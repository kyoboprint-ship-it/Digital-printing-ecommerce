import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Nav } from "@/components/landing/Nav";
import namecardPreview from "@/assets/namecard-preview.jpg";

// ── Types ────────────────────────────────────────────────────────────────────
type PaperGrade = "normal" | "premium";
type Side = "single" | "double";

interface UnitPrices {
  [grade: string]: { [side: string]: number };
}

// 통당 실제 매수 — 96배수 정칙 (96 × 통수)
const ACTUAL_QTY: Record<number, number> = { 1: 96, 2: 192, 3: 288, 4: 384 };

// 다통 할인율 기본값 (서버에서 fetch 후 갱신)
const DEFAULT_DISCOUNT: Record<number, number> = { 1: 0, 2: 0.2, 3: 0.2, 4: 0.2 };

// ── Route definition ─────────────────────────────────────────────────────────
export const Route = createFileRoute("/order/namecard")({
  component: NamecardOrderPage,
  head: () => ({
    meta: [
      { title: "명함 주문 — Printly" },
      { name: "description", content: "90×50mm 국판 표준 명함. 통수·용지·면수를 선택하면 실시간으로 가격이 표시됩니다." },
    ],
  }),
});

// ── Animated number hook ─────────────────────────────────────────────────────
function useAnimatedNumber(target: number, duration = 200): number {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef  = useRef<number | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === target) return;
    const startTime = performance.now();

    function animate(now: number) {
      const t    = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(prev + (target - prev) * ease));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = target;
        setDisplay(target);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
}

// ── Static option data ───────────────────────────────────────────────────────
const PACK_OPTIONS = [
  { value: 1, label: "1통", sub: "96매" },
  { value: 2, label: "2통", sub: "192매" },
  { value: 3, label: "3통", sub: "288매" },
  { value: 4, label: "4통", sub: "384매" },
] as const;

// 용지 7종: grade 기준 그룹, 가격은 grade만으로 산출
interface PaperOption {
  key: string;
  grade: PaperGrade;
  name: string;
  gsm: string;
  desc: string;
}

const PAPER_OPTIONS: PaperOption[] = [
  // 일반지 4종
  { key: "snow250",   grade: "normal",  name: "스노우지",  gsm: "250g", desc: "반광택 코팅지 · 선명한 인쇄" },
  { key: "snow300",   grade: "normal",  name: "스노우지",  gsm: "300g", desc: "반광택 두꺼운 코팅지" },
  { key: "art250",    grade: "normal",  name: "아트지",    gsm: "250g", desc: "광택 코팅지 · 선명한 색상" },
  { key: "art300",    grade: "normal",  name: "아트지",    gsm: "300g", desc: "광택 두꺼운 코팅지" },
  // 고급지 5종
  { key: "banouvo",   grade: "premium", name: "반누보",    gsm: "210g", desc: "벨벳 무코팅 · 고급 질감" },
  { key: "ensemble",  grade: "premium", name: "앙상블",    gsm: "210g", desc: "자연스러운 무코팅 엠보" },
  { key: "arte",      grade: "premium", name: "아르떼",    gsm: "210g", desc: "강한 엠보 텍스처" },
  { key: "stardream", grade: "premium", name: "스타드림",  gsm: "210g", desc: "메탈릭 펄 코팅지" },
  { key: "randevu",   grade: "premium", name: "랑데뷰",    gsm: "210g", desc: "내추럴 무코팅 고급지" },
];

const SIDE_OPTIONS = [
  { value: "single" as Side, label: "단면", sub: "앞면만 인쇄" },
  { value: "double" as Side, label: "양면", sub: "앞·뒷면 인쇄" },
] as const;

// ── CSS helpers ──────────────────────────────────────────────────────────────
function packCls(active: boolean) {
  return [
    "flex flex-col items-center justify-center rounded-xl border py-3 px-2 text-center transition-all duration-150 cursor-pointer",
    active
      ? "border-primary bg-primary text-primary-foreground shadow-sm"
      : "border-border bg-background hover:border-primary/50 hover:bg-accent",
  ].join(" ");
}

function selectorCls(active: boolean) {
  return [
    "flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-all duration-150 cursor-pointer",
    active
      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
      : "border-border bg-background hover:border-primary/40 hover:bg-accent",
  ].join(" ");
}

function paperCls(active: boolean, grade: PaperGrade) {
  const accentNormal  = "border-sky-400 bg-sky-400/5 ring-1 ring-sky-400 shadow-sm";
  const accentPremium = "border-violet-400 bg-violet-400/5 ring-1 ring-violet-400 shadow-sm";
  return [
    "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all duration-150 cursor-pointer",
    active
      ? (grade === "normal" ? accentNormal : accentPremium)
      : "border-border bg-background hover:border-primary/40 hover:bg-accent",
  ].join(" ");
}

// ── NamecardPreview ──────────────────────────────────────────────────────────
function NamecardPreview({ side }: { side: Side }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        {side === "double" && (
          <div
            className="absolute top-2 left-2 rounded-xl bg-border/60"
            style={{ width: 288, height: 160 }}
          />
        )}
        <div
          className="relative overflow-hidden rounded-xl border border-border shadow-md"
          style={{ width: 288, height: 160 }}
          aria-label="명함 미리보기 (90×50mm 비율)"
        >
          <img
            src={namecardPreview}
            alt="명함 미리보기"
            className="h-full w-full object-cover"
            draggable={false}
          />
          <span className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-sm select-none">
            90 × 50 mm
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main page component ──────────────────────────────────────────────────────
function NamecardOrderPage() {
  const [packCount,     setPackCount]     = useState<number>(1);
  const [paperKey,      setPaperKey]      = useState<string>("snow250");
  const [side,          setSide]          = useState<Side>("double");
  const [unitPrices,    setUnitPrices]    = useState<UnitPrices | null>(null);
  const [discountRates, setDiscountRates] = useState<Record<number,number>>(DEFAULT_DISCOUNT);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  // 현재 선택 용지 정보
  const selectedPaper = PAPER_OPTIONS.find(p => p.key === paperKey) ?? PAPER_OPTIONS[0];
  const grade = selectedPaper.grade;

  // 페이지 로드 시 가격 정책 1회 캐시
  useEffect(() => {
    fetch("/api/namecard/prices")
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setUnitPrices(d.unitPrices);
          if (d.discountRates) setDiscountRates(d.discountRates);
        } else {
          setError("가격 정보를 불러오지 못했습니다.");
        }
      })
      .catch(() => setError("서버 연결 오류 (서버가 실행 중인지 확인하세요)"))
      .finally(() => setLoading(false));
  }, []);

  // 가격 계산
  const unitPrice    = unitPrices?.[grade]?.[side] ?? 0;
  const basePrice    = unitPrice * packCount;
  const discRate     = discountRates[packCount] ?? 0;
  const namecardPrice = Math.round(basePrice * (1 - discRate));
  const packQty      = ACTUAL_QTY[packCount] ?? 96;

  const animPrice = useAnimatedNumber(namecardPrice, 200);
  const perCard   = packQty > 0 ? Math.round(namecardPrice / packQty) : 0;

  // 용지 그룹별 분리
  const normalPapers  = PAPER_OPTIONS.filter(p => p.grade === "normal");
  const premiumPapers = PAPER_OPTIONS.filter(p => p.grade === "premium");

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Nav />

      <main className="mx-auto max-w-xl px-4 py-12">
        {/* ── 헤더 ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            명함 주문
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            90 × 50 mm 명함
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            국판 표준 규격 · 일반지 / 고급지 선택
          </p>
        </div>

        {/* ── 카드 미리보기 ── */}
        <NamecardPreview side={side} />

        {/* ── 주문 폼 ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-7">

          {/* STEP 1: 통수 */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              STEP 1 &nbsp;·&nbsp; 수량
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {PACK_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setPackCount(opt.value)}
                  className={packCls(packCount === opt.value)}>
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-xs opacity-70 mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
            {packCount >= 2 && (
              <p className="mt-2 text-xs text-sky-500 font-medium">
                ✦ 2통 이상 명함 금액 20% 할인 적용
              </p>
            )}
          </section>

          {/* STEP 2: 용지 */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              STEP 2 &nbsp;·&nbsp; 용지
            </h2>

            {/* 일반지 그룹 */}
            <p className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-2">
              일반지
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {normalPapers.map(opt => (
                <button key={opt.key} onClick={() => setPaperKey(opt.key)}
                  className={paperCls(paperKey === opt.key, "normal")}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-sm">{opt.name}</span>
                    <span className="text-xs text-muted-foreground">{opt.gsm}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-0.5 leading-tight opacity-80">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* 고급지 그룹 */}
            <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider mb-2">
              고급지
            </p>
            <div className="grid grid-cols-2 gap-2">
              {premiumPapers.map(opt => (
                <button key={opt.key} onClick={() => setPaperKey(opt.key)}
                  className={paperCls(paperKey === opt.key, "premium")}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-sm">{opt.name}</span>
                    <span className="text-xs text-muted-foreground">{opt.gsm}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-0.5 leading-tight opacity-80">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* 선택 용지 요약 */}
            <p className="mt-2 text-xs text-muted-foreground">
              선택: <span className="font-semibold text-foreground">
                {selectedPaper.name} {selectedPaper.gsm}
              </span>
              &nbsp;·&nbsp;
              <span className={grade === "normal" ? "text-sky-400" : "text-violet-400"}>
                {grade === "normal" ? "일반지" : "고급지"} 단가 적용
              </span>
            </p>
          </section>

          {/* STEP 3: 단/양면 */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              STEP 3 &nbsp;·&nbsp; 인쇄 면수
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {SIDE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setSide(opt.value)}
                  className={selectorCls(side === opt.value)}>
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── 가격 표시 ── */}
          <div className="border-t border-border pt-6">
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                <div className="h-9 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-56 animate-pulse rounded bg-muted" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {packCount}통&nbsp;·&nbsp;
                    {selectedPaper.name} {selectedPaper.gsm}&nbsp;·&nbsp;
                    {side === "double" ? "양면" : "단면"}&nbsp;·&nbsp;
                    {packQty.toLocaleString()}매
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tabular-nums tracking-tight">
                      ₩{animPrice.toLocaleString()}
                    </span>
                    {discRate > 0 && (
                      <span className="text-sm text-sky-400 font-semibold">
                        -{Math.round(discRate * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {discRate > 0 && (
                      <>
                        <span className="line-through opacity-50">
                          ₩{basePrice.toLocaleString()}
                        </span>
                        &nbsp;→&nbsp;
                      </>
                    )}
                    통당&nbsp;{unitPrice.toLocaleString()}원&nbsp;
                    &middot;&nbsp;매당&nbsp;{perCard.toLocaleString()}원
                  </p>
                </div>

                {/* 주문하기 — 1차 제외 */}
                <button
                  disabled
                  title="파일 업로드·결제 기능은 다음 업데이트에서 제공됩니다"
                  className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground opacity-40 cursor-not-allowed select-none"
                >
                  주문하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          파일 업로드 · 결제 기능은 2차 업데이트에서 제공됩니다
        </p>
      </main>
    </div>
  );
}
