import { createFileRoute } from "@tanstack/react-router";
import { PaperOrderPage } from "@/components/order/PaperOrderPage";

export const Route = createFileRoute("/order/flyer")({
  component: FlyerOrderPage,
  head: () => ({
    meta: [
      { title: "전단지 주문 — Printly" },
      { name: "description", content: "A4/A5/B5 전단지. 크기·수량·용지를 선택하면 실시간으로 견적이 표시됩니다." },
    ],
  }),
});

function FlyerOrderPage() {
  return <PaperOrderPage productType="flyer" />;
}
