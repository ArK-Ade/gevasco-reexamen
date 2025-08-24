// src/components/GevascoForm.tsx
import { useState } from "react";
import { generateGevascoPdf } from "../utils/pdfGenerator";
import { listPdfFields } from "../utils/listPdfFields";

export default function GevascoForm() {
  const [nom, setNom] = useState("");
  const [fieldName, setFieldName] = useState("Nom"); // remplace après avoir listé

  const onGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateGevascoPdf({ nom, fieldName, flatten: true });
  };

  const onList = async () => {
    try {
      const names = await listPdfFields();
      alert(`Regarde la console pour la liste des champs (${names.length})`);
    } catch (e: any) {
      alert(e?.message || "Impossible de lister les champs.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl space-y-4">
      <h1 className="text-xl font-bold">GEVA-Sco — Remplir PDF</h1>

      <div className="text-sm p-3 rounded bg-blue-50 border border-blue-200">
        PDF attendu à <code className="px-1 bg-white rounded">/geva-sco-reexamen.pdf</code> (dossier <b>public/</b>)
      </div>

      <button
        type="button"
        onClick={onList}
        className="text-sm border px-3 py-1.5 rounded hover:bg-gray-50"
      >
        Lister les champs du PDF (console)
      </button>

      <form onSubmit={onGenerate} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nom de l'élève</label>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Ex: Jean Dupont"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nom du champ PDF</label>
          <input
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Ex: Nom, NomEleve, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            Utilise “Lister les champs” pour trouver le nom exact.
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Générer le PDF rempli
        </button>
      </form>
    </div>
  );
}
