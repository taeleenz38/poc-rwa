"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  idDocument: string;
  idNumber: string;
  idExpiry: string;
  country: string;
  birthdate: string;
  walletAddress: string;
}

interface UserDocument {
  downloadUrl: string;
}

const Page = () => {
  // const router = useRouter();
  // const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingDocuments, setIsFetchingDocuments] = useState(true);
  const [username, setUsername] = useState("");

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [isLoggedIn, router]);

  // if (!isLoggedIn) {
  //   return null;
  // }

  // useEffect(() => {
  //   const user = localStorage.getItem("username");
  //   if (user) {
  //     setUsername(user);
  //   }
  // }, []);

  useEffect(() => {
    if (username) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(
            `https://api.tokenisation.gcp-hub.com.au/auth/profile?email=${username}`
          );
          console.log(response.data, "Profile data");
          setUserDetails(response.data);
          setIsFetching(false);
        } catch (err) {
          console.error("Failed to fetch profile data");
          setIsFetching(false);
        }
      };
      fetchUserDetails();
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      const fetchDocument = async () => {
        try {
          const response = await axios.get(
            `https://api.tokenisation.gcp-hub.com.au/contract-sign/download/link?email=${username}`
          );
          console.log(response.data, "Document data");
          setUserDocument(response.data);
          setIsFetchingDocuments(false);
        } catch (err) {
          console.error("Failed to fetch document");
          setIsFetchingDocuments(false);
        }
      };
      fetchDocument();
    }
  }, [username]);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col text-primary root-container">
        <h1 className="flex text-4xl font-semibold mb-4 items-center justify-start">
          Your Profile
        </h1>
        <h2 className="flex text-2xl font-normal items-center justify-start mb-4">
          Track and manage your information
        </h2>

        <div className="flex flex-row gap-x-16 mb-12">
          <div className="flex flex-col w-1/2 text-primary h-fit py-5 px-6 border borderColor">
            <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
              Account Details
            </h2>
            <div className="overflow-x-auto">
              <div className="bg-[#F5F2F2] text-primary py-4 font-bold"></div>
              {isFetching ? (
                <div className="text-center py-4">
                  <Skeleton height={26} className="w-full" />
                </div>
              ) : userDetails ? (
                <div className="text-primary p-3 mb-4">
                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                    <div className="font-semibold">First Name</div>
                    <div>{userDetails?.firstName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                    <div className="font-semibold">Last Name</div>
                    <div>{userDetails?.lastName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                    <div className="font-semibold">Email</div>
                    <div>{userDetails?.email}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                    <div className="font-semibold">Country</div>
                    <div>{userDetails?.country}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                    <div className="font-semibold">Date of Birth</div>
                    <div>{userDetails?.birthdate}</div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4">No account details found.</p>
              )}
            </div>
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="flex flex-col justify-start py-3 items-start px-4 border borderColor">
              <h2 className="text-2xl font-semibold flex items-center justify-start px-1">
                Overview
              </h2>
              <div className="flex flex-col justify-start py-2 items-start my-4 mx-2">
                <div className="border-l-4 border-[#C99383] px-3">
                  <div className="flex flex-col gap-y-5">
                    <>
                      <h3 className="text-lg">User Status - Active </h3>
                      <h3 className="text-lg">KYC Status - Complete </h3>
                    </>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end py-3 items-start my-4 px-4 border borderColor">
              <h2 className="text-2xl font-semibold flex items-center justify-start px-1">
                Notes
              </h2>
              <div className="flex flex-col justify-start py-2 items-start my-4 mx-2">
                <div className="border-l-4 border-[#C99383] px-3">
                  <div className="flex flex-col gap-y-5">
                    <div>
                      <h3 className="text-lg">&nbsp;</h3>
                      <h3 className="text-lg">&nbsp;</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-x-16 border borderColor">
          <div className="flex flex-col gap-y-4 w-1/2">
            <div className="flex flex-col w-full py-8 text-primary h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Documents
              </h2>
              <div className="overflow-x-auto">
                <div className="bg-[#F5F2F2] text-primary py-2 px-3 font-bold">
                  <h3>Submitted for KYC</h3>
                </div>
                {isFetching ? (
                  <div className="text-center py-4">
                    <Skeleton height={26} className="w-full" />
                  </div>
                ) : userDetails ? (
                  <div className="text-primary p-3 mb-4">
                    <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                      <div className="font-semibold">ID Document</div>
                      <div className="">{userDetails?.idDocument}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                      <div className="font-semibold">ID Number</div>
                      <div className="">{userDetails?.idNumber}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                      <div className="font-semibold">ID Expiry</div>
                      <div className="">{userDetails?.idExpiry}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                      <div className="font-semibold">Country</div>
                      <div className="">{userDetails?.country}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 py-2 border-b borderColor">
                      <div className="font-semibold">Date of Birth</div>
                      <div className="">{userDetails?.birthdate}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4">No document details found.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 w-1/2">
            <div className="flex flex-col w-full py-8 text-primary h-fit p-5">
              <div className="mb-11"></div>
              <div className="overflow-x-auto">
                <div className="bg-[#F5F2F2] text-primary py-2 px-3 font-bold">
                  <h3>Signed Documents</h3>
                </div>
                {isFetchingDocuments ? (
                  <div className="text-center py-4">
                    <Skeleton height={26} className="w-full" />
                  </div>
                ) : userDocument ? (
                  <div className="text-primary p-3 mb-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b borderColor py-2">
                      <div className="font-semibold px-0.5">Agreement</div>
                      <a
                        href={userDocument?.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-md text-[#007BFF] hover:text-[#0056b3]"
                      >
                        View Signed Document
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4">No signed documents found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
