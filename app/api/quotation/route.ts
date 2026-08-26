export const runtime = "nodejs";

type QuotationRequest = {
  clientDetails?: {
    name?: string;
    phone?: string;
    venue?: string;
    city?: string;
    date?: string;
  };
  packageName?: string;
  coverageItems?: string[];
  total?: number;
};

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const clean = (value: unknown) =>
  typeof value === "string" ? value.replace(/[\\()]/g, "\\$&").replace(/[\r\n\t]/g, " ").trim() : "";

const wrap = (text: string, width = 76) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines;
};

function createPdf(lines: string[]) {
  const chunks: string[][] = [];
  for (let index = 0; index < lines.length; index += 42) chunks.push(lines.slice(index, index + 42));

  const objects: string[] = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  const pageObjectIds: number[] = [];
  const contentObjectIds: number[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    pageObjectIds.push(objects.length + 1);
    objects.push("");
    contentObjectIds.push(objects.length + 1);
    const content = [
      "BT",
      "0.76 0.56 0.05 rg",
      "/F1 18 Tf",
      "50 790 Td",
      "(NANDA PHOTOGRAPHY) Tj",
      "0.15 0.12 0.05 rg",
      "/F1 10 Tf",
      "0 -28 Td",
      "/F1 11 Tf",
      "(WEDDING QUOTATION) Tj",
      "/F1 10 Tf",
      "0 -28 Td",
      "14 TL",
      ...chunks[index].flatMap((line) => [`(${line}) Tj`, "T*"]),
      "ET",
    ].join("\n");
    objects.push(`<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`);
  }

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;
  pageObjectIds.forEach((id, index) => {
    objects[id - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`;
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

export async function POST(request: Request) {
  const body = (await request.json()) as QuotationRequest;
  const client = body.clientDetails ?? {};
  const clientName = clean(client.name);
  const packageName = clean(body.packageName);
  const total = typeof body.total === "number" && Number.isFinite(body.total) && body.total >= 0 ? body.total : null;
  const coverageItems = Array.isArray(body.coverageItems) ? body.coverageItems.map(clean).filter(Boolean).slice(0, 40) : [];

  if (!clientName || !packageName || total === null) {
    return Response.json({ error: "Client, package, and total are required." }, { status: 400 });
  }

  const details = [["Mobile", clean(client.phone)], ["Venue", clean(client.venue)], ["City", clean(client.city)], ["Event date", clean(client.date)]].filter(([, value]) => value);
  const quoteDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date());
  const lines = [
    `Quotation date: ${quoteDate}`,
    "",
    "BILL TO",
    clientName,
    ...details.map(([label, value]) => `${label}: ${value}`),
    "",
    `PACKAGE: ${packageName}`,
    "",
    "COVERAGE & DELIVERABLES",
    ...(coverageItems.length ? coverageItems.flatMap((item) => wrap(`- ${item}`)) : ["- Coverage to be confirmed"]),
    "",
    `TOTAL ESTIMATE: Rs. ${formatter.format(total)}`,
    "",
    "TERMS",
    "- This quotation is valid for 14 days from the issue date.",
    "- Dates are confirmed once the advance payment is received.",
    "- Any additions requested after confirmation are quoted separately.",
    "",
    "Thank you for considering Nanda Photography.",
  ].map(clean);

  const pdf = createPdf(lines);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="nanda-photography-quotation.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
