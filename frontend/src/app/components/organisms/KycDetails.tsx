"use client";

import React, { useState } from "react";
import Button from "@/app/components/atoms/Buttons/Button";
import Image from "next/image";
import InputWithLabel from "@/app/components/atoms/Inputs/InputWithLabel";

type KycDetailsProps = {
  logoSrc: string;
  altText: string;
  fundName: string;
  fundDescription: string;
  yieldText: string;
};

const KycDetails = (props: KycDetailsProps) => {
  const { logoSrc, altText, fundName, fundDescription, yieldText } = props;
  const [idDocType, setIdDocType] = useState("");
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [idDocSubType, setIdDocSubType] = useState("");

  const [value, setValue] = useState("");

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col items-center justify-center w-1/2 bg-primary min-h-screen">
        <div className="">
          <Image src="/LOGO.png" alt="small logo" className="rounded-full" width={75} height={75} />
          <p className="text-2xl font-medium mt-4 text-light">Onboard to AYF</p>
        </div>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center w-1/2">
        <h1 className="text-2xl font-semibold mb-10">Investor Onboarding</h1>
        <form>
          <div className="grid grid-cols-2 gap-2 border border-white p-4">
            <div className="flex flex-col p-2">
              <InputWithLabel
                id="idDocType"
                name="idDocType"
                type="text"
                label="Document Type"
                placeholder="Enter document type"
                value={idDocType}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="country"
                name="country"
                type="text"
                label="Country"
                placeholder="Enter country"
                value={country}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="issuedDate"
                name="issuedDate"
                type="date"
                label="Issued Date"
                placeholder="Enter issued date"
                value={issuedDate}
                onChange={() => {}}
                widthfull={true}
              />
            </div>
            <div className="flex flex-col  p-2">
              <InputWithLabel
                id="validUntil"
                name="validUntil"
                type="date"
                label="Valid Until"
                placeholder="Enter valid until date"
                value={validUntil}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="number"
                name="number"
                type="text"
                label="Document Number"
                placeholder="Enter document number"
                value={number}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="dob"
                name="dob"
                type="date"
                label="Date of Birth"
                placeholder="Enter date of birth"
                value={dob}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="placeOfBirth"
                name="placeOfBirth"
                type="text"
                label="Place of Birth (Optional)"
                placeholder="Enter place of birth"
                value={placeOfBirth}
                onChange={() => {}}
                widthfull={true}
              />
              <InputWithLabel
                id="idDocSubType"
                name="idDocSubType"
                type="text"
                label="Document Subtype"
                placeholder="Enter document subtype"
                value={idDocSubType}
                onChange={() => {}}
                widthfull={true}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              text="Submit"
              className="hover:bg-primary hover:text-white w-1/5 mt-10"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default KycDetails;
