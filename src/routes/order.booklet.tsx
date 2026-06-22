import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { Nav } from "@/components/landing/Nav";
import bookletImg from "@/assets/product-booklets.jpg";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PaperRow {
  paper_code: string;
  paper_name: string;
  gsm: number;
  cate: string;
}

interface BookBreakdown {
  cover_print: number;
  cover_paper: number;
  inner_print: number;
  inner_paper: number;
  binding: number;
  finishing: number;
  base_fee: number;
}

interface BookResult {
  ok: boolean;
  total?: number;
  per_unit?: number;
  subtotal?: number;
  vat?: number;
  breakdown?: BookBreakdown;
  error?: string;
}

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/order/booklet")({
  head: () => ({
    meta: [
      { title: "책자/제본 주문 · Printly" },
      {
        name: "description",
        content:
          "브로슈어·카탈로그·소책자를 손쉽게 제작하세요. 판형·제본·용지까지 한 화면에서 실시간 견적.",
      },
    ],
  }),
  component: BookletPage,
});

// ── Constants ─────────────────────────────────────────────────────────────────
const SIZE_PRESETS = [
  { label: "A4",   w: 210, h: 297 },
  { label: "A5",   w: 148, h: 210 },
  { label: "B5",   w: 182, h: 257 },
  { label: "국배판", w: 188, h: 257 },
];

const BINDING_OPTIONS = [
  {
    key: "perfect",
    label: "무선제본",
    subLabel: "Perfect Binding",
    desc: "책등 접착 · 두꺼운 책자에 적합",
  },
  {
    key: "saddle",
    label: "중철제본",
    subLabel: "Saddle Stitch",
    desc: "가운데 스테이플 · 80p 이하 적합",
  },
  {
    key: "spiral",
    label: "스프링제본",
    subLabel: "Spiral Binding",
    desc: "링 스프링 · 펼침 활용 용이",
  },
];

const QTY_QUICK = [50, 100, 200, 300, 500, 1000];

const COATING_OPTIONS = [
  { value: "none",    label: "없음" },
  { value: "gloss_1", label: "단면유광" },
  { value: "matte_1", label: "단면무광" },
  { value: "gloss_2", label: "양면유광" },
  { value: "matte_2", label: "양면무광" },
];

// ── CSS helpers ───────────────────────────────────────────────────────────────
function pillCls(active: boolean) {
  return [
    "rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-background hover:border-primary/50 hover:bg-accent",
  ].join(" ");
}

function compactBtnCls(active: boolean) {
  return [
    "rounded-lg border py-1.5 px-2 text-center transition-all duration-150 cursor-pointer leading-snug",
    active
      ? "border-primary bg-primary text-primary-foreground shadow-sm"
      : "border-border bg-background hover:border-primary/50 hover:bg-accent",
  ].join(" ");
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
        {n}
      </span>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
    </div>
  );
}

function fmtWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

// ── 3단 드롭다운용 Select ─────────────────────────────────────────────────────
function CascadeSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 min-w-0 rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── 표지/내지 용지 3단 캐스케이드 섹션 ───────────────────────────────────────
function PaperCascade({
  papers,
  loading,
  cate,
  name,
  code,
  onCate,
  onName,
  onCode,
  allCates,
}: {
  papers: PaperRow[];
  loading: boolean;
  cate: string;
  name: string;
  code: string;
  onCate: (v: string) => void;
  onName: (v: string) => void;
  onCode: (v: string) => void;
  allCates: string[];
}) {
  const names = Array.from(
    new Set(
      papers.filter((p) => (p.cate || "기타") === cate).map((p) => p.paper_name)
    )
  );
  const gsms = papers.filter(
    (p) => (p.cate || "기타") === cate && p.paper_name === name
  );
  const selectedPaper = papers.find((p) => p.paper_code === code);

  if (loading) {
    return <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <div>
      <div className="flex flex-col gap-1.5 sm:flex-row">
        <CascadeSelect
          value={cate}
          onChange={onCate}
          options={allCates.map((c) => ({ value: c, label: c }))}
          placeholder="분류"
        />
        <CascadeSelect
          value={name}
          onChange={onName}
          options={names.map((n) => ({ value: n, label: n }))}
          placeholder="용지명"
        />
        <CascadeSelect
          value={code}
          onChange={onCode}
          options={gsms.map((p) => ({
            value: p.paper_code,
            label: `${p.gsm}g`,
          }))}
          placeholder="평량"
        />
      </div>
      {selectedPaper && (
        <p className="mt-1 text-[10px] text-muted-foreground">
          {selectedPaper.paper_name} {selectedPaper.gsm}g
          {selectedPaper.cate && (
            <span className="ml-1 opacity-60">· {selectedPaper.cate}</span>
          )}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function BookletPage() {
  // STEP 1: 판형
  const [sizePreset, setSizePreset] = useState("A4");
  const [sizeW, setSizeW] = useState(210);
  const [sizeH, setSizeH] = useState(297);

  // STEP 2: 제본
  const [binding, setBinding] = useState("perfect");

  // STEP 3: 날개
  const [hasWing, setHasWing] = useState<0 | 1>(0);

  // STEP 4: 부수
  const [qty, setQty] = useState(100);
  const [qtyInput, setQtyInput] = useState("100");

  // STEP 5: 표지 사양
  const [coverColor, setCoverColor] = useState<"color" | "bw">("color");
  const [coverDuplex, setCoverDuplex] = useState(true);
  const [coverPaperCate, setCoverPaperCate] = useState("");
  const [coverPaperName, setCoverPaperName] = useState("");
  const [coverPaperCode, setCoverPaperCode] = useState("");

  // STEP 6: 내지 사양
  const [bodyColor, setBodyColor] = useState<"color" | "bw">("bw");
  const [bodyDuplex, setBodyDuplex] = useState(true);
  const [bodyPages, setBodyPages] = useState(32);
  const [bodyPagesInput, setBodyPagesInput] = useState("32");
  const [bodyPaperCate, setBodyPaperCate] = useState("");
  const [bodyPaperName, setBodyPaperName] = useState("");
  const [bodyPaperCode, setBodyPaperCode] = useState("");

  // STEP 7: 후가공 (표지 코팅)
  const [coverCoating, setCoverCoating] = useState("none");

  // 용지 목록
  const [papers, setPapers] = useState<PaperRow[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(true);

  // 견적
  const [estimate, setEstimate] = useState<BookResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 용지 목록 로드 ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/pm/papers?active=1")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.papers)) {
          const list: PaperRow[] = d.papers;
          setPapers(list);

          // 표지 초기값 — 첫 번째 용지
          const firstCate = list[0]?.cate || "기타";
          const byCate = list.filter((p) => (p.cate || "기타") === firstCate);
          const firstName = byCate[0]?.paper_name || "";
          const firstCode =
            byCate.find((p) => p.paper_name === firstName)?.paper_code || "";
          setCoverPaperCate(firstCate);
          setCoverPaperName(firstName);
          setCoverPaperCode(firstCode);

          // 내지 초기값 — 모조 80~100g 우선
          const bodyDefault =
            list.find(
              (p) => p.paper_name.includes("모조") && p.gsm <= 100
            ) ||
            list.find((p) => p.gsm <= 100) ||
            list[0];
          if (bodyDefault) {
            setBodyPaperCate(bodyDefault.cate || "기타");
            setBodyPaperName(bodyDefault.paper_name);
            setBodyPaperCode(bodyDefault.paper_code);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPapers(false));
  }, []);

  // ── 파생값 ────────────────────────────────────────────────────────────────
  const allCates = Array.from(new Set(papers.map((p) => p.cate || "기타")));

  // ── 핸들러 ─────────────────────────────────────────────────────────────────
  function handleSizePreset(label: string) {
    const preset = SIZE_PRESETS.find((p) => p.label === label);
    if (preset) {
      setSizeW(preset.w);
      setSizeH(preset.h);
    }
    setSizePreset(label);
  }

  function handleQtyInput(val: string) {
    setQtyInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n > 0) setQty(n);
  }

  function handleBodyPagesInput(val: string) {
    setBodyPagesInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 4) setBodyPages(n);
  }

  // 표지 캐스케이드 핸들러
  function handleCoverCate(cate: string) {
    setCoverPaperCate(cate);
    const filtered = papers.filter((p) => (p.cate || "기타") === cate);
    const firstName = filtered[0]?.paper_name || "";
    setCoverPaperName(firstName);
    const firstCode =
      filtered.find((p) => p.paper_name === firstName)?.paper_code || "";
    setCoverPaperCode(firstCode);
  }

  function handleCoverName(name: string) {
    setCoverPaperName(name);
    const gsms = papers.filter(
      (p) => (p.cate || "기타") === coverPaperCate && p.paper_name === name
    );
    setCoverPaperCode(gsms[0]?.paper_code || "");
  }

  // 내지 캐스케이드 핸들러
  function handleBodyCate(cate: string) {
    setBodyPaperCate(cate);
    const filtered = papers.filter((p) => (p.cate || "기타") === cate);
    const firstName = filtered[0]?.paper_name || "";
    setBodyPaperName(firstName);
    const firstCode =
      filtered.find((p) => p.paper_name === firstName)?.paper_code || "";
    setBodyPaperCode(firstCode);
  }

  function handleBodyName(name: string) {
    setBodyPaperName(name);
    const gsms = papers.filter(
      (p) => (p.cate || "기타") === bodyPaperCate && p.paper_name === name
    );
    setBodyPaperCode(gsms[0]?.paper_code || "");
  }

  // ── §6 가드: 두 용지 코드 모두 확정되어야 계산 시작 ─────────────────────────
  const canCalc =
    !!coverPaperCode &&
    !!bodyPaperCode &&
    qty > 0 &&
    bodyPages >= 4 &&
    sizeW > 0 &&
    sizeH > 0;

  // ── 견적 계산 (debounced 500ms) ───────────────────────────────────────────
  const runCalc = useCallback(() => {
    if (!canCalc) {
      setEstimate(null);
      return;
    }
    setCalculating(true);
    fetch("/api/pe/calculate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            order_type: "book",
            qty,
            size_w: sizeW,
            size_h: sizeH,
            binding,
            has_wing: hasWing,
            cover: {
              color_group: coverColor,
              duplex: coverDuplex,
              page: 4,
              paper_code: coverPaperCode,
            },
            body: {
              color_group: bodyColor,
              duplex: bodyDuplex,
              page: bodyPages,
              paper_code: bodyPaperCode,
            },
            finishing: {
              coating: coverCoating,
              fold: "none",
              crease: 0,
              perforation: 0,
              diecut: "none",
              hole: 0,
              corner: false,
              line_cut: false,
            },
          },
        ],
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.item_results?.[0]) {
          const ir = d.item_results[0];
          const itm = ir.items || {};
          setEstimate({
            ok: true,
            total: ir.total,
            subtotal: ir.subtotal,
            vat: ir.vat,
            per_unit: ir.per_unit,
            breakdown: {
              cover_print: itm.cover_print?.total ?? 0,
              cover_paper: itm.cover_paper?.total ?? 0,
              inner_print: itm.inner_print?.total ?? 0,
              inner_paper: itm.inner_paper?.total ?? 0,
              binding:     itm.binding?.total     ?? 0,
              finishing:   itm.finishing?.total   ?? 0,
              base_fee:    itm.base_fee?.total    ?? 0,
            },
          });
        } else {
          setEstimate({ ok: false, error: d.error || "계산 실패" });
        }
      })
      .catch((err) => setEstimate({ ok: false, error: String(err) }))
      .finally(() => setCalculating(false));
  }, [
    canCalc,
    qty,
    sizeW,
    sizeH,
    binding,
    hasWing,
    coverColor,
    coverDuplex,
    coverPaperCode,
    coverCoating,
    bodyColor,
    bodyDuplex,
    bodyPages,
    bodyPaperCode,
  ]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runCalc, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [runCalc]);

  // ── UI 파생값 ─────────────────────────────────────────────────────────────
  const total = estimate?.ok ? (estimate.total ?? 0) : 0;
  const perUnit = estimate?.ok ? (estimate.per_unit ?? 0) : 0;
  const bd = estimate?.ok ? estimate.breakdown : null;

  const selectedBinding = BINDING_OPTIONS.find((b) => b.key === binding);
  const summaryParts = [
    SIZE_PRESETS.find((p) => p.label === sizePreset)?.label ||
      `${sizeW}×${sizeH}mm`,
    selectedBinding?.label || binding,
    `${bodyPages + 4}p`,
    `${qty.toLocaleString()}부`,
  ];
  if (coverCoating !== "none") {
    summaryParts.push(
      COATING_OPTIONS.find((c) => c.value === coverCoating)?.label || ""
    );
  }
  const summaryText = summaryParts.join(" · ");

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-6">

        {/* 페이지 헤더 */}
        <div className="mb-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Booklet
          </p>
          <h1 className="text-2xl font-bold tracking-tight">책자 / 제본</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            브로슈어 · 카탈로그 · 소책자 제작
          </p>
        </div>

        {/* 2단 레이아웃 */}
        <div className="grid gap-6 lg:grid-cols-[45fr_55fr] items-start">

          {/* ── 좌측: 히어로 이미지 (sticky) ── */}
          <div className="lg:sticky lg:top-6">
            <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-foreground/10">
              <img
                src={bookletImg}
                alt="책자/제본"
                className="w-full object-cover"
                style={{ minHeight: "400px", maxHeight: "580px" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-transparent to-transparent" />
              <div className="absolute left-6 top-6 right-6">
                <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground tracking-widest uppercase">
                  Booklet
                </span>
                <h2 className="mt-3 text-4xl font-black leading-tight text-white drop-shadow">
                  책자 / 제본
                </h2>
                <p className="mt-1.5 text-sm font-medium text-white/90 drop-shadow">
                  브로슈어 · 카탈로그 · 소책자 제작
                </p>
              </div>
              {/* 판형·제본 요약 뱃지 */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                {[
                  SIZE_PRESETS.find((p) => p.label === sizePreset)?.label || `${sizeW}×${sizeH}`,
                  selectedBinding?.label || "",
                  `${bodyPages + 4}p · ${qty}부`,
                ].filter(Boolean).map((t, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── 우측: 스크롤 패널 ── */}
          <div className="flex flex-col rounded-3xl border border-border bg-card/60 overflow-hidden lg:max-h-[calc(100vh-7rem)]">

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">

              {/* ─────────────────── STEP 1: 판형 ─────────────────── */}
              <section>
                <StepLabel n={1} title="판형 (Size)" />
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {SIZE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleSizePreset(p.label)}
                      className={compactBtnCls(sizePreset === p.label)}
                    >
                      <div className="text-[11px] font-semibold">{p.label}</div>
                      <div className="text-[9px] opacity-60 mt-0.5">
                        {p.w}×{p.h}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setSizePreset("custom")}
                    className={compactBtnCls(sizePreset === "custom")}
                  >
                    <div className="text-[11px] font-semibold">직접</div>
                    <div className="text-[9px] opacity-60 mt-0.5">mm</div>
                  </button>
                </div>
                {sizePreset === "custom" && (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={sizeW}
                      min={1}
                      onChange={(e) => setSizeW(Number(e.target.value))}
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-center"
                      placeholder="가로"
                    />
                    <span className="text-xs text-muted-foreground">×</span>
                    <input
                      type="number"
                      value={sizeH}
                      min={1}
                      onChange={(e) => setSizeH(Number(e.target.value))}
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-center"
                      placeholder="세로"
                    />
                    <span className="text-xs text-muted-foreground">mm</span>
                  </div>
                )}
              </section>

              {/* ─────────────────── STEP 2: 제본 ─────────────────── */}
              <section>
                <StepLabel n={2} title="제본 방식 (Binding)" />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {BINDING_OPTIONS.map((b) => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setBinding(b.key)}
                      className={[
                        "rounded-2xl border p-3 text-left transition-all duration-150",
                        binding === b.key
                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                          : "border-border bg-background hover:border-primary/50 hover:bg-accent",
                      ].join(" ")}
                    >
                      <div className="text-sm font-bold">{b.label}</div>
                      <div className="mt-0.5 text-[10px] font-medium text-primary/70">
                        {b.subLabel}
                      </div>
                      <div className="mt-1 text-[10px] leading-snug text-muted-foreground">
                        {b.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* ─────────────────── STEP 3: 날개 ─────────────────── */}
              <section>
                <StepLabel n={3} title="표지 날개 (Wing Flap)" />
                <div className="flex gap-2">
                  <button
                    onClick={() => setHasWing(0)}
                    className={pillCls(hasWing === 0)}
                  >
                    없음
                  </button>
                  <button
                    onClick={() => setHasWing(1)}
                    className={pillCls(hasWing === 1)}
                  >
                    있음
                  </button>
                </div>
              </section>

              {/* ─────────────────── STEP 4: 부수 ─────────────────── */}
              <section>
                <StepLabel n={4} title="부수 (Quantity)" />
                <div className="mb-2 flex items-center gap-2">
                  <input
                    type="number"
                    value={qtyInput}
                    min={1}
                    onChange={(e) => handleQtyInput(e.target.value)}
                    className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-right"
                  />
                  <span className="text-sm text-muted-foreground">부</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QTY_QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQty(q);
                        setQtyInput(String(q));
                      }}
                      className={pillCls(qty === q)}
                    >
                      {q.toLocaleString()}
                    </button>
                  ))}
                </div>
              </section>

              {/* ─────────────────── STEP 5: 표지 사양 ─────────────────── */}
              <section>
                <StepLabel n={5} title="표지 사양 (Cover)" />
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    표지 · COVER{" "}
                    <span className="font-normal normal-case tracking-normal text-amber-500">
                      (4p 고정)
                    </span>
                  </p>

                  {/* 색상 */}
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      색상
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCoverColor("color")}
                        className={pillCls(coverColor === "color")}
                      >
                        컬러
                      </button>
                      <button
                        onClick={() => setCoverColor("bw")}
                        className={pillCls(coverColor === "bw")}
                      >
                        흑백
                      </button>
                    </div>
                  </div>

                  {/* 인쇄 면수 */}
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      인쇄 면수
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCoverDuplex(true)}
                        className={pillCls(coverDuplex)}
                      >
                        양면
                      </button>
                      <button
                        onClick={() => setCoverDuplex(false)}
                        className={pillCls(!coverDuplex)}
                      >
                        단면
                      </button>
                    </div>
                  </div>

                  {/* 용지 3단 드롭다운 */}
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      용지
                    </p>
                    <PaperCascade
                      papers={papers}
                      loading={loadingPapers}
                      cate={coverPaperCate}
                      name={coverPaperName}
                      code={coverPaperCode}
                      onCate={handleCoverCate}
                      onName={handleCoverName}
                      onCode={setCoverPaperCode}
                      allCates={allCates}
                    />
                    {!coverPaperCode && !loadingPapers && (
                      <p className="mt-1 text-[10px] text-amber-600 font-medium">
                        ⚠ 표지 용지를 선택해 주세요
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* ─────────────────── STEP 6: 내지 사양 ─────────────────── */}
              <section>
                <StepLabel n={6} title="내지 사양 (Inner Pages)" />
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                    내지 · INNER
                  </p>

                  {/* 색상 */}
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      색상
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBodyColor("color")}
                        className={pillCls(bodyColor === "color")}
                      >
                        컬러
                      </button>
                      <button
                        onClick={() => setBodyColor("bw")}
                        className={pillCls(bodyColor === "bw")}
                      >
                        흑백
                      </button>
                    </div>
                  </div>

                  {/* 인쇄 면수 */}
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      인쇄 면수
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBodyDuplex(true)}
                        className={pillCls(bodyDuplex)}
                      >
                        양면
                      </button>
                      <button
                        onClick={() => setBodyDuplex(false)}
                        className={pillCls(!bodyDuplex)}
                      >
                        단면
                      </button>
                    </div>
                  </div>

                  {/* 페이지수 */}
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      내지 페이지수
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={bodyPagesInput}
                        min={4}
                        step={4}
                        onChange={(e) => handleBodyPagesInput(e.target.value)}
                        className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-center"
                      />
                      <span className="text-xs text-muted-foreground">
                        p{" "}
                        <span className="opacity-60">(4의 배수 권장)</span>
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      총 페이지:{" "}
                      <span className="font-semibold text-foreground">
                        {bodyPages + 4}p
                      </span>{" "}
                      (내지 {bodyPages}p + 표지 4p)
                    </p>
                  </div>

                  {/* 용지 3단 드롭다운 */}
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      용지
                    </p>
                    <PaperCascade
                      papers={papers}
                      loading={loadingPapers}
                      cate={bodyPaperCate}
                      name={bodyPaperName}
                      code={bodyPaperCode}
                      onCate={handleBodyCate}
                      onName={handleBodyName}
                      onCode={setBodyPaperCode}
                      allCates={allCates}
                    />
                    {!bodyPaperCode && !loadingPapers && (
                      <p className="mt-1 text-[10px] text-blue-600 font-medium">
                        ⚠ 내지 용지를 선택해 주세요
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* ─────────────────── STEP 7: 후가공 (표지 코팅) ─────────────────── */}
              <section>
                <StepLabel n={7} title="후가공 — 표지 코팅" />
                <div className="flex flex-wrap gap-1.5">
                  {COATING_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCoverCoating(c.value)}
                      className={pillCls(coverCoating === c.value)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  * 코팅은 표지 전용 후가공입니다
                </p>
              </section>

              {/* §6 가드 안내 */}
              {!canCalc && !loadingPapers && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <p className="text-xs font-medium text-amber-700">
                    ⚠ 표지와 내지 용지를 모두 선택하면 견적이 자동으로 계산됩니다.
                  </p>
                </div>
              )}

              {/* 하단 여백 */}
              <div className="h-2" />
            </div>

            {/* ─── Sticky 가격 패널 ─── */}
            <div className="shrink-0 border-t border-border bg-card/95 rounded-b-3xl backdrop-blur-sm">

              {/* 항목별 명세 */}
              {canCalc && bd && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 border-b border-border/50 px-4 py-2.5 text-[11px]">
                  {[
                    ["표지 인쇄", bd.cover_print],
                    ["표지 용지", bd.cover_paper],
                    ["내지 인쇄", bd.inner_print],
                    ["내지 용지", bd.inner_paper],
                    ["제본",     bd.binding],
                    ...(bd.finishing > 0 ? [["후가공", bd.finishing] as [string, number]] : []),
                    ...(bd.base_fee > 0  ? [["기본세팅", bd.base_fee]  as [string, number]] : []),
                  ].map(([label, amount]) => (
                    <div key={label as string} className="flex justify-between gap-2 text-muted-foreground">
                      <span>{label}</span>
                      <span className="tabular-nums">{fmtWon(amount as number)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 합계 + 주문 버튼 */}
              <div className="flex items-end justify-between gap-4 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="mb-1 truncate text-[11px] font-medium text-muted-foreground">
                    {summaryText}
                  </p>
                  {calculating ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black tracking-tight text-muted-foreground">
                        계산 중…
                      </span>
                    </div>
                  ) : canCalc && total > 0 ? (
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-black tracking-tight text-foreground">
                        ₩{total.toLocaleString("ko-KR")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        부당 ₩{perUnit.toLocaleString("ko-KR")} · VAT 포함
                      </span>
                    </div>
                  ) : estimate?.ok === false ? (
                    <p className="text-sm font-medium text-destructive">
                      {estimate.error}
                    </p>
                  ) : (
                    <span className="text-2xl font-black tracking-tight text-muted-foreground">
                      —
                    </span>
                  )}
                </div>
                <button
                  disabled={!canCalc || !total}
                  className="shrink-0 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                >
                  주문하기
                </button>
              </div>
            </div>

          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          파일 업로드 · 결제 기능은 2차 업데이트에서 제공됩니다
        </p>
      </main>
    </div>
  );
}
