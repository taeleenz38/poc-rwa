import Pricing from "@/app/components/organisms/Pricing";
import EQVPricing from "@/app/components/organisms/EQVPricing";

type FundManagementProps = {
  view: "VLR" | "EQV";
};

const FundManagement = ({ view }: FundManagementProps) => {
  return (
    <div className="text-black flex flex-col border-2 border-primary border-opacity-30 rounded-xl mb-36 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex justify-between items-center p-8">
        <h2 className="font-semibold text-primary text-sm md:text-base">
          {view === "VLR" ? "VLR Pricing (NAV)" : "EQV Pricing (NAV)"}
        </h2>
      </div>
      <div className="p-6">
        {view === "VLR" && <Pricing />}
        {view === "EQV" && <EQVPricing />}
      </div>
    </div>
  );
};

export default FundManagement;
