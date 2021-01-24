import React from "react";

export default function InputField({ type, label, name, value, onChange }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <input
          className="input"
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
