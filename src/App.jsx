import React, { useEffect, useMemo, useState } from "react";

/**
 * GEVASco (Réexamen) — Application web monopage
 * ------------------------------------------------
 * - Formulaire multi‑étapes (wizard)
 * - Sauvegarde auto dans localStorage
 * - Export JSON
 * - Page récapitulatif imprimable (utilise Imprimer → Enregistrer en PDF)
 * - Champs adaptés au GEVASco Réexamen (structure générique)
 *
 * ⚠️ Aucune donnée n'est envoyée côté serveur (100% local).
 */

export default function GEVAScoReexamenApp() {
  const STORAGE_KEY = "gevasco-reexamen-v1";

  const empty = useMemo(
    () => ({
      meta: {
        dateReexamen: "",
        academie: "",
        departement: "",
        etablissement: "",
        uai: "",
        referent: "",
      },
      eleve: {
        nom: "",
        prenom: "",
        ine: "",
        dateNaissance: "",
        classe: "",
        regime: "Jour\nInterne\nAutre",
        responsables: "",
        contact: "",
      },
      situation: {
        parcours: "",
        handicap: "",
        diagnostic: "",
        pointsAppui: "",
        difficultes: "",
      },
      besoins: {
        apprentissages: "",
        communication: "",
        mobilite: "",
        autonomie: "",
        sante: "",
        securite: "",
      },
      amenagements: {
        materiel: "",
        humain: "",
        organisation: "",
        pedagogique: "",
        evaluation: "",
      },
      projet: {
        objectifs: "",
        modalitesSuivi: "",
        calendrier: "",
        partenaires: "",
      },
      piecesJointes: {
        docs: "",
      },
      avis: {
        equipeEtab: "",
        famille: "",
        eleve: "",
      },
      signatures: {
        dateEquipe: "",
        nomChefEtab: "",
        visaChefEtab: false,
        nomReferent: "",
        visaReferent: false,
      },
    }),
    []
  );

  const [data, setData] = useState(empty);
  const [step, setStep] = useState(0);
  const [touch, setTouch] = useState(false);
  const steps = [
    { key: "meta", label: "Dossier / Contexte" },
    { key: "eleve", label: "Identité de l'élève" },
    { key: "situation", label: "Situation / Observations" },
    { key: "besoins", label: "Besoins repérés" },
    { key: "amenagements", label: "Aménagements proposés" },
    { key: "projet", label: "Projet & Suivi" },
    { key: "piecesJointes", label: "Pièces jointes" },
    { key: "avis", label: "Avis & Expression" },
    { key: "signatures", label: "Signatures / Validation" },
    { key: "recap", label: "Récapitulatif" },
  ];

  // Chargement depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData((d) => ({ ...d, ...JSON.parse(saved) }));
    } catch (e) {
      console.warn("Impossible de charger le brouillon", e);
    }
  }, []);

  // Sauvegarde auto
  useEffect(() => {
    if (!touch) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Sauvegarde localStorage échouée", e);
    }
  }, [data, touch]);

  const update = (scope, field, value) => {
    setTouch(true);
    setData((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        [field]: value,
      },
    }));
  };

  const requiredOk = () => {
    // Validation minimale de quelques champs clés
    const needed = [
      ["meta", "dateReexamen"],
      ["eleve", "nom"],
      ["eleve", "prenom"],
      ["eleve", "dateNaissance"],
      ["meta", "etablissement"],
    ];
    return needed.every(([s, f]) => String(data[s][f] || "").trim().length > 0);
  };

  const resetAll = () => {
    if (!confirm("Effacer toutes les données du brouillon ?")) return;
    setData(empty);
    localStorage.removeItem(STORAGE_KEY);
    setStep(0);
    setTouch(false);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const file = `gevasco-reexamen_${data?.eleve?.nom || "eleve"}.json`;
    a.download = file;
    a.click();
    URL.revokeObjectURL(url);
  };

  const go = (dir) => {
    setStep((s) => Math.min(Math.max(0, s + dir), steps.length - 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold">GEVASco — Réexamen</h1>
          <span className="ml-auto text-sm text-slate-500">100% local • Brouillon auto</span>
          <button
            onClick={resetAll}
            className="ml-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-100"
            title="Effacer le brouillon"
          >
            Réinitialiser
          </button>
          <button
            onClick={exportJSON}
            className="ml-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Export JSON
          </button>
          <button
            onClick={() => window.print()}
            className="ml-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Imprimer / PDF
          </button>
        </div>
        <Progress step={step} total={steps.length} />
        <Stepper steps={steps} step={step} setStep={setStep} />
      </header>

      <main className="max-w-6xl mx-auto p-4 print:p-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 print:shadow-none print:border-0 print:rounded-none">
          {steps[step]?.key !== "recap" ? (
            <FormStep stepKey={steps[step].key} data={data} update={update} />
          ) : (
            <Recap data={data} />
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => go(-1)}
              disabled={step === 0}
              className="rounded-2xl border px-4 py-2 disabled:opacity-40"
            >
              ← Précédent
            </button>
            <button
              onClick={() => go(1)}
              disabled={step === steps.length - 1}
              className="rounded-2xl border px-4 py-2 ml-auto"
            >
              Suivant →
            </button>
          </div>

          {!requiredOk() && (
            <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
              ⚠️ Champs requis manquants : remplis au moins la date de réexamen, le nom/prénom/date de naissance, et l'établissement.
            </p>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-xs text-slate-500 print:hidden">
        Données stockées localement dans votre navigateur. Aucun envoi externe.
      </footer>

      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          main { padding: 0 !important; }
          .print\:p-0 { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function Progress({ step, total }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="w-full h-1 bg-slate-100">
      <div
        className="h-1 bg-blue-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Stepper({ steps, step, setStep }) {
  return (
    <div className="overflow-x-auto border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2">
        {steps.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(i)}
            className={`whitespace-nowrap text-xs md:text-sm rounded-full border px-3 py-1.5 ${
              i === step ? "bg-blue-50 border-blue-300" : "hover:bg-slate-50"
            }`}
            title={s.label}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {children} {required && <span className="text-rose-600">*</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 6 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
        checked ? "bg-emerald-50 border-emerald-300" : "bg-slate-50"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${checked ? "bg-emerald-500" : "bg-slate-400"}`} />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function Section({ title, children, hint }) {
  return (
    <section className="mb-6">
      <div className="flex items-end gap-3 mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Full({ children }) {
  return <div className="md:col-span-2">{children}</div>;
}

function FormStep({ stepKey, data, update }) {
  switch (stepKey) {
    case "meta":
      return (
        <div>
          <Section title="Dossier / Contexte" hint="Informations administratives du réexamen">
            <div>
              <Label required>Date du réexamen</Label>
              <Input
                type="date"
                value={data.meta.dateReexamen}
                onChange={(v) => update("meta", "dateReexamen", v)}
              />
            </div>
            <div>
              <Label>Académie</Label>
              <Input value={data.meta.academie} onChange={(v) => update("meta", "academie", v)} />
            </div>
            <div>
              <Label>Département</Label>
              <Input value={data.meta.departement} onChange={(v) => update("meta", "departement", v)} />
            </div>
            <div>
              <Label required>Établissement</Label>
              <Input value={data.meta.etablissement} onChange={(v) => update("meta", "etablissement", v)} />
            </div>
            <div>
              <Label>UAI</Label>
              <Input value={data.meta.uai} onChange={(v) => update("meta", "uai", v)} />
            </div>
            <div>
              <Label>Référent de scolarité / AESH coord.</Label>
              <Input value={data.meta.referent} onChange={(v) => update("meta", "referent", v)} />
            </div>
          </Section>
        </div>
      );

    case "eleve":
      return (
        <div>
          <Section title="Identité de l'élève" hint="Champs requis pour identifier le dossier">
            <div>
              <Label required>Nom</Label>
              <Input value={data.eleve.nom} onChange={(v) => update("eleve", "nom", v)} />
            </div>
            <div>
              <Label required>Prénom</Label>
              <Input value={data.eleve.prenom} onChange={(v) => update("eleve", "prenom", v)} />
            </div>
            <div>
              <Label>INE</Label>
              <Input value={data.eleve.ine} onChange={(v) => update("eleve", "ine", v)} />
            </div>
            <div>
              <Label required>Date de naissance</Label>
              <Input type="date" value={data.eleve.dateNaissance} onChange={(v) => update("eleve", "dateNaissance", v)} />
            </div>
            <div>
              <Label>Classe / Niveau</Label>
              <Input value={data.eleve.classe} onChange={(v) => update("eleve", "classe", v)} />
            </div>
            <div>
              <Label>Régime (jour/interne)</Label>
              <Input value={data.eleve.regime} onChange={(v) => update("eleve", "regime", v)} />
            </div>
            <Full>
              <Label>Responsables légaux & Contacts</Label>
              <Textarea value={data.eleve.responsables} onChange={(v) => update("eleve", "responsables", v)} placeholder="Noms, liens, coordonnées, autorisations…" />
            </Full>
            <Full>
              <Label>Contact (téléphone / email)</Label>
              <Input value={data.eleve.contact} onChange={(v) => update("eleve", "contact", v)} />
            </Full>
          </Section>
        </div>
      );

    case "situation":
      return (
        <div>
          <Section title="Situation / Observations" hint="Synthèse pluridisciplinaire">
            <Full>
              <Label>Parcours & historique</Label>
              <Textarea value={data.situation.parcours} onChange={(v) => update("situation", "parcours", v)} />
            </Full>
            <Full>
              <Label>Situation de handicap / notifications</Label>
              <Textarea value={data.situation.handicap} onChange={(v) => update("situation", "handicap", v)} />
            </Full>
            <Full>
              <Label>Éléments médicaux / diagnostics (si fournis)</Label>
              <Textarea value={data.situation.diagnostic} onChange={(v) => update("situation", "diagnostic", v)} />
            </Full>
            <div>
              <Label>Points d'appui / réussites</Label>
              <Textarea rows={4} value={data.situation.pointsAppui} onChange={(v) => update("situation", "pointsAppui", v)} />
            </div>
            <div>
              <Label>Difficultés repérées</Label>
              <Textarea rows={4} value={data.situation.difficultes} onChange={(v) => update("situation", "difficultes", v)} />
            </div>
          </Section>
        </div>
      );

    case "besoins":
      return (
        <div>
          <Section title="Besoins repérés" hint="Selon les domaines de vie scolaire">
            <div>
              <Label>Apprentissages</Label>
              <Textarea rows={4} value={data.besoins.apprentissages} onChange={(v) => update("besoins", "apprentissages", v)} />
            </div>
            <div>
              <Label>Communication</Label>
              <Textarea rows={4} value={data.besoins.communication} onChange={(v) => update("besoins", "communication", v)} />
            </div>
            <div>
              <Label>Mobilité</Label>
              <Textarea rows={4} value={data.besoins.mobilite} onChange={(v) => update("besoins", "mobilite", v)} />
            </div>
            <div>
              <Label>Autonomie</Label>
              <Textarea rows={4} value={data.besoins.autonomie} onChange={(v) => update("besoins", "autonomie", v)} />
            </div>
            <div>
              <Label>Santé</Label>
              <Textarea rows={4} value={data.besoins.sante} onChange={(v) => update("besoins", "sante", v)} />
            </div>
            <div>
              <Label>Sécurité</Label>
              <Textarea rows={4} value={data.besoins.securite} onChange={(v) => update("besoins", "securite", v)} />
            </div>
          </Section>
        </div>
      );

    case "amenagements":
      return (
        <div>
          <Section title="Aménagements proposés" hint="À destination de la MDPH (PPS/PAP/AESH…)">
            <div>
              <Label>Matériels / aides techniques</Label>
              <Textarea rows={4} value={data.amenagements.materiel} onChange={(v) => update("amenagements", "materiel", v)} />
            </div>
            <div>
              <Label>Aides humaines (AESH, interprète, etc.)</Label>
              <Textarea rows={4} value={data.amenagements.humain} onChange={(v) => update("amenagements", "humain", v)} />
            </div>
            <div>
              <Label>Organisation / emploi du temps</Label>
              <Textarea rows={4} value={data.amenagements.organisation} onChange={(v) => update("amenagements", "organisation", v)} />
            </div>
            <div>
              <Label>Pédagogie / évaluations</Label>
              <Textarea rows={4} value={data.amenagements.pedagogique} onChange={(v) => update("amenagements", "pedagogique", v)} />
            </div>
            <Full>
              <Label>Aménagements d'examen / extra-scolaire</Label>
              <Textarea rows={4} value={data.amenagements.evaluation} onChange={(v) => update("amenagements", "evaluation", v)} />
            </Full>
          </Section>
        </div>
      );

    case "projet":
      return (
        <div>
          <Section title="Projet & Suivi" hint="Objectifs, partenaires, calendrier">
            <Full>
              <Label>Objectifs du projet personnalisé</Label>
              <Textarea value={data.projet.objectifs} onChange={(v) => update("projet", "objectifs", v)} />
            </Full>
            <div>
              <Label>Modalités de suivi (ESS, bilans)</Label>
              <Textarea rows={4} value={data.projet.modalitesSuivi} onChange={(v) => update("projet", "modalitesSuivi", v)} />
            </div>
            <div>
              <Label>Calendrier / échéances</Label>
              <Textarea rows={4} value={data.projet.calendrier} onChange={(v) => update("projet", "calendrier", v)} />
            </div>
            <Full>
              <Label>Partenaires (SESSAD, CMP, libéraux, etc.)</Label>
              <Textarea value={data.projet.partenaires} onChange={(v) => update("projet", "partenaires", v)} />
            </Full>
          </Section>
        </div>
      );

    case "piecesJointes":
      return (
        <div>
          <Section title="Pièces jointes">
            <Full>
              <Label>Liste des documents joints (références, dates)</Label>
              <Textarea value={data.piecesJointes.docs} onChange={(v) => update("piecesJointes", "docs", v)} placeholder="Ex : Bilan orthophonique (05/2025), Compte‑rendu ESS (03/2025)…" />
            </Full>
          </Section>
        </div>
      );

    case "avis":
      return (
        <div>
          <Section title="Avis & Expression">
            <div>
              <Label>Avis de l'équipe pédagogique / direction</Label>
              <Textarea rows={6} value={data.avis.equipeEtab} onChange={(v) => update("avis", "equipeEtab", v)} />
            </div>
            <div>
              <Label>Expression de la famille / responsables</Label>
              <Textarea rows={6} value={data.avis.famille} onChange={(v) => update("avis", "famille", v)} />
            </div>
            <div>
              <Label>Expression de l'élève</Label>
              <Textarea rows={6} value={data.avis.eleve} onChange={(v) => update("avis", "eleve", v)} />
            </div>
          </Section>
        </div>
      );

    case "signatures":
      return (
        <div>
          <Section title="Signatures / Validation">
            <div>
              <Label>Date de l'ESS / validation</Label>
              <Input type="date" value={data.signatures.dateEquipe} onChange={(v) => update("signatures", "dateEquipe", v)} />
            </div>
            <div>
              <Label>Nom — Chef d'établissement</Label>
              <Input value={data.signatures.nomChefEtab} onChange={(v) => update("signatures", "nomChefEtab", v)} />
            </div>
            <div>
              <Label>Visa Chef d'établissement</Label>
              <Switch checked={data.signatures.visaChefEtab} onChange={(v) => update("signatures", "visaChefEtab", v)} label={data.signatures.visaChefEtab ? "Signé" : "Non signé"} />
            </div>
            <div>
              <Label>Nom — Référent de scolarité</Label>
              <Input value={data.signatures.nomReferent} onChange={(v) => update("signatures", "nomReferent", v)} />
            </div>
            <div>
              <Label>Visa Référent</Label>
              <Switch checked={data.signatures.visaReferent} onChange={(v) => update("signatures", "visaReferent", v)} label={data.signatures.visaReferent ? "Signé" : "Non signé"} />
            </div>
          </Section>
        </div>
      );

    default:
      return <Recap data={data} />;
  }
}

function Recap({ data }) {
  return (
    <div className="prose max-w-none print:prose-sm">
      <h2 className="text-2xl font-bold mb-4">Récapitulatif — GEVASco (Réexamen)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Dossier / Contexte">
          <KV k="Date réexamen" v={data.meta.dateReexamen} />
          <KV k="Académie" v={data.meta.academie} />
          <KV k="Département" v={data.meta.departement} />
          <KV k="Établissement" v={data.meta.etablissement} />
          <KV k="UAI" v={data.meta.uai} />
          <KV k="Référent" v={data.meta.referent} />
        </Card>
        <Card title="Élève">
          <KV k="Nom" v={data.eleve.nom} />
          <KV k="Prénom" v={data.eleve.prenom} />
          <KV k="INE" v={data.eleve.ine} />
          <KV k="Date de naissance" v={data.eleve.dateNaissance} />
          <KV k="Classe" v={data.eleve.classe} />
          <KV k="Régime" v={data.eleve.regime} />
        </Card>
      </div>

      <Card title="Situation / Observations">
        <Pre v={data.situation.parcours} label="Parcours & historique" />
        <Pre v={data.situation.handicap} label="Handicap / notifications" />
        <Pre v={data.situation.diagnostic} label="Éléments médicaux" />
        <Cols>
          <Pre v={data.situation.pointsAppui} label="Points d'appui" />
          <Pre v={data.situation.difficultes} label="Difficultés" />
        </Cols>
      </Card>

      <Card title="Besoins">
        <Cols>
          <Pre v={data.besoins.apprentissages} label="Apprentissages" />
          <Pre v={data.besoins.communication} label="Communication" />
          <Pre v={data.besoins.mobilite} label="Mobilité" />
          <Pre v={data.besoins.autonomie} label="Autonomie" />
          <Pre v={data.besoins.sante} label="Santé" />
          <Pre v={data.besoins.securite} label="Sécurité" />
        </Cols>
      </Card>

      <Card title="Aménagements proposés">
        <Cols>
          <Pre v={data.amenagements.materiel} label="Matériels / aides techniques" />
          <Pre v={data.amenagements.humain} label="Aides humaines" />
          <Pre v={data.amenagements.organisation} label="Organisation / EDT" />
          <Pre v={data.amenagements.pedagogique} label="Pédagogie / évaluations" />
          <Pre v={data.amenagements.evaluation} label="Aménagements d'examen" />
        </Cols>
      </Card>

      <Card title="Projet & Suivi">
        <Pre v={data.projet.objectifs} label="Objectifs" />
        <Cols>
          <Pre v={data.projet.modalitesSuivi} label="Modalités de suivi" />
          <Pre v={data.projet.calendrier} label="Calendrier" />
        </Cols>
        <Pre v={data.projet.partenaires} label="Partenaires" />
      </Card>

      <Card title="Pièces jointes">
        <Pre v={data.piecesJointes.docs} />
      </Card>

      <Card title="Avis & Expression">
        <Cols>
          <Pre v={data.avis.equipeEtab} label="Équipe établissement" />
          <Pre v={data.avis.famille} label="Famille" />
          <Pre v={data.avis.eleve} label="Élève" />
        </Cols>
      </Card>

      <Card title="Signatures / Validation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KV k="Date validation" v={data.signatures.dateEquipe} />
          <KV k="Chef d'établissement" v={data.signatures.nomChefEtab} />
          <KV k="Visa Chef d'établissement" v={data.signatures.visaChefEtab ? "Signé" : "Non"} />
          <KV k="Référent scolarité" v={data.signatures.nomReferent} />
          <KV k="Visa Référent" v={data.signatures.visaReferent ? "Signé" : "Non"} />
        </div>
      </Card>

      <div className="mt-6 text-xs text-slate-500">
        <p>
          Astuce : pour générer un PDF, utilisez <strong>Imprimer</strong> puis
          <em> Enregistrer au format PDF</em>. Le style est optimisé pour l'impression.
        </p>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="my-4 border rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-slate-600">{k}</span>
      <span className="font-medium text-slate-900 text-right">{String(v || "—")}</span>
    </div>
  );
}

function Pre({ v, label }) {
  return (
    <div className="mb-2">
      {label && <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</div>}
      <pre className="whitespace-pre-wrap text-sm bg-slate-50 border rounded-xl p-3">{String(v || "—")}</pre>
    </div>
  );
}

function Cols({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}
