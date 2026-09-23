import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Hero Section */}
      <section className="border-b border-white/10 py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            AI-Powered Molecular Intelligence
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Predict Molecular
            <span className="block text-cyan-400">
              Solubility with AI
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            MoleSol AI uses machine learning and molecular descriptors
            to estimate aqueous solubility from a molecule's SMILES
            representation.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/predict"
              className="rounded-xl bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Predict a Molecule
            </Link>

            <Link
              href="/virtual-screening"
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3 font-semibold transition hover:bg-white/10"
            >
              Virtual Screening
            </Link>
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                The Challenge
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                Why Molecular Solubility Matters
              </h2>
            </div>

            <div className="text-slate-400">
              <p className="leading-8">
                Molecular solubility is an important property in
                pharmaceutical and chemical research. A molecule's ability
                to dissolve in water can influence its behavior,
                formulation, absorption, and practical applications.
              </p>

              <p className="mt-5 leading-8">
                Traditional experimental measurements can require
                considerable time and resources. Machine learning provides
                a computational approach for estimating solubility before
                laboratory testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Concept */}
      <section className="border-y border-white/10 bg-white/[0.02] py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Core Concept
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              What is Molecular Solubility?
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Molecular solubility describes how much of a substance can
              dissolve in a particular solvent under specified conditions.
              In MoleSol AI, solubility is represented using LogS, a
              logarithmic representation of aqueous solubility.
            </p>
          </div>
        </div>
      </section>

      {/* SMILES */}
      <section className="py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Molecular Representation
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                What is SMILES?
              </h2>

              <p className="mt-6 leading-8 text-slate-400">
                SMILES stands for Simplified Molecular Input Line Entry
                System. It represents the structure of a molecule as a
                text string.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <p className="text-sm text-slate-500">
                Example
              </p>

              <code className="mt-4 block break-all rounded-xl bg-black/30 p-5 text-cyan-300">
                CCO
              </code>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                The SMILES representation is processed by the backend to
                derive molecular information that can be used by the
                machine learning model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI */}
      <section className="border-y border-white/10 bg-white/[0.02] py-24">
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
              Machine Learning
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Why Use AI for Molecular Prediction?
            </h2>

            <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-400">
              Machine learning can identify relationships between
              molecular characteristics and experimentally observed
              properties. Once trained, a model can provide predictions
              for new molecular structures quickly.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-xl font-semibold">
                Fast Prediction
              </h3>
              <p className="mt-3 leading-7 text-slate-400">
                Estimate molecular properties computationally without
                requiring an experiment for every candidate.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-xl font-semibold">
                Data-Driven
              </h3>
              <p className="mt-3 leading-7 text-slate-400">
                Learn patterns from molecular data and experimentally
                measured solubility values.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-xl font-semibold">
                Candidate Screening
              </h3>
              <p className="mt-3 leading-7 text-slate-400">
                Evaluate multiple molecules computationally and identify
                candidates for further investigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-24">
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
              Workflow
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              How MoleSol AI Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              ["01", "Input", "Provide a molecule using its SMILES representation."],
              ["02", "Process", "Convert the molecular structure into useful numerical information."],
              ["03", "Predict", "The trained machine learning model estimates LogS."],
              ["04", "Analyze", "View the prediction or screen multiple molecules."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="text-sm font-bold text-cyan-400">
                  {number}
                </span>

                <h3 className="mt-4 text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="border-t border-white/10 py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Project Developer
          </p>

          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            Developed by
          </h2>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-10">
            <h3 className="text-2xl font-bold">
              Ramadugu Sravani
            </h3>

            <p className="mt-3 text-cyan-400">
              Independent Developer
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              MoleSol AI is a personal project focused on applying
              data science, machine learning, and cheminformatics
              to molecular property prediction.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            MoleSol AI · Personal Project
          </p>
        </div>
      </footer>

    </main>
  );
}