import React from "react";
import Skeleton from "react-loading-skeleton";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  birthdate: string;
}

interface UserDetailsCardProps {
  userDetails?: UserDetails | null;
  isFetching: boolean;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({
  userDetails,
  isFetching,
}) => {
  return (
    <div className="flex flex-col w-full md:w-1/2 h-fit py-5 px-6">
      <div className="overflow-x-auto">
        {isFetching ? (
          <div className="text-center py-4">
            <Skeleton height={26} className="w-full" />
          </div>
        ) : !userDetails ? (
          <p className="text-center py-4">No account details found.</p>
        ) : (
          <div className="p-3 mb-4">
            <DetailRow label="First Name" value={userDetails.firstName} />
            <DetailRow label="Last Name" value={userDetails.lastName} />
            <DetailRow label="Email" value={userDetails.email} />
            <DetailRow label="Country" value={userDetails.country} />
            <DetailRow
              label="Date of Birth"
              value={userDetails.birthdate}
              noBorder
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  noBorder?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, noBorder }) => (
  <div
    className={`grid grid-cols-2 gap-x-4 py-6 ${
      noBorder ? "" : "border-b borderColor"
    }`}
  >
    <div className="font-semibold text-sm">{label}</div>
    <div className="text-sm break-all">{value}</div>
  </div>
);

export default UserDetailsCard;
