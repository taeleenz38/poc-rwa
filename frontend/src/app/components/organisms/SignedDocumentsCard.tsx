import React from "react";
import Skeleton from "react-loading-skeleton";

interface UserDocument {
  downloadUrl: string;
}

interface SignedDocumentsCardProps {
  isFetchingDocuments: boolean;
  userDocument?: UserDocument | null;
}

const SignedDocumentsCard: React.FC<SignedDocumentsCardProps> = ({
  isFetchingDocuments,
  userDocument,
}) => {
  return (
    <div className="flex flex-col gap-y-4 w-full md:w-1/2">
      <div className="flex flex-col w-full py-8 h-fit p-5">
        <div className="overflow-x-auto">
          {isFetchingDocuments ? (
            <div className="text-center py-4">
              <Skeleton height={26} className="w-full" />
            </div>
          ) : !userDocument ? (
            <p className="text-center py-4 text-sm">
              No signed documents found.
            </p>
          ) : (
            // <div className="p-3 mb-4">
            //   <div className="grid grid-cols-2 gap-x-4 border-b borderColor">
            //     <div className="font-semibold py-6 text-sm">Agreement</div>
            //     <div className="flex items-center py-6">
            //       <a
            //         href={userDocument.downloadUrl}
            //         target="_blank"
            //         rel="noopener noreferrer"
            //         className="text-md text-primary hover:text-secondary-focus text-sm"
            //       >
            //         View Signed Document
            //       </a>
            //     </div>
            //   </div>
            // </div>
            <div className="flex flex-col py-3 items-start px-4">
              <h2 className="text-xl font-bold flex items-center justify-start px-1 text-primary">
                Agreement
              </h2>
              <div className="flex flex-col justify-center items-start my-4 mx-2">
                <div className="border-l-4 border-primary px-3">
                  <div className="flex flex-col gap-y-2">
                    <div>
                      <a
                        href={userDocument.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-md text-primary hover:text-secondary-focus text-sm"
                      >
                        View Signed Document
                      </a>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg">&nbsp;</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignedDocumentsCard;
