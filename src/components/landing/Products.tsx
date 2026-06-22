import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useInView } from "@/hooks/useInView";

const booklets      = "https://images.unsplash.com/photo-1526280524276-51b1c8a46321?w=800&h=800&fit=crop&q=85";
const flyers        = "https://images.unsplash.com/photo-1549233566-fc68a19376e8?w=800&h=800&fit=crop&q=85";
const brochures     = "https://images.unsplash.com/photo-1695634281181-b2357af34c61?w=800&h=800&fit=crop&q=85";
const postcards     = "https://images.unsplash.com/photo-1577201872486-e25a44ae7c77?w=800&h=800&fit=crop&q=85";
const stickers      = "https://images.unsplash.com/photo-1621252756235-7f37e5e5125e?w=800&h=800&fit=crop&q=85";
const businesscards = "https://images.unsplash.com/photo-1718670013921-2f144aba173a?w=800&h=800&fit=crop&q=85";

type Product = {
  id: string;
  emoji: string;
  title: string;
  tag: string;
  image: string;
  accent: string;
  disabled?: boolean;
};

const PRODUCTS: Product[] = [
  { id: "book",     emoji: "📖", title: "책자/제본", tag: "Book",          image: booklets,      accent: "oklch(0.62 0.21 285)" },
  { id: "flyer",    emoji: "🖼",  title: "전단지",   tag: "Flyer",         image: flyers,        accent: "oklch(0.65 0.18 200)" },
  { id: "leaflet",  emoji: "📄", title: "리플렛",   tag: "Leaflet",       image: brochures,     accent: "oklch(0.65 0.17 145)" },
  { id: "card",     emoji: "📰", title: "엽서/카드", tag: "Postcard",     image: postcards,     accent: "oklch(0.65 0.20 15)"  },
  { id: "sticker",  emoji: "🏷️", title: "스티커",   tag: "Sticker",       image: stickers,      accent: "oklch(0.75 0.18 85)",  disabled: true },
  { id: "namecard", emoji: "💳", title: "명함",     tag: "Business Card", image: businesscards, accent: "oklch(0.55 0.10 265)" },
];

export function Products() {
  const [selected, setSelected] = useState("book");
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTiltMove(e: React.MouseEvent<HTMLButtonElement>, idx: number) {
    const el = cardRefs.current[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -7;
    const rotY = ((x - cx) / cx) * 7;
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  }

  function handleTiltReset(idx: number) {
    const el = cardRefs.current[idx];
    if (el) el.style.transform = "";
  }

  return (
    <section
      ref={ref}
      id="products"
      className={`py-24 md:py-32 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
              Product Library
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              원하는 인쇄물을 골라보세요
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            6가지 카테고리, 무한한 조합. 각 제품은 클릭 한 번으로 옵션 구성을 시작할 수 있습니다.
          </p>
        </header>

        <div className="-mx-6 px-6">
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-6 md:gap-8 md:overflow-visible">
            {PRODUCTS.map((p, i) => {
              const isActive = selected === p.id;
              return (
                <button
                  key={p.id}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  type="button"
                  onClick={() => {
                    if (p.disabled) {
                      toast("곧 출시됩니다 🏷️", { id: "sticker-coming-soon" });
                      return;
                    }
                    if (p.id === "namecard") navigate({ to: "/order/namecard" });
                    else if (p.id === "flyer")   navigate({ to: "/order/flyer" });
                    else if (p.id === "card")    navigate({ to: "/order/postcard" });
                    else if (p.id === "leaflet") navigate({ to: "/order/leaflet" });
                    else if (p.id === "book")    navigate({ to: "/order/booklet" });
                    else setSelected(p.id);
                  }}
                  onMouseMove={(e) => !p.disabled && handleTiltMove(e, i)}
                  onMouseLeave={() => handleTiltReset(i)}
                  style={{ transition: "transform 0.15s ease, box-shadow 0.3s ease" }}
                  className={`group relative flex w-[156px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card text-left md:w-auto ${
                    p.disabled
                      ? "cursor-pointer opacity-80 border-border shadow-soft"
                      : isActive
                        ? "border-transparent shadow-lift ring-2"
                        : "border-border shadow-soft hover:shadow-xl"
                  }`}
                >
                  {/* 색 악센트 — 활성/hover 글로우 */}
                  {!p.disabled && (
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      style={{ boxShadow: `0 0 0 2px ${p.accent}, 0 8px 32px ${p.accent}40` }}
                    />
                  )}

                  {/* 이미지 */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[image:var(--gradient-soft)]">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      width={400}
                      height={400}
                      className={`h-full w-full object-cover transition-transform duration-700 ${
                        p.disabled ? "" : "group-hover:scale-105"
                      }`}
                    />
                    {/* 준비중 오버레이 */}
                    {p.disabled && (
                      <>
                        <div className="absolute inset-0 bg-[color:var(--color-ink)]/30" />
                        <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-soft">
                          준비중
                        </span>
                      </>
                    )}
                    {isActive && !p.disabled && (
                      <span
                        className="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-[10px] font-bold text-canvas shadow-soft"
                        style={{ background: p.accent }}
                      >
                        ✓
                      </span>
                    )}
                    {/* CTA 슬라이드업 — 호버 시 노출, 모바일 항상 노출 */}
                    {!p.disabled && (
                      <div className="absolute inset-x-0 bottom-0 flex items-end px-3 pb-3 pt-8 bg-gradient-to-t from-ink/70 to-transparent translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 [.touch-device_&]:translate-y-0 [.touch-device_&]:opacity-100 max-[767px]:translate-y-0 max-[767px]:opacity-100">
                        <span className="text-[11px] font-bold text-canvas tracking-wide">
                          주문하기 →
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 카드 하단 텍스트 */}
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        <span className="mr-1">{p.emoji}</span>
                        {p.title}
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{p.tag}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
