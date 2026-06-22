import catalog from "@/assets/portfolio-catalog.jpg";
import magazine from "@/assets/portfolio-magazine.jpg";
import booklet from "@/assets/portfolio-booklet.jpg";
import brochure from "@/assets/portfolio-brochure.jpg";
import marketing from "@/assets/portfolio-marketing.jpg";

type Work = {
  title: string;
  tag: string;
  client: string;
  image: string;
  span?: string;
};

const WORKS: Work[] = [
  { title: "Corporate Catalog", tag: "카탈로그", client: "Studio Norm", image: catalog, span: "md:col-span-2 md:row-span-2" },
  { title: "Editorial Magazine", tag: "매거진", client: "Issue 04", image: magazine },
  { title: "Foil Booklet", tag: "책제작", client: "Atelier Mire", image: booklet },
  { title: "Tri-fold Brochure", tag: "브로슈어", client: "Form & Co.", image: brochure, span: "md:col-span-2" },
  { title: "Brand Collateral", tag: "브랜딩", client: "Northline", image: marketing },
];

export function PortfolioGallery() {
  return (
    <section id="portfolio" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
              Customer Portfolio
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Printly로 완성된<br />
              프리미엄 인쇄 작업들
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            브랜드, 매거진, 출판물까지. 다양한 산업의 디자이너들이 Printly로 결과물을 완성합니다.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {WORKS.map((w) => (
            <figure
              key={w.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
                w.span ?? ""
              }`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-muted">
                <img
                  src={w.image}
                  alt={`${w.client} — ${w.title}`}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-3 p-5 text-canvas opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-canvas/80">{w.tag}</p>
                  <p className="mt-0.5 text-base font-bold tracking-tight">{w.title}</p>
                </div>
                <span className="rounded-full bg-canvas/15 px-2.5 py-1 text-[10px] font-medium backdrop-blur">
                  {w.client}
                </span>
              </figcaption>
              <span className="absolute left-3 top-3 rounded-full bg-canvas/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink shadow-soft backdrop-blur">
                {w.tag}
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
