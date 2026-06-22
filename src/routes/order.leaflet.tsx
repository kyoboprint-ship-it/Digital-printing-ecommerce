import { createFileRoute } from "@tanstack/react-router";
import { PaperOrderPage } from "@/components/order/PaperOrderPage";

export const Route = createFileRoute("/order/leaflet")({
  component: LeafletOrderPage,
  head: () => ({
    meta: [
      { title: "리플렛 주문 — Printly" },
      { name: "description", content: "접지형 리플렛·안내물. 규격·접지·용지를 선택하면 실시간 견적이 표시됩니다." },
    ],
  }),
});

function LeafletOrderPage() {
  return <PaperOrderPage productType="leaflet" showFoldStep />;
}
