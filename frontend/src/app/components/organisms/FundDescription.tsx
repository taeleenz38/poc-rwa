import React from "react";

const FundDescription = () => {
  return (
    <div className="flex md:flex-col w-full mx-auto max-w-screen-xl py-8 md:py-14 px-8 text-secondary">
      {[
        {
          heading: "Fund Name",
          description: "Stage 1 Velora Australian Yield Fund",
        },
        {
          heading: "Fund Structure",
          description: "The Fund is structured as a Bare Trust",
        },
        {
          heading: "Trustee",
          description: "Velora Pty Ltd (ACN 636 227 980)",
        },
        {
          heading: "Units",
          description:
            "Issued as VLR tokens minted on the Sepolia Testnet blockchain",
        },
        {
          heading: "Subscription Website",
          description: "velora.io",
        },
        {
          heading: "Investment Strategy",
          description:
            "To invest in Australian bank bills or equivalent risk/return cash investment products",
        },
        {
          heading: "Investor Eligibility",
          description:
            "Only open for investment by Velora executives and Velora strategic partners",
        },
        {
          heading: "Liquidity",
          description: "Daily Subscription and Redemption",
        },
        {
          heading: "Minimum and Maximum Subscription and Redemption amounts",
          description:
            "$100,000 AUD per investor, limited initially to a total of $5,000,000 AUD",
        },
        {
          heading: "Subscription and Redemption Price",
          description:
            "The Subscription and Redemption Price of VLR tokens is calculated by the Trustee on a daily basis and posted on the blockmajority.io website. The Subscription Price is determined as the Net Asset Value (NAV) of the Fund less accrued platform fees, divided by the number of VLR tokens issued. The NAV is the total value of the Fund's assets minus its liabilities.The VLR Token Price is calculated daily by the Trustee as the Net Asset Value (NAV) of The VLR Fund less accrued platform fees, divided by the number of VLR Tokens. The Trustee connects their wallet to VLR Pricing Contract sets the price every day at 3 pm AEST",
        },
        {
          heading: "Distributions",
          description:
            "It is the intention to not pay distributions. All distributions of the underlying Fund assets are reinvested back into the Fund. ",
        },
        {
          heading: "Fees and Expenses",
          description:
            "Issuance Fee: 0.20% of the Subscription Amount Redemption Fee: 0.20% of the Redemption Amount",
        },
      ].map(({ heading, description }, idx) => (
        <div key={idx} className="flex border-t last:border-b p-2">
          <h2 className="font-bold basis-1/3 p-2 ">{heading}</h2>
          <p className="basis-2/3 p-2 font-sm ml-5 md:ml-10">{description}</p>
        </div>
      ))}
    </div>
  );
};

export default FundDescription;
