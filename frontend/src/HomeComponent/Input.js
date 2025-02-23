import React from "react";

export function Input({ type, placeholder, className }) {
  return <input type={type} placeholder={placeholder} className={`p-2 border rounded ${className}`} />;
}
