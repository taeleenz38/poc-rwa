import React from "react";

const AllowlistWallets = () => {
  return (
    <div className="w-full h-3/4 p-4 mx-auto text-primary bg-white  flex flex-col mt-8 rounded-md bg-hero-pattern bg-no-repeat bg-right-bottom">
      <div className="text-3xl font-semibold mb-6 text-center mt-4">
        Currently Added Wallets To AYF Allowlist
      </div>
      <div className="flex flex-col gap-y-2 h-[80vh] overflow-y-scroll border-2 border-gray rounded-md p-4 "></div>
    </div>
  );
};

export default AllowlistWallets;
