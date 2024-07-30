"use client";

import React, { useState } from "react";
import axios from "axios";
import Button from "@/app/components/atoms/Buttons/Button";
import Image from "next/image";
import InputWithLabel from "@/app/components/atoms/Inputs/InputWithLabel";
import SelectField from "@/app/components/atoms/Inputs/SelectInput";
import Stepper from "@/app/components/atoms/Stepper";
import FileUpload from "@/app/components/atoms/Inputs/FileUpload";

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
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [idDocSubType, setIdDocSubType] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const stepLabels = ["Personal Info", "Document Info", "Upload Document"];

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const handleSelectChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      firstName,
      lastName,
      email,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/contract-sign/send",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Sign request sent successfully:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending sign request:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const documentOptions = [
    { label: "Driver's License", value: "drivers_license" },
  ];

  return (
    <div className="flex justify-between items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-1/2 bg-primary min-h-screen p-4">
        <div className="text-center">
          <Image
            src={logoSrc}
            alt={altText}
            className="rounded-full"
            width={75}
            height={75}
          />
          <p className="text-4xl font-medium mt-4 text-light">Onboard to AYF</p>
          <div className="mt-8">
            <Stepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          </div>
        </div>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center w-1/2 p-8">
        <h1 className="text-3xl text-primary font-semibold mb-8">
          Investor Onboarding
        </h1>
        <form
          className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {currentStep === 1 && (
            <div className="flex flex-col p-2">
              <InputWithLabel
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChange={handleChange(setFirstName)}
                widthfull={true}
              />
              <InputWithLabel
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChange={handleChange(setLastName)}
                widthfull={true}
              />
              <InputWithLabel
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Enter email"
                value={email}
                onChange={handleChange(setEmail)}
                widthfull={true}
              />
              <InputWithLabel
                id="country"
                name="country"
                type="text"
                label="Country"
                placeholder="Enter country"
                value={country}
                onChange={handleChange(setCountry)}
                widthfull={true}
              />
              <InputWithLabel
                id="dob"
                name="dob"
                type="date"
                label="Date of Birth"
                placeholder="Enter date of birth"
                value={dob}
                onChange={handleChange(setDob)}
                widthfull={true}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col p-2">
              <InputWithLabel
                id="issuedDate"
                name="issuedDate"
                type="date"
                label="Issued Date"
                placeholder="Enter issued date"
                value={issuedDate}
                onChange={handleChange(setIssuedDate)}
                widthfull={true}
              />
              <InputWithLabel
                id="validUntil"
                name="validUntil"
                type="date"
                label="Valid Until"
                placeholder="Enter valid until date"
                value={validUntil}
                onChange={handleChange(setValidUntil)}
                widthfull={true}
              />
              <SelectField
                label="Document Type:"
                value={idDocType}
                onChange={handleSelectChange(setIdDocType)}
                options={documentOptions}
                className="mb-4"
              />
              <InputWithLabel
                id="number"
                name="number"
                type="text"
                label="Document Number"
                placeholder="Enter document number"
                value={number}
                onChange={handleChange(setNumber)}
                widthfull={true}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col p-2">
              <FileUpload
                label="Upload Front of Driver's License"
                onChange={(file) => {
                  console.log(file);
                }}
                className="mb-8"
              />
              <FileUpload
                label="Upload Back of Driver's License"
                onChange={(file) => {
                  console.log(file);
                }}
                className="mb-4"
              />
            </div>
          )}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button
                text="Previous"
                className="hover:bg-primary text-primary hover:text-white w-44 py-2"
                onClick={prevStep}
              />
            )}
            <div className="flex-1 flex justify-end">
              {currentStep < totalSteps ? (
                <Button
                  text="Next"
                  className="hover:bg-primary text-primary hover:text-white w-44 py-2"
                  onClick={nextStep}
                />
              ) : (
                <Button
                  text="Submit"
                  className="hover:bg-primary text-primary hover:text-white w-44 py-2"
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KycDetails;
