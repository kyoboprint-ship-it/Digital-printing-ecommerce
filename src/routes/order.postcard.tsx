import { createFileRoute } from "@tanstack/react-router";
import { PaperOrderPage } from "@/components/order/PaperOrderPage";

export const Route = createFileRoute("/order/postcard")({
  component: PostcardOrderPage,
  head: () => ({
    meta: [
      { title: "카드/엽서 주문 — Printly" },
      { name: "description", content: "엽서·카드 제작. 크기·수량·용지를 선택하면 실시간으로 견적이 표시됩니다." },
    ],
  }),
});

function PostcardOrderPage() {
  return <PaperOrderPage productType="postcard" showSubTypeStep />;
}
