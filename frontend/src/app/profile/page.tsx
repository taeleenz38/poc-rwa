"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { config } from "@/config";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import UserDetailsCard from "../components/organisms/UserDetailsCard";
import UserOverviewCard from "../components/organisms/UserOverview";
import UserDocumentsCard from "../components/organisms/UserDocumentsCard";
import SignedDocumentsCard from "../components/organisms/SignedDocumentsCard";

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
  const account = useAccount({
    config,
  });
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingDocuments, setIsFetchingDocuments] = useState(true);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState<"Active" | "Inactive">(
    "Inactive"
  );

  const fetchUserStatus = async (user: string) => {
    try {
      setIsFetchingStatus(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/status?email=${user}`
      );
      if (response.status === 200 || 201) {
        if (response.data.isActive === true) {
          setUserStatus("Active");
        } else {
          setUserStatus("Inactive");
        }
      }
    } catch (err) {
      console.error("Failed to fetch status ", err);
      localStorage.setItem("UserStatus", "Inactive");
      setUserStatus("Inactive");
    } finally {
      setIsFetchingStatus(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setUsername(user);
      fetchUserStatus(user);
    }
  }, []);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/contract-sign/download/link?email=${username}`
      );
      console.log(response.data, "Document data");
      setUserDocument(response.data);
      setIsFetchingDocuments(false);
    } catch (err) {
      console.error("Failed to fetch document");
      setIsFetchingDocuments(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/profile?email=${username}`
      );
      console.log(response.data, "Profile data");
      setUserDetails(response.data);
      setIsFetching(false);
    } catch (err) {
      console.error("Failed to fetch profile data");
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserDetails();
      fetchDocument();
    }
  }, [username]);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col text-secondary py-4 md:py-8 lg:py-16 px-4 lg:px-[7.7rem]">
        <h1 className="flex text-4xl font-semibold mb-4 items-center justify-start">
          Your Profile
        </h1>
        <h2 className="flex text-xl font-normal items-center justify-start mb-8">
          Track and manage your information
        </h2>
        <div className="text-center bg-[url('/home-bg.jpg')] bg-cover bg-center bg-no-repeat rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-8 text-white font-bold text-2xl">
          Account Details
        </div>
        <div className="flex flex-col md:flex-row items-center md:gap-x-24 mb-0 md:mb-4">
          <UserDetailsCard userDetails={userDetails} isFetching={isFetching} />
          <UserOverviewCard
            userStatus={userStatus}
            isFetchingStatus={isFetchingStatus}
            userDetails={userDetails}
          />
        </div>
        <div className="text-center bg-[url('/home-bg.jpg')] bg-cover bg-center bg-no-repeat rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-8 text-white font-bold text-2xl">
          Documents
        </div>
        <div className="flex flex-col md:flex-row gap-x-16">
          <UserDocumentsCard
            isFetching={isFetching}
            userDetails={userDetails}
          />
          <SignedDocumentsCard
            isFetchingDocuments={isFetchingDocuments}
            userDocument={userDocument}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
