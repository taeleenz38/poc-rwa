import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = "0xCf073c6683584dd0bba965eeF933dC8c98bcee5B";
const MINT_TO = "0xD44B3b1e21d5F55f5b5Bb050E68218552aa4eAfC";
const MINT_AMOUNT = ethers.utils.parseUnits("500000000", 18);

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function mintTokens() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/KAVeQ1V8UkE6JlDQgFkY17g-8c5V-dXe"
  );
  const wallet = new ethers.Wallet(process.env.DEPLOYER as string, provider);

  console.log(`Using wallet: ${wallet.address}`);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  try {
    console.log(`Minting ${MINT_AMOUNT.toString()} tokens to ${MINT_TO}...`);
    const tx = await contract.mint(MINT_TO, MINT_AMOUNT);
    console.log(`Transaction sent! Tx hash: ${tx.hash}`);
    console.log(`Track it here: https://sepolia.etherscan.io/tx/${tx.hash}`);

    await tx.wait();
    console.log("Minting successful!");
  } catch (error) {
    console.error("Error minting tokens:", error);
  }
}

mintTokens();
