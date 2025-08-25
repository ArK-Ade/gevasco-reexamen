import React from "react";

function FormField({ name, value, onChange }) {
  return (
    <label className="block mb-2">
      {name} :
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 w-full"
      />
    </label>
  );
}

export default FormField;
