"use client";

import { useRef, useState } from "react";

type ScreeningResult = {
  id: number;
  name: string;
  smiles: string;
  prediction: number | null;
  category: string;
  error?: string;
};

export default function VirtualScreeningPage() {
  const [moleculesInput, setMoleculesInput] = useState("");
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ==========================================
  // RUN VIRTUAL SCREENING
  // ==========================================

  const runScreening = async (smilesList: string[]) => {
    if (smilesList.length === 0) {
      alert("No valid SMILES strings found.");
      return;
    }

    setLoading(true);
    setResults([]);

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${API_URL}/predict-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          smiles: smilesList,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Batch prediction failed."
        );
      }

      const screeningResults: ScreeningResult[] =
        data.results.map(
          (
            result: {
              id: number;
              name: string;
              smiles: string;
              predicted_solubility: number | null;
              category: string;
              error?: string | null;
            },
            index: number
          ) => ({
            id: index + 1,
            name: result.name || "Unknown",
            smiles: result.smiles,
            prediction:
              result.predicted_solubility !== null
                ? Number(result.predicted_solubility)
                : null,
            category: result.category || "Unknown",
            error: result.error || undefined,
          })
        );

      setResults(screeningResults);
    } catch (error) {
      console.error("Virtual screening error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Backend connection failed.";

      setResults(
        smilesList.map((smiles, index) => ({
          id: index + 1,
          name: "Unknown",
          smiles,
          prediction: null,
          category: "Error",
          error: errorMessage,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MANUAL SMILES SCREENING
  // ==========================================

  const handleScreen = async () => {
    const smilesList = moleculesInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (smilesList.length === 0) {
      alert("Please enter at least one SMILES string.");
      return;
    }

    await runScreening(smilesList);
  };

  // ==========================================
  // LOAD EXAMPLES
  // ==========================================

  const loadExamples = () => {
    const examples = [
      "CO",
      "CC(=O)C",
      "c1ccccc1",
      "CCO",
      "CC(=O)O",
      "C1CCCCC1",
      "CCOC(=O)C",
      "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
      "CC(=O)Oc1ccccc1C(=O)O",
      "CC(=O)NC1=CC=C(C=C1)O",
    ];

    setMoleculesInput(examples.join("\n"));
    setResults([]);
  };

  // ==========================================
  // CSV UPLOAD
  // ==========================================

  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCsvLoading(true);

    try {
      const text = await file.text();

      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length === 0) {
        alert("The CSV file is empty.");
        return;
      }

      // --------------------------------------
      // Read CSV header
      // --------------------------------------

      const header = lines[0]
        .split(",")
        .map((column) =>
          column.trim().toLowerCase().replace(/["']/g, "")
        );

      // Find SMILES column
      const smilesIndex = header.findIndex(
        (column) =>
          column === "smiles" ||
          column === "smile"
      );

      // --------------------------------------
      // If SMILES column exists
      // --------------------------------------

      if (smilesIndex !== -1) {
        const smilesList: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const columns = parseCSVLine(lines[i]);

          const smiles = columns[smilesIndex]
            ?.trim()
            .replace(/^["']|["']$/g, "");

          if (smiles) {
            smilesList.push(smiles);
          }
        }

        if (smilesList.length === 0) {
          alert("No SMILES values were found in the CSV.");
          return;
        }

        setMoleculesInput(smilesList.join("\n"));

        await runScreening(smilesList);
      }

      // --------------------------------------
      // If there is no SMILES header
      // Assume first column contains SMILES
      // --------------------------------------

      else {
        const smilesList: string[] = [];

        for (let i = 0; i < lines.length; i++) {
          const columns = parseCSVLine(lines[i]);

          const smiles = columns[0]
            ?.trim()
            .replace(/^["']|["']$/g, "");

          if (smiles) {
            smilesList.push(smiles);
          }
        }

        // Remove header-like first row if necessary
        if (
          smilesList.length > 0 &&
          (
            smilesList[0].toLowerCase() === "smiles" ||
            smilesList[0].toLowerCase() === "smile"
          )
        ) {
          smilesList.shift();
        }

        if (smilesList.length === 0) {
          alert("No SMILES values were found in the CSV.");
          return;
        }

        setMoleculesInput(smilesList.join("\n"));

        await runScreening(smilesList);
      }
    } catch (error) {
      console.error(error);
      alert("Could not read the CSV file.");
    } finally {
      setCsvLoading(false);

      // Allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ==========================================
  // CSV LINE PARSER
  // ==========================================

  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];

    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const character = line[i];

      if (character === '"') {
        insideQuotes = !insideQuotes;
      } else if (character === "," && !insideQuotes) {
        values.push(current);
        current = "";
      } else {
        current += character;
      }
    }

    values.push(current);

    return values;
  };

  // ==========================================
  // CLEAR EVERYTHING
  // ==========================================

  const clearAll = () => {
    setMoleculesInput("");
    setResults([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // DOWNLOAD RESULTS
  // ==========================================

  const downloadResults = () => {
    if (results.length === 0) {
      alert("There are no results to download.");
      return;
    }

    const header =
      "Molecule,SMILES,Predicted LogS,Category,Status";

    const rows = results.map((result) => {
      const name = escapeCSV(result.name);
      const smiles = escapeCSV(result.smiles);

      const prediction =
        result.prediction !== null
          ? result.prediction.toFixed(4)
          : "";

      const category = escapeCSV(result.category);

      const status = result.error
        ? escapeCSV(result.error)
        : "Success";

      return `${name},${smiles},${prediction},${category},${status}`;
    });

    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "molesol_virtual_screening_results.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* ======================================
          HEADER
      ====================================== */}

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
            Molecular Screening
          </p>

          <h1 className="mt-5 text-5xl font-bold">
            Virtual Screening
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Screen multiple molecules and automatically identify
            compounds while predicting their aqueous solubility.
          </p>
        </div>
      </section>

      {/* ======================================
          INPUT SECTION
      ====================================== */}

      <section className="py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Input Molecules
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Enter SMILES or Upload CSV
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Enter one SMILES string per line or upload a CSV
              containing a SMILES column.
            </p>

            {/* ==================================
                FORMAT EXAMPLE
            ================================== */}

            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm font-semibold text-slate-300">
                Manual input example
              </p>

              <code className="mt-3 block text-sm leading-7 text-cyan-300">
                CO
                <br />
                CC(=O)C
                <br />
                c1ccccc1
                <br />
                CCO
              </code>

            </div>

            {/* ==================================
                CSV FORMAT
            ================================== */}

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm font-semibold text-slate-300">
                CSV format
              </p>

              <code className="mt-3 block text-sm leading-7 text-cyan-300">
                SMILES
                <br />
                CCO
                <br />
                CO
                <br />
                c1ccccc1
                <br />
                CC(=O)C
              </code>

            </div>

            {/* ==================================
                TEXTAREA
            ================================== */}

            <textarea
              value={moleculesInput}
              onChange={(e) =>
                setMoleculesInput(e.target.value)
              }
              placeholder={`Enter SMILES strings:
CO
CC(=O)C
c1ccccc1
CCO`}
              rows={12}
              className="mt-6 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
            />

            {/* ==================================
                BUTTONS
            ================================== */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {/* LOAD EXAMPLES */}

              <button
                onClick={loadExamples}
                disabled={loading || csvLoading}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold transition hover:bg-white/[0.08] disabled:opacity-50"
              >
                Load Examples
              </button>

              {/* UPLOAD CSV */}

              <label className="cursor-pointer rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-center font-semibold text-cyan-300 transition hover:bg-cyan-400/20">

                {csvLoading
                  ? "Reading CSV..."
                  : "Upload CSV"}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCSVUpload}
                  disabled={loading || csvLoading}
                  className="hidden"
                />

              </label>

              {/* CLEAR */}

              <button
                onClick={clearAll}
                disabled={loading || csvLoading}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold transition hover:bg-white/[0.08] disabled:opacity-50"
              >
                Clear
              </button>

              {/* RUN */}

              <button
                onClick={handleScreen}
                disabled={loading || csvLoading}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Screening..."
                  : "Run Screening"}
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* ======================================
          RESULTS
      ====================================== */}

      {results.length > 0 && (
        <section className="pb-24">

          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >

            {/* RESULTS HEADER */}

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Screening Results
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Molecular Predictions
              </h2>

              <p className="mt-3 text-slate-400">
                {results.length} molecule
                {results.length !== 1 ? "s" : ""} screened.
              </p>

            </div>

            {/* ==================================
                DOWNLOAD BUTTON
            ================================== */}

            <div className="mb-5 flex justify-end">

              <button
                onClick={downloadResults}
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                Download Results CSV
              </button>

            </div>

            {/* ==================================
                RESULTS TABLE
            ================================== */}

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  {/* HEADER */}

                  <thead className="border-b border-white/10 bg-white/[0.03]">

                    <tr>

                      <th className="px-6 py-4 text-sm text-slate-400">
                        #
                      </th>

                      <th className="px-6 py-4 text-sm text-slate-400">
                        Molecule
                      </th>

                      <th className="px-6 py-4 text-sm text-slate-400">
                        SMILES
                      </th>

                      <th className="px-6 py-4 text-sm text-slate-400">
                        Predicted LogS
                      </th>

                      <th className="px-6 py-4 text-sm text-slate-400">
                        Category
                      </th>

                    </tr>

                  </thead>

                  {/* BODY */}

                  <tbody>

                    {results.map((result) => (

                      <tr
                        key={result.id}
                        className="border-b border-white/10 last:border-b-0"
                      >

                        {/* NUMBER */}

                        <td className="px-6 py-5 text-slate-500">
                          {result.id}
                        </td>

                        {/* NAME */}

                        <td className="px-6 py-5 font-semibold">
                          {result.name}
                        </td>

                        {/* SMILES */}

                        <td className="max-w-md px-6 py-5">

                          <span className="break-all font-mono text-sm text-cyan-300">
                            {result.smiles}
                          </span>

                        </td>

                        {/* PREDICTION */}

                        <td className="px-6 py-5">

                          {result.prediction !== null ? (

                            <span className="text-lg font-bold text-cyan-400">
                              {result.prediction.toFixed(4)}
                            </span>

                          ) : (

                            <span className="text-red-400">
                              —
                            </span>

                          )}

                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-5">

                          {result.error ? (

                            <span className="text-sm text-red-400">
                              {result.error}
                            </span>

                          ) : (

                            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                              {result.category}
                            </span>

                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* ======================================
          INFORMATION
      ====================================== */}

      <section className="border-t border-white/10 py-20">

        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >

          <p className="text-sm leading-7 text-slate-500">
            Molecule names are automatically retrieved when available.
            Solubility predictions are generated using the trained
            MoleSol AI machine learning model.
          </p>

        </div>

      </section>

      {/* ======================================
          FOOTER
      ====================================== */}

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
            MoleSol AI · Virtual Screening
          </p>

        </div>

      </footer>

    </main>
  );
}

// ==========================================
// SOLUBILITY CATEGORY
// ==========================================

function getSolubilityCategory(logS: number) {
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

// ==========================================
// ESCAPE CSV VALUES
// ==========================================

function escapeCSV(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}