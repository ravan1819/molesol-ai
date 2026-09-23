"use client";

import { useState } from "react";

type PredictionResponse = {
  smiles: string;
  predicted_solubility: number;
};

export default function PredictPage() {
  const [smiles, setSmiles] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    const cleanSmiles = smiles.trim();

    // -----------------------------
    // Validate input
    // -----------------------------
    if (!cleanSmiles) {
      setError("Please enter a SMILES string.");
      setPrediction(null);
      return;
    }

    // -----------------------------
    // Reset previous state
    // -----------------------------
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      // -----------------------------
      // Send request to FastAPI
      // -----------------------------
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            smiles: cleanSmiles,
          }),
        }
      );

      // -----------------------------
      // Read response
      // -----------------------------
      const data = await response.json();

      // -----------------------------
      // Handle backend error
      // -----------------------------
      if (!response.ok) {
        setError(
          data.detail ||
            "Prediction failed. Please check the SMILES string."
        );

        return;
      }

      // -----------------------------
      // Validate prediction
      // -----------------------------
      if (
        typeof data.predicted_solubility !== "number"
      ) {
        setError(
          "The backend returned an invalid prediction."
        );

        return;
      }

      // -----------------------------
      // Store prediction
      // -----------------------------
      setPrediction(
        data.predicted_solubility
      );

    } catch (error) {
      console.error(
        "Prediction error:",
        error
      );

      setError(
        "Could not connect to the FastAPI backend. Make sure the backend is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Example molecule
  // -----------------------------
  const useExample = () => {
    setSmiles("CCO");
    setPrediction(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-white/10 py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Molecular Prediction
          </p>

          <h1 className="mt-5 text-5xl font-bold">
            Predict Molecular Solubility
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Enter a molecule&apos;s SMILES representation to
            estimate its aqueous solubility using the trained
            machine learning model.
          </p>
        </div>
      </section>

      {/* =====================================================
          PREDICTION AREA
      ===================================================== */}

      <section className="py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="grid gap-8 lg:grid-cols-2">

            {/* =================================================
                INPUT CARD
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Input
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Molecule SMILES
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Enter the SMILES string of the molecule you
                want to analyze.
              </p>

              {/* SMILES Input */}

              <textarea
                value={smiles}
                onChange={(e) => {
                  setSmiles(e.target.value);
                  setError("");
                }}
                placeholder="Example: CCO"
                rows={7}
                spellCheck={false}
                className="mt-6 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
              />

              {/* Example */}

              <button
                type="button"
                onClick={useExample}
                className="mt-3 text-sm text-cyan-400 transition hover:text-cyan-300"
              >
                Use example: CCO
              </button>

              {/* Predict Button */}

              <button
                type="button"
                onClick={handlePredict}
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Predicting..."
                  : "Predict Solubility"}
              </button>

              {/* Error */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-sm font-medium text-red-400">
                    {error}
                  </p>
                </div>
              )}

            </div>

            {/* =================================================
                RESULT CARD
            ================================================= */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Prediction Result
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {prediction !== null
                  ? "Prediction Complete"
                  : "Awaiting Prediction"}
              </h2>

              {/* Result Box */}

              <div
                className={`mt-8 rounded-2xl border p-8 text-center ${
                  prediction !== null
                    ? "border-cyan-400/20 bg-cyan-400/5"
                    : "border-dashed border-white/10"
                }`}
              >

                {/* LogS */}

                <p className="text-sm text-slate-500">
                  Predicted LogS
                </p>

                <p className="mt-3 text-5xl font-bold text-cyan-400">
                  {prediction !== null
                    ? prediction.toFixed(4)
                    : "—"}
                </p>

                {/* Category */}

                <p className="mt-6 text-sm text-slate-500">
                  Solubility Category
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {prediction !== null
                    ? getSolubilityCategory(
                        prediction
                      )
                    : "—"}
                </p>

              </div>

              {/* Molecule */}

              {prediction !== null && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">

                  <p className="text-sm text-slate-500">
                    Molecule
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-cyan-300">
                    {smiles}
                  </p>

                </div>
              )}

              {/* Loading */}

              {loading && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Processing molecule with the ML model...
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Prediction Pipeline
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              From SMILES to Prediction
            </h2>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">

            {[
              {
                number: "01",
                title: "SMILES",
                text: "The molecular structure is submitted as a SMILES string.",
              },
              {
                number: "02",
                title: "RDKit",
                text: "RDKit converts the SMILES into a molecular structure.",
              },
              {
                number: "03",
                title: "Descriptors",
                text: "Molecular descriptors are calculated from the structure.",
              },
              {
                number: "04",
                title: "XGBoost",
                text: "The trained model predicts the molecular LogS value.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="text-sm font-bold text-cyan-400">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.text}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          NOTE
      ===================================================== */}

      <section className="py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "850px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p className="text-sm leading-7 text-slate-500">
            MoleSol AI provides computational estimates of
            molecular solubility. Experimental laboratory
            measurements may differ from model predictions.
          </p>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 py-8">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p className="text-sm text-slate-500">
            MoleSol AI · Molecular Solubility Prediction
          </p>
        </div>
      </footer>

    </main>
  );
}


/* ============================================================
   SOLUBILITY CATEGORY
   ============================================================ */

function getSolubilityCategory(
  logS: number
): string {

  if (logS >= 0) {
    return "Highly Soluble";
  }

  if (logS >= -2) {
    return "Soluble";
  }

  if (logS >= -4) {
    return "Moderately Soluble";
  }

  return "Low Solubility";
}