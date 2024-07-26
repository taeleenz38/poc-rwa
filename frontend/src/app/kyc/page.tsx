import React from "react";
import KycDetails from "../components/organisms/KycDetails";
import {
  EthIcon,
  SolanaIcon,
  LiquidIcon,
  BaseIcon,
  MoonbeamIcon,
} from "../components/atoms/Icons";

type Props = {};

const KYC = (props: Props) => {
  return (
    <KycDetails
      logoSrc="/LOGO.png"
      altText="Fund logo"
      fundName="AYF"
      fundDescription="Copiam Australian Dollar Yield"
      yieldText="Verify your identity and onboard to Copiam"
    />
  );
};

export default KYC;
