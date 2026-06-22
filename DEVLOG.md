# Printly Frontend — 개발 로그 (AI 초기화 대비)

> 이 문서는 AI(Claude) 컨텍스트 초기화 시 작업 연속성을 위한 인계 문서입니다.  
> 세션 시작 시 이 파일을 먼저 읽고 작업을 이어가세요.

---

## ⚠️ 절대 규칙 (변경 불가)

1. **`node server/server.js` 실행 절대 금지** — 서버 기동은 `start.bat` 전용
2. **`node migrate_*.js`만 AI가 직접 실행 가능**
3. **금액 로직·calcEngine·calculate/batch 변경 금지** — 프론트엔드 시각/UX 레이어만 건드림
4. **라우팅 회귀 금지** — 5종 상품 navigate() 연결 상태 보존

---

## 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 레포 | `https://github.com/kyoboprint-ship-it/Digital-printing-ecommerce` |
| 브랜치 | `master` |
| 로컬 경로 | `E:\printjob_money\project-source\` |
| 개발 서버 | `localhost:5175` (Vite, React 19) |
| 백엔드 서버 | `localhost:7100` (Node.js, 별도) |
| 스택 | React 19 · TanStack Router · TailwindCSS v4 · Vite · TypeScript |

---

## GitHub × Figma AI 협업 워크플로우

```
분석가 지시서 발행
       ↓
Figma AI (GitHub public 레포 읽기 가능, 쓰기 불가)
  → 코드 제공
       ↓
사용자가 코드를 Claude(나)에게 전달
       ↓
Claude가 로컬 파일 수정 (Desktop Commander MCP 사용)
       ↓
사용자가 git push
       ↓
분석가 독립 검증 (localhost:5175 Ctrl+F5)
```

**중요**: Figma AI는 GitHub URL에 `master` 브랜치를 명시해야 코드를 볼 수 있음.  
URL 형식: `https://github.com/kyoboprint-ship-it/Digital-printing-ecommerce/tree/master`

---

## 랜딩 섹션 확정 구조

```
Nav
Hero
#products    ← Products.tsx (제품 선택기, 유일한 상품 진입점)
#workflow    ← Workflow.tsx
#paper       ← Paper.tsx
#quote       ← Quote.tsx
#portfolio   ← PortfolioGallery.tsx
#cta         ← CTA.tsx
Footer
```

> `#workspace`(InteractiveProductDesk.tsx)는 **PM-DEV-LANDING-UX-02 B안**으로 제거됨.  
> 파일 자체는 남아있으나 `routes/index.tsx`에서 import·JSX 모두 제거된 상태.

---

## 완료된 작업 목록

### Phase 1 — 6종 제품 체계 개편
- [x] `Products.tsx` — catalog 제거, sticker(준비중) 추가, 6종 체계
- [x] `Hero.tsx` — 핫스팟 7→6개 (catalog 제거)
- [x] `Footer.tsx` — 6종 링크 업데이트
- [x] `Nav.tsx` — `#workspace` → `#products` 링크 수정
- [x] `Nav.tsx` — 모바일 햄버거 메뉴 추가
- [x] `PortfolioGallery.tsx` — 6종 태그 + Unsplash 임시 이미지
- [x] `Paper.tsx` — Unsplash 임시 이미지

### Phase 2 — 이미지 Unsplash 임시 URL 교체
- [x] Hero, Products, Paper, PortfolioGallery 전체 교체
- [x] `InteractiveProductDesk.tsx` — 로컬 import → Unsplash URL

### Phase 3 — GitHub 독립 레포 생성
- [x] `https://github.com/kyoboprint-ship-it/Digital-printing-ecommerce` (master 브랜치)
- [x] `.gitignore` — `.workspace/`, `.lovable/`, `.tanstack/` 추가
- [x] `README.md` 초기 작성

### Phase 4 — PM-DEV-LANDING-UX-01 (UX 고도화)
- [x] **0순위**: InteractiveProductDesk 라우팅 전면 연결
  - book→/order/booklet, flyer→/order/flyer, leaflet→/order/leaflet
  - card→/order/postcard, namecard→/order/namecard
  - sticker: disabled + 토스트
- [x] **2순위**: 스크롤 진입 애니메이션
  - `src/hooks/useInView.ts` 신규 생성 (IntersectionObserver, prefers-reduced-motion 지원)
  - 적용 섹션: Products, Workflow, Paper, Quote, PortfolioGallery
- [x] **3순위**: 스티커 토스트
  - `__root.tsx`에 `<Toaster />` 1회 마운트 (sonner)
  - InteractiveProductDesk + Products 양쪽 클릭 시 `toast("곧 출시됩니다 🏷️", {id:"sticker-coming-soon"})`

### Phase 5 — PM-DEV-LANDING-UX-02 (B안 확정)
- [x] **IA 결정**: B안 확정 — #workspace 제거, #products 단독
- [x] `routes/index.tsx` — InteractiveProductDesk import·JSX 완전 제거
- [x] `Products.tsx` — 카드 비주얼 전면 업그레이드
  - 카드 간격: `md:gap-5` → `md:gap-8`, 모바일 `gap-4` → `gap-5`
  - 모바일 카드 폭: `w-[170px]` → `w-[156px]`
  - 3D tilt (onMouseMove 순수 JS, perspective 600px, max 7deg)
  - 색 악센트 (카드별 고유 oklch 색상, hover 글로우)
  - CTA "주문하기 →" 슬라이드업 (hover 시 노출, 모바일 항상 노출)

---

## 현재 검증 상태

| 항목 | 상태 | 비고 |
|---|---|---|
| 5종 라우팅 | ✅ 통과 | 분석가 검증 완료 |
| 스크롤 애니메이션 | ✅ 적용 | 분석가 재검증 대기 |
| 스티커 토스트 | ✅ 적용 | 분析가 재검증 대기 |
| #workspace 제거 | ✅ 수정 완료 | ReferenceError 수정 후 재push |
| 카드 비주얼 업그레이드 | ✅ 적용 | 분析가 재검증 대기 |

---

## 미완료 / 보류 항목

| 항목 | 우선순위 | 비고 |
|---|---|---|
| 실사 촬영 이미지 교체 | 낮음 | 촬영 후 Unsplash URL → 로컬 파일 교체 |
| 스티커 상품 개발 | 추후 | `/order/sticker` 라우트 미구현 |
| CTA 카피 검토 | 보류 | 현행 유지 결정 |
| 상세페이지 메뉴 가독성 | 예정 | 분석가 지시 대기 |

---

## Products.tsx 데이터 구조 (카드 추가/삭제 기준)

```tsx
// src/components/landing/Products.tsx
const PRODUCTS: Product[] = [
  { id: "book",     emoji: "📖", title: "책자/제본", tag: "Book",          image: booklets,      accent: "oklch(0.62 0.21 285)" },
  { id: "flyer",    emoji: "🖼",  title: "전단지",   tag: "Flyer",         image: flyers,        accent: "oklch(0.65 0.18 200)" },
  { id: "leaflet",  emoji: "📄", title: "리플렛",   tag: "Leaflet",       image: brochures,     accent: "oklch(0.65 0.17 145)" },
  { id: "card",     emoji: "📰", title: "엽서/카드", tag: "Postcard",     image: postcards,     accent: "oklch(0.65 0.20 15)"  },
  { id: "sticker",  emoji: "🏷️", title: "스티커",   tag: "Sticker",       image: stickers,      accent: "oklch(0.75 0.18 85)",  disabled: true },
  { id: "namecard", emoji: "💳", title: "명함",     tag: "Business Card", image: businesscards, accent: "oklch(0.55 0.10 265)" },
];
// 배열에 추가/삭제하면 카드가 자동 생성·제거됨 (데이터 주도 원칙)
// disabled: true → 준비중 오버레이 + 토스트, 라우팅 없음
// 라우팅: onClick 내부 if/else 분기 — id로 navigate() 호출
```

---

## 파일 수정 방법 (AI용)

```
로컬 파일 읽기/쓰기: mcp__Desktop_Commander__read_file / write_file / edit_block
경로 예시: E:\printjob_money\project-source\src\components\landing\Products.tsx
```

**주의**: `Edit` 도구(Cowork 기본)는 세션 연결 폴더 외부 파일에 접근 불가.  
반드시 `mcp__Desktop_Commander__*` 도구를 사용할 것.

---

## 커밋 규칙

- 항목별 커밋 분리 (회귀 추적 용이)
- 형식: `feat:`, `fix:`, `refactor:` 접두사
- push 전 반드시 로컬 콘솔 에러 0 확인 후 보고
