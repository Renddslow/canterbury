const fauna = require("faunadb");
const twilio = require("twilio");
const sgMail = require("@sendgrid/mail");
const { parsePhoneNumber } = require("awesome-phonenumber");
const got = require("got");
const { schedule } = require("@netlify/functions");

const sms = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
sgMail.setApiKey(process.env.SENDGRID_KEY);

const q = fauna.query;
const client = new fauna.Client({
  secret: process.env.FAUNA_KEY || "",
  domain: "db.fauna.com",
  scheme: "https",
});

const getDate = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const getTextMessageContent = (prompt) =>
  [
    `"${prompt.scripture}" (${prompt.ref})`,
    "",
    prompt.message,
    "\n———————\n(You are receiving this text because you signed up for daily checkup reminders at https://checkup.flatland.church. Text STOP to unsubscribe).",
  ].join("\n");

const getEmailContent = (prompt, email) => `<!DOCTYPE html>
<html lang="en-US">
   <head>
      <style>
        p {
            margin-bottom: 12px;
         }
      </style>
   </head>
   <body>
    <div style="max-width: 600px;">
      <p>Good morning,</p>
      <p>
         "${prompt.scripture}" <strong>(${prompt.ref})</strong>
      </p>
      <p>${prompt.message}</p>
      <footer style="text-align: center; margin-top: 24px">
         <div style="font-size: 12px; color: #434443">
            <p style="margin-bottom: 0">
               This email was sent to (${email}) because you signed up for daily spiritual checkup reminders at https://checkup.flatland.church. Reply to this email to unsubscribe.
            </p>
            <p>by Flatland Group, 501(c)3 47-0795919, 4801 N 144th Street, Omaha, NE 68116</p>
         </div>
         <p style="color: #434443">
            If you have any questions, simply respond to this email and we'll be happy to help.
         </p>
      </footer>
      </div>
   </body>
</html>
`;

const notify = async () => {
  const now = getDate(new Date());
  const prompts = await got(
    "https://checkup.flatland.church/prompts.json"
  ).json();
  const today = prompts.find((p) => p.date === now);

  if (!today) {
    return {
      statusCode: 404,
      body: "No prompt for today",
    };
  }

  const data = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("all_people")), { size: 500 }),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );

  const subscriptions = data.data.map((d) => d.data);

  await Promise.all(
    subscriptions.map(async (data) => {
      if (data.type === "phone") {
        const pn = parsePhoneNumber(data.value, "US");
        const to = pn.getNumber();
        const body = getTextMessageContent(today);
        await sms.messages.create({
          body,
          from: "+14023789202",
          to,
        });
      } else {
        await sgMail
          .send({
            html: getEmailContent(today),
            to: data.value,
            replyTo: {
              email: "mubatt@wyopub.com",
              name: "Matt McElwee",
            },
            from: {
              email: "no-reply@flatland.church",
              name: "Matt at Flatland",
            },
            subject:
              "Your daily spiritual checkup reminder from Flatland Church",
          })
          .catch((e) => console.log(e));
      }
    })
  );

  return {
    statusCode: 200,
  };
};

exports.handler = schedule("15 13 * * *", notify);
