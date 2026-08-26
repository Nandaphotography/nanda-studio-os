"use client";

import { useState } from "react";
import { packages } from "../data/packages";
import {
  quotationEventTypes,
  signatureCoverageOptions,
  signatureDeliverables,
  signatureEventAddOns,
  signatureEvents,
  signatureRates,
  type SignatureCoverageOption,
  type QuotationEventTypeId,
} from "../data/signature";
import { saveQuotation } from "../data/quotations";

type ClientDetails = {
  name: string;
  phone: string;
  venue: string;
  city: string;
  date: string;
};

type Package = (typeof packages)[number];
type CustomEventPackage = {
  id: string;
  name: string;
  price: null;
  description: string;
  customizable: true;
  photography?: string[];
  videography?: string[];
  deliverables?: string[];
};
type SelectedPackage = Package | CustomEventPackage;

const nonWeddingEventTypes = new Set<QuotationEventTypeId>([
  "birthday",
  "half-saree",
  "engagement",
  "other-event-up-to-5-hours",
]);

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function QuotationPage() {
  const [selectedEventType, setSelectedEventType] = useState<QuotationEventTypeId | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [selectedSignatureEvents, setSelectedSignatureEvents] = useState<string[]>([]);
  const [selectedCoverage, setSelectedCoverage] = useState<
    Record<string, SignatureCoverageOption[]>
  >({});
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [selectedEventAddOns, setSelectedEventAddOns] = useState<Record<string, string[]>>({});
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: "",
    phone: "",
    venue: "",
    city: "",
    date: "",
  });
  const [isQuotationGenerated, setIsQuotationGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [savedQuoteNumber, setSavedQuoteNumber] = useState("");

  const selectedEvents = signatureEvents.filter((event) =>
    selectedSignatureEvents.includes(event.id)
  );
  const availableCoverageEvents = selectedEventType === "wedding"
    ? signatureEvents.filter((event) => !nonWeddingEventTypes.has(event.id as QuotationEventTypeId))
    : signatureEvents.filter((event) => event.id === selectedEventType);
  const signatureTotal = selectedEvents.reduce(
    (total, event) =>
      total +
      (selectedCoverage[event.id] ?? []).reduce(
        (coverageTotal, coverage) => coverageTotal + signatureRates[coverage],
        0
      ),
    0
  );
  const deliverableTotal = signatureDeliverables.reduce(
    (total, deliverable) => total + (selectedDeliverables.includes(deliverable.id) ? deliverable.price : 0),
    0
  );
  const eventAddOnTotal = Object.values(selectedEventAddOns).flat().reduce(
    (total, addOnId) => total + (signatureEventAddOns.find((addOn) => addOn.id === addOnId)?.price ?? 0),
    0
  );
  const quotationTotal = selectedPackage?.customizable
    ? signatureTotal + eventAddOnTotal + deliverableTotal
    : selectedPackage?.price ?? 0;

  const selectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setSelectedSignatureEvents([]);
    setSelectedCoverage({});
    setSelectedDeliverables([]);
    setSelectedEventAddOns({});
    setIsQuotationGenerated(false);
  };

  const selectEventType = (eventTypeId: QuotationEventTypeId) => {
    const eventType = quotationEventTypes.find((item) => item.id === eventTypeId);
    if (!eventType) return;
    setSelectedEventType(eventTypeId);
    setSelectedCoverage({});
    setSelectedDeliverables([]);
    setSelectedEventAddOns({});
    setSavedQuoteNumber("");
    setIsQuotationGenerated(false);
    if (eventTypeId === "wedding") {
      setSelectedPackage(null);
      setSelectedSignatureEvents([]);
      return;
    }
    setSelectedPackage({
      id: `${eventTypeId}-coverage`,
      name: `${eventType.name} Coverage`,
      price: null,
      description: eventType.description,
      customizable: true,
    });
    setSelectedSignatureEvents([eventTypeId]);
  };

  const updateClientDetail = (field: keyof ClientDetails, value: string) => {
    setClientDetails((currentDetails) => ({ ...currentDetails, [field]: value }));
    setIsQuotationGenerated(false);
  };

  const toggleSignatureEvent = (eventId: string) => {
    const isRemoving = selectedSignatureEvents.includes(eventId);
    if (isRemoving) {
      setSelectedCoverage((currentCoverage) => {
        const { [eventId]: removedCoverage, ...remainingCoverage } = currentCoverage;
        void removedCoverage;
        return remainingCoverage;
      });
      setSelectedEventAddOns((currentAddOns) => {
        const { [eventId]: removedAddOns, ...remainingAddOns } = currentAddOns;
        void removedAddOns;
        return remainingAddOns;
      });
    }
    setSelectedSignatureEvents((currentEvents) => {
      if (isRemoving) {
        return currentEvents.filter((id) => id !== eventId);
      }
      return [...currentEvents, eventId];
    });
    setIsQuotationGenerated(false);
  };

  const toggleCoverage = (eventId: string, coverage: SignatureCoverageOption) => {
    setSelectedCoverage((currentCoverage) => {
      const eventCoverage = currentCoverage[eventId] ?? [];
      const nextCoverage = eventCoverage.includes(coverage)
        ? eventCoverage.filter((item) => item !== coverage)
        : [...eventCoverage, coverage];
      return { ...currentCoverage, [eventId]: nextCoverage };
    });
    setIsQuotationGenerated(false);
  };

  const toggleDeliverable = (deliverableId: string) => {
    setSelectedDeliverables((currentDeliverables) =>
      currentDeliverables.includes(deliverableId)
        ? currentDeliverables.filter((id) => id !== deliverableId)
        : [...currentDeliverables, deliverableId]
    );
    setIsQuotationGenerated(false);
  };

  const toggleEventAddOn = (eventId: string, addOnId: string) => {
    setSelectedEventAddOns((currentAddOns) => {
      const eventAddOns = currentAddOns[eventId] ?? [];
      const nextAddOns = eventAddOns.includes(addOnId)
        ? eventAddOns.filter((id) => id !== addOnId)
        : [...eventAddOns, addOnId];
      return { ...currentAddOns, [eventId]: nextAddOns };
    });
    setIsQuotationGenerated(false);
  };

  const canGenerate = Boolean(
    selectedPackage &&
      clientDetails.name.trim() &&
      (!selectedPackage.customizable || selectedEvents.length > 0)
  );

  const getCoverageItems = () => {
    if (!selectedPackage) return [];
    if (!selectedPackage.customizable) {
      return [
        ...(selectedPackage.photography ?? []).map((item) => `Photography: ${item}`),
        ...(selectedPackage.videography ?? []).map((item) => `Videography: ${item}`),
        ...(selectedPackage.deliverables ?? []).map((item) => `Deliverable: ${item}`),
      ];
    }
    return [
      ...selectedEvents.map((event) => `${event.name}: ${selectedCoverage[event.id]?.length ? selectedCoverage[event.id].join(", ") : "Crew to be confirmed"}`),
      ...selectedEvents.flatMap((event) => signatureEventAddOns.filter((addOn) => selectedEventAddOns[event.id]?.includes(addOn.id)).map((addOn) => `${event.name} add-on: ${addOn.name}`)),
      ...signatureDeliverables.filter((deliverable) => selectedDeliverables.includes(deliverable.id)).map((deliverable) => `Deliverable: ${deliverable.name}`),
    ];
  };

  const saveCurrentQuotation = () => {
    if (!selectedPackage || !canGenerate) return;
    const createdAt = new Date().toISOString();
    const quoteNumber = `NP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    saveQuotation({
      id: crypto.randomUUID(),
      quoteNumber,
      createdAt,
      status: "Draft",
      client: clientDetails,
      packageName: selectedPackage.name,
      coverageItems: getCoverageItems(),
      total: quotationTotal,
    });
    setSavedQuoteNumber(quoteNumber);
  };

  const downloadQuotation = async () => {
    if (!selectedPackage || !canGenerate) return;

    setIsGenerating(true);
    setGenerationError("");
    try {
      const coverageItems = getCoverageItems();
      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientDetails, packageName: selectedPackage.name, coverageItems, total: quotationTotal }),
      });
      if (!response.ok) throw new Error("Unable to create the quotation PDF.");

      const pdf = await response.blob();
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nanda-photography-quotation-${clientDetails.name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "client"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setIsQuotationGenerated(true);
    } catch {
      setGenerationError("We could not create the PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080704] px-5 py-8 text-yellow-50 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl rounded-3xl border border-yellow-500/30 bg-[#12100a] p-6 shadow-2xl shadow-black/50 sm:p-10">
        <header className="border-b border-yellow-500/25 pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-yellow-400">Nanda Photography</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-yellow-100 sm:text-5xl">Wedding quotation</h1>
              <p className="mt-2 max-w-2xl text-yellow-100/65">Build a clear coverage plan and share a tailored quotation with your client.</p>
            </div>
            {selectedPackage && (
              <div className="rounded-xl border border-yellow-500/30 bg-black/25 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-wider text-yellow-100/55">Estimated total</p>
                <p className="mt-1 text-2xl font-bold text-yellow-300">{formatPrice(quotationTotal)}</p>
              </div>
            )}
          </div>
        </header>

        <section className="mt-9">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold">1. Select event type</h2>
            <p className="text-sm text-yellow-100/55">Choose the occasion first</p>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {quotationEventTypes.map((eventType) => {
              const isSelected = selectedEventType === eventType.id;
              return (
                <button key={eventType.id} type="button" onClick={() => selectEventType(eventType.id)} aria-pressed={isSelected} className={`rounded-2xl border p-6 text-left transition ${isSelected ? "border-yellow-300 bg-yellow-400/15 ring-1 ring-yellow-300" : "border-yellow-500/25 bg-black/20 hover:border-yellow-400 hover:bg-white/5"}`}>
                  <h3 className="text-xl font-bold text-yellow-100">{eventType.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-yellow-100/65">{eventType.description}</p>
                  <p className="mt-5 text-sm font-semibold text-yellow-200">{isSelected ? "Selected" : "Choose event"}</p>
                </button>
              );
            })}
          </div>
        </section>

        {selectedEventType === "wedding" && (
          <section className="mt-9">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-semibold">2. Select a Wedding package</h2>
              <p className="text-sm text-yellow-100/55">All prices are in INR</p>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return <button key={pkg.id} type="button" onClick={() => selectPackage(pkg)} aria-pressed={isSelected} className={`rounded-2xl border p-6 text-left transition ${isSelected ? "border-yellow-300 bg-yellow-400/15 ring-1 ring-yellow-300" : "border-yellow-500/25 bg-black/20 hover:border-yellow-400 hover:bg-white/5"}`}><div className="flex items-start justify-between gap-3"><h3 className="text-xl font-bold text-yellow-100">{pkg.name}</h3><span className="text-sm font-semibold text-yellow-300">{pkg.price ? formatPrice(pkg.price) : "Custom"}</span></div><p className="mt-3 text-sm leading-6 text-yellow-100/65">{pkg.description}</p><p className="mt-5 text-sm font-semibold text-yellow-200">{isSelected ? "Selected" : "Choose package"}</p></button>;
              })}
            </div>
          </section>
        )}

        {selectedPackage && !selectedPackage.customizable && <PackageDetails selectedPackage={selectedPackage} />}

        {selectedPackage?.customizable && (
          <section className="mt-9 rounded-2xl border border-yellow-500/25 bg-black/20 p-6 sm:p-7">
            <h2 className="text-2xl font-semibold">{selectedEventType === "wedding" ? "3. Create your Signature coverage" : `2. Create your ${selectedPackage.name}`}</h2>
            <p className="mt-2 text-yellow-100/65">Choose the programs, then add the crew for each one. The estimate updates as you go.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableCoverageEvents.map((event) => {
                const isSelected = selectedSignatureEvents.includes(event.id);
                const eventTotal = (selectedCoverage[event.id] ?? []).reduce((total, coverage) => total + signatureRates[coverage], 0);
                return (
                  <div key={event.id} className={`rounded-xl border p-5 ${isSelected ? "border-yellow-300 bg-yellow-400/10" : "border-yellow-500/25 bg-[#0c0a05]"}`}>
                    <button type="button" onClick={() => toggleSignatureEvent(event.id)} aria-pressed={isSelected} className="flex w-full items-center justify-between gap-3 text-left">
                      <span className="font-semibold">{event.name}</span>
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-sm ${isSelected ? "border-yellow-300 bg-yellow-300 text-black" : "border-yellow-500/60 text-yellow-300"}`}>{isSelected ? "✓" : "+"}</span>
                    </button>
                    {isSelected && (
                      <div className="mt-4 border-t border-yellow-500/20 pt-4">
                        <div className="grid gap-2">
                          {(event.coverageOptions ?? signatureCoverageOptions).map((coverage) => {
                            const checked = selectedCoverage[event.id]?.includes(coverage) ?? false;
                            return (
                              <label key={coverage} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5">
                                <span className="flex items-center gap-3"><input type="checkbox" checked={checked} onChange={() => toggleCoverage(event.id, coverage)} className="h-4 w-4 accent-yellow-400" />{coverage}</span>
                                <span className="text-yellow-100/55">{formatPrice(signatureRates[coverage])}</span>
                              </label>
                            );
                          })}
                        </div>
                        <p className="mt-4 text-right text-sm font-semibold text-yellow-300">{eventTotal ? formatPrice(eventTotal) : "Select crew"}</p>
                        {(event.id === "reception" || event.id === "muhurtham") && (
                          <div className="mt-5 border-t border-yellow-500/20 pt-4">
                            <p className="text-sm font-semibold text-yellow-200">LED wall</p>
                            <div className="mt-2 grid gap-2">
                              {signatureEventAddOns.map((addOn) => {
                                const checked = selectedEventAddOns[event.id]?.includes(addOn.id) ?? false;
                                return <label key={addOn.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"><span className="flex items-center gap-3"><input type="checkbox" checked={checked} onChange={() => toggleEventAddOn(event.id, addOn.id)} className="h-4 w-4 accent-yellow-400" />{addOn.name}</span><span className="text-yellow-100/55">{formatPrice(addOn.price)}</span></label>;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 border-t border-yellow-500/20 pt-6">
              <h3 className="text-lg font-semibold text-yellow-200">Deliverables</h3>
              <p className="mt-1 text-sm text-yellow-100/60">Premium Canvera Album (13x40 Inches), storage, and photo frames.</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {signatureDeliverables.map((deliverable) => {
                  const isSelected = selectedDeliverables.includes(deliverable.id);
                  return (
                    <label key={deliverable.id} className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${isSelected ? "border-yellow-300 bg-yellow-400/10" : "border-yellow-500/25 bg-[#0c0a05] hover:border-yellow-400"}`}>
                      <span className="flex items-center gap-3 font-medium"><input type="checkbox" checked={isSelected} onChange={() => toggleDeliverable(deliverable.id)} className="h-4 w-4 accent-yellow-400" />{deliverable.name}</span>
                      <span className="whitespace-nowrap text-sm font-semibold text-yellow-300">{formatPrice(deliverable.price)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="mt-9">
          <h2 className="text-2xl font-semibold">{selectedPackage?.customizable ? (selectedEventType === "wedding" ? "4" : "3") : "3"}. Client details</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input label="Client name" value={clientDetails.name} onChange={(value) => updateClientDetail("name", value)} placeholder="Client name" />
            <Input label="Mobile number" value={clientDetails.phone} onChange={(value) => updateClientDetail("phone", value)} placeholder="Mobile number" type="tel" />
            <Input label="Venue" value={clientDetails.venue} onChange={(value) => updateClientDetail("venue", value)} placeholder="Venue" />
            <Input label="City" value={clientDetails.city} onChange={(value) => updateClientDetail("city", value)} placeholder="City" />
            <Input label="Event date" value={clientDetails.date} onChange={(value) => updateClientDetail("date", value)} type="date" />
          </div>
        </section>

        {selectedPackage && (
          <section className="mt-9 rounded-2xl border border-yellow-500/30 bg-black/25 p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">Quotation preview</p>
            <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-2xl font-bold text-yellow-100">{clientDetails.name || "Client name pending"}</h2>
                <p className="mt-1 text-yellow-100/60">{[clientDetails.phone, clientDetails.venue, clientDetails.city, clientDetails.date].filter(Boolean).join(" · ") || "Add client details to complete this quotation."}</p>
                <p className="mt-5 font-semibold text-yellow-200">{selectedPackage.name}</p>
              </div>
              <p className="text-3xl font-bold text-yellow-300">{formatPrice(quotationTotal)}</p>
            </div>
            {selectedPackage.customizable && selectedEvents.length > 0 && (
              <div className="mt-5 grid gap-3">
                {selectedEvents.map((event) => <div key={event.id} className="flex flex-col justify-between gap-1 rounded-lg border border-yellow-500/20 px-4 py-3 sm:flex-row"><span className="font-medium">{event.name}</span><span className="text-sm text-yellow-100/65">{selectedCoverage[event.id]?.length ? selectedCoverage[event.id].join(" · ") : "Crew to be confirmed"}</span></div>)}
                {selectedEvents.flatMap((event) => signatureEventAddOns.filter((addOn) => selectedEventAddOns[event.id]?.includes(addOn.id)).map((addOn) => <div key={`${event.id}-${addOn.id}`} className="flex flex-col justify-between gap-1 rounded-lg border border-yellow-500/20 px-4 py-3 sm:flex-row"><span className="font-medium">{event.name}: {addOn.name}</span><span className="text-sm text-yellow-100/65">{formatPrice(addOn.price)}</span></div>))}
                {signatureDeliverables.filter((deliverable) => selectedDeliverables.includes(deliverable.id)).map((deliverable) => <div key={deliverable.id} className="flex flex-col justify-between gap-1 rounded-lg border border-yellow-500/20 px-4 py-3 sm:flex-row"><span className="font-medium">Deliverable: {deliverable.name}</span><span className="text-sm text-yellow-100/65">{formatPrice(deliverable.price)}</span></div>)}
              </div>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" disabled={!canGenerate} onClick={saveCurrentQuotation} className="rounded-xl border border-yellow-400 px-6 py-3 font-bold text-yellow-200 transition hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-40">Save quotation</button>
              <button type="button" disabled={!canGenerate || isGenerating} onClick={downloadQuotation} className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40">{isGenerating ? "Creating PDF..." : "Download quotation PDF"}</button>
              {savedQuoteNumber && <p className="self-center text-sm font-medium text-yellow-200">Saved as {savedQuoteNumber}.</p>}
              {isQuotationGenerated && <p className="self-center text-sm font-medium text-yellow-200">PDF quotation downloaded for {clientDetails.name}.</p>}
              {generationError && <p className="self-center text-sm font-medium text-red-300">{generationError}</p>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <label className="grid gap-2 text-sm font-medium text-yellow-100/80">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} className="rounded-xl border border-yellow-500/30 bg-black/25 px-4 py-3 text-yellow-50 outline-none placeholder:text-yellow-100/35 focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300" /></label>;
}

function PackageDetails({ selectedPackage }: { selectedPackage: Exclude<Package, { customizable: true }> }) {
  const sections = [["Photography", selectedPackage.photography], ["Videography", selectedPackage.videography], ["Production", selectedPackage.production], ["Deliverables", selectedPackage.deliverables], ["Complimentary", selectedPackage.complimentary]] as const;
  const eventSections = selectedPackage.events && !Array.isArray(selectedPackage.events) ? Object.entries(selectedPackage.events) : [];
  return <section className="mt-9 rounded-2xl border border-yellow-500/25 bg-black/20 p-6 sm:p-7"><h2 className="text-2xl font-semibold">What&apos;s included</h2><div className="mt-5 grid gap-6 md:grid-cols-2">{sections.map(([title, items]) => items?.length ? <PackageList key={title} title={title} items={items} /> : null)}{eventSections.length > 0 && <div><h3 className="font-semibold text-yellow-300">Event coverage</h3><div className="mt-3 grid gap-3">{eventSections.map(([event, items]) => <PackageList key={event} title={event} items={items} compact />)}</div></div>}</div></section>;
}

function PackageList({ title, items, compact = false }: { title: string; items: readonly string[]; compact?: boolean }) {
  return <div><h3 className="font-semibold capitalize text-yellow-300">{title}</h3><ul className={`mt-3 grid ${compact ? "gap-1" : "gap-2"} text-sm text-yellow-100/75`}>{items.map((item) => <li key={item}>✓ {item}</li>)}</ul></div>;
}
