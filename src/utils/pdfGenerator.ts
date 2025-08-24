// src/utils/pdfGenerator.ts
import { PDFDocument } from "pdf-lib";

export async function generateGevascoPdf({
  nom,
  fieldName = "Nom",           // <-- remplace après avoir listé les champs
  pdfPath = "/geva-sco-reexamen.pdf", // si dans public/
  flatten = false,
}: {
  nom: string;
  fieldName?: string;
  pdfPath?: string;
  flatten?: boolean;
}) {
  try {
    // 1) Charger le PDF
    const resp = await fetch(pdfPath);
    if (!resp.ok) throw new Error(`Fetch PDF failed: ${resp.status} ${resp.statusText}`);
    const bytes = await resp.arrayBuffer();

    // 2) Charger & accéder au formulaire
    const pdfDoc = await PDFDocument.load(bytes);
    const form = pdfDoc.getForm();

    // 3) Renseigner le champ (nom exact requis)
    const nameField = form.getTextField(fieldName);
    nameField.setText(nom);

    // Optionnel: rendre les champs non éditables dans le PDF final
    if (flatten) form.flatten();

    // 4) Sauver
    const out = await pdfDoc.save(); // Uint8Array

    // 5) Télécharger (pas de popup, pas de blocage)
    const blob = new Blob([out], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gevasco-reexamen_${nom || "document"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    return true;
  } catch (err: any) {
    console.error("Erreur génération PDF:", err);
    alert(err?.message || "Échec de génération du PDF (voir console).");
    return false;
  }
}
