export type SignatureEvent = {
  id: string;
  name: string;
  crew: string[];
  coverageOptions?: SignatureCoverageOption[];
};

export const quotationEventTypes = [
  { id: "wedding", name: "Wedding", description: "Choose from Wedding packages or custom Signature coverage." },
  { id: "birthday", name: "Birthday", description: "Create a custom event coverage quotation." },
  { id: "half-saree", name: "Half Saree", description: "Create a custom event coverage quotation." },
  { id: "engagement", name: "Engagement", description: "Create a custom event coverage quotation." },
  { id: "other-event-up-to-5-hours", name: "Other Event (Up to 5 Hours)", description: "Create a custom event coverage quotation." },
] as const;

export type QuotationEventTypeId = (typeof quotationEventTypes)[number]["id"];

export const signatureRates = {
  "Traditional Photographer": 5000,
  "Traditional Videographer": 5000,
  "Candid Photographer": 10000,
  "Candid Cinematographer": 12000,
  Drone: 4000,
  "30-sheet album": 18000,
  "60-sheet album": 30000,
  "100-sheet album": 45000,
} as const;

export type SignatureRateName = keyof typeof signatureRates;

export const signatureCoverageOptions = [
  "Traditional Photographer",
  "Traditional Videographer",
  "Candid Photographer",
  "Candid Cinematographer",
  "Drone",
] as const;

export type SignatureCoverageOption = (typeof signatureCoverageOptions)[number];

export const signatureEventAddOns = [
  {
    id: "led-wall-6x8",
    name: "LED Wall (6x8 Feet)",
    price: 10000,
  },
  {
    id: "led-wall-12x8",
    name: "LED Wall (12x8 Feet)",
    price: 20000,
  },
] as const;

export const signatureDeliverables = [
  {
    id: "canvera-premium-small-20",
    name: "Premium Canvera Album Small (12x18 Inches) - 20 Sheets",
    price: 5000,
  },
  {
    id: "canvera-premium-30",
    name: "Premium Canvera Album (13x40 Inches) - 30 Sheets",
    price: signatureRates["30-sheet album"],
  },
  {
    id: "canvera-premium-60",
    name: "Premium Canvera Album (13x40 Inches) - 60 Sheets",
    price: signatureRates["60-sheet album"],
  },
  {
    id: "canvera-premium-100",
    name: "Premium Canvera Album (13x40 Inches) - 100 Sheets",
    price: signatureRates["100-sheet album"],
  },
  {
    id: "pendrive",
    name: "Pendrive",
    price: 1000,
  },
  {
    id: "hard-drive",
    name: "Hard Drive",
    price: 10000,
  },
  {
    id: "imported-photo-frame",
    name: "Imported Photo Frame (12x18 Inches)",
    price: 1000,
  },
] as const;

export const signatureEvents: SignatureEvent[] = [
  {
    id: "pre-wedding",
    name: "Pre-Wedding",
    crew: ["Candid Photographer", "Candid Cinematographer", "Drone"],
    coverageOptions: ["Candid Photographer", "Candid Cinematographer", "Drone"],
  },
  {
    id: "birthday",
    name: "Birthday",
    crew: [],
  },
  {
    id: "half-saree",
    name: "Half Saree",
    crew: [],
  },
  {
    id: "engagement",
    name: "Engagement",
    crew: [],
  },
  {
    id: "haldi",
    name: "Haldi",
    crew: [],
  },
  {
    id: "mehendi",
    name: "Mehendi",
    crew: ["Candid Photographer", "Candid Cinematographer"],
  },
  {
    id: "sangeeth",
    name: "Sangeeth",
    crew: [],
  },
  {
    id: "nalugu",
    name: "Nalugu",
    crew: [
      "Traditional Photographer",
      "Candid Photographer",
      "Traditional Videographer",
      "Candid Cinematographer",
    ],
  },
  {
    id: "extra-nalugu",
    name: "Extra Nalugu (Bride/Groom)",
    crew: [],
  },
  {
    id: "reception",
    name: "Reception",
    crew: [],
  },
  {
    id: "muhurtham",
    name: "Muhurtham",
    crew: [],
  },
  {
    id: "dinner-guest-coverage",
    name: "Dinner & Guest Coverage",
    crew: ["1 Traditional Photographer", "1 Traditional Videographer"],
  },
  {
    id: "other-event-up-to-5-hours",
    name: "Other Event (Up to 5 Hours)",
    crew: [],
  },
];
