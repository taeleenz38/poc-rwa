import React from "react";
import Image from "next/image";

interface HomepageCardProps {
  src: string;
  title: string;
  description: string;
}

const HomepageCard: React.FC<HomepageCardProps> = ({
  src,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center w-[340px] p-10 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <Image src={src} alt={title} width={300} height={300} />
      <h2 className="text-xl font-bold mt-10">{title}</h2>
      <h3 className="text-md text-secondary text-center mt-4">{description}</h3>
    </div>
  );
};

export default HomepageCard;
