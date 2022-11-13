const fauna = require("faunadb");
const { to } = require("await-to-js");

const q = fauna.query;
const client = new fauna.Client({
  secret: process.env.FAUNA_KEY || "",
  domain: "db.fauna.com",
  scheme: "https",
});

const handler = async (event) => {
  const { type, value } = JSON.parse(event.body);
  await client.query(
    q.Create(q.Collection("people"), {
      data: {
        type,
        value,
      },
    })
  );
  return {
    statusCode: 200,
  };
};

exports.handler = handler;
