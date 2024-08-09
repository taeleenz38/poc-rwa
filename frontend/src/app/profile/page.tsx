"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { config } from "@/config";
import axios from "axios";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

const Page = () => {
  const [profileData, setProfileData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const { address } = useAccount({ config });
  const [username, setUsername] = useState("");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      const fetchProfileData = async () => {
        try {
          const response = await axios.get(
            `https://api.tokenisation.gcp-hub.com.au/auth/profile?email=${username}`
          );
          setProfileData(response.data);
          setIsFetching(false);
        } catch (err) {
          setError("Failed to fetch profile data");
          setIsFetching(false);
        }
      };
      fetchProfileData();
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
          <div className="flex flex-col w-1/2 text-primary h-fit py-5 px-6 border border-gray">
            <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
              Account Details
            </h2>
            <div className="overflow-x-auto">
              <div className="bg-[#F5F2F2] text-primary py-4 font-bold"></div>
              {/* {isFetching ? ( */}
              {/* <div className="text-center py-4">
          <Skeleton height={26} className="w-full" />
        </div> */}
              {/* ) : ( */}
              {/* Key section */}
              <div className="text-primary p-3 mb-4">
                {/* Keys and values */}
                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                  <div className="font-semibold">First Name</div>
                  <div>Ted</div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                  <div className="font-semibold">Last Name</div>
                  <div>Hansen</div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                  <div className="font-semibold">Email</div>
                  <div>Ted.Hansen@gmail.com</div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                  <div className="font-semibold">Country</div>
                  <div>Australia</div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                  <div className="font-semibold">Date of Birth</div>
                  <div>01/01/2000</div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                  <div className="font-semibold">Submitted ID for KYC</div>
                  <div>Driver license -18208489</div>
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="flex flex-col justify-start py-3 items-start mb-4 px-4 border border-gray">
              <h2 className="text-2xl font-semibold flex items-center justify-start px-1">
                Overview
              </h2>
              <div className="flex flex-col justify-start py-2 items-start my-4 mx-2">
                <div className="border-l-4 border-[#C99383] px-3">
                  <div className="flex flex-col gap-y-5">
                    <>
                      {/* {isFetching ? ( */}
                      {/* <>
                      <Skeleton height={30} className="w-full" />
                    </>
                  ) : ( */}
                      <h3 className="text-lg">User Status - Active </h3>
                      <h3 className="text-lg">KYC Status - Complete </h3>
                      {/* )} */}
                    </>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end py-3 items-start my-4 px-4 border border-gray">
              <h2 className="text-2xl font-semibold flex items-center justify-start px-1">
                Notes
              </h2>
              <div className="flex flex-col justify-start py-2 items-start my-4 mx-2">
                <div className="border-l-4 border-[#C99383] px-3">
                  <div className="flex flex-col gap-y-5">
                    <div>
                      <h3 className="text-lg">&nbsp;</h3>
                      <h3 className="text-lg">&nbsp;</h3>
                      <h3 className="text-lg">&nbsp;</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-x-16 border border-gray">
          <div className="flex flex-col gap-y-4 w-1/2">
            <div className="flex flex-col w-full py-8 text-primary h-fit p-5">
              <h2 className="flex font-bold text-xl mb-4 justify-start items-center">
                Documents
              </h2>
              <div className="overflow-x-auto">
                <div className="bg-[#F5F2F2] text-primary py-2 px-3 font-bold">
                  <h3>Submitted for KYC</h3>
                </div>
                <div className="text-primary p-3 mb-4">
                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                    <div className="font-semibold">ID Document</div>
                    <div className="">Driver License</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                    <div className="font-semibold">ID Number</div>
                    <div className="">18208489</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                    <div className="font-semibold">Expiry</div>
                    <div className="">10/6/2028</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                    <div className="font-semibold">Country</div>
                    <div className="">Australia</div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-300">
                    <div className="font-semibold">Date of Birth</div>
                    <div className="">01/01/2000</div>
                  </div>
                </div>
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
                <div className="text-primary p-3 mb-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-gray py-2">
                    <div className="font-semibold px-0.5">Agreement</div>
                    <a
                      href="https://sumsub.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007BFF] hover:text-[#0056b3]"
                    >
                      https://sumsub.com/{" "}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
