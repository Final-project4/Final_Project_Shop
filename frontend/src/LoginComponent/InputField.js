import React from "react";

const InputField = ({ label, type, id, value, onChange, placeholder,style }) => {
  return (
    <div className="mt-6">
      <label htmlFor={id} className="block text-sm font-light text-gray-900 text-center">
        {label}
      </label>
      <div className="mt-6">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required
          className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm"
          placeholder={placeholder}
          style={{ ...style, border: 'none' }}
        />
      </div>
    </div>
  );
};

export default InputField;