import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for the AccountStatusResponse
interface AccountStatusResponse {
  termIndex: string;
  account: string;
  status: boolean;
}

const AllowlistWallets: React.FC = () => {
  const [wallets, setWallets] = useState<AccountStatusResponse[]>([]);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axios.get<AccountStatusResponse[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/account-status`
        );
        setWallets(response.data);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    fetchWallets();
  }, []);

  return (
    <div className="w-full h-3/4 p-4 mx-auto text-primary bg-white flex flex-col mt-8 rounded-md bg-right-bottom">
      <div className="text-3xl font-semibold mb-6 text-center mt-4">
        Currently Added Wallets To Allowlist
      </div>
      <div className="flex flex-col gap-y-3 h-[80vh] overflow-y-scroll rounded-md p-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.account}
            className="bg-primary text-light p-4 rounded-md flex justify-between items-center"
          >
            <div className="flex flex-col">
              <div className="font-semibold text-lg">{wallet.account}</div>
              <div className="text-sm text-gray-500">
                Status: {wallet.status ? "Active" : "Inactive"}
              </div>
            </div>
            <div><strong>AUDY</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllowlistWallets;
