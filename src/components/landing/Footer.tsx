export function Footer() {
  return (
    <footer className="border-t border-border bg-paper-muted py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-[2fr_3fr]">
        <div>
          <a href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="grid size-7 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-canvas text-sm">P</span>
            Printly
          </a>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            아이디어를 인쇄하다. 누구나 쉽게, 전문가처럼.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">제품</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/order/booklet" className="hover:text-ink">책자/제본</a></li>
              <li><a href="/order/flyer" className="hover:text-ink">전단지</a></li>
              <li><a href="/order/leaflet" className="hover:text-ink">리플렛</a></li>
              <li><a href="/order/postcard" className="hover:text-ink">엽서/카드</a></li>
              <li><a href="/order/namecard" className="hover:text-ink">명함</a></li>
              <li><span className="text-muted-foreground/60">스티커 (준비중)</span></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">회사</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-ink">소개</a></li>
              <li><a href="#" className="hover:text-ink">제휴 문의</a></li>
              <li><a href="#" className="hover:text-ink">채용</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">지원</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-ink">고객센터</a></li>
              <li><a href="#" className="hover:text-ink">파일 가이드</a></li>
              <li><a href="#" className="hover:text-ink">이용약관</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-3 border-t border-border px-6 pt-8 text-[11px] text-muted-foreground md:flex-row md:items-center">
        <span>© 2026 Printly Inc. All rights reserved.</span>
        <span>Made with care in Seoul</span>
      </div>
    </footer>
  );
}
