import { useInView } from "@/hooks/useInView";

const ROWS = [
  { label: "제품", value: "책제작", chip: "Book" },
  { label: "규격", value: "A4 (210 × 297mm)" },
  { label: "페이지", value: "80 페이지" },
  { label: "용지", value: "프리미엄 매트지 120g" },
  { label: "제본", value: "무선제본" },
  { label: "후가공", value: "표지 무광 코팅" },
];

export function Quote() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      id="quote"
      className={`px-6 py-24 md:py-32 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">
              Live Quotation
            </p>
            <h2 className="mb-5 text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              선택과 동시에<br /> 실시간 견적 확인
            </h2>
            <p className="mb-8 max-w-[46ch] text-muted-foreground">
              옵션을 바꿀 때마다 금액이 즉시 업데이트됩니다. 숨겨진 추가비용 없이,
              SaaS 대시보드처럼 투명하게 제공되는 견적 시스템.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-[var(--color-accent-mint)] text-[11px]">✓</span>
                옵션 변경 시 0.3초 이내 자동 계산
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-[var(--color-accent-peach)] text-[11px]">✓</span>
                수량별 단가 자동 비교 제공
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-[var(--color-accent-lavender)] text-[11px]">✓</span>
                견적서 PDF 즉시 다운로드 가능
              </li>
            </ul>
          </div>

          {/* Quote card */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] blur-2xl opacity-60"
              style={{ background: "var(--gradient-soft)" }}
            />
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
              <header className="flex items-center justify-between border-b border-border bg-paper-muted/60 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-red-400/70" />
                  <span className="size-2.5 rounded-full bg-yellow-400/70" />
                  <span className="size-2.5 rounded-full bg-green-400/70" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">printly.app / quote</p>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-brand)]">Live</span>
              </header>

              <div className="px-7 py-7">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">견적 #PR-24081</p>
                    <p className="mt-1 text-lg font-bold">프리미엄 책제작 견적</p>
                  </div>
                  <span className="rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--color-brand)]">
                    실시간 계산중
                  </span>
                </div>

                <dl className="divide-y divide-border rounded-2xl border border-border bg-paper-muted/40">
                  {ROWS.map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                      <dt className="text-muted-foreground">{r.label}</dt>
                      <dd className="flex items-center gap-2 text-right font-medium text-ink">
                        {r.value}
                        {r.chip && (
                          <span className="rounded-md bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-border">
                            {r.chip}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex items-end justify-between rounded-2xl bg-[image:var(--gradient-brand)] px-6 py-5 text-canvas shadow-soft">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-canvas/80">Estimated Total</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight">238,000원</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-canvas/15 px-4 py-2 text-xs font-semibold text-canvas backdrop-blur transition-colors hover:bg-canvas/25"
                  >
                    주문하기 →
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-muted-foreground">VAT 포함 · 영업일 기준 2일 이내 출고</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
