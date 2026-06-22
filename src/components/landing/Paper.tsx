import { useInView } from "@/hooks/useInView";

const paperImg = "https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=1000&h=1200&fit=crop&q=85";

const STOCKS = [
  { name: "매트지", desc: "은은한 무광 표면, 차분한 색감 표현에 탁월", swatch: "oklch(0.95 0.01 80)" },
  { name: "코팅지", desc: "선명한 발색과 광택, 사진 인쇄에 최적", swatch: "oklch(0.97 0.02 230)" },
  { name: "비코팅지", desc: "자연스러운 질감, 친환경 인쇄에 적합", swatch: "oklch(0.93 0.03 80)" },
  { name: "프리미엄 특수지", desc: "수입 코튼·메탈릭 등 고급 질감 80여 종", swatch: "oklch(0.88 0.06 50)" },
];

export function Paper() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      id="paper"
      className={`overflow-hidden px-6 py-24 md:py-32 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl shadow-lift outline outline-1 -outline-offset-1 outline-black/5">
              <img
                src={paperImg}
                alt="프리미엄 용지의 섬세한 질감 클로즈업"
                loading="lazy"
                width={1000}
                height={1200}
                className="block h-auto w-full"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-lift">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">선택 가능한 용지</p>
              <p className="mt-1 text-2xl font-bold text-gradient-brand">80+ 종</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
              Paper Experience
            </p>
            <h2 className="mb-5 text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              종이를 고르는 일이<br /> 프리미엄 경험이 됩니다
            </h2>
            <p className="mb-10 max-w-[46ch] text-muted-foreground">
              매트, 코팅, 비코팅, 그리고 수입 특수지까지. 각 용지의 질감과 무게를
              한눈에 비교하고, 가장 어울리는 종이를 직관적으로 선택할 수 있습니다.
            </p>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STOCKS.map((s) => (
                <li
                  key={s.name}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <span
                    className="mt-0.5 size-10 shrink-0 rounded-lg ring-1 ring-border"
                    style={{ background: s.swatch }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
