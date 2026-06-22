import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const IMG = {
  booklets:      "https://images.unsplash.com/photo-1526280524276-51b1c8a46321?w=800&h=800&fit=crop&q=85",
  flyers:        "https://images.unsplash.com/photo-1549233566-fc68a19376e8?w=800&h=800&fit=crop&q=85",
  brochures:     "https://images.unsplash.com/photo-1695634281181-b2357af34c61?w=800&h=800&fit=crop&q=85",
  postcards:     "https://images.unsplash.com/photo-1577201872486-e25a44ae7c77?w=800&h=800&fit=crop&q=85",
  stickers:      "https://images.unsplash.com/photo-1621252756235-7f37e5e5125e?w=800&h=800&fit=crop&q=85",
  businesscards: "https://images.unsplash.com/photo-1718670013921-2f144aba173a?w=800&h=800&fit=crop&q=85",
};

type DeskProduct = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  image: string;
  sizes: string[];
  papers: string[];
  lead: string;
  route?: string;
  disabled?: boolean;
};

const PRODUCTS: DeskProduct[] = [
  { id: "book",     emoji: "📖", title: "책자/제본", subtitle: "Book",          description: "교재, 회사소개서, 출판물 제작",  cta: "책자 제작 시작",  image: IMG.booklets,      route: "/order/booklet",  sizes: ["A4", "B5", "A5", "Custom"],       papers: ["미색모조 80g", "아트지 150g", "랑데뷰 130g"],      lead: "영업일 3일" },
  { id: "flyer",    emoji: "🖼",  title: "전단지",   subtitle: "Flyer",          description: "프로모션·매장 홍보용 전단",    cta: "전단지 시작",     image: IMG.flyers,        route: "/order/flyer",    sizes: ["A4", "A5", "B5"],                 papers: ["아트지 100g", "스노우지 120g"],                    lead: "영업일 1일" },
  { id: "leaflet",  emoji: "📄", title: "리플렛",   subtitle: "Leaflet",        description: "접지형 안내물, 행사 안내서",   cta: "리플렛 시작",     image: IMG.brochures,     route: "/order/leaflet",  sizes: ["A4 3단", "A3 2단", "Custom"],     papers: ["스노우지 150g", "아트지 200g"],                    lead: "영업일 2일" },
  { id: "card",     emoji: "📮", title: "엽서/카드", subtitle: "Postcard",       description: "초대장, 청첩장, 굿즈 엽서",   cta: "카드 제작 시작",  image: IMG.postcards,     route: "/order/postcard", sizes: ["100×148", "105×210", "Custom"],   papers: ["랑데뷰 240g", "반누보 250g"],                      lead: "영업일 2일" },
  { id: "sticker",  emoji: "🏷️", title: "스티커",   subtitle: "Sticker",        description: "롤스티커, 낱장스티커, 투명",   cta: "준비 중",         image: IMG.stickers,      disabled: true,           sizes: ["Custom"],                         papers: ["아트지", "투명 PVC", "크라프트"],                  lead: "준비 중" },
  { id: "namecard", emoji: "💳", title: "명함",     subtitle: "Business Card",  description: "프리미엄 비즈니스 명함",       cta: "명함 제작 시작",  image: IMG.businesscards, route: "/order/namecard", sizes: ["90×50", "85×55", "Custom"],       papers: ["랑데뷰 240g", "반누보 250g", "크라프트 220g"],     lead: "영업일 1일" },
];

export function InteractiveProductDesk() {
  const [active, setActive] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const navigate = useNavigate();
  const opened = PRODUCTS.find((p) => p.id === openId) ?? null;

  return (
    <section id="workspace" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
              Interactive Workspace
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              책상 위의 제품을<br />
              직접 만져보세요
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            마우스를 올리면 살짝 떠오르고, <strong className="text-ink">클릭하면 상세 옵션과 시작 가격</strong>을
            바로 확인할 수 있어요.
          </p>
        </header>

        {/* The "desk" */}
        <div
          className="relative overflow-hidden rounded-[2rem] border border-border p-6 shadow-soft md:p-10"
          style={{ background: "var(--gradient-soft)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(oklch(0 0 0 / 1) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {PRODUCTS.map((p, i) => {
              const isActive = active === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => !p.disabled && setActive(p.id)}
                  onMouseLeave={() => setActive((cur) => (cur === p.id ? null : cur))}
                  onFocus={() => !p.disabled && setActive(p.id)}
                  onBlur={() => setActive((cur) => (cur === p.id ? null : cur))}
                  onClick={() => !p.disabled && setOpenId(p.id)}
                  aria-label={`${p.title} 자세히 보기`}
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-500 ease-out ${
                    p.disabled
                      ? "cursor-default opacity-60"
                      : isActive
                      ? "-translate-y-2 border-transparent shadow-lift ring-2 ring-[color:var(--color-brand)]"
                      : "border-border shadow-soft hover:-translate-y-2 hover:shadow-lift"
                  } ${i % 2 === 0 ? "md:translate-y-2" : ""}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-muted">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      width={600}
                      height={450}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 grid size-8 place-items-center rounded-full bg-canvas/90 text-base shadow-soft backdrop-blur">
                      {p.emoji}
                    </span>
                    {p.disabled && (
                      <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        준비중
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 px-5 pb-5 pt-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {p.subtitle}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                  </div>

                  {!p.disabled && (
                    <div
                      className={`pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-ink px-4 py-3 text-canvas shadow-lift transition-all duration-300 ${
                        isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold">클릭해서 옵션 보기</span>
                        <span className="grid size-6 place-items-center rounded-full bg-canvas/15 text-xs">→</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={!!opened} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          {opened && (
            <>
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-paper-muted">
                <img src={opened.image} alt={opened.title} className="h-full w-full object-cover" />
                <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-canvas/90 text-lg shadow-soft backdrop-blur">
                  {opened.emoji}
                </span>
              </div>
              <div className="px-6 pb-6 pt-5 md:px-8 md:pb-8">
                <DialogHeader className="text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
                    {opened.subtitle}
                  </p>
                  <DialogTitle className="text-2xl font-bold tracking-tight md:text-3xl">
                    {opened.title}
                  </DialogTitle>
                  <DialogDescription>{opened.description}</DialogDescription>
                </DialogHeader>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-paper-muted/40 p-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">규격</p>
                    <div className="flex flex-wrap gap-1.5">
                      {opened.sizes.map((s) => (
                        <span key={s} className="rounded-md bg-card px-2 py-1 text-xs font-medium ring-1 ring-border">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-paper-muted/40 p-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">추천 용지</p>
                    <ul className="space-y-1 text-xs text-ink">
                      {opened.papers.map((p) => (
                        <li key={p}>· {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end rounded-xl bg-[image:var(--gradient-soft)] border border-border px-5 py-3">
                  <p className="text-xs text-muted-foreground">출고 · {opened.lead}</p>
                </div>

                <DialogFooter className="mt-6 flex-row gap-2 sm:justify-end">
                  <Button variant="outline" onClick={() => setOpenId(null)}>
                    닫기
                  </Button>
                  {opened.route ? (
                    <Button
                      onClick={() => {
                        setOpenId(null);
                        navigate({ to: opened.route as string });
                      }}
                    >
                      {opened.cta} →
                    </Button>
                  ) : null}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
