import { Metadata } from "next";
import PageTitle from "@/components/shared/PageTitle";
import TriggeredDiscountsList from "./_components/TriggeredDiscountsList";

export const metadata: Metadata = {
  title: "Triggered Discounts",
};

export default function TriggeredDiscountsPage() {
  return (
    <section>
      <PageTitle>Triggered Discounts</PageTitle>
      <TriggeredDiscountsList />
    </section>
  );
}