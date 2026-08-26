"use client";

import Link from "next/link";
import { BrandMark } from "../components/brand-mark";
import { useSyncExternalStore } from "react";
import {
  getSavedQuotations,
  quotationsChangedEvent,
  updateQuotationStatus,
  type QuotationStatus,
} from "../data/quotations";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(date));

const statusStyle: Record<QuotationStatus, string> = {
  Draft: "border-slate-400/40 bg-slate-400/10 text-slate-200",
  Sent: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  Confirmed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
};
const emptyQuotations: never[] = [];

export default function ProjectsPage() {
  const quotations = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(quotationsChangedEvent, onStoreChange);
      window.addEventListener("storage", onStoreChange);
      return () => {
        window.removeEventListener(quotationsChangedEvent, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    getSavedQuotations,
    () => emptyQuotations
  );

  const setStatus = (id: string, status: QuotationStatus) => {
    updateQuotationStatus(id, status);
  };

  return (
    <main className="min-h-screen bg-[#080704] px-5 py-8 text-yellow-50 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl rounded-3xl border border-yellow-500/30 bg-[#12100a] p-6 shadow-2xl shadow-black/50 sm:p-10">
        <header className="flex flex-col gap-5 border-b border-yellow-500/25 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BrandMark className="text-yellow-300" />
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-yellow-100">Wedding projects</h1>
            <p className="mt-2 text-yellow-100/65">Saved quotations and their current booking status.</p>
          </div>
          <Link href="/quotation" className="rounded-xl bg-yellow-400 px-5 py-3 text-center font-bold text-black transition hover:bg-yellow-300">Create quotation</Link>
        </header>

        {quotations.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-yellow-500/30 bg-black/20 px-6 py-14 text-center">
            <h2 className="text-xl font-semibold text-yellow-100">No quotations saved yet</h2>
            <p className="mt-2 text-yellow-100/60">Create and save a quotation to see it here.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {quotations.map((quotation) => (
              <article key={quotation.id} className="rounded-2xl border border-yellow-500/25 bg-black/20 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold text-yellow-400">{quotation.quoteNumber}</p>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[quotation.status]}`}>{quotation.status}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold text-yellow-100">{quotation.client.name}</h2>
                    <p className="mt-1 text-sm text-yellow-100/60">{quotation.packageName} · Created {formatDate(quotation.createdAt)}</p>
                    <p className="mt-3 text-sm text-yellow-100/75">{[quotation.client.phone, quotation.client.venue, quotation.client.city, quotation.client.date].filter(Boolean).join(" · ")}</p>
                    {quotation.coverageItems.length > 0 && <p className="mt-3 text-sm text-yellow-100/55">{quotation.coverageItems.join(" · ")}</p>}
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <p className="text-2xl font-bold text-yellow-300">{formatPrice(quotation.total)}</p>
                    <label className="text-sm text-yellow-100/65">Status<select value={quotation.status} onChange={(event) => setStatus(quotation.id, event.target.value as QuotationStatus)} className="ml-3 rounded-lg border border-yellow-500/30 bg-[#12100a] px-3 py-2 text-yellow-50 outline-none"><option>Draft</option><option>Sent</option><option>Confirmed</option></select></label>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
