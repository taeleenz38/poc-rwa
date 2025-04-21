import React from "react";

const FundDescription = () => {
  return (
    <div className="flex md:flex-col w-full mx-auto max-w-screen-xl py-8 md:py-14 px-8 text-secondary">
        {[
          {
            heading: "Fund Name",
            description: "Equivest Asian Emerging Markets Fund",
          },
          {
            heading: "Fund Structure",
            description: "The Fund is structured as a Managed Investment Trust",
          },
          {
            heading: "Trustee",
            description: "Equivest Pty Ltd (ACN 636 227 980)",
          },
          {
            heading: "Units",
            description:
              "Issued as EQV tokens minted on the Sepolia Testnet blockchain",
          },
          {
            heading: "Subscription Website",
            description: "equivest.io",
          },
          {
            heading: "Investment Strategy",
            description:
              "To invest in a diversified portfolio of Australian emerging market assets, including equities and debt instruments",
          },
          {
            heading: "Investor Eligibility",
            description:
              "Open to wholesale investors and strategic partners of Equivest",
          },
          {
            heading: "Liquidity",
            description: "Weekly Subscription and Redemption",
          },
          {
            heading: "Minimum and Maximum Subscription and Redemption amounts",
            description:
              "$250,000 AUD per investor, limited initially to a total of $1,000,000 AUD",
          },
          {
            heading: "Subscription and Redemption Price",
            description:
              "The Subscription and Redemption Price of EQV tokens is calculated weekly by the Trustee and posted on the blockmajority.io website. The price reflects the Net Asset Value (NAV) of the Fund, adjusted for fees and expenses.",
          },
          {
            heading: "Distributions",
            description:
              "Distributions may be paid quarterly, depending on Fund performance, or reinvested at the discretion of the Trustee.",
          },
          {
            heading: "Fees and Expenses",
            description:
              "Issuance Fee: 0.50% of the Subscription Amount Redemption Fee: 0.50% of the Redemption Amount",
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
