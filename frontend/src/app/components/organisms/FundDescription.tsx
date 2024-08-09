import React from "react";

const FundDescription = () => {
  return (
    <div className="flex flex-col md:flex-row w-full mx-auto max-w-screen-xl py-8 md:py-14 px-8 text-black">
      <div className="w-full md:w-1/3">
        <p className="text-base lg:text-lg font-semibold text-left">
          AYF is a tokenised Fund and is designed for investors seeking a
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
            description: "Stage 1 Copiam Australian Yield Fund",
          },
          {
            heading: "Fund Structure",
            description: "The Fund is structured as a Bare Trust",
          },
          {
            heading: "Trustee",
            description: "Copiam Pty Ltd (ACN 636 227 980)",
          },
          {
            heading: "Units",
            description:
              "Issued as AYF tokens minted on the Sepolia Testnet blockchain",
          },
          {
            heading: "Subscription Website",
            description: "copiam.io",
          },
          {
            heading: "Investment Strategy",
            description:
              "To invest in Australian bank bills or equivalent risk/return cash investment products",
          },
          {
            heading: "Investor Eligibility",
            description:
              "Only open for investment by Copiam executives and Copiam strategic partners",
          },
          {
            heading: "Liquidity",
            description: "Daily Subscription and Redemption",
          },
          {
            heading: "Minimum and Maximum Subscription and Redemption amounts",
            description:
              "A$1,000 per investor, limited initially to a total of A$150,000",
          },
          {
            heading: "Subscription and Redemption Price",
            description:
              "The Subscription and Redemption Price of AYF tokens is calculated by the Trustee on a daily basis and posted on the copiam.io website. The Subscription Price is determined as the Net Asset Value (NAV) of the Fund less accrued platform fees, divided by the number of AYF tokens issued. The NAV is the total value of the Fund's assets minus its liabilities. ",
          },
          {
            heading: "Distributions",
            description:
              "It is the intention to not pay distributions. All distributions of the underlying Fund assets are reinvested back into the Fund. ",
          },
          {
            heading: "Management Fee",
            description: "0.20% per annum paid quarterly in arrears ",
          },
        ].map(({ heading, description }, idx) => (
          <div key={idx} className="flex border-t last:border-b p-2">
            <h2 className="basis-1/3 p-2 font-semibold">{heading}</h2>
            <p className="basis-2/3 p-2 font-medium ml-5 md:ml-10">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundDescription;
