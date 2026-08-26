import Link from "next/link";
import { BrandMark } from "./components/brand-mark";

const portfolioCategories = [
  { name: "Weddings", caption: "Timeless ceremonies & celebrations", tone: "from-[#5d3824] via-[#1e1510] to-[#0d0a09]" },
  { name: "Pre-Wedding", caption: "Stories before the celebration", tone: "from-[#433448] via-[#201824] to-[#0d0a09]" },
  { name: "Engagement", caption: "The beginning of forever", tone: "from-[#6a4c24] via-[#241b11] to-[#0d0a09]" },
  { name: "Portraits & Events", caption: "Milestones, beautifully remembered", tone: "from-[#254449] via-[#112327] to-[#0d0a09]" },
];
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090706] px-5 py-6 text-yellow-50 sm:px-8 sm:py-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(173,117,31,0.22),transparent_30%),radial-gradient(circle_at_88%_86%,rgba(92,31,58,0.28),transparent_34%),linear-gradient(135deg,#100c08_0%,#070504_52%,#130b11_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-yellow-500/20 pb-5">
          <BrandMark className="text-yellow-300" />
          <span className="hidden rounded-full border border-yellow-400/25 bg-yellow-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-200 sm:block">
            Studio Workspace
          </span>
        </header>

        <section className="flex min-h-[calc(100vh-8rem)] items-center py-14 sm:py-20">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-yellow-400">Photography, thoughtfully planned</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight text-yellow-50 sm:text-6xl lg:text-7xl">
                Beautiful celebrations deserve a beautiful plan.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-yellow-100/65">
                Create clear event quotations, select coverage, and keep every wedding project organised in one place.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/quotation" className="rounded-xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 px-6 py-4 text-center font-bold text-[#1a1004] shadow-lg shadow-amber-900/25 transition hover:brightness-110">
                  Create New Quotation
                </Link>
                <Link href="/projects" className="rounded-xl border border-yellow-400/35 bg-black/20 px-6 py-4 text-center font-semibold text-yellow-100 transition hover:border-yellow-300 hover:bg-white/5">
                  View Wedding Projects
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-400/25 bg-[#17100b]/75 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">Your Studio</p>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.9)]" />
              </div>
              <div className="mt-7 space-y-4">
                <div className="rounded-2xl border border-yellow-500/20 bg-black/25 p-5">
                  <p className="text-sm text-yellow-100/55">Quotation workflow</p>
                  <p className="mt-1 text-xl font-semibold text-yellow-50">From occasion to estimate</p>
                  <p className="mt-2 text-sm leading-6 text-yellow-100/60">Wedding, Birthday, Half Saree, Engagement, and more.</p>
                </div>
                <div className="rounded-2xl border border-yellow-500/20 bg-black/25 p-5">
                  <p className="text-sm text-yellow-100/55">Signature coverage</p>
                  <p className="mt-1 text-xl font-semibold text-yellow-50">Crew, deliverables &amp; add-ons</p>
                  <p className="mt-2 text-sm leading-6 text-yellow-100/60">Build a tailored quote with live pricing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-yellow-500/20 py-16 sm:py-20" aria-labelledby="portfolio-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-yellow-400">Portfolio demo</p>
              <h2 id="portfolio-heading" className="mt-3 text-4xl font-bold tracking-tight text-yellow-50 sm:text-5xl">Moments, told your way.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-yellow-100/60">Gallery spaces are ready for your best photographs in every category.</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {portfolioCategories.map((category, index) => (
              <article key={category.name} className={`group relative min-h-72 overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-br ${category.tone} p-6 shadow-xl shadow-black/25`}>
                <div className="absolute -right-5 -top-9 text-[11rem] font-bold leading-none text-yellow-200/[0.06] transition duration-500 group-hover:scale-110">0{index + 1}</div>
                <div className="relative flex h-full flex-col justify-between">
                  <span className="w-fit rounded-full border border-yellow-200/20 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-200/80">Gallery</span>
                  <div>
                    <h3 className="text-3xl font-bold text-yellow-50">{category.name}</h3>
                    <p className="mt-2 text-sm text-yellow-100/65">{category.caption}</p>
                    <p className="mt-5 text-xs uppercase tracking-[0.18em] text-yellow-300/80">Add selected photos</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-yellow-500/20 py-12 sm:flex sm:items-center sm:justify-between sm:gap-8" aria-labelledby="social-heading">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-yellow-400">Stay connected</p>
            <h2 id="social-heading" className="mt-3 text-3xl font-bold tracking-tight text-yellow-50">Follow Nanda Photography</h2>
            <p className="mt-2 text-sm text-yellow-100/60">Your social links will appear here once added.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:justify-end">
            {["Instagram", "YouTube", "Facebook", "WhatsApp"].map((platform) => (
              <span key={platform} className="rounded-full border border-yellow-400/25 bg-black/20 px-4 py-2 text-sm font-medium text-yellow-100/75">{platform}</span>
            ))}
          </div>
        </section>

        <footer className="border-t border-yellow-500/20 py-5 text-center text-xs tracking-wide text-yellow-100/45 sm:text-left">
          Nanda Photography · Crafted for unforgettable celebrations
        </footer>
      </div>
    </main>
  );
}
