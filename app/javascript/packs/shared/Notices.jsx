import React from "react";

const Message = ({ text }) => <p>{text}</p>;

export default function Notices({ notices }) {
  return (
    <div>
      {notices
        .filter(value => value)
        .map((value, idx) => (
          <Message key={idx} text={value} />
        ))}
    </div>
  );
}
