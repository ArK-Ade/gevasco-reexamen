// components/forms/StepEleve.tsx
import React from "react";

interface StepEleveProps {
  formValues: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepEleve({ formValues, onChange }: StepEleveProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm">Nom élève</label>
        <input
          name="nomEleve"
          value={formValues.nomEleve || ""}
          onChange={onChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Date de naissance - Jour</label>
        <input
          name="dateNaissanceJour"
          value={formValues.dateNaissanceJour || ""}
          onChange={onChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Date de naissance - Mois</label>
        <input
          name="dateNaissanceMois"
          value={formValues.dateNaissanceMois || ""}
          onChange={onChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Date de naissance - Année</label>
        <input
          name="dateNaissanceAnnee"
          value={formValues.dateNaissanceAnnee || ""}
          onChange={onChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
    </div>
  );
}
