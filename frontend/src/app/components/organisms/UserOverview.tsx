import React from "react";
import Skeleton from "react-loading-skeleton";

interface UserDetails {
  walletAddress?: string;
}

interface UserOverviewCardProps {
  userStatus: string;
  isFetchingStatus: boolean;
  userDetails?: UserDetails | null;
}

const UserOverviewCard: React.FC<UserOverviewCardProps> = ({
  userStatus,
  isFetchingStatus,
  userDetails,
}) => {
  return (
    <div className="w-full md:w-1/2 flex flex-col mt-5 py-6 md:mt-0">
      {/* Overview Section */}
      <div className="flex flex-col py-3 items-start px-4">
        <h2 className="text-xl font-bold flex items-center justify-start px-1 text-primary">
          Overview
        </h2>
        <div className="flex flex-col items-start my-4 mx-2">
          <div className="border-l-4 border-primary px-3">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-2 w-full">
                <StatusRow
                  label="User Status"
                  isLoading={isFetchingStatus}
                  value={userStatus}
                />
                <StatusRow
                  label="KYC Status"
                  isLoading={isFetchingStatus}
                  value={userStatus === "Active" ? "Completed" : "Pending"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eligible Investments Section */}
      <div className="flex flex-col items-start px-4">
        <h2 className="text-xl font-bold flex items-center justify-start px-1 text-primary">
          Eligible Funds
        </h2>
        <div className="flex flex-col items-start my-4 mx-2">
          <div className="border-l-4 border-primary px-3">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-2 w-full">
                <StatusRow
                  label="Velora"
                  isLoading={isFetchingStatus}
                  value={userStatus === "Active" ? "Eligible" : "Pending"}
                />
                <StatusRow
                  label="Equivest"
                  isLoading={isFetchingStatus}
                  value={userStatus === "Active" ? "Eligible" : "Pending"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Address Section */}
      <div className="flex flex-col py-3 items-start px-4">
        <h2 className="text-xl font-bold flex items-center justify-start px-1 text-primary">
          Wallet Address
        </h2>
        <div className="flex flex-col justify-center items-start my-4 mx-2">
          <div className="border-l-4 border-primary px-3">
            <div className="flex flex-col gap-y-2">
              <div>
                <h3 className="text-sm break-all">
                  {userDetails?.walletAddress || "N/A"}
                </h3>
              </div>
            </div>
          </div>
          <h3 className="text-lg">&nbsp;</h3>
        </div>
      </div>
    </div>
  );
};

interface StatusRowProps {
  label: string;
  isLoading: boolean;
  value: string;
}

const StatusRow: React.FC<StatusRowProps> = ({ label, isLoading, value }) => (
  <h3>
    <span className="text-sm font-semibold">{label} - </span>
    {isLoading ? (
      <Skeleton height={26} className="w-full" />
    ) : (
      <span className="text-sm">{value}</span>
    )}
  </h3>
);

export default UserOverviewCard;
