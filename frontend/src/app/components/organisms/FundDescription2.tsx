import React from "react";

const FundDescription = () => {
  return (
    <div className="flex flex-col md:flex-row w-full mx-auto max-w-screen-xl py-8 md:py-14 px-8 text-secondary">
      <div className="w-full md:w-1/3">
        <p className="text-base lg:text-lg  text-left">
          AEMF is a tokenised Fund and is designed for investors seeking a
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
            description: "Block Majority Australian Emerging Markets Fund",
          },
          {
            heading: "Fund Structure",
            description: "The Fund is structured as a Managed Investment Trust",
          },
          {
            heading: "Trustee",
            description: "Block Majority Pty Ltd (ACN 636 227 980)",
          },
          {
            heading: "Units",
            description:
              "Issued as AEMF tokens minted on the Sepolia Testnet blockchain",
          },
          {
            heading: "Subscription Website",
            description: "blockmajority.io",
          },
          {
            heading: "Investment Strategy",
            description:
              "To invest in a diversified portfolio of Australian emerging market assets, including equities and debt instruments",
          },
          {
            heading: "Investor Eligibility",
            description:
              "Open to wholesale investors and strategic partners of Block Majority",
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
              "The Subscription and Redemption Price of AEMF tokens is calculated weekly by the Trustee and posted on the blockmajority.io website. The price reflects the Net Asset Value (NAV) of the Fund, adjusted for fees and expenses.",
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
            <h2 className="basis-1/3 p-2 ">{heading}</h2>
            <p className="basis-2/3 p-2 font-sm ml-5 md:ml-10">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundDescription;
