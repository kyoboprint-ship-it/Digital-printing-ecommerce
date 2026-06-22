const heroImg = "https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?w=1920&h=1080&fit=crop&q=85";

// ── 핫스팟 정의 ────────────────────────────────────────────────────────────
// left/top/width/height 모두 이미지 컨테이너 대비 % → 반응형 유지 (절대 픽셀 사용 금지)
//
// PM-DEV-LANDING-HERO-01-HF: PM 확정 측정치 적용 완료 ✅
type Hotspot = {
  id: string;
  label: string;
  href: string;
  // 이미지 컨테이너 대비 %
  left: number;
  top: number;
  width: number;
  height: number;
};

// PM-DEV-LANDING-HERO-01-HF: PM 확정 좌표 적용 완료 (2026-06-18)
const HOTSPOTS: Hotspot[] = [
  { id: "book",     label: "책자/제본", href: "#products", left: 16,   top: 26, width: 14.5, height: 34 },
  { id: "leaflet",  label: "리플렛",   href: "#products", left: 60,   top: 24, width: 24,   height: 34 },
  { id: "card",     label: "엽서/카드", href: "#products", left: 14.5, top: 62, width: 18,   height: 31 },
  { id: "flyer",    label: "전단지",   href: "#products", left: 33,   top: 60, width: 24,   height: 34 },
  { id: "sticker",  label: "스티커",   href: "#products", left: 58,   top: 62, width: 21,   height: 30 },
  { id: "namecard", label: "명함",     href: "#products", left: 77,   top: 62, width: 18,   height: 28 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px]"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-32 -z-10 size-[420px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.85 0.12 50 / 0.45), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 -z-10 size-[520px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.85 0.12 285 / 0.5), transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft animate-fade-up">
            <span className="size-1.5 rounded-full bg-[image:var(--gradient-brand)]" />
            Creative Print Studio · Printly
          </span>
          <h1 className="mb-6 max-w-[20ch] text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl animate-fade-up [animation-delay:80ms]">
            아이디어를 <span className="text-gradient-brand">인쇄하다</span>.
            <br />
            비즈니스의 가치를 완성하다.
          </h1>
          <p className="mb-10 max-w-[48ch] text-pretty text-base text-muted-foreground md:text-lg animate-fade-up [animation-delay:160ms]">
            원하는 인쇄물을 선택하고, 용지와 옵션을 설정해
            <br className="hidden sm:block" />
            쉽고 빠르게 견적을 확인하세요.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row animate-fade-up [animation-delay:240ms]">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-brand)] py-3.5 pl-6 pr-5 text-base font-semibold text-canvas shadow-lift transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              제작 시작하기
              <span className="grid size-6 place-items-center rounded-full bg-canvas/20 text-sm">→</span>
            </a>
            <a
              href="#quote"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-ink shadow-soft transition-colors hover:bg-paper-muted"
            >
              견적 확인하기
            </a>
          </div>
        </div>
      </div>

      {/* Full-bleed desk image */}
      <div className="relative mt-16 left-1/2 right-1/2 -mx-[50vw] w-screen animate-reveal [animation-delay:380ms]">
        <div className="relative overflow-hidden shadow-lift">
          <img
            src={heroImg}
            alt="디자이너의 책상 위에 놓인 프리미엄 인쇄물 — 책자, 카탈로그, 리플렛, 엽서, 명함, 스티커"
            width={1920}
            height={1080}
            className="block h-auto w-full select-none"
            draggable={false}
          />

          {/*
            ── 핫스팟 (PM-DEV-LANDING-HERO-01) ────────────────────────────
            구조:
              <a>  → 절대 배치, % 좌표 (반응형)
                <span.ring-layer>  → 호버 시 브랜드 컬러 ring + 부양 (-translate-y-2)
                <span.label>       → 핫스팟 상단 중앙 라벨 툴팁
          */}
          {HOTSPOTS.map((h) => (
            <a
              key={h.id}
              href={h.href}
              aria-label={`${h.label} 자세히 보기`}
              className="group absolute z-10"
              style={{
                left:   `${h.left}%`,
                top:    `${h.top}%`,
                width:  `${h.width}%`,
                height: `${h.height}%`,
              }}
            >
              {/*
                ring-layer: 제품 경계를 정확히 감싸는 ring.
                  · scale-105 + -translate-y-2 → 부양 효과 (약한 scale로 ring이 제품을 자연스럽게 감쌈)
                  · animate-pulse 제거 → opacity 전환과 충돌하던 flicker 해소
              */}
              <span
                className="absolute inset-0 rounded-xl ring-2 ring-[color:var(--color-brand)] opacity-0
                            transition-all duration-300 ease-out will-change-transform
                            group-hover:opacity-100 group-hover:-translate-y-2 group-hover:scale-105
                            group-focus:opacity-100 group-focus:-translate-y-2 group-focus:scale-105
                            shadow-lift"
              />
              {/* 라벨: 핫스팟 상단 중앙 (부양 효과와 동기화) */}
              <span
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-7
                            whitespace-nowrap rounded-full bg-ink px-2.5 py-1
                            text-[10px] font-semibold text-canvas
                            opacity-0 transition-all duration-200
                            group-hover:opacity-100 group-hover:-translate-x-1/2 group-hover:-translate-y-2
                            group-focus:opacity-100"
              >
                {h.label}
              </span>
            </a>
          ))}

          {/* Floating chips */}
          <div className="pointer-events-none absolute left-6 top-12 hidden rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-lift animate-float md:block">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">실시간 견적</p>
            <p className="mt-0.5 font-bold">238,000원</p>
          </div>
          <div className="pointer-events-none absolute right-6 bottom-16 hidden rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-lift animate-float-slow md:block">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">출고 예정</p>
            <p className="mt-0.5 font-bold">D+2일</p>
          </div>
        </div>
      </div>
    </section>
  );
}
