import { useState } from "react";
import { X, Menu } from "lucide-react";

const LINKS = [
  { label: "제품",       href: "#products" },
  { label: "제작 과정", href: "#workflow" },
  { label: "용지",       href: "#paper" },
  { label: "실시간 견적", href: "#quote" },
  { label: "포트폴리오", href: "#portfolio" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-canvas text-sm">P</span>
            <span>Printly</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href="#" className="hidden text-sm font-medium text-muted-foreground hover:text-ink sm:inline-block">
              로그인
            </a>
            <a
              href="#cta"
              className="hidden items-center gap-2 rounded-full bg-[image:var(--gradient-brand)] py-2 pl-4 pr-4 text-sm font-semibold text-canvas shadow-soft transition-transform hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
            >
              제작 시작하기
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-lg border border-border text-ink transition-colors hover:bg-paper-muted md:hidden"
              aria-label="메뉴 열기"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-canvas shadow-lift">
            <div className="flex h-16 items-center justify-between border-b border-border px-6">
              <a href="/" className="flex items-center gap-2 text-lg font-bold">
                <span className="grid size-7 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-canvas text-sm">P</span>
                Printly
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-lg border border-border text-ink hover:bg-paper-muted"
                aria-label="메뉴 닫기"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper-muted"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto border-t border-border p-4 flex flex-col gap-3">
              <a href="#" className="rounded-xl px-4 py-3 text-center text-sm font-medium text-muted-foreground hover:bg-paper-muted">
                로그인
              </a>
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-brand)] py-3 text-sm font-semibold text-canvas shadow-soft"
              >
                제작 시작하기
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
