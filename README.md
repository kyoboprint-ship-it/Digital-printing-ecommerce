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
│   ├── __root.tsx             # 루트 레이아웃 (Toaster 마운트됨)
│   ├── index.tsx              # 랜딩 페이지 (/)
│   ├── order.booklet.tsx      # 책자/제본 주문
│   ├── order.flyer.tsx        # 전단지 주문
│   ├── order.leaflet.tsx      # 리플렛 주문
│   ├── order.postcard.tsx     # 엽서/카드 주문
│   └── order.namecard.tsx     # 명함 주문
│
├── components/
│   └── landing/               # 랜딩 페이지 섹션 컴포넌트
│       ├── Nav.tsx            # 상단 네비게이션 + 모바일 햄버거 메뉴
│       ├── Hero.tsx           # 히어로 + 핫스팟 6종
│       ├── Products.tsx       # 제품 선택기 (6종 카드, 단독 진입점)
│       ├── Workflow.tsx       # 5단계 제작 과정
│       ├── Paper.tsx          # 용지 소개
│       ├── Quote.tsx          # 실시간 견적 데모
│       ├── PortfolioGallery.tsx
│       ├── CTA.tsx
│       └── Footer.tsx
│
├── hooks/
│   └── useInView.ts           # IntersectionObserver 스크롤 애니메이션 훅
│
├── assets/                    # 이미지 에셋 (→ Unsplash 임시 URL 사용 중)
└── styles.css                 # 디자인 토큰 (oklch 색상 시스템)
```

---

## 랜딩 섹션 순서 (확정)

```
Nav → Hero → #products → #workflow → #paper → #quote → #portfolio → #cta → Footer
```

> `#workspace`(InteractiveProductDesk)는 PM-DEV-LANDING-UX-02 B안 확정으로 제거됨.  
> 모든 상품 진입은 `#products`(Products.tsx) 단독 처리.

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
| `sticker` | 스티커 | 미구현 | ⏳ 준비중 (토스트만) |
| `namecard` | 명함 | `/order/namecard` | ✅ |

---

## 이미지 현황

현재 모든 이미지는 **Unsplash 임시 URL**을 사용합니다 (실사 촬영 전 단계).  
교체 시 각 컴포넌트 상단 URL 상수만 바꾸면 됩니다.

| 컴포넌트 | 상수명 | 교체 대상 |
|---|---|---|
| `Hero.tsx` | `heroImg` | 인쇄물 배치 이미지 |
| `Products.tsx` | `booklets`, `flyers` 등 | 각 제품 1:1 이미지 |
| `Paper.tsx` | `paperImg` | 용지 질감 클로즈업 |
| `PortfolioGallery.tsx` | `IMG.*` | 포트폴리오 작업물 5종 |

---

## 주요 스크립트

```bash
npm run dev      # 개발 서버 (포트 5175)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run format   # Prettier 포맷
```

---

## 상세 개발 현황

→ **`DEVLOG.md`** 참조
