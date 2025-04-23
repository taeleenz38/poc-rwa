import React from "react";
import Image from "next/image";

interface FundInfoCardProps {
  src: string;
  title: string;
  description: string;
}

const FundInfoCard: React.FC<FundInfoCardProps> = ({
  src,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center w-[360px] p-6 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <Image src={src} alt={title} width={40} height={40} />
      <h2 className="text-xl font-medium mt-6 text-center text-primary">{title}</h2>
      <h3 className="text-md text-secondary text-center mt-4">{description}</h3>
    </div>
  );
};

export default FundInfoCard;
