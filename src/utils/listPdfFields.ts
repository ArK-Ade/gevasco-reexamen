import { PDFDocument } from "pdf-lib";

export async function listPdfFields(pdfPath = "/geva-sco-reexamen.pdf") {
  const resp = await fetch(pdfPath);
  if (!resp.ok) throw new Error(`Fetch PDF failed: ${resp.status} ${resp.statusText}`);
  const bytes = await resp.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const names = fields.map(f => f.getName());
  console.log("Champs disponibles dans le PDF:", names);
  return names;
}