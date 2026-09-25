export default function ModelInsightsPage() {
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
            Machine Learning
          </p>

          <h1 className="mt-5 text-5xl font-bold">
            Model Insights
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Technical information about the machine learning approach
            used by MoleSol AI.
          </p>
        </div>
      </section>

      {/* Model Overview */}
      <section className="py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center">
              <p className="text-sm text-slate-500">
                Model
              </p>

              <h2 className="mt-3 text-3xl font-bold text-cyan-400">
                Random Forest
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center">
              <p className="text-sm text-slate-500">
                Target Property
              </p>

              <h2 className="mt-3 text-3xl font-bold text-cyan-400">
                LogS
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center">
              <p className="text-sm text-slate-500">
                Validation
              </p>

              <h2 className="mt-3 text-3xl font-bold text-cyan-400">
                5-Fold CV
              </h2>
            </div>

          </div>
        </div>
      </section>

      {/* Performance Metrics */}
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
              Evaluation
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Performance Metrics
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-slate-400">
              These values should be replaced with the final metrics
              obtained from the trained model.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {[
              ["R²", "—", "Coefficient of determination"],
              ["RMSE", "—", "Root Mean Squared Error"],
              ["MAE", "—", "Mean Absolute Error"],
            ].map(([name, value, description]) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center"
              >
                <p className="text-sm text-slate-500">
                  {name}
                </p>

                <p className="mt-3 text-4xl font-bold text-cyan-400">
                  {value}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  {description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Cross Validation */}
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
            Validation Strategy
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            5-Fold Cross-Validation
          </h2>

          <p className="mt-6 leading-8 text-slate-400">
            Five-fold cross-validation divides the available training
            data into five subsets. The model is trained using four
            subsets and evaluated using the remaining subset. This
            process is repeated so that every subset is used for
            validation.
          </p>

          <p className="mt-5 leading-8 text-slate-400">
            Cross-validation provides a more reliable estimate of model
            performance and helps evaluate how well the model generalizes
            to unseen data.
          </p>
        </div>
      </section>

      {/* Hyperparameter Tuning */}
      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Optimization
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Hyperparameter Tuning
          </h2>

          <p className="mt-5 leading-8 text-slate-400">
            Different XGBoost configurations were evaluated to identify
            a suitable model configuration.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03]">
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-sm text-slate-400">
                    Parameter
                  </th>

                  <th className="px-6 py-4 text-sm text-slate-400">
                    Values Tested
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-white/10">
                  <td className="px-6 py-4">
                    n_estimators
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    100, 200
                  </td>
                </tr>

                <tr className="border-b border-white/10">
                  <td className="px-6 py-4">
                    max_depth
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    3, 5, 6
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4">
                    learning_rate
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    0.05, 0.10
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Molecular Features */}
      <section className="py-20">
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
              Molecular Features
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Features Used by the Model
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Molecular Weight",
              "LogP",
              "Topological Polar Surface Area",
              "H-Bond Donors",
              "H-Bond Acceptors",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
              >
                <p className="text-sm font-medium leading-6 text-slate-300">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="border-t border-white/10 py-20">
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Responsible Prediction
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Model Limitations
          </h2>

          <p className="mt-6 leading-8 text-slate-400">
            Machine learning predictions are estimates rather than
            replacements for experimental measurements. Prediction
            quality depends on the training data, molecular representation,
            and how similar a new molecule is to the data used during
            model development.
          </p>

          <p className="mt-5 leading-8 text-slate-400">
            MoleSol AI should therefore be used as a computational
            screening and decision-support tool rather than as a
            substitute for laboratory validation.
          </p>
        </div>
      </section>

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
            MoleSol AI · Model Insights
          </p>
        </div>
      </footer>

    </main>
  );
}