export type QuotationStatus = "Draft" | "Sent" | "Confirmed";

export type SavedQuotation = {
  id: string;
  quoteNumber: string;
  createdAt: string;
  status: QuotationStatus;
  client: {
    name: string;
    phone: string;
    venue: string;
    city: string;
    date: string;
  };
  packageName: string;
  coverageItems: string[];
  total: number;
};

const storageKey = "nanda-studio-quotations";
export const quotationsChangedEvent = "nanda-studio-quotations-changed";
let cachedRaw: string | null = null;
let cachedQuotations: SavedQuotation[] = [];

export const getSavedQuotations = (): SavedQuotation[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey) ?? "[]";
    if (raw === cachedRaw) return cachedQuotations;
    const saved = JSON.parse(raw) as SavedQuotation[];
    cachedRaw = raw;
    cachedQuotations = Array.isArray(saved) ? saved : [];
    return cachedQuotations;
  } catch {
    return [];
  }
};

export const saveQuotation = (quotation: SavedQuotation) => {
  const quotations = getSavedQuotations();
  cachedQuotations = [quotation, ...quotations];
  cachedRaw = JSON.stringify(cachedQuotations);
  window.localStorage.setItem(storageKey, cachedRaw);
  window.dispatchEvent(new Event(quotationsChangedEvent));
};

export const updateQuotationStatus = (id: string, status: QuotationStatus) => {
  cachedQuotations = getSavedQuotations().map((quotation) =>
    quotation.id === id ? { ...quotation, status } : quotation
  );
  cachedRaw = JSON.stringify(cachedQuotations);
  window.localStorage.setItem(storageKey, cachedRaw);
  window.dispatchEvent(new Event(quotationsChangedEvent));
  return cachedQuotations;
};
