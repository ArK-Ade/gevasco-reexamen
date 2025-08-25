import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const ListPdfFields = () => {
  const [fields, setFields] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const form = pdfDoc.getForm();
    const pdfFields = form.getFields();

    // Récupérer les noms des champs
    const fieldNames = pdfFields.map((field) => field.getName());

    console.log("Champs trouvés :", fieldNames);
    setFields(fieldNames);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Lister les champs du PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {fields.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Champs détectés :</h3>
          <ul className="list-disc pl-6">
            {fields.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListPdfFields;
