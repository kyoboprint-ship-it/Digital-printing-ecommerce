export function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-canvas text-sm">P</span>
          <span>Printly</span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#products" className="transition-colors hover:text-ink">제품</a>
          <a href="#workflow" className="transition-colors hover:text-ink">제작 과정</a>
          <a href="#paper" className="transition-colors hover:text-ink">용지</a>
          <a href="#quote" className="transition-colors hover:text-ink">실시간 견적</a>
          <a href="#portfolio" className="transition-colors hover:text-ink">포트폴리오</a>
        </div>
        <div className="flex items-center gap-2">
          <a href="#" className="hidden text-sm font-medium text-muted-foreground hover:text-ink sm:inline-block">로그인</a>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-brand)] py-2 pl-4 pr-4 text-sm font-semibold text-canvas shadow-soft transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            제작 시작하기
          </a>
        </div>
      </div>
    </nav>
  );
}
