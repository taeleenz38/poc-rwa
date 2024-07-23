import React from "react";

const FundDescription = () => {
  return (
    <div className="flex flex-col md:flex-row w-full mx-auto max-w-screen-xl py-8 md:py-14 px-8">
      <div className="w-full md:w-1/3">
        <p className="text-lg lg:text-2xl font-medium">
          ABBY is a tokenised Fund and is designed for investors seeking a
          secure, liquid, and low-risk investment option. The Fund primarily
          invests in high-quality Australian bank bills and other short-term
          money market instruments. Its objective is to provide investors with a
          stable return while preserving capital and maintaining high liquidity.
        </p>
      </div>
      <div className="w-full md:w-2/3 md:ml-20 mt-10 md:mt-0">
        {[
          {
            heading: "Fund Name",
            description: "Copiam ABBGY Fund",
          },
          {
            heading: "Manager",
            description: "Copiam ABBGY Fund",
          },
          {
            heading: "Trustee / Fund Administrator",
            description: "Polar 993",
          },
          {
            heading: "Prime Broker",
            description: "JPMAM / Hedge Fund",
          },
          {
            heading: "Investment vehicle",
            description: "Corporate Collective Investment Vehicle (CCIV)",
          },
          {
            heading: "Structure",
            description: "CCIV",
          },
          {
            heading: "Term",
            description: "Open ended",
          },
          {
            heading: "Investment type",
            description:
              "Portfolio of Australian Bank Bills &/or Government Bonds",
          },
          {
            heading: "Currency",
            description: "Australian Dollars",
          },
          {
            heading: "Investor eligibility",
            description:
              "Wholesale Investors (as defined in the Corporations Act)",
          },
        ].map(({ heading, description }, idx) => (
          <div key={idx} className="flex border-t last:border-b p-2">
            <h2 className="basis-1/3 font-semibold">{heading}</h2>
            <p className="basis-2/3 font-medium ml-5 md:ml-10">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundDescription;
