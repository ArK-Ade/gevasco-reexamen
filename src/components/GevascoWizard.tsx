// components/GevascoWizard.tsx
import React, { useState } from "react";
import StepEleve from "./forms/StepEleve";
import { generateGevascoPdf } from "../utils/pdfGenerator";

export default function GevascoWizard() {
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const steps = [
    <StepEleve formValues={formValues} onChange={handleChange} />,
    <div>Étape Scolarité (à créer)</div>,
    <div>Étape Accompagnement (à créer)</div>,
    <div>Étape Participants (à créer)</div>,
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Assistant GEVASCO</h1>

      {steps[step]}

      <div className="mt-6 flex gap-4">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Retour
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={() => generateGevascoPdf(formValues)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Générer PDF
          </button>
        )}
      </div>
    </div>
  );
}
