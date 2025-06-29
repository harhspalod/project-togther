import { Metadata } from "next";
import PageTitle from "@/components/shared/PageTitle";
import CampaignsList from "./_components/CampaignsList";
import CreateCampaignForm from "./_components/CreateCampaignForm";

export const metadata: Metadata = {
  title: "Campaigns",
};

export default function CampaignsPage() {
  return (
    <section>
      <PageTitle>Marketing Campaigns</PageTitle>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampaignsList />
        </div>
        <div>
          <CreateCampaignForm />
        </div>
      </div>
    </section>
  );
}