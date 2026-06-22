import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import booklets from "@/assets/product-booklets.jpg";
import brochures from "@/assets/product-brochures.jpg";
import flyers from "@/assets/product-flyers.jpg";
import postcards from "@/assets/product-postcards.jpg";
import businesscards from "@/assets/product-businesscards.jpg";
// TODO: 실제 촬영본 준비 시 로컬 파일로 교체
const stickers = "https://images.unsplash.com/photo-1591241880902-7f05d345516e?w=800&h=800&fit=crop";

type Product = {
  id: string;
  emoji: string;
  title: string;
  tag: string;
  image: string;
  disabled?: boolean; // 준비중 상품
};

const PRODUCTS: Product[] = [
  { id: "book",     emoji: "📖", title: "책자/제본", tag: "Book",          image: booklets },
  { id: "flyer",    emoji: "🖼", title: "전단지",   tag: "Flyer",         image: flyers },
  { id: "leaflet",  emoji: "📄", title: "리플렛",   tag: "Leaflet",       image: brochures },
  { id: "card",     emoji: "📰", title: "엽서/카드", tag: "Postcard",     image: postcards },
  { id: "sticker",  emoji: "🏷️", title: "스티커",   tag: "Sticker",       image: stickers, disabled: true },
  { id: "namecard", emoji: "💳", title: "명함",     tag: "Business Card", image: businesscards },
];

export function Products() {
  const [selected, setSelected] = useState("book");
  const navigate = useNavigate();

  return (
    <section id="products" className="py-24 md:py-32">
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
                  disabled={p.disabled}
                  onClick={() => {
                    if (p.disabled) return;
                    if (p.id === "namecard") {
                      navigate({ to: "/order/namecard" });
                    } else if (p.id === "flyer") {
                      navigate({ to: "/order/flyer" });
                    } else if (p.id === "card") {
                      navigate({ to: "/order/postcard" });
                    } else if (p.id === "leaflet") {
                      navigate({ to: "/order/leaflet" });
                    } else if (p.id === "book") {
                      navigate({ to: "/order/booklet" });
                    } else {
                      setSelected(p.id);
                    }
                  }}
                  className={`group relative flex w-[170px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-300 md:w-auto ${
                    p.disabled
                      ? "cursor-not-allowed opacity-80 border-border shadow-soft"
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
