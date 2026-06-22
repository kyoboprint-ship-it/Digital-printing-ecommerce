import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { InteractiveProductDesk } from "@/components/landing/InteractiveProductDesk";
import { Products } from "@/components/landing/Products";
import { Workflow } from "@/components/landing/Workflow";
import { Paper } from "@/components/landing/Paper";
import { Quote } from "@/components/landing/Quote";
import { PortfolioGallery } from "@/components/landing/PortfolioGallery";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Printly — 아이디어를 인쇄하다 | 차세대 온라인 인쇄 플랫폼" },
      {
        name: "description",
        content:
          "디자이너의 책상처럼 직관적인 인쇄 워크스페이스. 제품 선택부터 용지, 후가공, 실시간 견적까지 한 곳에서.",
      },
      { property: "og:title", content: "Printly — 아이디어를 인쇄하다" },
      {
        property: "og:description",
        content:
          "Canva처럼 쉬운 제작 경험과 전문 인쇄 품질. 책상 위 인쇄물을 골라 즉시 견적을 확인하세요.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Nav />
      <main>
        <Hero />
        <InteractiveProductDesk />
        <Products />
        <Workflow />
        <Paper />
        <Quote />
        <PortfolioGallery />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
