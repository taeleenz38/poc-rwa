import { parseUnits } from "ethers/lib/utils";
import { expect } from "chai";

import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import {
  AUDC_ADDRESS,
} from "../../test-deploy/constants";

async function main() {
  const signers = await ethers.getSigners();

  const usdcWhaleSigner = signers[0];
  const guardian = signers[1];
  const managerAdmin = signers[2];
  const pauser = signers[3];
  const assetSender = signers[4];
  const user = signers[7];

  const audc = await ethers.getContractAt("A$DC", AUDC_ADDRESS);
  const abbyManager = await ethers.getContract("ABBYManager");
  const pricer = await ethers.getContract("ABBY_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const abby = await ethers.getContract("ABBY");
  const blocklist = await ethers.getContract("Blocklist");

  console.log("audc==>", audc.address);
  console.log("abbyManager==>", abbyManager.address);
  console.log("pricer==>", pricer.address);
  console.log("allowlist==>", allowlist.address);
  console.log("abby==>", abby.address);

  // Current gas price (in wei)
  let gasPrice = await ethers.provider.getGasPrice();
  // Increase the gas price by 10%
  gasPrice = gasPrice.mul(ethers.BigNumber.from(200)).div(ethers.BigNumber.from(100));
  
  const gasLimit = 600000;
  
  let currentTerm = "Test Term 1";
  await allowlist.connect(guardian).addTerm("Test Term 1", { gasPrice, gasLimit });
  await allowlist.connect(guardian).setValidTermIndexes([0], { gasPrice, gasLimit });

  console.log("Set allowlists");
  let currentTermIndex = 0;
  await allowlist
    .connect(guardian)
    .setAccountStatus(user.address, currentTermIndex, true, { gasPrice, gasLimit });
  await allowlist
    .connect(guardian)
    .setAccountStatus(guardian.address, currentTermIndex, true, { gasPrice, gasLimit });
  await allowlist
    .connect(guardian)
    .setAccountStatus(abbyManager.address, currentTermIndex, true, { gasPrice, gasLimit });
  console.log("Set allowlists done!");

  console.log("Request Subscription!");

  await audc.connect(usdcWhaleSigner).transfer(user.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("transferred A$DC!");
  await audc.connect(user).approve(abbyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("Approval provided for A$DC!");
  const res = await allowlist.isAllowed(user.address, { gasPrice, gasLimit });
  console.log(res);

  const minDeposit = await abbyManager.connect(user).minimumDepositAmount();
  console.log("The value of min deposit is:", minDeposit.toString());
  console.log("Request Subscription!");
  const tx = await abbyManager.connect(user).requestSubscription(parseUnits("20000", 18), { gasPrice, gasLimit });
  const receipt = await tx.wait();
  console.log("--------------------Request Subscription done!----------------------------------", receipt);
  
  
  const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);

  console.log("Getting latest price to string", (await pricer.getLatestPrice({ gasPrice, gasLimit })).toString());
  
  const tx1 = await abbyManager
    .connect(managerAdmin)
    ["setPriceIdForDeposits(bytes32[],uint256[])"](
      [FIRST_DEPOSIT_ID],
      [BigNumber.from(1)],
      { gasPrice, gasLimit }
    );
  await tx1.wait();  

  console.log("Setting priceId for deposit done!");

  let depositRequest = await abbyManager.depositIdToDepositor(FIRST_DEPOSIT_ID, { gasPrice, gasLimit });
  console.log('deposit id request returned!');
  expect(depositRequest[0]).to.eq(user.address);
  expect(depositRequest[1]).to.eq(parseUnits("20000", 18));
  expect(depositRequest[2]).to.eq(BigNumber.from(1));
  console.log("Expected values passed!!");
  
  const block = (await ethers.provider.getBlock()).timestamp;
  console.log(block);

  const tx2 = await abbyManager
    .connect(managerAdmin)
    .setClaimableTimestamp(block + 100, [FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  
  await tx2.wait(); 
  console.log("setClaimableTimestamp done!!");
  
  for (var i = 0; i < 10; i++){
    await waitForNextBlock()
    console.log("Block incremented by one.");
  }
  
 
  const currentTimestamp = (await ethers.provider.getBlock()).timestamp;
  console.log('current block timestamp', currentTimestamp);
  console.log('claim timestamp:', block+100);
 

  //mint abby/rwa tokens based on the deposited A$DC

  const tx3 = await abbyManager.connect(managerAdmin).claimMint([FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  await tx3.wait(); 
  console.log("user claimed balance!");
  const balClaimed = await abby.balanceOf(user.address, { gasPrice, gasLimit });
  console.log("balance of minted abby/rwa tokens", balClaimed.toString());
  //this is the amount of rwa/abby tokens minted to user
  expect(balClaimed).eq(parseUnits("2000", 18));
  console.log("balance claimed assert passed!");
  
  console.log("claimed balance assertion passed!");
  const tx4 = await pricer.connect(managerAdmin).addPrice(parseUnits("10", 18), 1, { gasPrice, gasLimit });
  await tx4.wait(); 
  const tx5 = await pricer
    .connect(managerAdmin)
    .updatePrice(BigNumber.from(2), parseUnits("20", 18), { gasPrice, gasLimit });
  await tx5.wait(); 

  console.log("price added to pricer and price updated in pricer!")

  //redeem the rwa/abby tokens back to A$DC
  const tx6 = await abby.connect(user).approve(abbyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx6.wait(); 
  console.log("approving to spend abby tokens!");
  

  //requesting redemptions
  const tx7 = await abbyManager.connect(user).requestRedemption(parseUnits("1000", 18), { gasPrice, gasLimit });
  await tx7.wait(); 
  console.log('redemption requested successfully!!');
  const HASH_OF_BANK = ethers.utils.hexZeroPad(ethers.utils.hexlify(69), 32);

  const tx8 = await abbyManager
    .connect(user)
    .requestRedemptionServicedOffchain(parseUnits("1000", 18), HASH_OF_BANK, { gasPrice, gasLimit });
  await tx8.wait();

  const balAfterRedemption = await abby.balanceOf(user.address, { gasPrice, gasLimit });
  expect(balAfterRedemption).to.eq(BigNumber.from(0));

  const tx9 =await abbyManager
    .connect(managerAdmin)
    ["setPriceIdForRedemptions(bytes32[],uint256[])"](
      [FIRST_DEPOSIT_ID],
      [BigNumber.from(2)],
      { gasPrice, gasLimit }
    );
  await tx9.wait();
  console.log('price set for redemption!!!');
  const redeemRequest = await abbyManager.redemptionIdToRedeemer(
    FIRST_DEPOSIT_ID,
    { gasPrice, gasLimit }
  );
  expect(redeemRequest[0]).to.eq(user.address);
  expect(redeemRequest[1]).to.eq(parseUnits("1000", 18));
  expect(redeemRequest[2]).to.eq(BigNumber.from(2));
  console.log("redemption asserts passed!!");

  const assetSenderBalance = await audc.connect(assetSender).balanceOf(assetSender.address);  
  console.log('The balance of the asset sender', assetSenderBalance);

  const tx10 = await audc.connect(usdcWhaleSigner).transfer(assetSender.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx10.wait();

  console.log("transferred A$DC!");
  const tx11 = await audc.connect(assetSender).approve(abbyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx11.wait();
  const tx12 = await audc.connect(assetSender).approve(user.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await tx12.wait();
  console.log("Approval provided for A$DC!");

  console.log('starting claim redemption!!');
  const tx13 = await abbyManager.connect(user).claimRedemption([FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  await tx13.wait();
  console.log("claim redemption completed!!");
  let balUSDC = await audc.balanceOf(user.address, { gasPrice, gasLimit });
  console.log("Balance of user after claiming A$DC", balUSDC);
  // expect(balUSDC).to.eq(parseUnits("20000", 18));
  // console.log("assertion true after redemption complete!");
  
}

async function waitForNextBlock(): Promise<void> {
    const provider = ethers.provider;
    const currentBlock = await provider.getBlockNumber();
  
    console.log(`Current block number: ${currentBlock}`);
    console.log("Waiting for the next block...");
  
    return new Promise<void>((resolve) => {
      const onBlock = (blockNumber: number) => {
        if (blockNumber > currentBlock) {
          console.log(`New block mined: ${blockNumber}`);
          provider.off("block", onBlock); // Stop listening for new blocks
          resolve();
        }
      };
  
      provider.on("block", onBlock);
    });
  }

main();
