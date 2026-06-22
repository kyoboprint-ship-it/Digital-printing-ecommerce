import { useState } from "react";
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
  disabled?: boolean;
};

const PRODUCTS: Product[] = [
  { id: "book",     emoji: "📖", title: "책자/제본", tag: "Book",          image: booklets },
  { id: "flyer",    emoji: "🖼",  title: "전단지",   tag: "Flyer",         image: flyers },
  { id: "leaflet",  emoji: "📄", title: "리플렛",   tag: "Leaflet",       image: brochures },
  { id: "card",     emoji: "📰", title: "엽서/카드", tag: "Postcard",     image: postcards },
  { id: "sticker",  emoji: "🏷️", title: "스티커",   tag: "Sticker",       image: stickers, disabled: true },
  { id: "namecard", emoji: "💳", title: "명함",     tag: "Business Card", image: businesscards },
];

export function Products() {
  const [selected, setSelected] = useState("book");
  const navigate = useNavigate();
  const { ref, inView } = useInView();

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

        {/* Single horizontal row, scrollable on mobile */}
        <div className="-mx-6 px-6">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-6 md:gap-5 md:overflow-visible">
            {PRODUCTS.map((p) => {
              const isActive = selected === p.id;
              return (
                <button
                  key={p.id}
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
                  className={`group relative flex w-[170px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-300 md:w-auto ${
                    p.disabled
                      ? "cursor-pointer opacity-80 border-border shadow-soft"
                      : isActive
                        ? "border-transparent shadow-lift ring-2 ring-[color:var(--color-brand)]"
                        : "border-border shadow-soft hover:-translate-y-1 hover:shadow-lift"
                  }`}
                >
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
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-[image:var(--gradient-brand)] text-[10px] font-bold text-canvas shadow-soft">
                        ✓
                      </span>
                    )}
                  </div>
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
