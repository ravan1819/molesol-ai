"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Predict", href: "/predict" },
    { name: "Virtual Screening", href: "/virtual-screening" },
    { name: "Model Insights", href: "/model-insights" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl">
            🧬
          </div>

          <div>
            <div className="text-lg font-bold tracking-wide">
              MOLESOL <span className="text-cyan-400">AI</span>
            </div>

            <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Molecular Intelligence
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/predict"
          className="hidden rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20 lg:block"
        >
          Try Prediction →
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-white/10 px-3 py-2 text-xl text-slate-200 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#050816]/95 px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-cyan-400"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/predict"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-cyan-400 px-4 py-3 text-center font-semibold text-slate-950"
            >
              Try Prediction →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}