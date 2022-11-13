import React from "react";
import styled from "styled-components";

const FormControl = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 12px;
`;

const InputControl = styled.input`
  width: 100%;
  display: block;
  background: #fff;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: inherit;
`;

const Input = ({ label, id, value, onChange, type = "email", ...props }) => {
  return (
    <FormControl>
      <label htmlFor={id}>{label}</label>
      <InputControl
        {...props}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
      />
    </FormControl>
  );
};

export default Input;
