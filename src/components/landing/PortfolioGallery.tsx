// Unsplash 임시 이미지 (실제 촬영본으로 교체 예정)
const IMG = {
  booklet:  "https://images.unsplash.com/photo-1526280524276-51b1c8a46321?w=900&h=1100&fit=crop&q=85",
  namecard: "https://images.unsplash.com/photo-1718670013921-2f144aba173a?w=900&h=1100&fit=crop&q=85",
  leaflet:  "https://images.unsplash.com/photo-1695634281181-b2357af34c61?w=900&h=1100&fit=crop&q=85",
  flyer:    "https://images.unsplash.com/photo-1549233566-fc68a19376e8?w=900&h=1100&fit=crop&q=85",
  card:     "https://images.unsplash.com/photo-1577201867491-47644a49dcab?w=900&h=1100&fit=crop&q=85",
};

type Work = {
  title: string;
  tag: string;
  client: string;
  image: string;
  span?: string;
};

const WORKS: Work[] = [
  { title: "Premium Booklet",  tag: "책자/제본", client: "Atelier Mire", image: IMG.booklet,  span: "md:col-span-2 md:row-span-2" },
  { title: "Luxury Name Card", tag: "명함",      client: "Studio Norm",  image: IMG.namecard },
  { title: "Tri-fold Leaflet", tag: "리플렛",    client: "Form & Co.",   image: IMG.leaflet },
  { title: "A4 Flyer Series",  tag: "전단지",    client: "Northline",    image: IMG.flyer,    span: "md:col-span-2" },
  { title: "Postcard Set",     tag: "엽서/카드", client: "Issue 04",     image: IMG.card },
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
            브랜드, 출판물, 마케팅까지. 다양한 산업의 디자이너들이 Printly로 결과물을 완성합니다.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {WORKS.map((w) => (
            <figure
              key={w.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${w.span ?? ""}`}
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
