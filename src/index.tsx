import React, { useState } from "react";
// @ts-ignore
import { createRoot } from "react-dom";
import styled from "styled-components";

import Input from "./Input";

const Wrapper = styled.div`
  background: #3494e6;
  background: -webkit-linear-gradient(45deg, #3494e6, #ec6ead);
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  height: 100%;
  overflow: hidden;
`;

const Toggle = styled.button`
  padding: 2px;
  background: #f5f5f5;
  border: 1px solid #e1e3e2;
  color: #0d0e0d;
  border-radius: 4px;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  font-size: inherit;
  cursor: pointer;

  span {
    padding: 8px 12px;
  }

  ${(props) =>
    props.left
      ? `
  span:first-child {
    background: #ffffff;
    border-bottom: 1px solid #ccc;
    border-radius: 4px;
  }
  `
      : `
  span:last-child {
    background: #ffffff;
    border-bottom: 1px solid #ccc;
    border-radius: 4px;
  }
  `};
`;

const Card = styled.div`
  width: max-content;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin: 50vh auto 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 24px;
  transform: translateY(-50%);
`;

const Button = styled.button`
  appearance: none;
  font-size: inherit;
  font-weight: 600;
  padding: 12px;
  border-radius: 4px;
  border: 0;
  background: #f93;
  margin-left: auto;
  display: block;
  margin-top: 24px;
`;

const App = () => {
  const [type, setType] = useState("email");
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Wrapper>
      <Card>
        <div>
          <p>Sign up for a</p>
          <h1>Spiritual Check Up</h1>
        </div>
        <Toggle
          left={type === "email"}
          onClick={() => setType((s) => (s === "email" ? "phone" : "email"))}
        >
          <span>Email</span>
          <span>Text Message</span>
        </Toggle>
        <form onSubmit={handleSubmit}>
          {type === "email" ? (
            <Input
              id="email"
              label="Email address"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <Input
              id="phone"
              label="Phone number"
              autoComplete="tel"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
          <Button>Sign Up</Button>
        </form>
      </Card>
    </Wrapper>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
