# Printly — Frontend

온라인 인쇄 플랫폼 Printly의 프론트엔드 소스코드입니다.

**Stack**: React 19 · TanStack Router · TailwindCSS v4 · Vite · TypeScript

---

## 빠른 시작

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5175` 접속.

> **참고**: 주문 페이지(`/order/*`)는 백엔드 API(포트 7100)가 필요합니다.  
> **랜딩 페이지(`/`)는 API 없이 완전히 동작합니다.**

---

## 프로젝트 구조

```
src/
├── routes/
│   ├── index.tsx              # 랜딩 페이지 (/)
│   ├── order.booklet.tsx      # 책자/제본 주문
│   ├── order.flyer.tsx        # 전단지 주문
│   ├── order.leaflet.tsx      # 리플렛 주문
│   ├── order.postcard.tsx     # 엽서/카드 주문
│   └── order.namecard.tsx     # 명함 주문
│
├── components/
│   └── landing/               # 랜딩 페이지 섹션 컴포넌트 (12개)
│       ├── Nav.tsx
│       ├── Hero.tsx           # 히어로 + 핫스팟 6종
│       ├── Products.tsx       # 제품 카드 6종
│       ├── Workflow.tsx
│       ├── Paper.tsx
│       ├── Quote.tsx
│       ├── PortfolioGallery.tsx
│       ├── CTA.tsx
│       └── Footer.tsx
│
├── assets/                    # 이미지 에셋
└── styles.css                 # 디자인 토큰 (oklch 색상 시스템)
```

---

## 디자인 시스템

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-brand` | `oklch(0.62 0.21 285)` | 버튼, 포인트 컬러 |
| `--color-ink` | `oklch(0.2 0.02 285)` | 본문 텍스트 |
| `--color-canvas` | `oklch(1 0 0)` | 페이지 배경 |
| `--color-paper-muted` | `oklch(0.975 0.008 285)` | 카드·섹션 배경 |
| `--gradient-brand` | `135deg, purple → violet` | CTA, 배지, 아이콘 |

폰트: **Pretendard** (한글) + Instrument Sans (영문 fallback)

---

## 제품 6종

| ID | 한글명 | 라우트 | 상태 |
|---|---|---|---|
| `book` | 책자/제본 | `/order/booklet` | ✅ |
| `flyer` | 전단지 | `/order/flyer` | ✅ |
| `leaflet` | 리플렛 | `/order/leaflet` | ✅ |
| `card` | 엽서/카드 | `/order/postcard` | ✅ |
| `sticker` | 스티커 | 미구현 | ⏳ 준비중 |
| `namecard` | 명함 | `/order/namecard` | ✅ |

---

## 이미지 교체 대상

`src/assets/` 안의 아래 파일들을 교체하면 됩니다:

| 파일명 | 위치 | 비고 |
|---|---|---|
| `hero-desk.jpg` | 히어로 섹션 | 6종 인쇄물 배치 이미지 |
| `product-booklets.jpg` | 제품 카드 | 1:1 비율 |
| `product-flyers.jpg` | 제품 카드 | 1:1 비율 |
| `product-brochures.jpg` | 제품 카드 | 1:1 비율 (리플렛) |
| `product-postcards.jpg` | 제품 카드 | 1:1 비율 |
| `product-stickers.jpg` | 제품 카드 | **신규 추가 필요** |
| `product-businesscards.jpg` | 제품 카드 | 1:1 비율 |
| `paper-texture.jpg` | 용지 섹션 | 4:5 비율 |
| `portfolio-*.jpg` | 포트폴리오 | 4:5 비율, 5종 |

> `product-stickers.jpg`는 아직 없습니다. 추가 후 `Products.tsx` 상단 import를 교체하세요.

---

## 주요 스크립트

```bash
npm run dev      # 개발 서버 (포트 5175)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run format   # Prettier 포맷
```

---

## 디자인 지시서

Figma 작업을 위한 상세 디자인 지시서(`Printly_랜딩페이지_Figma_디자인_지시서_v2.docx`)를 참고하세요.
