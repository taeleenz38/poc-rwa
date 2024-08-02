import { Injectable } from '@nestjs/common';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { PricingResponse } from '../dto/PricingResponse';
import { ALLOW_LIST_ABI, ALLOW_LIST_ADDRESS, API_KEY, PRICE_ADDED_ABI, PRICE_CHANGED_ABI, PRICING_ADDRESS, ACCOUNT_STATUS_ABI, ABBY_MANAGER_ADDRESS, MINT_REQESTED_ABI, MINT_COMPLETED_ABI, CLAIMABLETIMESTAMP_ABI, PRICEIDSETFORDEPOSIT_ABI, REDEMPTION_COMPLETED_ABI, REDEMPTION_REQUESTED_ABI,PRICEIDSETFORREDEMPTION_ABI,REDEMPTION_APPROVAL_ABI  } from '../constants';
import { AllowListResponse } from '../dto/AllowListResponse';
import { AccountStatusResponse } from '../dto/AccountStatusResponse';
import { MintRequestedResponse } from '../dto/MIntRequestResponse';
import { ClaimableTimestampResponse } from '../dto/ClaimableTimestampResponse';
import { PriceIdForDeposit } from '../dto/PriceIdForDeposit';
import { RedemptionRequestResponse } from '../dto/RedemptionRequestResponse';
import { ClaimableList } from '../dto/ClaimableList';
import { PriceIdForRedemption } from '../dto/PriceIdForRedemption';
import { ClaimableRedemptionResponse } from '../dto/ClaimableRedemptionResponse';

@Injectable()
export class AlchemyService {
  async getPricing(): Promise<PricingResponse[]> {
    let pricingResponse: PricingResponse[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA
    };
    const alchemy = new Alchemy(settings);
    let address = PRICING_ADDRESS

    const priceAddedDaoInterface = new Utils.Interface(PRICE_ADDED_ABI);
    const priceAddedCreatedTopics = priceAddedDaoInterface.encodeFilterTopics('PriceAdded', []);

    const priceChangedDaoInterface = new Utils.Interface(PRICE_CHANGED_ABI);
    const priceChangedCreatedTopics = priceChangedDaoInterface.encodeFilterTopics('PriceUpdated', []);

    let priceAddedLogs = await alchemy.core.getLogs(
      {
        fromBlock: '0x0',
        toBlock: 'latest',
        address: address,
        topics: priceAddedCreatedTopics,
      }
    );

    let priceChangedLogs = await alchemy.core.getLogs(
      {
        fromBlock: '0x0',
        toBlock: 'latest',
        address: address,
        topics: priceChangedCreatedTopics,
      }
    );

    priceAddedLogs.forEach(log => {
      const data = ethers.utils.arrayify(log.data);
      const partLength = Math.ceil(data.length / 2);
      const part1 = data.slice(0, partLength);
      let pricing: PricingResponse = {
        formattedPriceId: ethers.BigNumber.from(log.topics[1]).toString(),
        priceId: log.topics[1].toString(),
        price: ethers.utils.formatEther(ethers.BigNumber.from(part1).toBigInt())
      };
      pricingResponse.push(pricing);
    });
    console.log(pricingResponse);

    priceChangedLogs.forEach(log => {
      // const changedPriceId = ethers.BigNumber.from(log.topics[1]).toString();
      const changedPriceId = log.topics[1].toString();

      const data = ethers.utils.arrayify(log.data);
      const partLength = Math.ceil(data.length / 4);
      const part1 = data.slice(partLength * 3);
      const changedPrice = ethers.utils.formatEther(ethers.BigNumber.from(part1).toBigInt());

      const index = pricingResponse.findIndex(pricing => pricing.priceId === changedPriceId);
      if (index !== -1) {
        pricingResponse[index].price = changedPrice;
      }
    })
    console.log(pricingResponse);
    return pricingResponse;
  }
  /*
    async getAllowList(): Promise<string> { 
      let allowListResponse: AllowListResponse[] = [];
      const settings = {
        apiKey: API_KEY,
        network: Network.ETH_SEPOLIA
      };
      const alchemy = new Alchemy(settings);
      let address = ALLOW_LIST_ADDRESS
  
      const allowListDaoInterface = new Utils.Interface(ALLOW_LIST_ABI);
      const allowListSetTopics = allowListDaoInterface.encodeFilterTopics('TermAdded', []);
  
      let allowListSetLogs = await alchemy.core.getLogs(
        {
          fromBlock: '0x0',
          toBlock: 'latest',
          address: address,
          topics: allowListSetTopics,
        }
      );
  
      const types = ['bytes32', 'bytes32'];
  
      // console.log(allowListSetLogs);
      allowListSetLogs.forEach(log => {
  
        // console.log(part1)
        const iface = new ethers.utils.Interface(ALLOW_LIST_ABI);
        try {
          const decodedLog = iface.parseLog(log);
          console.log(decodedLog.args);
        } catch (error) {
          console.error('Error decoding log:', error);
        }
  
  
        // console.log(ethers.utils.defaultAbiCoder.decode(types, part1));
        // console.log(ethers.BigNumber.from(part2).toBigInt());
        // let allowList: AllowListResponse = {
        //   termIndex: ethers.BigNumber.from(log.topics[1]).toString(),
        //   message: ethers.utils.formatEther(ethers.BigNumber.from(part1).toBigInt())
          
        // };
        // allowListResponse.push(allowList);
      });
  
      // console.log(allowListResponse);
  
      return 'success';
    }
  }
  */

  async getTermIndexList(): Promise<AllowListResponse[]> {
    let allowListResponse: AllowListResponse[] = [];
    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ALLOW_LIST_ADDRESS;

    const allowListDaoInterface = new Utils.Interface(ALLOW_LIST_ABI);
    const allowListSetTopics = allowListDaoInterface.encodeFilterTopics('TermAdded', []);

    let allowListSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: allowListSetTopics,
    });

    const iface = new ethers.utils.Interface(ALLOW_LIST_ABI);

    allowListSetLogs.forEach((log) => {
      try {
        const decodedLog = iface.parseLog(log);
        const hashedMessage = decodedLog.args.hashedMessage;
        const termIndex = decodedLog.args.termIndex.toString();

        let allowList: AllowListResponse = {
          message: hashedMessage,
          termIndex: termIndex,
        };
        allowListResponse.push(allowList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    return allowListResponse;
  }

  async getAccountStatus(): Promise<AccountStatusResponse[]> {
    let accountStatusResponse: AccountStatusResponse[] = [];
    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ALLOW_LIST_ADDRESS;

    const accountStatusInterface = new Utils.Interface(ACCOUNT_STATUS_ABI);
    const accountStatusSetTopics = accountStatusInterface.encodeFilterTopics('AccountStatusSetByAdmin', []);

    let accountStatusSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: accountStatusSetTopics,
    });

    const iface = new ethers.utils.Interface(ACCOUNT_STATUS_ABI);

    accountStatusSetLogs.forEach((log) => {
      try {
        const decodedLog = iface.parseLog(log);
        const account = decodedLog.args.account;
        const termIndex = decodedLog.args.termIndex.toString();
        const status = decodedLog.args.status;

        let allowList: AccountStatusResponse = {
          account: account,
          termIndex: termIndex,
          status: status
        };
        accountStatusResponse.push(allowList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    return accountStatusResponse;
  }

  async getPendingDepositRequestList(): Promise<MintRequestedResponse[]> {
    let returnMintRequestResponse: MintRequestedResponse[] = [];
    let allMintRequestResponse: MintRequestedResponse[] = [];
    let pendingMintRequestResponse: MintRequestedResponse[] = [];
    let priceIdForDepositList: PriceIdForDeposit[] = [];
    let mintCompletedList: string[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const mintRequestInterface = new Utils.Interface(MINT_REQESTED_ABI);
    const mintRequestSetTopics = mintRequestInterface.encodeFilterTopics('MintRequested', []);

    let mintRequestSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: mintRequestSetTopics,
    });

    const iface = new ethers.utils.Interface(MINT_REQESTED_ABI);

    mintRequestSetLogs.forEach((log) => {
      try {
        const decodedLog = iface.parseLog(log);
        const user = decodedLog.args.user;
        //This has a padding const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
        const depositId = decodedLog.args.depositId;
        
        const collateralAmountDeposited = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.collateralAmountDeposited).toBigInt());
        const depositAmountAfterFee = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.depositAmountAfterFee).toBigInt());
        const feeAmount = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.feeAmount).toBigInt());

        let mintRequestList: MintRequestedResponse = {
          user: user,
          depositId: depositId,
          collateralAmountDeposited: collateralAmountDeposited,
          depositAmountAfterFee: depositAmountAfterFee,
          feeAmount: feeAmount,
        };
        allMintRequestResponse.push(mintRequestList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const mintCompletedAbi = new Utils.Interface(MINT_COMPLETED_ABI);
    const mintCompletedTopic = mintCompletedAbi.encodeFilterTopics('MintCompleted', []);

    let mintCompletedlogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: mintCompletedTopic,
    });

    const mintCompleted = new ethers.utils.Interface(MINT_COMPLETED_ABI);
    mintCompletedlogs.forEach((log) => {
      try {
        const decodedLog = mintCompleted.parseLog(log);
        const depositId = decodedLog.args.depositId;
        mintCompletedList.push(depositId);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    allMintRequestResponse.forEach((value) => {
      try {
        const matchingDeposits = mintCompletedList.filter(item => item === value.depositId);

         // Add matching deposits to mintList
         if (!matchingDeposits || matchingDeposits.length == 0) {
          pendingMintRequestResponse.push(value);
        }

      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const priceIdSetFoDeposit = new Utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    const priceIdSetFoDepositTopics = priceIdSetFoDeposit.encodeFilterTopics('PriceIdSetForDeposit', []);

    let priceIdLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: priceIdSetFoDepositTopics,
    });

    const priceIdSetForDeposit = new ethers.utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    priceIdLogs.forEach((log) => {
      try {
        const decodedLog = priceIdSetForDeposit.parseLog(log);
        const depositIdSet = decodedLog.args.depositIdSet;
        const priceId = decodedLog.args.priceIdSet;
        const priceIdForDeposit: PriceIdForDeposit = {priceId:priceId, depositId:depositIdSet};
        priceIdForDepositList.push(priceIdForDeposit);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingMintRequestResponse.forEach((value) => {//2
      try {
        const priceIdNotMatch = priceIdForDepositList.filter(item => item.depositId === value.depositId);

        // Add matching deposits to mintList
        if (!priceIdNotMatch || priceIdNotMatch.length == 0) {
          // value.priceId = priceIdMatch[0].priceId;
          returnMintRequestResponse.push(value);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    return returnMintRequestResponse;
  }

  async getDepositRequestListWithPriceId(): Promise<MintRequestedResponse[]> {
    let returnMintRequestResponse: MintRequestedResponse[] = [];
    let allMintRequestResponse: MintRequestedResponse[] = [];
    let pendingMintRequestResponse: MintRequestedResponse[] = [];
    let mintCompletedList: string[] = [];
    let priceIdForDepositList: PriceIdForDeposit[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const mintRequestInterface = new Utils.Interface(MINT_REQESTED_ABI);
    const mintRequestSetTopics = mintRequestInterface.encodeFilterTopics('MintRequested', []);

    let mintRequestSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: mintRequestSetTopics,
    });

    const iface = new ethers.utils.Interface(MINT_REQESTED_ABI);

    mintRequestSetLogs.forEach((log) => {
      try {
        const decodedLog = iface.parseLog(log);
        const user = decodedLog.args.user;
        //This has a padding const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
        const depositId = decodedLog.args.depositId;
        
        const collateralAmountDeposited = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.collateralAmountDeposited).toBigInt());
        const depositAmountAfterFee = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.depositAmountAfterFee).toBigInt());
        const feeAmount = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.feeAmount).toBigInt());

        let mintRequestList: MintRequestedResponse = {
          user: user,
          depositId: depositId,
          collateralAmountDeposited: collateralAmountDeposited,
          depositAmountAfterFee: depositAmountAfterFee,
          feeAmount: feeAmount,
        };
        allMintRequestResponse.push(mintRequestList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const mintCompletedAbi = new Utils.Interface(MINT_COMPLETED_ABI);
    const mintCompletedTopic = mintCompletedAbi.encodeFilterTopics('MintCompleted', []);

    let mintCompletedlogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: mintCompletedTopic,
    });

    const mintCompleted = new ethers.utils.Interface(MINT_COMPLETED_ABI);
    mintCompletedlogs.forEach((log) => {
      try {
        const decodedLog = mintCompleted.parseLog(log);
        const depositId = decodedLog.args.depositId;
        mintCompletedList.push(depositId);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    allMintRequestResponse.forEach((value) => {
      try {
        const matchingDeposits = mintCompletedList.filter(item => item === value.depositId);

         // Add matching deposits to mintList
         if (!matchingDeposits || matchingDeposits.length == 0) {
          pendingMintRequestResponse.push(value);
        }

      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const priceIdSetFoDeposit = new Utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    const priceIdSetFoDepositTopics = priceIdSetFoDeposit.encodeFilterTopics('PriceIdSetForDeposit', []);

    let priceIdLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: priceIdSetFoDepositTopics,
    });

    const priceIdSetForDeposit = new ethers.utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    priceIdLogs.forEach((log) => {
      try {
        const decodedLog = priceIdSetForDeposit.parseLog(log);
        const depositIdSet = decodedLog.args.depositIdSet;
        const priceId = decodedLog.args.priceIdSet;
        const priceIdForDeposit: PriceIdForDeposit = {priceId:priceId, depositId:depositIdSet};
        priceIdForDepositList.push(priceIdForDeposit);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingMintRequestResponse.forEach((value) => {//2
      try {
        const priceIdMatch = priceIdForDepositList.filter(item => item.depositId === value.depositId);

        // Add matching deposits to mintList
        if (priceIdMatch.length > 0) {
          value.priceId = priceIdMatch[0].priceId;
          returnMintRequestResponse.push(value);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    return returnMintRequestResponse;
  }

  async getClaimableTimestampList(): Promise<ClaimableTimestampResponse[]> {
    let claimableTimestampResponse: ClaimableTimestampResponse[] = [];
    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const claimableTimestampInterface = new Utils.Interface(CLAIMABLETIMESTAMP_ABI);
    const claimableTimestampSetTopics = claimableTimestampInterface.encodeFilterTopics('ClaimableTimestampSet', []);

    let claimableTimestampSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: claimableTimestampSetTopics,
    });

    const iface = new ethers.utils.Interface(CLAIMABLETIMESTAMP_ABI);

    claimableTimestampSetLogs.forEach((log) => {
      try {
        const decodedLog = iface.parseLog(log);
        const depositId = decodedLog.args.depositId;
        // console.log("timestamp====>", ethers.BigNumber.from(decodedLog.args.claimTimestamp).toBigInt());
        const claimTimestampBigInt = ethers.BigNumber.from(decodedLog.args.claimTimestamp).toBigInt();
        const claimTimestampNumber = Number(claimTimestampBigInt); // Convert to Number
        const claimTimestampDate = new Date(claimTimestampNumber * 1000); // Convert to milliseconds
        const claimTimestampFormatted = claimTimestampDate.toISOString(); // Format as ISO string
        console.log("claimTimestampBigInt==>", claimTimestampBigInt);
        console.log("claimTimestampFormatted===>", claimTimestampFormatted)
        // const claimTimestamp = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.claimTimestamp).toBigInt());
        console.log(decodedLog);
        let claimableTimestampList: ClaimableTimestampResponse = {
          depositId: depositId,
          claimTimestamp: claimTimestampFormatted,
          claimTimestampFromChain: claimTimestampNumber
        };
        console.log(claimableTimestampList);
        claimableTimestampResponse.push(claimableTimestampList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const mintCompltedInterface = new Utils.Interface(MINT_COMPLETED_ABI);
    const mintCompltedSetTopics = mintCompltedInterface.encodeFilterTopics('MintCompleted', []);

    let mintCompltedSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: mintCompltedSetTopics,
    });

    const ifaceMintComplted = new ethers.utils.Interface(MINT_COMPLETED_ABI);
    mintCompltedSetLogs.forEach((log) => {
      try {
        const decodedLog = ifaceMintComplted.parseLog(log);
        const depositId = decodedLog.args.depositId;
        claimableTimestampResponse = claimableTimestampResponse.filter(item => item.depositId !== depositId);

      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });
    return claimableTimestampResponse;
  }

  async getClaimableDetails(): Promise<ClaimableList[]> {
    let claimList: ClaimableList[] = [];
    let returnClaimList: ClaimableList[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;


    let priceIdForDeposit: PriceIdForDeposit[] = [];
    const priceInterface = new Utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    const priceSetTopics = priceInterface.encodeFilterTopics('PriceIdSetForDeposit', []);

    let priceSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: priceSetTopics,
    });

    const ifaceForPriceSet = new ethers.utils.Interface(PRICEIDSETFORDEPOSIT_ABI);

    priceSetLogs.forEach((log) => {
      try {
        const decodedLog = ifaceForPriceSet.parseLog(log);
        const priceId = ethers.BigNumber.from(decodedLog.args.priceIdSet).toString();
        const depositId = decodedLog.args.depositIdSet;

        let priceSetList: PriceIdForDeposit = {
          priceId: priceId,
          depositId: depositId,
        };
        priceIdForDeposit.push(priceSetList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const priceList = await this.getPricing();
    const claimableList = await this.getClaimableTimestampList();
    const mintList = await this.getDepositRequestListWithPriceId();

    // console.log("mintList-====================>", mintList);
    // console.log("priceList-====================>", priceList);
    // console.log("claimableList-====================>", claimableList);

    mintList.forEach((value) => {
      try {
        const matchingDeposits = claimableList.filter(item => item.depositId === value.depositId);

        // Add matching deposits to mintList
        if (matchingDeposits.length > 0) {
          const claimableItem: ClaimableList = {
            user: value.user,
            depositId: value.depositId,
            collateralAmountDeposited: value.collateralAmountDeposited,
            depositAmountAfterFee: value.depositAmountAfterFee,
            feeAmount: value.feeAmount,
            claimTimestamp: matchingDeposits[0].claimTimestamp,
            claimTimestampFromChain: matchingDeposits[0].claimTimestampFromChain,
            priceId: value.priceId
          };
          claimList.push(claimableItem);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    claimList.forEach((value) => {
      try {
        const matchingDeposits = priceList.filter(item => ethers.BigNumber.from(item.priceId).toString() === ethers.BigNumber.from(value.priceId).toString());
    
        // Add matching deposits to mintList
        if (matchingDeposits.length > 0) {
          const depositAmountAfterFeeNumber = parseFloat(value.depositAmountAfterFee);
          const priceNumber = parseFloat(matchingDeposits[0].price);
    
          const claimableAmount: number = depositAmountAfterFeeNumber / priceNumber;
          value.claimableAmount = claimableAmount;

          if (matchingDeposits.length > 0) {
            const claimableItem: ClaimableList = {
              user: value.user,
              depositId: value.depositId,
              collateralAmountDeposited: value.collateralAmountDeposited,
              depositAmountAfterFee: value.depositAmountAfterFee,
              feeAmount: value.feeAmount,
              claimTimestamp: value.claimTimestamp,
              claimTimestampFromChain: value.claimTimestampFromChain,
              priceId: value.priceId,
              claimableAmount: claimableAmount
            };
            returnClaimList.push(claimableItem);
          }
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });



    //deposit if
    //address
    //claimable time
    //amount


    //we have all required data need to combine and get the list
    //mintRequestResponse ->depositAmountAfterFee, depositId
    //priceIdForDeposit -> depositId,priceId
    //priceList ->priceid,price
    //claimableList ->depositId, claimTimestamp

    //return {depositAmountAfterFee/price, claimTimestamp}
    return returnClaimList;
  }


  // async getPendingRedemptionList(): Promise<RedemptionRequestResponse[]> {
  //   let redemptionRequestResponse: RedemptionRequestResponse[] = []
  //   const settings = {
  //     apiKey: API_KEY,
  //     network: Network.ETH_SEPOLIA,
  //   };
  //   const alchemy = new Alchemy(settings);
  //   let address = ABBY_MANAGER_ADDRESS;

  //   const redemptionRequestedStatusInterface = new Utils.Interface(REDEMPTION_REQUESTED_ABI);
  //   const redemptionRequestedStatusSetTopics = redemptionRequestedStatusInterface.encodeFilterTopics('RedemptionRequested', []);

  //   const redemptionCompletedStatusInterface = new Utils.Interface(REDEMPTION_COMPLETED_ABI);
  //   const redemptionCompletedStatusSetTopics = redemptionCompletedStatusInterface.encodeFilterTopics('RedemptionCompleted', []);


  //   let redemptionRequestedLogs = await alchemy.core.getLogs({
  //     fromBlock: "0x0",
  //     toBlock: "latest",
  //     address: address,
  //     topics: redemptionRequestedStatusSetTopics,
  //   });
  //   let iface = new ethers.utils.Interface(REDEMPTION_REQUESTED_ABI);

  //   redemptionRequestedLogs.forEach((log) => {
  //     try {
  //       const decodedLog = iface.parseLog(log);
  //       const user = decodedLog.args.user;
  //       const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
  //       const rwaAmountIn = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.rwaAmountIn).toBigInt());

  //       let redemptionRequest: RedemptionRequestResponse = {
  //         user: user,
  //         redemptionId: redemptionId,
  //         rwaAmountIn: rwaAmountIn,
  //       };
  //       redemptionRequestResponse.push(redemptionRequest);
  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });

  //   let redemptionCompletedLogs = await alchemy.core.getLogs({
  //     fromBlock: "0x0",
  //     toBlock: "latest",
  //     address: address,
  //     topics: redemptionCompletedStatusSetTopics,
  //   });
  //   iface = new ethers.utils.Interface(REDEMPTION_COMPLETED_ABI);

  //   let completedRedemptionIds = new Set();

  //   redemptionCompletedLogs.forEach((log) => {
  //     try {
  //       const decodedLog = iface.parseLog(log);
  //       const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
  //       completedRedemptionIds.add(redemptionId);
  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });

  //   // Filter out the completed redemption requests
  //   let filteredRedemptionRequests = redemptionRequestResponse.filter(request => !completedRedemptionIds.has(request.redemptionId));

  //   console.log('Filtered Redemption Requests:', filteredRedemptionRequests);
  //   return filteredRedemptionRequests;
  // }

  // async getPendingRedemptionList(): Promise<RedemptionRequestResponse[]> {
  //   let returnRedeemRequestResponse: RedemptionRequestResponse[] = [];
  //   let allRedeemRequestResponse: RedemptionRequestResponse[] = [];
  //   let pendingRedeemRequestResponse: RedemptionRequestResponse[] = [];
  //   let priceIdForRedemptionList: PriceIdForRedemption[] = [];
  //   let redeemCompletedList: string[] = [];

  //   const settings = {
  //     apiKey: API_KEY,
  //     network: Network.ETH_SEPOLIA,
  //   };
  //   const alchemy = new Alchemy(settings);
  //   let address = ABBY_MANAGER_ADDRESS;

  //   const redemptionRequestedStatusInterface = new Utils.Interface(REDEMPTION_REQUESTED_ABI);
  //   const redemptionRequestedStatusSetTopics = redemptionRequestedStatusInterface.encodeFilterTopics('RedemptionRequested', []);


  //   let redeemRequestSetLogs = await alchemy.core.getLogs({
  //     fromBlock: "0x0",
  //     toBlock: "latest",
  //     address: address,
  //     topics: redemptionRequestedStatusSetTopics,
  //   });

  //   let iface = new ethers.utils.Interface(REDEMPTION_REQUESTED_ABI);

  //   redeemRequestSetLogs.forEach((log) => {
  //     try {
  //       const decodedLog = iface.parseLog(log);
  //       const user = decodedLog.args.user;
  //       const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
  //       const rwaAmountIn = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.rwaAmountIn).toBigInt());

  //       let redemptionRequest: RedemptionRequestResponse = {
  //         user: user,
  //         redemptionId: redemptionId,
  //         rwaAmountIn: rwaAmountIn,
  //       };
  //       allRedeemRequestResponse.push(redemptionRequest);
  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });

  //   const redemptionCompletedStatusInterface = new Utils.Interface(REDEMPTION_COMPLETED_ABI);
  //   const redemptionCompletedStatusSetTopics = redemptionCompletedStatusInterface.encodeFilterTopics('RedemptionCompleted', []);

  //   let redeemCompletedlogs = await alchemy.core.getLogs({
  //     fromBlock: "0x0",
  //     toBlock: "latest",
  //     address: address,
  //     topics: redemptionCompletedStatusSetTopics,
  //   });

  //   // const mintCompleted = new ethers.utils.Interface(REDEMPTION_COMPLETED_ABI);
  //   iface = new ethers.utils.Interface(REDEMPTION_COMPLETED_ABI);

  //   let completedRedemptionIds = new Set();
  //   redeemCompletedlogs.forEach((log) => {
  //     try {
  //       const decodedLog = iface.parseLog(log);
  //       const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();


  //       redeemCompletedList.push(redemptionId);
  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });

  //   allRedeemRequestResponse.forEach((value) => {
  //     try {
  //       const matchingDeposits = redeemCompletedList.filter(item => item === value.redemptionId);

  //        // Add matching deposits to mintList
  //        if (!matchingDeposits || matchingDeposits.length == 0) {
  //         pendingRedeemRequestResponse.push(value);
  //       }

  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });

  //   const priceIdSet = new Utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
  //   const priceIdSetTopics = priceIdSet.encodeFilterTopics('PriceIdSetForRedemption', []);

  //   let priceIdLogs = await alchemy.core.getLogs({
  //     fromBlock: "0x0",
  //     toBlock: "latest",
  //     address: address,
  //     topics: priceIdSetTopics,
  //   });

  //   const priceIdSetForRedeem = new ethers.utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
  //   priceIdLogs.forEach((log) => {
  //     try {
  //       const decodedLog = priceIdSetForRedeem.parseLog(log);
  //       const redeemIdSet = decodedLog.args.redemptionIdSet;
  //       const priceId = decodedLog.args.priceIdSet;
  //       const priceIdForRedeem: PriceIdForRedemption = {priceId:priceId, redeemId:redeemIdSet};
  //       priceIdForRedemptionList.push(priceIdForRedeem);
  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });

  //   pendingRedeemRequestResponse.forEach((value) => {//2
  //     try {
  //       const priceIdNotMatch = priceIdForRedemptionList.filter(item => item.redeemId === value.redemptionId);

  //       // Add matching deposits to mintList
  //       if (!priceIdNotMatch || priceIdNotMatch.length == 0) {
  //         // value.priceId = priceIdMatch[0].priceId;
  //         returnRedeemRequestResponse.push(value);
  //       }
  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });


  //   const redeemApprovalSet = new Utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
  //   const redeemApprovalTopics = redeemApprovalSet.encodeFilterTopics('PriceIdSetForRedemption', []);

  //   let redeemApprovalLogs = await alchemy.core.getLogs({
  //     fromBlock: "0x0",
  //     toBlock: "latest",
  //     address: address,
  //     topics: redeemApprovalTopics,
  //   });

  //   let redeemApprovalId = new Set();

  //   // const redeemApprovalLogs = new ethers.utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
  //   priceIdLogs.forEach((log) => {
  //     try {
  //       const decodedLog = redeemApprovalSet.parseLog(log);
  //       const redeemIdSet = ethers.BigNumber.from(decodedLog.args.redemptionIdSet).toString();
  //       redeemApprovalId.add(redeemIdSet);
  //     } catch (error) {
  //       console.error("Error decoding log:", error);
  //     }
  //   });

  //   console.log(redeemApprovalId);

  //   console.log(returnRedeemRequestResponse);

  //   let filteredRedemptionRequests = returnRedeemRequestResponse.filter(request => !redeemApprovalId.has(request.redemptionId));


  //   return filteredRedemptionRequests;
  // }

  async getPendingRedemptionList(): Promise<RedemptionRequestResponse[]> {
    let approvedRedeemptionIds = new Set();
    let pricedRedeemptionIds = new Set();
    let completedRedemptionIds = new Set();
    let allRedeemptionList: RedemptionRequestResponse[] = [];
    let pendingRedeemptionList: RedemptionRequestResponse[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const redemptionRequestedsInterface = new Utils.Interface(REDEMPTION_REQUESTED_ABI);
    const redemptionRequestedTopics = redemptionRequestedsInterface.encodeFilterTopics('RedemptionRequested', []);

    let redeemRequestSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionRequestedTopics,
    });

    redeemRequestSetLogs.forEach((log) => {
      try {
        const decodedLog = redemptionRequestedsInterface.parseLog(log);
        const user = decodedLog.args.user;
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        const rwaAmountIn = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.rwaAmountIn).toBigInt());

        let redemptionRequest: RedemptionRequestResponse = {
          user: user,
          redemptionId: redemptionId,
          rwaAmountIn: rwaAmountIn,
        };
        allRedeemptionList.push(redemptionRequest);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const redemptionCompletedInterface = new Utils.Interface(REDEMPTION_COMPLETED_ABI);
    const redemptionCompletedSetTopics = redemptionCompletedInterface.encodeFilterTopics('RedemptionCompleted', []);

    let redeemCompletedlogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionCompletedSetTopics,
    });

    redeemCompletedlogs.forEach((log) => {
      try {
        const decodedLog = redemptionCompletedInterface.parseLog(log);
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        completedRedemptionIds.add(redemptionId);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingRedeemptionList = allRedeemptionList.filter(request => !completedRedemptionIds.has(request.redemptionId));

    const redemptionPricingInterface = new Utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
    const redemptionPricedSetTopics = redemptionPricingInterface.encodeFilterTopics('PriceIdSetForRedemption', []);

    let priceIdLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionPricedSetTopics,
    });

    const priceIdSetForRedeem = new ethers.utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
    priceIdLogs.forEach((log) => {
      try {
        const decodedLog = priceIdSetForRedeem.parseLog(log);
        const redeemIdSet = ethers.BigNumber.from(decodedLog.args.redemptionIdSet).toString();
        pricedRedeemptionIds.add(redeemIdSet);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingRedeemptionList = pendingRedeemptionList.filter(request => !pricedRedeemptionIds.has(request.redemptionId));

    const redemptionApprovalInterface = new Utils.Interface(REDEMPTION_APPROVAL_ABI);
    const redeemApprovalTopics = redemptionApprovalInterface.encodeFilterTopics('RedemptionApproved', []);

    let redeemApprovalLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redeemApprovalTopics,
    });

    redeemApprovalLogs.forEach((log) => {
      try {
        const decodedLog = redemptionApprovalInterface.parseLog(log);
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        approvedRedeemptionIds.add(redemptionId);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingRedeemptionList = pendingRedeemptionList.filter(request => !approvedRedeemptionIds.has(request.redemptionId));

    return pendingRedeemptionList;
  }

  async getPendingApprovalRedemptionList(): Promise<RedemptionRequestResponse[]> {
    let approvedRedeemptionIds = new Set();
    let pricedRedeemptionIdList: PriceIdForRedemption[] = [];
    let completedRedemptionIds = new Set();
    let pricedRedeemptionIds = new Set();
    let allRedeemptionList: RedemptionRequestResponse[] = [];
    let pendingRedeemptionList: RedemptionRequestResponse[] = [];
    let claimableRedemptionResponse: ClaimableRedemptionResponse[] = []

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const redemptionRequestedsInterface = new Utils.Interface(REDEMPTION_REQUESTED_ABI);
    const redemptionRequestedTopics = redemptionRequestedsInterface.encodeFilterTopics('RedemptionRequested', []);

    let redeemRequestSetLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionRequestedTopics,
    });

    redeemRequestSetLogs.forEach((log) => {
      try {
        const decodedLog = redemptionRequestedsInterface.parseLog(log);
        const user = decodedLog.args.user;
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        const rwaAmountIn = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.rwaAmountIn).toBigInt());

        let redemptionRequest: RedemptionRequestResponse = {
          user: user,
          redemptionId: redemptionId,
          rwaAmountIn: rwaAmountIn,
        };
        allRedeemptionList.push(redemptionRequest);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const redemptionCompletedInterface = new Utils.Interface(REDEMPTION_COMPLETED_ABI);
    const redemptionCompletedSetTopics = redemptionCompletedInterface.encodeFilterTopics('RedemptionCompleted', []);

    let redeemCompletedlogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionCompletedSetTopics,
    });

    redeemCompletedlogs.forEach((log) => {
      try {
        const decodedLog = redemptionCompletedInterface.parseLog(log);
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        completedRedemptionIds.add(redemptionId);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingRedeemptionList = allRedeemptionList.filter(request => !completedRedemptionIds.has(request.redemptionId));

    const redemptionApprovalInterface = new Utils.Interface(REDEMPTION_APPROVAL_ABI);
    const redeemApprovalTopics = redemptionApprovalInterface.encodeFilterTopics('RedemptionApproved', []);

    let redeemApprovalLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redeemApprovalTopics,
    });

    redeemApprovalLogs.forEach((log) => {
      try {
        const decodedLog = redemptionApprovalInterface.parseLog(log);
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        approvedRedeemptionIds.add(redemptionId);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingRedeemptionList = pendingRedeemptionList.filter(request => !approvedRedeemptionIds.has(request.redemptionId));

    const redemptionPricingInterface = new Utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
    const redemptionPricedSetTopics = redemptionPricingInterface.encodeFilterTopics('PriceIdSetForRedemption', []);

    let priceIdLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionPricedSetTopics,
    });

    const priceIdSetForRedeem = new ethers.utils.Interface(PRICEIDSETFORREDEMPTION_ABI);
    priceIdLogs.forEach((log) => {
      try {
        const decodedLog = priceIdSetForRedeem.parseLog(log);
        const redeemIdSet = ethers.BigNumber.from(decodedLog.args.redemptionIdSet).toString();
        const priceId = decodedLog.args.priceIdSet;
        const priceIdForRedeem: PriceIdForRedemption = {priceId:priceId, redeemId:redeemIdSet};
        pricedRedeemptionIdList.push(priceIdForRedeem);
        pricedRedeemptionIds.add(redeemIdSet);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    pendingRedeemptionList = pendingRedeemptionList.filter(request => pricedRedeemptionIds.has(request.redemptionId));

    const priceList:PricingResponse[] = await this.getPricing(); 
    
    pendingRedeemptionList.forEach((value) => {
      try {
        const matchingDeposits = priceList.filter(item => ethers.BigNumber.from(item.priceId).toString() === ethers.BigNumber.from(value.priceId).toString());
    
        // Add matching deposits to mintList
        if (matchingDeposits.length > 0) {
          const redemptionAmount = parseFloat(value.rwaAmountIn);
          const price = parseFloat(matchingDeposits[0].price);
    
          const redeemAmount: number = redemptionAmount * price;
          const claimableRedemption: ClaimableRedemptionResponse = {
              user: value.user,
              redemptionId: value.redemptionId,
              priceId: value.priceId,
              redeemAmount: redeemAmount,
              rwaAmountIn: value.rwaAmountIn
            };
            claimableRedemptionResponse.push(claimableRedemption);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    return claimableRedemptionResponse;
  }
}
