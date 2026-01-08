import React from "react";

export default function Button({ children, className, onClick }) {
  return <button className={`${className}`} onClick={onClick}>{children}</button>;
}
