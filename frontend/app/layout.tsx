import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoleSol AI",
  description: "AI-powered molecular solubility prediction and virtual screening",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050816] text-white antialiased">

        {/* Navbar */}
        <nav className="border-b border-white/10 bg-[#050816]/95">
          <div
            style={{
              width: "100%",
              maxWidth: "1180px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <div className="flex h-20 items-center justify-between">

              {/* Logo */}
              <Link
                href="/"
                className="text-xl font-bold tracking-tight"
              >
                MoleSol
                <span className="text-cyan-400"> AI</span>
              </Link>

              {/* Navigation */}
              <div className="hidden items-center gap-8 md:flex">
                <Link
                  href="/"
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  Home
                </Link>

                <Link
                  href="/predict"
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  Predict
                </Link>

                <Link
                  href="/virtual-screening"
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  Virtual Screening
                </Link>

                <Link
                  href="/model-insights"
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  Model Insights
                </Link>

                <Link
                  href="/about"
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  About
                </Link>
              </div>

            </div>
          </div>
        </nav>

        {/* Page Content */}
        {children}

      </body>
    </html>
  );
}