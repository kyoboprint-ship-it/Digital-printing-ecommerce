import { useInView } from "@/hooks/useInView";

const STEPS = [
  { n: "01", title: "제품 선택", desc: "원하는 인쇄물 카테고리를 골라요" },
  { n: "02", title: "규격 선택", desc: "표준 규격 또는 맞춤 사이즈" },
  { n: "03", title: "용지 선택", desc: "프리미엄 용지 80여 종 중 선택" },
  { n: "04", title: "후가공 선택", desc: "박, 형압, 코팅 등 마감 옵션" },
  { n: "05", title: "실시간 견적 확인", desc: "선택과 동시에 금액 자동 계산" },
];

export function Workflow() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      id="workflow"
      className={`bg-paper-muted px-6 py-24 md:py-32 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 text-center md:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            5단계로 완성되는 인쇄 제작
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            복잡한 인쇄 사양서, 이제 그만. 직관적인 단계 구성으로 누구나 전문가처럼 주문할 수 있습니다.
          </p>
        </header>

        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-sm font-bold text-canvas shadow-soft">
                  {i + 1}
                </span>
                <span className="font-mono text-xs text-muted-foreground">STEP {s.n}</span>
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-muted-foreground lg:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
