import React from "react";

const Message = ({ text }) => <p>{text}</p>;

export default function ErrorMessages({ errors }) {
  if (!errors) {
    return [];
  }

  return (
    <div>
      {Object.entries(errors).map(([key, value], idx) => (
        <Message key={idx} text={`${key} ${value.join(", ")}`} />
      ))}
    </div>
  );
}
