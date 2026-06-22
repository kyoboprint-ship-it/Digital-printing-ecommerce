export function CTA() {
  return (
    <section id="cta" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center text-canvas shadow-lift md:px-16 md:py-24"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-canvas/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 size-80 rounded-full bg-canvas/10 blur-3xl" />

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-canvas/80">
            Start your project
          </p>
          <h2 className="mx-auto mb-6 max-w-[20ch] text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            아이디어를 인쇄하다.<br />
            쉽게 만들고, 정확하게 주문하세요.
          </h2>
          <p className="mx-auto mb-10 max-w-[48ch] text-canvas/85">
            지금 바로 제품을 선택하고, 30초 만에 견적서를 받아보세요.
            계정 없이도 무료로 시작할 수 있습니다.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-canvas py-3.5 pl-6 pr-5 text-base font-bold text-ink shadow-lift transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              제작 시작하기
              <span className="grid size-6 place-items-center rounded-full bg-ink/10 text-sm">→</span>
            </a>
            <a
              href="#quote"
              className="rounded-full border border-canvas/30 px-6 py-3.5 text-sm font-semibold text-canvas backdrop-blur transition-colors hover:bg-canvas/10"
            >
              견적 확인하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
