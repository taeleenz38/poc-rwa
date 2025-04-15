"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ayfabi from "@/artifacts/ABBY.json";

const formatNumber = (number: number | string, decimalPlaces: number = 2): string => {
    const num = typeof number === "string" ? parseFloat(number) : number;
    return num.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
};

export function useEqvData() {
    const [eqvTotalSupply, setEqvTotalSupply] = useState<string>("...");
    const [eqvNav, setEqvNav] = useState<string>("...");
    const [eqvPrice, setEqvPrice] = useState<string>("...");

    // Fetch total supply
    useEffect(() => {
        const fetchSupply = async () => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(
                    "https://sepolia.infura.io/v3/87d9d315fbda4c4b93710160977c7370"
                );
                const contractAddress = process.env.NEXT_PUBLIC_EQV_ADDRESS as `0x${string}`;
                const contract = new ethers.Contract(contractAddress, ayfabi.abi, provider);
                const supply = await contract.totalSupply();
                const formatted = ethers.utils.formatUnits(supply, 18);
                setEqvTotalSupply(formatNumber(parseFloat(formatted), 2));
            } catch (err) {
                console.error("Error fetching EQV total supply:", err);
            }
        };

        fetchSupply();
    }, []);

    // Fetch NAV
    useEffect(() => {
        const fetchNav = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_FILE_API}/file-upload/chainlink/EQV`);
                const data = await res.json();
                setEqvNav(data.NAV);
            } catch (err) {
                console.error("Error fetching EQV NAV:", err);
            }
        };

        fetchNav();
    }, []);

    // Calculate price
    useEffect(() => {
        const nav = parseFloat(eqvNav);
        const supply = parseFloat(eqvTotalSupply.replace(/[^\d.-]/g, ""));

        if (!isNaN(nav) && !isNaN(supply) && supply > 0) {
            const price = nav / supply;
            setEqvPrice(formatNumber(price, 2));
        }
    }, [eqvNav, eqvTotalSupply]);

    return { eqvNav, eqvTotalSupply, eqvPrice };
}
