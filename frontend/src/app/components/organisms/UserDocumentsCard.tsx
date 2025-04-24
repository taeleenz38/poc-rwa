import React from "react";
import Skeleton from "react-loading-skeleton";

interface UserDetails {
  idDocument?: string;
  idNumber?: string;
  idExpiry?: string;
  country?: string;
  birthdate?: string;
}

interface UserDocumentsCardProps {
  userDetails?: UserDetails | null;
  isFetching: boolean;
}

const UserDocumentsCard: React.FC<UserDocumentsCardProps> = ({
  userDetails,
  isFetching,
}) => {
  return (
    <div className="flex flex-col gap-y-4 w-full md:w-1/2">
      <div className="flex flex-col w-full py-8 h-fit p-5">
        <div className="overflow-x-auto">

          {isFetching ? (
            <div className="text-center py-4">
              <Skeleton height={26} className="w-full" />
            </div>
          ) : !userDetails ? (
            <p className="text-center py-4">No document details found.</p>
          ) : (
            <div className="p-3 mb-4">
              <DocumentRow label="ID Document" value={userDetails.idDocument} />
              <DocumentRow label="ID Number" value={userDetails.idNumber} />
              <DocumentRow label="ID Expiry" value={userDetails.idExpiry} />
              <DocumentRow label="Country" value={userDetails.country} />
              <DocumentRow
                label="Date of Birth"
                value={userDetails.birthdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DocumentRowProps {
  label: string;
  value?: string;
}

const DocumentRow: React.FC<DocumentRowProps> = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-x-4 py-6 border-b borderColor">
    <div className="font-semibold text-sm">{label}</div>
    <div className="text-sm">{value || "N/A"}</div>
  </div>
);

export default UserDocumentsCard;
