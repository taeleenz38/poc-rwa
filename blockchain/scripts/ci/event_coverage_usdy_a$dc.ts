import { waitNSecondsUntilNodeUp } from "../utils/util";
import { keccak256, parseUnits } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { expect } from "chai";

import {
  getImpersonatedSigner,
  setUSDCBalance,
  increaseBlockTimestamp,
} from "../utils/util";

import { network, ethers } from "hardhat";
import { ERC20 } from "../../typechain";
import { BigNumber, Signer, providers } from "ethers";
import {
  KYC_REGISTRY,
  PROD_GUARDIAN_USDY,
  SANCTION_ADDRESS,
  USDC_MAINNET,
} from "../../test-deploy/mainnet_constants";

async function main() {
  const signers = await ethers.getSigners();

  const usdcWhaleSigner = signers[0];
  const guardian = signers[1];
  const managerAdmin = signers[2];
  const pauser = signers[3];
  const assetSender = signers[4];
  const user = signers[8];

  const usdc = await ethers.getContractAt("A$DC", USDC_MAINNET);
  const usdyManager = await ethers.getContract("USDYManager");
  const pricer = await ethers.getContract("USDY_Pricer");
  const allowlist = await ethers.getContract("Allowlist");
  const usdy = await ethers.getContract("USDY");
  const blocklist = await ethers.getContract("Blocklist");

  console.log(usdc.address);
  console.log(usdyManager.address);
  console.log(pricer.address);
  console.log(allowlist.address);
  console.log(usdy.address);

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
    .setAccountStatus(usdyManager.address, currentTermIndex, true, { gasPrice, gasLimit });
  console.log("Set allowlists done!");

  await usdc.connect(usdcWhaleSigner).transfer(user.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("transferred A$DC!");
  await usdc.connect(user).approve(usdyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("Approval provided for A$DC!");
  const res = await allowlist.isAllowed(user.address, { gasPrice, gasLimit });
  console.log(res);

  const minDeposit = await usdyManager.connect(user).minimumDepositAmount();
  console.log("The value of min deposit is:", minDeposit.toString());
  console.log("Request Subscription!");
  const tx = await usdyManager.connect(user).requestSubscription(parseUnits("20000", 18), { gasPrice, gasLimit });
  const receipt = await tx.wait();
  console.log("--------------------Request Subscription done!----------------------------------", receipt);
  
  
  const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
 /* await usdyManager
    .connect(managerAdmin)
    .overwriteDepositor(
      FIRST_DEPOSIT_ID,
      user.address,
      parseUnits("10000", 18),
      BigNumber.from(0),
      { gasPrice, gasLimit }
    );*/

  console.log("Getting latest price to string", (await pricer.getLatestPrice({ gasPrice, gasLimit })).toString());
  await usdyManager
    .connect(managerAdmin)
    ["setPriceIdForDeposits(bytes32[],uint256[])"](
      [FIRST_DEPOSIT_ID],
      [BigNumber.from(1)],
      { gasPrice, gasLimit }
    );
    
  console.log("Setting priceId for deposit done!");

  let depositRequest = await usdyManager.depositIdToDepositor(FIRST_DEPOSIT_ID, { gasPrice, gasLimit });
  console.log('deposit id request returned!');
  expect(depositRequest[0]).to.eq(user.address);
  expect(depositRequest[1]).to.eq(parseUnits("20000", 18));
  expect(depositRequest[2]).to.eq(BigNumber.from(1));
  console.log("Expected values passed!!");
  
  const block = (await ethers.provider.getBlock()).timestamp;
  console.log(block);

  await usdyManager
    .connect(managerAdmin)
    .setClaimableTimestamp(block + 1000, [FIRST_DEPOSIT_ID], { gasPrice, gasLimit });

  console.log("setClaimableTimestamp done!!");  
  await network.provider.send("evm_increaseTime", [3600]);


  //mint usdy/rwa tokens based on the deposited A$DC

  await usdyManager.connect(managerAdmin).claimMint([FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  console.log("user claimed balance!");
  const balClaimed = await usdy.balanceOf(user.address, { gasPrice, gasLimit });
  console.log("balance of minted usdy/rwa tokens", balClaimed.toString());
  //this is the amount of rwa/usdy tokens minted to user
  expect(balClaimed).eq(parseUnits("2000", 18));
  console.log("balance claimed assert passed!");
  
  console.log("claimed balance assertion passed!");
  await pricer.connect(managerAdmin).addPrice(parseUnits("10", 18), 1, { gasPrice, gasLimit });
  await pricer
    .connect(managerAdmin)
    .updatePrice(BigNumber.from(2), parseUnits("20", 18), { gasPrice, gasLimit });

  console.log("price added to pricer and price updated in pricer!")

  //redeem the rwa/usdy tokens back to A$DC
  await usdy.connect(user).approve(usdyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("approving to spend usdy tokens!");
  //change the decimal values to get this to work!!!
  await usdyManager.connect(user).requestRedemption(parseUnits("1000", 18), { gasPrice, gasLimit });
  console.log('redemption requested successfully!!');
  const HASH_OF_BANK = ethers.utils.hexZeroPad(ethers.utils.hexlify(69), 32);

  await usdyManager
    .connect(user)
    .requestRedemptionServicedOffchain(parseUnits("1000", 18), HASH_OF_BANK, { gasPrice, gasLimit });

  const balAfterRedemption = await usdy.balanceOf(user.address, { gasPrice, gasLimit });
  expect(balAfterRedemption).to.eq(BigNumber.from(0));

  await usdyManager
    .connect(managerAdmin)
    ["setPriceIdForRedemptions(bytes32[],uint256[])"](
      [FIRST_DEPOSIT_ID],
      [BigNumber.from(2)],
      { gasPrice, gasLimit }
    );
  console.log('price set for redemption!!!');
  const redeemRequest = await usdyManager.redemptionIdToRedeemer(
    FIRST_DEPOSIT_ID,
    { gasPrice, gasLimit }
  );
  expect(redeemRequest[0]).to.eq(user.address);
  expect(redeemRequest[1]).to.eq(parseUnits("1000", 18));
  expect(redeemRequest[2]).to.eq(BigNumber.from(2));
  console.log("redemption asserts passed!!");

  /*await setUSDCBalance(assetSender, usdcWhaleSigner, parseUnits("20000", 6));
  await usdc
    .connect(assetSender)
    .approve(usdyManager.address, parseUnits("20000", 6), { gasPrice, gasLimit });*/

  const assetSenderBalance = await usdc.connect(assetSender).balanceOf(assetSender.address);  
  console.log('The balance of the asset sender', assetSenderBalance);

  await usdc.connect(usdcWhaleSigner).transfer(assetSender.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("transferred A$DC!");
  await usdc.connect(assetSender).approve(usdyManager.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  await usdc.connect(assetSender).approve(user.address, parseUnits("20000", 18), { gasPrice, gasLimit });
  console.log("Approval provided for A$DC!");

  console.log('starting claim redemption!!');
  await usdyManager.connect(user).claimRedemption([FIRST_DEPOSIT_ID], { gasPrice, gasLimit });
  console.log("claim redemption completed!!");
  let balUSDC = await usdc.balanceOf(user.address, { gasPrice, gasLimit });
  console.log("Balance of user after claiming A$DC", balUSDC);
  expect(balUSDC).to.eq(parseUnits("20000", 18));
  console.log("assertion true after redemption complete!");

  //await usdyManager.connect(pauser).pauseSubscription({ gasPrice, gasLimit });
  //await usdyManager.connect(pauser).pauseRedemption({ gasPrice, gasLimit });

  //await usdyManager.connect(managerAdmin).unpauseSubscription({ gasPrice, gasLimit });
  //await usdyManager.connect(managerAdmin).unpauseRedemption({ gasPrice, gasLimit });

  //await usdyManager.connect(managerAdmin).setSanctionsList(SANCTION_ADDRESS, { gasPrice, gasLimit });
  //await usdyManager.connect(managerAdmin).setBlocklist(blocklist.address, { gasPrice, gasLimit });

  //await usdyManager.connect(pauser).pauseOffChainRedemption({ gasPrice, gasLimit });
  //await usdyManager.connect(managerAdmin).unpauseOffChainRedemption({ gasPrice, gasLimit });
  
}

main();
