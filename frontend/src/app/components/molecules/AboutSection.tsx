import React from "react";
import Image from "next/image";

const AboutSection = () => {
  return (
    <div className="flex flex-col pt-4 pb-10 md:pt-20 md:pb-20 items-center text-secondary bg-gray-50 mx-2">
      <h2 className="text-4xl font-semibold mb-12">About Block Majority</h2>
      <div className="border-2 border-primary border-opacity-30 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-20 max-w-4xl w-full">
        <div className="flex justify-between items-center gap-4 mb-20">
          <p className="w-4/5 text-lg sm:text-xl text-gray-700 leading-relaxed px-1 text-left">
            Block Majority&apos;s vision is to be the world&apos;s leading
            provider of FX and Debt Security liquidity to the main stakeholders
            in the digital asset ecosystem who trade in native digital “crypto”
            assets.
          </p>
          <Image src="/crypto.png" alt="about-1" width={100} height={100} />
        </div>
        <div className="flex justify-between justify-items-end items-center gap-4 mb-20">
          <Image src="/exchange.png" alt="about-1" width={100} height={100} />
          <p className="w-4/5 text-lg sm:text-xl text-gray-700 leading-relaxed px-1 text-right">
            These stakeholders are predominantly Digital Asset Exchanges (DAEs),
            but also Digital Asset Projects, Digital Asset Custodians,
            specialist Digital Asset Funds, and Wholesale Digital Asset
            Investors who trade in or manage native digital assets.
          </p>
        </div>
        <div className="flex justify-between items-center gap-4">
          <p className="w-4/5 text-lg sm:text-xl text-gray-700 leading-relaxed px-1 text-left">
            The sheer number of investors in crypto now and associated trading
            volumes globally, plus the “normalisation” of crypto as an asset
            class (evidenced by various regulatory announcements), highlight a
            very active ecosystem currently underserved by Banks and the broader
            financial services industry due to prudential regulatory constraints
            and disruptive threats.
          </p>
          <Image src="/rules.png" alt="about-1" width={100} height={100} />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
