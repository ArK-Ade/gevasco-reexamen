// utils/pdfGenerator.ts
import { PDFDocument } from "pdf-lib";
import { fieldMapping } from "./mapping";
import { saveAs } from "file-saver"

export async function generateGevascoPdf(formValues: Record<string, string>) {
  try {
    const url = "./geva-sco-reexamen.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    Object.entries(formValues).forEach(([reactKey, value]) => {
      const pdfFieldName = fieldMapping[reactKey];
      if (!pdfFieldName) return;
      try {
        const field = form.getTextField(pdfFieldName);
        field.setText(value);
      } catch (err) {
        console.warn(`Champ introuvable: ${pdfFieldName}`);
      }
    });

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "gevasco-rempli.pdf");
  } catch (err) {
    console.error("Erreur génération PDF:", err);
  }
}
