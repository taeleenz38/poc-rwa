import {ethers} from "hardhat";
import * as fs from 'fs';
const { deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  console.log('starting deployment of token!', deployer.address); 
  
    // Deploy the Blocklist contract
    await deploy("A$DC", {
      from: deployer,
      args: [],
      log: true,
    });
  
    // Get the deployed A$DC contract instance
    const audc = await ethers.getContract("A$DC");
    console.log("deployed A$DC address:", audc.address);
  

  //const tokenFactory = await ethers.getContractFactory("A$DC");

  //console.log('got contract factory');
 // const provider: Provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/wgC_6RILBar_tWOU1IpbIxaRGZOb4JE6`);
 // const wallet = new ethers.Wallet(`957632735f6c053f8196c4bb0f7cca92c2717c22b3d9b2dba6996a26afadc93a`, provider);
  //const token = await tokenFactory.deploy();
  
  //console.log(`Deploying token at ${token.address} ...`);
  //await token.deployed();
  //console.log(`Deployed token ${token.address} !`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
