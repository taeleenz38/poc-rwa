import React from "react";

const AboutSection = () => {
  return (
    <div className="flex flex-col pt-4 pb-10 md:pt-20 md:pb-12 items-center bg-gray-50 mx-2">
      <h2 className="text-4xl font-semibold text-primary mb-12">
        About Copiam
      </h2>
      <div className="border borderColor rounded-sm shadow-lg p-10 max-w-4xl w-full text-center">
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8 px-1">
          Copiam&apos;s vision is to be the world&apos;s leading provider of FX
          and Debt Security liquidity to the main stakeholders in the digital
          asset ecosystem who trade in native digital “crypto” assets.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8 px-1">
          These stakeholders are predominantly Digital Asset Exchanges (DAEs),
          but also Digital Asset Projects, Digital Asset Custodians, specialist
          Digital Asset Funds, and Wholesale Digital Asset Investors who trade
          in or manage native digital assets.
        </p>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed px-1">
          The sheer number of investors in crypto now and associated trading
          volumes globally, plus the “normalisation” of crypto as an asset class
          (evidenced by various regulatory announcements), highlight a very
          active ecosystem currently underserved by Banks and the broader
          financial services industry due to prudential regulatory constraints
          and disruptive threats.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
