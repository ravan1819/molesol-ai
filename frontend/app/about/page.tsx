export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Header */}
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
            About the Project
          </p>

          <h1 className="mt-5 text-5xl font-bold">
            About MoleSol AI
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            A personal project exploring the application of machine
            learning and cheminformatics to molecular solubility
            prediction.
          </p>
        </div>
      </section>

      {/* Project Objective */}
      <section className="py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Project Objective
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Making Molecular Prediction More Accessible
          </h2>

          <p className="mt-6 leading-8 text-slate-400">
            MoleSol AI is designed to provide a simple interface for
            estimating molecular aqueous solubility using machine
            learning. The system combines molecular processing,
            descriptor generation, prediction, and virtual screening
            into one application.
          </p>

          <p className="mt-5 leading-8 text-slate-400">
            The project focuses on turning a computational machine
            learning workflow into a practical web-based application.
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Technology Stack
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Built With
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Python", "Core programming and machine learning workflow"],
              ["Pandas", "Data processing and dataset handling"],
              ["RDKit", "Molecular structure processing and descriptors"],
              ["XGBoost", "Machine learning model for solubility prediction"],
              ["FastAPI", "Backend API for prediction and screening"],
              ["Next.js", "Web frontend and user interface"],
            ].map(([name, description]) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
              >
                <h3 className="text-xl font-semibold text-cyan-300">
                  {name}
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
      <section className="py-24">
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
            Developer
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            Developed by
          </h2>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-10">
            <h3 className="text-2xl font-bold">
              Ramadugu Sravani
            </h3>

            <p className="mt-3 text-cyan-400">
              Independent Developer
            </p>

            <p className="mt-6 leading-8 text-slate-400">
              MoleSol AI is a personal project created to explore
              machine learning, data science, and cheminformatics through
              a practical AI-powered application.
            </p>

            <p className="mt-5 text-sm text-slate-500">
              sravanmiramadugu123@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-white/10 py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "850px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <h2 className="text-2xl font-bold">
            Disclaimer
          </h2>

          <p className="mt-5 leading-8 text-slate-500">
            MoleSol AI provides computational estimates and is intended
            for research, learning, and screening purposes. Predictions
            should not be considered a replacement for experimental
            laboratory measurements.
          </p>
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
            MoleSol AI · Personal Molecular AI Project
          </p>
        </div>
      </footer>

    </main>
  );
}