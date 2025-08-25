import React, { useState } from "react";
import { generateGevascoPdf } from "../utils/pdfGenerator";
import { fieldMapping } from "../utils/mapping";
import FormField from "./FormField";

function GevascoForm() {
  const [formValues, setFormValues] = useState(
    Object.keys(fieldMapping).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = () => {
    generateGevascoPdf(formValues);
  };

  return (
    <div>
      {Object.keys(fieldMapping).map((key) => (
        <FormField
          key={key}
          name={key}
          value={formValues[key]}
          onChange={handleChange}
        />
      ))}

      <button
        onClick={handleGenerate}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Générer le PDF
      </button>
    </div>
  );
}

export default GevascoForm;
