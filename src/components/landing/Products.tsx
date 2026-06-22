import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useInView } from "@/hooks/useInView";

const IMAGES = {
  book:     "https://images.unsplash.com/photo-1526280524276-51b1c8a46321?w=800&h=1000&fit=crop&q=85",
  flyer:    "https://images.unsplash.com/photo-1549233566-fc68a19376e8?w=800&h=1000&fit=crop&q=85",
  leaflet:  "https://images.unsplash.com/photo-1695634281181-b2357af34c61?w=800&h=1000&fit=crop&q=85",
  card:     "https://images.unsplash.com/photo-1577201872486-e25a44ae7c77?w=800&h=1000&fit=crop&q=85",
  sticker:  "https://images.unsplash.com/photo-1621252756235-7f37e5e5125e?w=800&h=1000&fit=crop&q=85",
  namecard: "https://images.unsplash.com/photo-1718670013921-2f144aba173a?w=800&h=1000&fit=crop&q=85",
};

type Product = {
  id: string;
  title: string;
  tag: string;
  desc: string;
  image: string;
  disabled?: boolean;
};

const PRODUCTS: Product[] = [
  { id: "book",     title: "책자/제본", tag: "Book",          desc: "무선·중철·스프링 제본",  image: IMAGES.book },
  { id: "flyer",    title: "전단지",   tag: "Flyer",         desc: "단면·양면, 다양한 규격", image: IMAGES.flyer },
  { id: "leaflet",  title: "리플렛",   tag: "Leaflet",       desc: "접지 5종 포함",          image: IMAGES.leaflet },
  { id: "card",     title: "엽서/카드", tag: "Postcard",     desc: "엽서·포스트카드",        image: IMAGES.card },
  { id: "sticker",  title: "스티커",   tag: "Sticker",       desc: "원형·사각·이형 커스텀",  image: IMAGES.sticker, disabled: true },
  { id: "namecard", title: "명함",     tag: "Business Card", desc: "기본·고급·특수 용지",    image: IMAGES.namecard },
];

export function Products() {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  function handleClick(p: Product) {
    if (p.disabled) {
      toast("곧 출시됩니다", { id: "sticker-coming-soon" });
      return;
    }
    const routes: Record<string, string> = {
      book:     "/order/booklet",
      flyer:    "/order/flyer",
      leaflet:  "/order/leaflet",
      card:     "/order/postcard",
      namecard: "/order/namecard",
    };
    navigate({ to: routes[p.id] });
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
        <header className="mb-14 flex flex-col gap-3 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
              Product Library
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              원하는 인쇄물을 골라보세요
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            6가지 카테고리, 클릭 한 번으로 견적과 주문까지.
          </p>
        </header>

        {/* 모바일: 가로스냅 / 데스크탑: 3×2 그리드 */}
        <div className="-mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-px md:overflow-visible md:rounded-2xl md:border md:border-border md:bg-border">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleClick(p)}
                className={`group relative flex w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-card text-left transition-all duration-500 md:w-auto md:rounded-none first:md:rounded-tl-2xl [&:nth-child(3)]:md:rounded-tr-2xl [&:nth-child(4)]:md:rounded-bl-2xl last:md:rounded-br-2xl ${
                  p.disabled ? "cursor-pointer" : "hover:bg-paper-muted"
                }`}
              >
                {/* 이미지 영역 */}
                <div
                  className={`relative w-full overflow-hidden ${p.disabled ? "opacity-50" : ""}`}
                  style={{ aspectRatio: "4/5" }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    width={600}
                    height={750}
                    className={`h-full w-full object-cover transition-transform duration-700 ${
                      !p.disabled ? "group-hover:scale-[1.04]" : ""
                    }`}
                  />
                  {p.disabled && (
                    <div className="absolute inset-0 flex items-end justify-start bg-ink/30 p-5">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold tracking-wide text-white">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-1 items-end justify-between gap-4 p-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {p.tag}
                    </p>
                    <p className="mt-1 text-lg font-bold leading-tight tracking-tight">
                      {p.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                  {!p.disabled && (
                    <span className="shrink-0 self-end text-base font-bold text-[color:var(--color-brand)] transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
