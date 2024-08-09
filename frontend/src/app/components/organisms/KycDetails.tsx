"use client";

import Button from "@/app/components/atoms/Buttons/Button";
import FileUpload from "@/app/components/atoms/Inputs/FileUpload";
import InputWithLabel from "@/app/components/atoms/Inputs/InputWithLabel";
import SelectField from "@/app/components/atoms/Inputs/SelectInput";
import Stepper from "@/app/components/atoms/Stepper";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import VerificationPopup from "./Popups/VerificationPopup";
import HelloSign from "hellosign-embedded";

type KycDetailsProps = {
  logoSrc: string;
  altText: string;
  fundName: string;
  fundDescription: string;
  yieldText: string;
};

const KycDetails = (props: KycDetailsProps) => {
  const { logoSrc, altText, fundName, fundDescription, yieldText } = props;
  const [idDocType, setIdDocType] = useState("ID_CARD");
  const [country, setCountry] = useState("AUS");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [idDocSubType, setIdDocSubType] = useState<
    "FRONT_SIDE" | "BACK_SIDE"
  >();
  const [currentStep, setCurrentStep] = useState(1);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backtFile, setBackFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const totalSteps = 6;
  const stepLabels = [
    "Verify your identity",
    "Add your wallet",
    "Sign documents",
    "User credentials",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [applicationid, setApplicationId] = useState();
  const [validateForm, setValidateForm] = useState(true);
  const [error, setError] = useState("");
  const [docSigned, setDocSigned] = useState(false);
  const [docSignedProgress, setDocSignedProgress] = useState(false);
  const [status, setStatus] = useState<"Submitted" | "Init" | "Done">(
    "Submitted"
  );

  const dropBoxSignclient = new HelloSign({
    clientId: process.env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID,
  });

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
    setCurrentStep((prevStep) => {
      const newStep = prevStep + 1;
      if (newStep <= totalSteps) {
        return newStep;
      }
      return prevStep; // or handle exceeding steps if necessary
    });
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => {
      const newStep = prevStep - 1;
      if (newStep >= 1) {
        return newStep;
      }
      return prevStep; // or handle steps below 1 if necessary
    });
  };

  const clearFields = () => {
    setFrontFile(null);
    setBackFile(null);
    setFirstName("");
    setLastName("");
    setIssuedDate("");
    setValidUntil("");
    setNumber("");
    setDob("");
    setPlaceOfBirth("");
    setFrontFile(null);
    setBackFile(null);
  };

  const isFormValid = () => {
    console.log(
      country.trim() !== "",
      firstName.trim() !== "",
      lastName.trim() !== "",
      issuedDate.trim() !== "",
      validUntil.trim() !== "",
      number.trim() !== "",
      dob.trim() !== "",
      frontFile !== null,
      backtFile !== null
    );
    return (
      country.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      issuedDate.trim() !== "" &&
      validUntil.trim() !== "" &&
      number.trim() !== "" &&
      dob.trim() !== "" &&
      frontFile !== null &&
      backtFile !== null
    );
  };

  const sendSignRequest = async () => {
    const requestData = {
      firstName,
      lastName,
      email,
      walletAddress,
    };

    try {
      setDocSigned(false);
      setDocSignedProgress(true);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/contract-sign-embd/sign",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Sign request sent successfully:", response.data);

      if (response.data.signUrl) {
        dropBoxSignclient.open(response.data.signUrl, {
          skipDomainVerification: true,
        });
      }

      dropBoxSignclient.once("sign", (data) => {
        setDocSigned(true);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending sign request:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setDocSignedProgress(false);
    }
  };

  const getStatus = async () => {
    try {
      setIsLoading(true);
      const statusUrl =
        process.env.NEXT_PUBLIC_BACKEND_API + "/kyc/status/" + applicationid;

      const response = await axios.get(statusUrl);
      if (response.data.reviewStatus === "completed") {
        setStatus("Done");
      } else {
        setStatus("Init");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (isFormValid()) {
        setValidateForm(true);
        if (currentStep === 3) {
          console.log("Submitting form...");

          // First, create the applicant to get the ID
          const applicantUrl =
            process.env.NEXT_PUBLIC_BACKEND_API + "/kyc/applicant";
          const response = await axios.post(applicantUrl);
          const id = response.data.id;
          setApplicationId((prev) => id);

          console.log(id, "id");
          // Now, upload the document with the ID
          const documentUrl =
            process.env.NEXT_PUBLIC_BACKEND_API +
            "/kyc/applicants/" +
            id +
            "/documents";

          console.log(documentUrl, "documentUrl");

          // Prepare the form data object
          const formDataFront = new FormData();
          formDataFront.append("idDocType", idDocType);
          formDataFront.append("country", country);
          formDataFront.append("firstName", firstName);
          formDataFront.append("lastName", lastName);
          formDataFront.append("issuedDate", issuedDate);
          formDataFront.append("validUntil", validUntil);
          formDataFront.append("number", number);
          formDataFront.append("dob", dob);
          formDataFront.append("placeOfBirth", placeOfBirth);
          formDataFront.append("idDocSubType", "FRONT_SIDE");
          if (frontFile) {
            formDataFront.append("file", frontFile); // frontFile should be a File object
          } else {
            console.error("No front file selected");
          }

          const formDataBack = new FormData();
          formDataBack.append("idDocType", idDocType);
          formDataBack.append("country", country);
          formDataBack.append("firstName", firstName);
          formDataBack.append("lastName", lastName);
          formDataBack.append("issuedDate", issuedDate);
          formDataBack.append("validUntil", validUntil);
          formDataBack.append("number", number);
          formDataBack.append("dob", dob);
          formDataBack.append("placeOfBirth", placeOfBirth);
          formDataBack.append("idDocSubType", "BACK_SIDE");
          if (backtFile) {
            formDataBack.append("file", backtFile); // backFile should be a File object
          } else {
            console.error("No back file selected");
          }

          console.log("Sending front file...");
          const resfront = await axios.post(documentUrl, formDataFront, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Front file response:", resfront);

          console.log("Sending back file...");
          const resBack = await axios.post(documentUrl, formDataBack, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Back file response:", resBack);

          if (resfront.status === 201 && resBack.status === 201) {
            // const statusURL =
            //   process.env.NEXT_PUBLIC_BACKEND_API + "/kyc/status/" + id;
            // const status = await axios.get(statusURL);
            // console.log(status, "status");
            nextStep();
          }
        }
      } else {
        setValidateForm(false);
      }
    } catch (error) {
      console.error("Error submitting KYC application:", error);
      setError("An error occurred during submission. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const documentOptions = [
    { label: "Driver's License", value: "drivers_license" },
  ];

  const countryOptions = [{ label: "Australia", value: "AUS" }];

  return (
    <div className="flex justify-between items-center min-h-screen ">
      <div className="flex flex-col items-center justify-center w-1/2 bg-[#F5F2F2] min-h-screen p-4">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <Image
            src={logoSrc}
            alt={altText}
            className="rounded-full"
            width={75}
            height={75}
          />
          <p className="text-4xl font-semibold mt-4 text-primary ">
            Onboard to Copiam AYF
          </p>
          <div className="mt-8 ">
            <Stepper
              currentStep={currentStep}
              totalSteps={3}
              stepLabels={stepLabels}
            />
          </div>
        </div>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center w-1/2 p-8 gap-4">
        <div
          className="w-full max-w-2xl bg-while  p-8 rounded-lg "
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }}
        >
          <h1 className="text-base text-gray font-semibold  text-center pb-9">
            {currentStep === 1
              ? "* Please provide your personal information"
              : currentStep === 2
              ? "* Upload the necessary document details"
              : currentStep === 3
              ? "* Submit the required documents, ensuring all information is up-to-date"
              : currentStep === 4
              ? "* Verification Has Been Submitted"
              : currentStep === 5
              ? "* Please provide your wallet address"
              : currentStep === 6
              ? "* Please sign the document"
              : "* Provide user credentials"}
          </h1>

          {currentStep === 1 && (
            <div className="flex flex-col rounded-md justify-center items-center ">
              <InputWithLabel
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChange={handleChange(setFirstName)}
                widthfull={true}
                required={true}
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
                required={true}
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
                required={true}
              />

              <SelectField
                label="Country"
                value={country}
                onChange={handleChange(setCountry)}
                options={countryOptions}
                className="mb-4"
              />

              {/* <InputWithLabel
                id="placeOfBirth"
                name="placeOfBirth"
                type="text"
                label="Place of Birth (Optional)"
                placeholder="Enter place of birth"
                value={placeOfBirth}
                onChange={handleChange(setPlaceOfBirth)}
                widthfull={true}
                required={true}
              /> */}
              <InputWithLabel
                id="dob"
                name="dob"
                type="date"
                label="Date of Birth"
                placeholder="Enter date of birth"
                value={dob}
                onChange={handleChange(setDob)}
                widthfull={true}
                required={true}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col rounded-md justify-center items-center ">
              <InputWithLabel
                id="issuedDate"
                name="issuedDate"
                type="date"
                label="Issued Date"
                placeholder="Enter issued date"
                value={issuedDate}
                onChange={handleChange(setIssuedDate)}
                widthfull={true}
                required={true}
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
                required={true}
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
                required={true}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col rounded-md justify-center items-center p-2 border border-gray/20 ">
              <FileUpload
                label="Upload Front of Driver's License"
                onChange={(file) => {
                  setFrontFile(file as File);
                }}
                className="mb-8"
              />
              <FileUpload
                label="Upload Back of Driver's License"
                onChange={(file) => {
                  setBackFile(file as File);
                }}
                className="mb-4"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col justify-center items-center gap-4">
              {/* <span>Please </span> */}
              <span>
                {status === "Done"
                  ? "You have been verified !"
                  : status === "Init"
                  ? "Verification is being proccessed. Try Again !"
                  : ""}
              </span>
              {status !== "Done" && (
                <Button
                  text={` ${isLoading ? "Checking Status..." : "Get Verified"}`}
                  onClick={getStatus}
                  className={`bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md `}
                />
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="flex flex-col rounded-md justify-center items-center ">
              <InputWithLabel
                id="Wallet Address"
                name="Wallet Address"
                type="text"
                label="Wallet Address"
                placeholder="Wallet Address"
                value={walletAddress}
                onChange={handleChange(setWalletAddress)}
                widthfull={true}
                required={true}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="flex flex-col rounded-md justify-center items-center ">
              <Button
                text={`${
                  docSignedProgress
                    ? "Preparing the document.."
                    : "Sign Document"
                }`}
                className={`bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md  ${
                  docSignedProgress && "bg-white text-primary"
                }`}
                onClick={sendSignRequest}
                disabled={docSignedProgress}
              />

              {docSigned && (
                <span className="text-base font-semibold text-green text-pretty mt-7">
                  Sign Up Succesfully Completed !
                </span>
              )}
            </div>
          )}

          {currentStep === 7 && (
            <div className="flex flex-col rounded-md justify-center items-center ">
              <InputWithLabel
                id="email"
                name="Email Address"
                type="text"
                label="Email Address"
                placeholder="Email Address"
                value={email}
                onChange={() => {}}
                widthfull={true}
                required={true}
              />
              <InputWithLabel
                id="Password"
                name="Password"
                type="password"
                label="Password"
                placeholder="Password"
                value={walletAddress}
                onChange={handleChange(setWalletAddress)}
                widthfull={true}
                required={true}
              />
              <InputWithLabel
                id="ConfirmPassword"
                name="ConfirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm Password"
                value={walletAddress}
                onChange={() => {}}
                widthfull={true}
                required={true}
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-6">
            {!validateForm && (
              <span className="text-base font-semibold text-orange text-pretty mt-7">
                {" "}
                Please Ensure all fields are filled out correctly and try again
              </span>
            )}
            {error && (
              <span className="text-base font-semibold text-red text-pretty mt-7">
                {error}
              </span>
            )}
            <div className="flex justify-between w-full mt-4">
              {currentStep > 1 && currentStep !== 6 && (
                <Button
                  text="Previous"
                  className={`bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md ${
                    currentStep === 4 && status !== "Done" && "hidden"
                  } ${
                    currentStep == 3 && isLoading && "bg-white text-primary"
                  }`}
                  onClick={prevStep}
                  disabled={
                    (currentStep === 4 && status !== "Done") ||
                    (currentStep == 3 && isLoading)
                  }
                />
              )}
              <div className="flex-1 flex justify-end">
                {currentStep < totalSteps && currentStep !== 3 ? (
                  <Button
                    text="Next"
                    className={`bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md ${
                      currentStep === 4 && status !== "Done" && "hidden"
                    }`}
                    onClick={nextStep}
                    disabled={currentStep === 4 && status !== "Done"}
                  />
                ) : (
                  currentStep === 3 && (
                    <Button
                      text={`${isLoading ? "Submitting..." : "Submit"}`}
                      className={`bg-primary py-2 text-light hover:bg-light hover:text-primary rounded-md ${
                        isLoading && "bg-white text-primary"
                      }`}
                      onClick={handleSubmit}
                      disabled={isLoading}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycDetails;
