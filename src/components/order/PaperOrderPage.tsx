import { useState, useEffect, useRef, useCallback } from "react";
import { Nav } from "@/components/landing/Nav";

// 제품 이미지 — src/assets/ (2048×2048)
import leafletImg  from "@/assets/leaflet_n.jpg";
import postcardImg from "@/assets/post_n.jpg";
import cardImg     from "@/assets/card_n.jpg";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PaperRow {
  paper_code: string;
  paper_name: string;
  gsm: number;
  cate: string;
}

interface CalcResult {
  ok: boolean;
  total?: number;
  error?: string;
}

export type PaperProductType = "flyer" | "postcard" | "card" | "leaflet";

interface Props {
  productType: PaperProductType;
  showSubTypeStep?: boolean;
  showFoldStep?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
type SizePreset = { label: string; w: number; h: number };

const SIZE_PRESETS_MAP: Record<PaperProductType, SizePreset[]> = {
  flyer: [
    { label: "A3",  w: 297, h: 420 },
    { label: "A4",  w: 210, h: 297 },
    { label: "A5",  w: 148, h: 210 },
    { label: "B5",  w: 182, h: 257 },
  ],
  leaflet: [
    { label: "A4",  w: 210, h: 297 },
    { label: "A3",  w: 297, h: 420 },
    { label: "A5",  w: 148, h: 210 },
    { label: "B5",  w: 182, h: 257 },
  ],
  postcard: [
    { label: "일반엽서 100×148",   w: 100, h: 148 },
    { label: "대형엽서 105×154",   w: 105, h: 154 },
    { label: "정사각엽서 140×140", w: 140, h: 140 },
  ],
  card: [
    { label: "명함형 90×50",    w: 90,  h: 50  },
    { label: "정사각 90×90",    w: 90,  h: 90  },
    { label: "안내카드 105×148", w: 105, h: 148 },
    { label: "청첩장형 120×180", w: 120, h: 180 },
  ],
};

const SIZE_DEFAULTS: Record<PaperProductType, { preset: string; w: number; h: number }> = {
  flyer:    { preset: "A4",              w: 210, h: 297 },
  leaflet:  { preset: "A4",              w: 210, h: 297 },
  postcard: { preset: "일반엽서 100×148", w: 100, h: 148 },
  card:     { preset: "명함형 90×50",     w: 90,  h: 50  },
};

const QTY_QUICK = [100, 200, 500, 1000, 2000];

const COATING_OPTIONS = [
  { value: "none",    label: "없음" },
  { value: "gloss_1", label: "단면 유광" },
  { value: "matte_1", label: "단면 무광" },
  { value: "gloss_2", label: "양면 유광" },
  { value: "matte_2", label: "양면 무광" },
];

// 작업B: 하드코딩 제거 — API에서 로드 (초기값은 폴백용)
const FINISHING_MAP_DEFAULTS: Record<PaperProductType, string[]> = {
  flyer:    ["coating"],
  leaflet:  ["fold", "coating"],
  postcard: ["coating"],
  card:     ["coating"],
};

const PRODUCT_LABELS: Record<PaperProductType, { title: string; subtitle: string; desc: string }> = {
  flyer:    { title: "전단지",   subtitle: "Flyer",    desc: "프로모션·매장 홍보용 전단" },
  leaflet:  { title: "리플렛",   subtitle: "Leaflet",  desc: "접지형 안내물 · 행사 안내서" },
  postcard: { title: "엽서",     subtitle: "Postcard", desc: "굿즈 엽서 · 감사카드 · 초대장" },
  card:     { title: "카드",     subtitle: "Card",     desc: "청첩장 · 초대장 · 안내 카드" },
};

const PRODUCT_IMAGES: Record<PaperProductType, string> = {
  flyer:    leafletImg,
  leaflet:  leafletImg,
  postcard: postcardImg,
  card:     cardImg,
};

// 작업A: 상품별 이미지 하단 오버레이 라벨 (showSubTypeStep 전용)
const SUBTYPE_LABELS: Record<PaperProductType, { ko: string; en: string }> = {
  flyer:    { ko: "전단지", en: "Flyer" },
  leaflet:  { ko: "리플렛", en: "Leaflet" },
  postcard: { ko: "엽서",   en: "Postcard" },
  card:     { ko: "카드",   en: "Card" },
};

// ── 접지 옵션 (PM-DEV-LEAFLET-PAGE-08) ────────────────────────────────────────
// calcEngine FOLD_DB/FOLD_LBL 기준 1:1 매핑 (십자접지 제외 확정)
interface FoldOption {
  key: string;
  label: string;
  subLabel: string;
  priceHint: string; // 표시용 매당 참고단가(A4 기준) — 실견적은 엔진값 사용
}

// PM-DEV-LEAFLET-FOLD-REVISE-09: 5종 확정 (4foldn 폐기)
const FOLD_OPTIONS: FoldOption[] = [
  { key: "none",   label: "접지 없음", subLabel: "No Fold",     priceHint: "" },
  { key: "half",   label: "2단접지",   subLabel: "Half Fold",   priceHint: "85" },
  { key: "zigzag", label: "3단접지",   subLabel: "Z-Fold",      priceHint: "105" },
  { key: "letter", label: "N접지",     subLabel: "Letter Fold", priceHint: "105" },
  { key: "gate",   label: "대문접지",  subLabel: "Gate Fold",   priceHint: "104" },
  { key: "4fold",  label: "병풍접지",  subLabel: "Accordion",   priceHint: "106" },
];

// ── 접지 SVG 아이콘 (PM-DEV-LEAFLET-FOLD-REVISE-09) ─────────────────────────
// mockup/fold-icons/*.svg 인라인 — WF 앞면/BF 뒷면/SK 외곽선 동적 적용
function FoldIcon({ foldKey, active }: { foldKey: string; active: boolean }) {
  const WF = "#F8F5EE"; // 앞면
  const BF = "#C8A070"; // 뒷면
  const SK = active ? "#7C6AE0" : "#909090"; // 외곽선
  const sw = "1.6";
  const sp = { strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const svgStyle = { maxHeight: "56px", width: "100%" };

  // 접지없음: 단순 흰 종이 한 장
  if (foldKey === "none") return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
      <polygon points="65,55 135,55 135,160 65,160" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
      <line x1="80" y1="90"  x2="120" y2="90"  stroke={SK} strokeWidth="1" opacity="0.3"/>
      <line x1="80" y1="107" x2="120" y2="107" stroke={SK} strokeWidth="1" opacity="0.3"/>
      <line x1="80" y1="124" x2="120" y2="124" stroke={SK} strokeWidth="1" opacity="0.3"/>
    </svg>
  );

  // 2단접지 (half) — fold-2.svg
  if (foldKey === "half") return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
      <polygon points="45,125 100,145 100,50 45,30" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="100,145 155,125 155,30 100,50" fill={BF} stroke={SK} strokeWidth={sw} {...sp}/>
    </svg>
  );

  // 3단접지 (zigzag) — fold-3.svg
  if (foldKey === "zigzag") return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
      <polygon points="60,130 95,148 95,53 60,35" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="95,148 125,130 125,35 95,53" fill={BF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="125,130 150,148 150,53 125,35" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
    </svg>
  );

  // N접지 (letter) — fold-n.svg
  if (foldKey === "letter") return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
      <polygon points="45,130 80,150 80,55 45,35" fill={BF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="80,150 115,130 115,35 80,55" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="115,130 150,150 150,55 115,35" fill={BF} stroke={SK} strokeWidth={sw} {...sp}/>
    </svg>
  );

  // 대문접지 (gate) — fold-gate.svg
  if (foldKey === "gate") return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
      <polygon points="60,55 140,55 140,140 60,140" fill={BF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="40,160 60,140 60,55 40,75" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="140,140 160,160 160,75 140,55" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
    </svg>
  );

  // 병풍접지 (4fold) — fold-accordion.svg
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
      <polygon points="35,125 65,145 65,50 35,30" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="65,145 95,125 95,30 65,50" fill={BF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="95,125 125,145 125,50 95,30" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="125,145 155,125 155,30 125,50" fill={BF} stroke={SK} strokeWidth={sw} {...sp}/>
      <polygon points="155,125 175,140 175,45 155,30" fill={WF} stroke={SK} strokeWidth={sw} {...sp}/>
    </svg>
  );
}

// ── CSS helpers ───────────────────────────────────────────────────────────────
/** 크기 프리셋·코팅 컴팩트 버튼 */
function compactBtnCls(active: boolean) {
  return [
    "rounded-lg border py-1.5 px-2 text-center transition-all duration-150 cursor-pointer leading-snug",
    active
      ? "border-primary bg-primary text-primary-foreground shadow-sm"
      : "border-border bg-background hover:border-primary/50 hover:bg-accent",
  ].join(" ");
}

/** 색상·면수·수량·코팅 pill 버튼 */
function pillCls(active: boolean) {
  return [
    "rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-background hover:border-primary/50 hover:bg-accent",
  ].join(" ");
}

// ── Main component ────────────────────────────────────────────────────────────
export function PaperOrderPage({
  productType: initialType,
  showSubTypeStep = false,
  showFoldStep    = false,
}: Props) {
  // STEP 0
  const [subType, setSubType] = useState<PaperProductType>(initialType);
  // STEP 1: 크기
  const [sizePreset, setSizePreset] = useState<string>(SIZE_DEFAULTS[initialType].preset);
  const [sizeW,      setSizeW]      = useState<number>(SIZE_DEFAULTS[initialType].w);
  const [sizeH,      setSizeH]      = useState<number>(SIZE_DEFAULTS[initialType].h);
  // STEP 2: 수량
  const [qty,      setQty]      = useState<number>(500);
  const [qtyInput, setQtyInput] = useState<string>("500");
  // STEP 3: 색상
  const [colorGroup, setColorGroup] = useState<"color" | "bw">("color");
  // STEP 4: 면수
  const [duplex, setDuplex] = useState<0 | 1>(0);
  // STEP 5: 용지
  const [papers,     setPapers]     = useState<PaperRow[]>([]);
  const [paperCate,  setPaperCate]  = useState<string>("");
  const [paperCode,  setPaperCode]  = useState<string>("");
  const [loadingPapers, setLoadingPapers] = useState(true);
  // STEP 6 (showFoldStep 전용): 접지
  const [fold, setFold] = useState<string>("none");
  // STEP 6/7: 코팅
  const [coating, setCoating] = useState<string>("none");
  // 작업B: 후가공 노출 맵 (API에서 로드, 초기값=폴백)
  const [finishingMap, setFinishingMap] = useState<Record<PaperProductType, string[]>>(
    { ...FINISHING_MAP_DEFAULTS }
  );
  // 견적
  const [estimate,    setEstimate]    = useState<CalcResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeType       = showSubTypeStep ? subType : initialType;
  // 작업B: API맵 우선, 없으면 DEFAULTS 폴백
  const allowedFinishing = finishingMap[activeType] ?? FINISHING_MAP_DEFAULTS[activeType] ?? ["coating"];
  const labels           = PRODUCT_LABELS[activeType];
  const sizePresets      = SIZE_PRESETS_MAP[activeType];
  const productImage     = PRODUCT_IMAGES[activeType];
  const subtypeLabel     = SUBTYPE_LABELS[activeType];

  // 레이아웃 비율: leaflet/flyer는 접지 스텝이 넓어 spec col 더 필요
  const imgColCls  = (activeType === "flyer" || activeType === "leaflet") ? "lg:w-2/5" : "lg:w-1/2";
  const specColCls = (activeType === "flyer" || activeType === "leaflet") ? "lg:w-3/5" : "lg:w-1/2";

  // STEP 번호 오프셋
  const stepBase   = showSubTypeStep ? 1 : 0; // 상품 선택이 STEP0이면 나머지 +1
  const foldOffset = showFoldStep ? 1 : 0;     // 접지 스텝이 있으면 코팅 +1

  // STEP0 전환: subType + 규격 상태 동시 리셋
  function handleSubTypeChange(t: PaperProductType) {
    setSubType(t);
    const def = SIZE_DEFAULTS[t];
    setSizePreset(def.preset);
    setSizeW(def.w);
    setSizeH(def.h);
  }

  // 작업B: 후가공 노출 맵 최초 1회 로드
  useEffect(() => {
    fetch("/api/product-config/finishing-map")
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.map) setFinishingMap(prev => ({ ...prev, ...(d.map as Record<string, string[]>) }));
      })
      .catch(() => {}); // 실패 시 초기값(폴백) 유지
  }, []);

  // 용지 목록 최초 1회 로드
  useEffect(() => {
    fetch("/api/pm/papers?active=1")
      .then(r => r.json())
      .then(d => {
        if (d.ok && Array.isArray(d.papers)) {
          setPapers(d.papers);
          if (d.papers.length > 0) {
            const firstCate = d.papers[0].cate || "";
            setPaperCate(firstCate);
            const first = d.papers.find((p: PaperRow) => (p.cate || "") === firstCate);
            if (first) setPaperCode(first.paper_code);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPapers(false));
  }, []);

  // 견적 계산 (debounced 400ms)
  // PM-DEV-ESTIMATE-DIFF-INVESTIGATE-07: /calculate/batch 사용
  //   ① batch → normalizeItemSpec → size_group 자동 주입 (sheetHalfCoeff 정상 적용)
  //   ② total = subtotal + Math.ceil(subtotal×0.1) → 7200 personal_estimate 완전 일치
  const runCalc = useCallback(() => {
    if (!qty || !sizeW || !sizeH || !paperCode) { setEstimate(null); return; }
    setCalculating(true);
    fetch("/api/pe/calculate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{
          order_type: "paper",
          qty,
          size_w: sizeW,
          size_h: sizeH,
          paper_spec: {
            color_group: colorGroup,
            duplex:      duplex === 1,
            paper_code:  paperCode,
            machine:     "toner",
          },
          finishing: {
            coating,
            fold:              showFoldStep ? fold : "none",
            crease:            0,
            perforation:       0,
            diecut:            "none",
            diecut_complexity: "mid",
            hole:              0,
            corner:            false,
            line_cut:          false,
          },
        }],
      }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.item_results?.[0]) {
          const ir = d.item_results[0];
          setEstimate({ ok: true, total: ir.total ?? d.summary?.total ?? 0 });
        } else {
          setEstimate({ ok: false, error: d.error || "계산 실패" });
        }
      })
      .catch(err => setEstimate({ ok: false, error: String(err) }))
      .finally(() => setCalculating(false));
  }, [qty, sizeW, sizeH, colorGroup, duplex, paperCode, coating, fold, showFoldStep]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runCalc, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [runCalc]);

  // 파생 데이터
  const categories     = Array.from(new Set(papers.map(p => p.cate || "기타")));
  const filteredPapers = paperCate ? papers.filter(p => (p.cate || "기타") === paperCate) : papers;
  const selectedPaper  = papers.find(p => p.paper_code === paperCode);

  function handleCateChange(cate: string) {
    setPaperCate(cate);
    const first = papers.find(p => (p.cate || "기타") === cate);
    if (first) setPaperCode(first.paper_code);
  }

  function handleSizePreset(label: string) {
    const preset = sizePresets.find(p => p.label === label);
    if (preset) { setSizeW(preset.w); setSizeH(preset.h); }
    setSizePreset(label);
  }

  function handleQtyInput(val: string) {
    setQtyInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n > 0) setQty(n);
  }

  const total   = estimate?.ok ? (estimate.total ?? 0) : 0;
  const perUnit = qty > 0 && total > 0 ? Math.round(total / qty) : 0;

  // 선택된 접지 옵션 표시명
  const selectedFold = FOLD_OPTIONS.find(f => f.key === fold);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-8">

        {/* ── 헤더 ── */}
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {labels.subtitle}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">{labels.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{labels.desc}</p>
        </div>

        {/* ── 2단 레이아웃 ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ── 좌측: 제품 이미지 + 상품 라벨 오버레이 ── */}
          <div className={`w-full ${imgColCls} lg:sticky lg:top-4`}>
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-muted shadow-sm">
              <img
                src={productImage}
                alt={labels.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              {/* 작업A: showSubTypeStep일 때 현재 선택 상품명을 이미지 하단에 크게 표시 */}
              {showSubTypeStep && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pt-12 pb-5 px-5 pointer-events-none">
                  <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest leading-none mb-1">
                    {subtypeLabel.en}
                  </p>
                  <p className="text-white text-3xl font-extrabold leading-none tracking-tight drop-shadow-sm">
                    {subtypeLabel.ko}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── 우측: 사양 + 가격 패널 ── */}
          <div className={`w-full ${specColCls} flex flex-col gap-3`}>

            {/* 사양 카드 */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4">

              {/* STEP 0: 상품 선택 — 세그먼트 토글 (postcard 라우트 전용) */}
              {showSubTypeStep && (
                <section>
                  <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    상품 선택
                  </h2>
                  <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-border">
                    {(["postcard", "card"] as PaperProductType[]).map((t, i) => (
                      <button
                        key={t}
                        onClick={() => handleSubTypeChange(t)}
                        className={[
                          "py-3 px-4 text-center transition-all duration-150",
                          i === 0 ? "border-r border-border" : "",
                          subType === t
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground hover:bg-accent",
                        ].join(" ")}
                      >
                        <div className="text-sm font-bold">
                          {t === "postcard" ? "엽서" : "카드"}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${
                          subType === t ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {t === "postcard" ? "Postcard · 굿즈 엽서" : "Card · 청첩장 · 안내"}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* STEP 1: 크기 */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  STEP {stepBase + 1} · 크기
                </h2>
                <div className={`grid gap-1.5 mb-2 ${
                  activeType === "flyer" || activeType === "leaflet" ? "grid-cols-4" :
                  activeType === "card"     ? "grid-cols-2 sm:grid-cols-4" :
                  /* postcard */              "grid-cols-3"
                }`}>
                  {sizePresets.map(p => (
                    <button key={p.label} onClick={() => handleSizePreset(p.label)}
                      className={compactBtnCls(sizePreset === p.label)}>
                      <div className="text-[11px] font-semibold">{p.label}</div>
                      <div className="text-[9px] opacity-60 mt-0.5">{p.w}×{p.h}</div>
                    </button>
                  ))}
                  <button onClick={() => setSizePreset("custom")}
                    className={compactBtnCls(sizePreset === "custom")}>
                    <div className="text-[11px] font-semibold">직접입력</div>
                    <div className="text-[9px] opacity-60 mt-0.5">mm</div>
                  </button>
                </div>
                {sizePreset === "custom" && (
                  <div className="flex gap-2 items-center mt-1">
                    <input type="number" value={sizeW} min={1}
                      onChange={e => setSizeW(Number(e.target.value))}
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-center"
                      placeholder="가로" />
                    <span className="text-xs text-muted-foreground">×</span>
                    <input type="number" value={sizeH} min={1}
                      onChange={e => setSizeH(Number(e.target.value))}
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-center"
                      placeholder="세로" />
                    <span className="text-xs text-muted-foreground">mm</span>
                  </div>
                )}
              </section>

              {/* STEP 2: 수량 */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  STEP {stepBase + 2} · 수량
                </h2>
                <div className="flex gap-2 items-center mb-2">
                  <input type="number" value={qtyInput} min={1}
                    onChange={e => handleQtyInput(e.target.value)}
                    className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-right" />
                  <span className="text-sm text-muted-foreground">부</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {QTY_QUICK.map(q => (
                    <button key={q}
                      onClick={() => { setQty(q); setQtyInput(String(q)); }}
                      className={pillCls(qty === q)}>
                      {q.toLocaleString()}
                    </button>
                  ))}
                </div>
              </section>

              {/* STEP 3: 색상 */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  STEP {stepBase + 3} · 색상
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setColorGroup("color")} className={pillCls(colorGroup === "color")}>
                    컬러
                  </button>
                  <button onClick={() => setColorGroup("bw")} className={pillCls(colorGroup === "bw")}>
                    흑백
                  </button>
                </div>
              </section>

              {/* STEP 4: 면수 */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  STEP {stepBase + 4} · 인쇄 면수
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setDuplex(0)} className={pillCls(duplex === 0)}>단면</button>
                  <button onClick={() => setDuplex(1)} className={pillCls(duplex === 1)}>양면</button>
                </div>
              </section>

              {/* STEP 5: 용지 */}
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  STEP {stepBase + 5} · 용지
                </h2>
                {loadingPapers ? (
                  <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={paperCate}
                      onChange={e => handleCateChange(e.target.value)}
                      className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                    >
                      <option value="">전체</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={paperCode}
                      onChange={e => setPaperCode(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                    >
                      <option value="">-- 용지 선택 --</option>
                      {filteredPapers.map(p => (
                        <option key={p.paper_code} value={p.paper_code}>
                          {p.paper_name} {p.gsm}g
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {selectedPaper && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    선택: <span className="font-semibold text-foreground">
                      {selectedPaper.paper_name} {selectedPaper.gsm}g
                    </span>
                    {selectedPaper.cate && <>&nbsp;·&nbsp;{selectedPaper.cate}</>}
                  </p>
                )}
              </section>

              {/* ── STEP 6: 접지 선택 (PM-DEV-LEAFLET-PAGE-08 작업C) ── */}
              {showFoldStep && allowedFinishing.includes("fold") && (
                <section>
                  <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    STEP {stepBase + 6} · 접지
                  </h2>
                  {/* 6종 접지 썸네일 카드 그리드 (3열) */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {FOLD_OPTIONS.map(opt => {
                      const isActive = fold === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setFold(opt.key)}
                          className={[
                            "flex flex-col items-center rounded-xl border p-1.5 transition-all duration-150 cursor-pointer text-center",
                            isActive
                              ? "border-[#6d5dfc] bg-[#6d5dfc]/5 ring-1 ring-[#6d5dfc] shadow-sm"
                              : "border-border bg-background hover:border-primary/40 hover:bg-accent",
                          ].join(" ")}
                        >
                          {/* 3D ISO SVG 썸네일 */}
                          <div className="w-full mb-1">
                            <FoldIcon foldKey={opt.key} active={isActive} />
                          </div>
                          <span className={`text-[9px] font-bold leading-tight ${isActive ? "text-[#6d5dfc]" : "text-foreground"}`}>
                            {opt.label}
                          </span>
                          <span className="text-[8px] text-muted-foreground mt-0.5 leading-none">
                            {opt.priceHint ? `+${opt.priceHint}원/매` : "기본"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {fold !== "none" && selectedFold && (
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      선택: <span className="font-semibold text-foreground">
                        {selectedFold.label}
                      </span>
                      &nbsp;·&nbsp;{selectedFold.subLabel}
                      <span className="ml-1 text-[#6d5dfc] font-semibold">
                        (실제 후가공비는 견적가에 포함)
                      </span>
                    </p>
                  )}
                </section>
              )}

              {/* STEP 6/7: 코팅 — API allowedFinishing 조건 */}
              {allowedFinishing.includes("coating") && (
                <section>
                  <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    STEP {stepBase + 6 + foldOffset} · 코팅
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {COATING_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setCoating(opt.value)}
                        className={pillCls(coating === opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

            </div>{/* end 사양 카드 */}

            {/* ── 가격 패널 — sticky bottom ── */}
            <div className="sticky bottom-4 rounded-2xl border border-border bg-card p-4 shadow-lg">
              {calculating ? (
                <div className="space-y-1.5">
                  <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                </div>
              ) : estimate && !estimate.ok ? (
                <p className="text-sm text-destructive">
                  {estimate.error || "계산 오류가 발생했습니다"}
                </p>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground mb-0.5 truncate">
                      {sizeW}×{sizeH}mm&nbsp;·&nbsp;
                      {colorGroup === "color" ? "컬러" : "흑백"}&nbsp;·&nbsp;
                      {duplex === 1 ? "양면" : "단면"}&nbsp;·&nbsp;
                      {qty.toLocaleString()}부
                      {showFoldStep && fold !== "none" && selectedFold && (
                        <>&nbsp;·&nbsp;{selectedFold.label}</>
                      )}
                      {coating !== "none" && (
                        <>&nbsp;·&nbsp;{COATING_OPTIONS.find(c => c.value === coating)?.label}</>
                      )}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold tabular-nums tracking-tight">
                        {total > 0 ? `₩${total.toLocaleString()}` : "—"}
                      </span>
                    </div>
                    {perUnit > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        매당&nbsp;{perUnit.toLocaleString()}원
                      </p>
                    )}
                    {!estimate && !calculating && (
                      <p className="text-[10px] text-muted-foreground">
                        옵션을 선택하면 견적이 표시됩니다
                      </p>
                    )}
                  </div>
                  <button
                    disabled
                    title="파일 업로드·결제 기능은 다음 업데이트에서 제공됩니다"
                    className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground opacity-40 cursor-not-allowed select-none"
                  >
                    주문하기
                  </button>
                </div>
              )}
            </div>

          </div>{/* end 우측 */}
        </div>{/* end 2단 */}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          파일 업로드 · 결제 기능은 2차 업데이트에서 제공됩니다
        </p>
      </main>
    </div>
  );
}
