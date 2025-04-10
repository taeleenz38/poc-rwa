"use client"
import React from 'react'
import { useState, useEffect } from "react";
import InputField from "@/app/components/atoms/Inputs/TextInput";
import CloseButton from "@/app/components/atoms/Buttons/CloseButton";
import Submit from "@/app/components/atoms/Buttons/Submit";

interface UpdateLRProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateLiquidityReport: React.FC<UpdateLRProps> = ({ isOpen, onClose }) => {
    const [dailyAssets, setDailyAssets] = useState<string>("");
    const [weeklyAssets, setWeeklyAssets] = useState<string>("");
    const [dailyAssetsPercentage, setDailyAssetsPercentage] = useState<string>("");
    const [weeklyAssetsPercentage, setWeeklyAssetsPercentage] = useState<string>("");
    const [date, setDate] = useState<string>("");

    const resetForm = () => {
        setDailyAssets("");
        setWeeklyAssets("");
        setDailyAssetsPercentage("");
        setWeeklyAssetsPercentage("");
        setDate("");
    };

    const onCloseModal = () => {
        onClose();
        resetForm();
    };

    const UpdateLR = async () => {
        return "hello world"
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
            <div className="p-8 rounded-lg text-gray bg-white shadow-md shadow-white w-1/3">
                <div className="flex justify-between items-center mb-8">
                    <div></div>
                    <h2 className="text-2xl font-bold text-primary">Add Price</h2>
                    <CloseButton onClick={onCloseModal} />
                </div>
                <div className="text-center px-8 l mb-4 ">
                    Please enter the desired price for AUDY (Australian Yield Fund).
                </div>
                <div className="w-full mx-auto mb-8">
                    <InputField
                        label="Daily Liquid Assets Value ($):"
                        value={dailyAssets || ""}
                        onChange={(e) => setDailyAssets(e.target.value)}
                    />
                </div>
                <div className="w-full mx-auto mb-8">
                    <InputField
                        label="Weekly Liquid Assets Value ($):"
                        value={weeklyAssets || ""}
                        onChange={(e) => setWeeklyAssets(e.target.value)}
                    />
                </div>
                <div className="w-full mx-auto mb-8">
                    <InputField
                        label="% of Total Assets in Daily Liquid Assets:"
                        value={dailyAssetsPercentage || ""}
                        onChange={(e) => setDailyAssetsPercentage(e.target.value)}
                    />
                </div>
                <div className="w-full mx-auto mb-8">
                    <InputField
                        label="% of Total Assets in Weekly Liquid Assets:"
                        value={weeklyAssetsPercentage || ""}
                        onChange={(e) => setWeeklyAssetsPercentage(e.target.value)}
                    />
                </div>
                <div className="w-full mx-auto mb-8">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="w-full flex justify-between">
                    <div className="w-[49%]">
                        <Submit
                            onClick={onCloseModal}
                            label={"Go Back"}
                            disabled={false}
                            className="w-full !bg-[#e6e6e6] !text-primary hover:!text-secondary"
                        />
                    </div>
                    <div className="w-[49%]">
                        <Submit
                            onClick={UpdateLR}
                            label={"Confirm"}
                            disabled={false}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
//

export default UpdateLiquidityReport