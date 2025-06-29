import { Fragment } from "react";
import { Metadata } from "next";
import PageTitle from "@/components/shared/PageTitle";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <Fragment>
      <section>
        <PageTitle>Dashboard Overview</PageTitle>
        <AnalyticsCharts />
      </section>
    </Fragment>
  );
}