import { Injectable } from '@nestjs/common';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { PricingResponse } from '../dto/PricingResponse';
import { ALLOW_LIST_ABI, ALLOW_LIST_ADDRESS, API_KEY, PRICE_ADDED_ABI, PRICE_CHANGED_ABI, PRICING_ADDRESS, ACCOUNT_STATUS_ABI, ABBY_MANAGER_ADDRESS, MINT_REQESTED_ABI, MINT_COMPLETED_ABI, CLAIMABLETIMESTAMP_ABI, PRICEIDSETFORDEPOSIT_ABI, REDEMPTION_COMPLETED_ABI, REDEMPTION_REQUESTED_ABI, PRICEIDSETFORREDEMPTION_ABI, REDEMPTION_APPROVAL_ABI, TRANSFER_ABI, AUDC_ADDRESS, ABBY_ADDRESS, ASSET_SENDER_ADDRESS, FEE_RECIPIENT_ADDRESS } from '../constants';
import { AllowListResponse } from '../dto/AllowListResponse';
import { AccountStatusResponse } from '../dto/AccountStatusResponse';
import { MintRequestedResponse } from '../dto/MIntRequestResponse';
import { ClaimableTimestampResponse } from '../dto/ClaimableTimestampResponse';
import { PriceIdForDeposit } from '../dto/PriceIdForDeposit';
import { RedemptionRequestResponse } from '../dto/RedemptionRequestResponse';
import { ClaimableList } from '../dto/ClaimableList';
import { PriceIdForRedemption } from '../dto/PriceIdForRedemption';
import { ClaimableRedemptionResponse } from '../dto/ClaimableRedemptionResponse';
import { TransferResponse } from '../dto/TransferResponse';
import { MIntCompletedResponse } from '../dto/MIntCompletedResponse';
import { TransactionHistoryResponse } from '../dto/TransactionHistoryResponse';
import { RedemptionCompletedResponse } from '../dto/RedemptionCompletedResponse';

@Injectable()
export class AlchemyService {
  async getAllPricing(): Promise<PricingResponse[]> {
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

    for (const log of priceAddedLogs) {
      const decodedLog = priceAddedDaoInterface.parseLog(log);
      const priceId = decodedLog.args.priceId;
      const price = decodedLog.args.price;

      const block = await alchemy.core.getBlock(log.blockNumber);
      const timestamp = block.timestamp;
      const date = new Date(timestamp * 1000).toISOString();

      let pricing: PricingResponse = {
        // formattedPriceId: ethers.BigNumber.from(priceId).toString(),
        priceId: priceId.toString(),
        price: ethers.utils.formatEther(ethers.BigNumber.from(price).toBigInt()),
        status: "New Price ID",
        date: date
      };
      pricingResponse.push(pricing);
    }

    for (const log of priceChangedLogs) {
      const decodedLog = priceChangedDaoInterface.parseLog(log);
      const priceId = decodedLog.args.priceId;
      const price = decodedLog.args.newPrice;

      const block = await alchemy.core.getBlock(log.blockNumber);
      const timestamp = block.timestamp;
      const date = new Date(timestamp * 1000).toISOString();

      let pricing: PricingResponse = {
        // formattedPriceId: ethers.BigNumber.from(priceId).toString(),
        priceId: priceId.toString(),
        price: ethers.utils.formatEther(ethers.BigNumber.from(price).toBigInt()),
        status: "Updated Price ID",
        date: date
      };
      pricingResponse.push(pricing);
    }
    // console.log(pricingResponse);
    pricingResponse.sort((a, b) => {
      if (a.priceId < b.priceId) return -1;
      if (a.priceId > b.priceId) return 1;
  
      if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

    return pricingResponse;
  }

  async getPricingForTransaction(): Promise<PricingResponse[]> {
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

    for (const log of priceAddedLogs) {
      const decodedLog = priceAddedDaoInterface.parseLog(log);
      const priceId = decodedLog.args.priceId;
      const price = decodedLog.args.price;

      const block = await alchemy.core.getBlock(log.blockNumber);
      const timestamp = block.timestamp;
      const date = new Date(timestamp * 1000).toISOString();

      let pricing: PricingResponse = {
        // formattedPriceId: ethers.BigNumber.from(priceId).toString(),
        priceId: priceId.toString(),
        price: ethers.utils.formatEther(ethers.BigNumber.from(price).toBigInt()),
        status: "New Price ID",
        date: date
      };
      pricingResponse.push(pricing);
    }

    for (const log of priceChangedLogs) {
      const decodedLog = priceChangedDaoInterface.parseLog(log);
      const priceId = decodedLog.args.priceId;
      const price = decodedLog.args.newPrice;

      const block = await alchemy.core.getBlock(log.blockNumber);
      const timestamp = block.timestamp;
      const date = new Date(timestamp * 1000).toISOString();

      const index = pricingResponse.findIndex(pricing => pricing.priceId === priceId.toString());
      if (index !== -1) {
        pricingResponse[index].price = ethers.utils.formatEther(ethers.BigNumber.from(price).toBigInt());
        pricingResponse[index].date = date;
        pricingResponse[index].status = "Updated Price ID";
      }
    }
    // console.log(pricingResponse);
    pricingResponse.sort((a, b) => {
      if (a.priceId < b.priceId) return -1;
      if (a.priceId > b.priceId) return 1;
  
      if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

    return pricingResponse;
  }

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

    for (const log of accountStatusSetLogs) {
      try {
        const decodedLog = iface.parseLog(log);
        const account = decodedLog.args.account;
        const termIndex = decodedLog.args.termIndex.toString();
        const status = decodedLog.args.status;
        const block = await alchemy.core.getBlock(log.blockNumber);
        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000).toISOString();

        // Find if the account already exists in the array
        const existingEntryIndex = accountStatusResponse.findIndex(entry => entry.account === account);

        if (existingEntryIndex !== -1) {
          // If the account exists, compare the dates
          const existingEntry = accountStatusResponse[existingEntryIndex];
          if (new Date(existingEntry.date).getTime() < new Date(date).getTime()) {
            // Update the existing entry if the new entry has a more recent date
            accountStatusResponse[existingEntryIndex] = {
              account: account,
              termIndex: termIndex,
              status: status,
              date: date
            };
          }
        } else {
          // If the account does not exist, add it to the array
          let allowList: AccountStatusResponse = {
            account: account,
            termIndex: termIndex,
            status: status,
            date: date
          };
          accountStatusResponse.push(allowList);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }
    accountStatusResponse.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return accountStatusResponse;
  }


  async getPendingDepositRequestList(): Promise<MintRequestedResponse[]> {
    let returnMintRequestResponse: MintRequestedResponse[] = [];
    let allMintRequestResponse: MintRequestedResponse[] = [];
    let priceIdForDepositList: PriceIdForDeposit[] = [];
    let mintCompletedList: MIntCompletedResponse[] = [];
    let claimableTimestampResponse: ClaimableTimestampResponse[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const mintRequestInterface = new Utils.Interface(MINT_REQESTED_ABI);
    const mintRequestSetTopics = mintRequestInterface.encodeFilterTopics('MintRequested', []);

    let mintRequestSetLogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: mintRequestSetTopics,
    });

    const iface = new ethers.utils.Interface(MINT_REQESTED_ABI);

    for (const log of mintRequestSetLogs) {
      try {
        const decodedLog = iface.parseLog(log);
        const user = decodedLog.args.user;
        //This has a padding const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
        const depositId = decodedLog.args.depositId;
        const block = await alchemy.core.getBlock(log.blockNumber);
        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000).toISOString();


        const collateralAmountDeposited = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.collateralAmountDeposited).toBigInt());
        const depositAmountAfterFee = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.depositAmountAfterFee).toBigInt());
        const feeAmount = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.feeAmount).toBigInt());

        let mintRequestList: MintRequestedResponse = {
          user: user,
          depositId: depositId,
          collateralAmountDeposited: collateralAmountDeposited,
          depositAmountAfterFee: depositAmountAfterFee,
          feeAmount: feeAmount,
          requestTimestamp: date
        };
        allMintRequestResponse.push(mintRequestList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    const mintCompletedAbi = new Utils.Interface(MINT_COMPLETED_ABI);
    const mintCompletedTopic = mintCompletedAbi.encodeFilterTopics('MintCompleted', []);

    let mintCompletedlogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: mintCompletedTopic,
    });

    const mintCompleted = new ethers.utils.Interface(MINT_COMPLETED_ABI);
    for (const log of mintCompletedlogs) {
      try {
        const decodedLog = mintCompleted.parseLog(log);
        const depositId = decodedLog.args.depositId;
        const user = decodedLog.args.user;

        // const block = await alchemy.core.getBlock(log.blockNumber);
        // const timestamp = block.timestamp;
        // const date = new Date(timestamp * 1000).toISOString();

          let mintCompletedResponse: MIntCompletedResponse = {
            user: user,
            depositId: decodedLog.args.depositId,
            rwaOwed: decodedLog.args.rwaAmountOut,
            depositAmountAfterFee: decodedLog.args.collateralAmountDeposited,
            price: decodedLog.args.price,
            priceId: decodedLog.args.priceId,
            // dateTime: date
          };
          mintCompletedList.push(mintCompletedResponse);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    const priceIdSetFoDeposit = new Utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    const priceIdSetFoDepositTopics = priceIdSetFoDeposit.encodeFilterTopics('PriceIdSetForDeposit', []);

    let priceIdLogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: priceIdSetFoDepositTopics,
    });

    const priceIdSetForDeposit = new ethers.utils.Interface(PRICEIDSETFORDEPOSIT_ABI);

    for (const log of priceIdLogs) {
      try {
        const decodedLog = priceIdSetForDeposit.parseLog(log);
        const depositIdSet = decodedLog.args.depositIdSet;
        const priceId = decodedLog.args.priceIdSet;
        const priceIdForDeposit: PriceIdForDeposit = { priceId: priceId, depositId: depositIdSet };
        priceIdForDepositList.push(priceIdForDeposit);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    const claimableTimestampInterface = new Utils.Interface(CLAIMABLETIMESTAMP_ABI);
    const claimableTimestampSetTopics = claimableTimestampInterface.encodeFilterTopics('ClaimableTimestampSet', []);

    let claimableTimestampSetLogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: claimableTimestampSetTopics,
    });

    const claimableTimestampIface = new ethers.utils.Interface(CLAIMABLETIMESTAMP_ABI);

    for (const log of claimableTimestampSetLogs) {
      try {
        const decodedLog = claimableTimestampIface.parseLog(log);
        const depositId = decodedLog.args.depositId;
        const claimTimestampBigInt = ethers.BigNumber.from(decodedLog.args.claimTimestamp).toBigInt();
        const claimTimestampNumber = Number(claimTimestampBigInt); // Convert to Number
        const claimTimestampDate = new Date(claimTimestampNumber * 1000); // Convert to milliseconds
        const claimTimestampFormatted = claimTimestampDate.toISOString(); // Format as ISO string

        let claimableTimestampList: ClaimableTimestampResponse = {
          depositId: depositId,
          claimTimestamp: claimTimestampFormatted,
          claimTimestampFromChain: claimTimestampNumber
        };
        claimableTimestampResponse.push(claimableTimestampList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    const allPricing: PricingResponse[] = await this.getPricingForTransaction()

    // console.log(allMintRequestResponse);
    // console.log(mintCompletedList);
    // console.log(priceIdForDepositList);
    // console.log(claimableTimestampResponse);
    // console.log(allPricing);

    for (const mintRequested of allMintRequestResponse) {
      try {
        const mintCompleted = mintCompletedList.find(completed => completed.depositId === mintRequested.depositId);
        const priceIdAdded = priceIdForDepositList.find(completed => completed.depositId === mintRequested.depositId);
        const claimableTImeStampAdded = claimableTimestampResponse.find(completed => completed.depositId === mintRequested.depositId);

        let mintRequestList: MintRequestedResponse = {
          user: mintRequested.user,
          depositId: mintRequested.depositId,
          collateralAmountDeposited: mintRequested.collateralAmountDeposited,
          depositAmountAfterFee: mintRequested.depositAmountAfterFee,
          feeAmount: mintRequested.feeAmount,
          status: "Requested",
          requestTimestamp: mintRequested.requestTimestamp
        };

        if(mintCompleted){
          mintRequestList.status = "Completed"
        } 

        if(priceIdAdded){
          const pricing = allPricing.find(completed => completed.priceId === ethers.BigNumber.from(priceIdAdded.priceId).toString());
          mintRequestList.priceId = ethers.BigNumber.from(priceIdAdded.priceId).toString()
          mintRequestList.price = pricing.price
        } 

        if(claimableTImeStampAdded){
          mintRequestList.claimableTimestamp = claimableTImeStampAdded.claimTimestamp
        } 
      returnMintRequestResponse.push(mintRequestList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    returnMintRequestResponse.sort((a, b) => new Date(b.requestTimestamp).getTime() - new Date(a.requestTimestamp).getTime());
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
        const priceIdForDeposit: PriceIdForDeposit = { priceId: priceId, depositId: depositIdSet };
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
        const claimTimestampBigInt = ethers.BigNumber.from(decodedLog.args.claimTimestamp).toBigInt();
        const claimTimestampNumber = Number(claimTimestampBigInt); // Convert to Number
        const claimTimestampDate = new Date(claimTimestampNumber * 1000); // Convert to milliseconds
        const claimTimestampFormatted = claimTimestampDate.toISOString(); // Format as ISO string

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

    const priceList = await this.getPricingForTransaction();
    const claimableList = await this.getClaimableTimestampList();
    const mintList = await this.getDepositRequestListWithPriceId();

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

    return returnClaimList;
  }


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
        const priceIdForRedeem: PriceIdForRedemption = { priceId: priceId, redeemId: redeemIdSet };
        pricedRedeemptionIdList.push(priceIdForRedeem);
        pricedRedeemptionIds.add(redeemIdSet);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const priceList: PricingResponse[] = await this.getPricingForTransaction();

    pendingRedeemptionList.forEach((value) => {
      try {

        const reeemItem = pricedRedeemptionIdList.filter(item => item.redeemId === value.redemptionId);
        if (reeemItem.length > 0) {
          const matchingDeposits = priceList.filter(item => ethers.BigNumber.from(item.priceId).toString() === ethers.BigNumber.from(reeemItem[0].priceId).toString());

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
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }

    });

    return claimableRedemptionResponse;
  }

  async getClaimableRedemptionList(): Promise<RedemptionRequestResponse[]> {
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

    pendingRedeemptionList = pendingRedeemptionList.filter(request => approvedRedeemptionIds.has(request.redemptionId));

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
        const priceIdForRedeem: PriceIdForRedemption = { priceId: priceId, redeemId: redeemIdSet };
        pricedRedeemptionIdList.push(priceIdForRedeem);
        pricedRedeemptionIds.add(redeemIdSet);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const priceList: PricingResponse[] = await this.getPricingForTransaction();

    pendingRedeemptionList.forEach((value) => {
      try {

        const reeemItem = pricedRedeemptionIdList.filter(item => item.redeemId === value.redemptionId);
        if (reeemItem.length > 0) {
          const matchingDeposits = priceList.filter(item => ethers.BigNumber.from(item.priceId).toString() === ethers.BigNumber.from(reeemItem[0].priceId).toString());

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
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }

    });

    return claimableRedemptionResponse;
  }

  async getTransferEvents(user: string): Promise<TransferResponse[]> {

    let transferList: TransferResponse[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);

    const transferInterface = new Utils.Interface(TRANSFER_ABI);
    const transferCreatedTopics = transferInterface.encodeFilterTopics('Transfer', []);

    let transferLogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: 'latest',
      address: AUDC_ADDRESS,
      topics: transferCreatedTopics,
    });

    const transferIface = new ethers.utils.Interface(TRANSFER_ABI);

    for (const log of transferLogs) {
      try {
        const decodedLog = transferIface.parseLog(log);
        const from = decodedLog.args.from.toString();
        const to = decodedLog.args.to.toString();
        const amount = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.value));
        const block = await alchemy.core.getBlock(log.blockNumber);
        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000).toISOString();

        if (
          from.toLowerCase() === user.toLowerCase() &&
          (to.toLowerCase() === ASSET_SENDER_ADDRESS.toLowerCase() || to.toLowerCase() === FEE_RECIPIENT_ADDRESS.toLowerCase())
        ) {
          transferList.push({
            from,
            to,
            amount: amount,
            type: 'DEPOSIT',
            dateTime: date,
            currency: "AUDC",
          });
        }

        if (from.toLowerCase() === ASSET_SENDER_ADDRESS.toLowerCase() && to.toLowerCase() === user.toLowerCase()) {
          transferList.push({
            from,
            to,
            amount: amount,
            type: 'REDEEM',
            dateTime: date,
            currency: "AUDC",
          });
        }
      } catch (error) {
        console.error('Error decoding log:', error);
      }
    };

    let tokenLogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: 'latest',
      address: ABBY_ADDRESS,
      topics: transferCreatedTopics,
    });

    const tokenIface = new ethers.utils.Interface(TRANSFER_ABI);

    for (const log of tokenLogs) {
      try {
        const decodedLog = tokenIface.parseLog(log);
        const from = decodedLog.args.from.toString();
        const to = decodedLog.args.to.toString();
        const token = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.value));
        const block = await alchemy.core.getBlock(log.blockNumber);
        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000).toISOString();

        if (
          from.toLowerCase() === user.toLowerCase() &&
          to === ethers.constants.AddressZero
        ) {
          transferList.push({
            from,
            to,
            amount: token,
            type: 'BURNED',
            dateTime: date,
            currency: "AYF",
          });
        }

        if (from === ethers.constants.AddressZero && to.toLowerCase() === user.toLowerCase()) {
          transferList.push({
            from,
            to,
            amount: token,
            type: 'RECIEVED',
            dateTime: date,
            currency: "AYF",
          });
        }
      } catch (error) {
        console.error('Error decoding log:', error);
      }
    };
    transferList.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    return transferList;
  }

  async getTransactionHistory(userAddress: string): Promise<TransactionHistoryResponse[]> {
    let allMintRequestResponse: MintRequestedResponse[] = [];
    let mintCompletedList: MIntCompletedResponse[] = [];
    let finalTransactionHistoryResponse: TransactionHistoryResponse[] = []
    let redemptionCompletedList: RedemptionCompletedResponse[] = [];
    let allRedeemptionList: RedemptionRequestResponse[] = [];

    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const mintRequestInterface = new Utils.Interface(MINT_REQESTED_ABI);
    const mintRequestSetTopics = mintRequestInterface.encodeFilterTopics('MintRequested', []);

    let mintRequestSetLogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: mintRequestSetTopics,
    });

    const iface = new ethers.utils.Interface(MINT_REQESTED_ABI);

    // mintRequestSetLogs.forEach((log) => {
    for (const log of mintRequestSetLogs) {
      try {
        const decodedLog = iface.parseLog(log);
        const user = decodedLog.args.user;
       
        if(user === userAddress) {
          //This has a padding const FIRST_DEPOSIT_ID = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
          const depositId = decodedLog.args.depositId;

          const collateralAmountDeposited = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.collateralAmountDeposited).toBigInt());
          const depositAmountAfterFee = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.depositAmountAfterFee).toBigInt());
          const feeAmount = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.feeAmount).toBigInt());

          const block = await alchemy.core.getBlock(log.blockNumber);
          const timestamp = block.timestamp;
          const date = new Date(timestamp * 1000).toISOString();

          let mintRequestList: MintRequestedResponse = {
            user: user,
            depositId: depositId,
            collateralAmountDeposited: collateralAmountDeposited,
            depositAmountAfterFee: depositAmountAfterFee,
            feeAmount: feeAmount,
            requestTimestamp: date
          };
          allMintRequestResponse.push(mintRequestList);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    const mintCompletedAbi = new Utils.Interface(MINT_COMPLETED_ABI);
    const mintCompletedTopic = mintCompletedAbi.encodeFilterTopics('MintCompleted', []);

    let mintCompletedlogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: mintCompletedTopic,
    });

    const mintCompleted = new ethers.utils.Interface(MINT_COMPLETED_ABI);
    for (const log of mintCompletedlogs) {
      try {
        const decodedLog = mintCompleted.parseLog(log);
        const depositId = decodedLog.args.depositId;
        const user = decodedLog.args.user;

        const block = await alchemy.core.getBlock(log.blockNumber);
        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000).toISOString();

        if(user === userAddress) {
          let mintCompletedResponse: MIntCompletedResponse = {
            user: user,
            depositId: decodedLog.args.depositId,
            rwaOwed: decodedLog.args.rwaAmountOut,
            depositAmountAfterFee: decodedLog.args.collateralAmountDeposited,
            price: decodedLog.args.price,
            priceId: decodedLog.args.priceId,
            dateTime: date
          };
          mintCompletedList.push(mintCompletedResponse);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    allMintRequestResponse.forEach((mintRequested) => {
      const mintCompleted = mintCompletedList.find(completed => completed.depositId === mintRequested.depositId);
      try {
          if(mintCompleted){
            let transactionHistoryResponse: TransactionHistoryResponse = {
              id: mintRequested.depositId,
              stableAmount: ethers.utils.formatEther(ethers.BigNumber.from(mintCompleted.depositAmountAfterFee).toBigInt()),
              tokenAmount: ethers.utils.formatEther(ethers.BigNumber.from(mintCompleted.rwaOwed)),
              type: "Invest",
              status: "COMPLETED",
              price: ethers.utils.formatEther(ethers.BigNumber.from(mintCompleted.price).toBigInt()),
              // priceId: ethers.BigNumber.from(mintCompleted.priceId).toString(),
              requestTime: mintRequested.requestTimestamp,
              mintedTime: mintCompleted.dateTime,
              transactionDate: mintCompleted.dateTime
            };
            finalTransactionHistoryResponse.push(transactionHistoryResponse);
          } else {
            let transactionHistoryResponse: TransactionHistoryResponse = {
              id: mintRequested.depositId,
              stableAmount: mintRequested.depositAmountAfterFee,
              type: "Invest",
              status: "SUBMITTED",
              requestTime: mintRequested.requestTimestamp,
              transactionDate: mintRequested.requestTimestamp
            };
            finalTransactionHistoryResponse.push(transactionHistoryResponse);
          }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const redemptionRequestedsInterface = new Utils.Interface(REDEMPTION_REQUESTED_ABI);
    const redemptionRequestedTopics = redemptionRequestedsInterface.encodeFilterTopics('RedemptionRequested', []);

    let redeemRequestSetLogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: redemptionRequestedTopics,
    });

    for (const log of redeemRequestSetLogs) {
      try {
        const decodedLog = redemptionRequestedsInterface.parseLog(log);
        const user = decodedLog.args.user;
        const block = await alchemy.core.getBlock(log.blockNumber);
        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000).toISOString();

        if(user === userAddress) {
          const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
          const rwaAmountIn = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.rwaAmountIn).toBigInt());

          let redemptionRequest: RedemptionRequestResponse = {
            user: user,
            redemptionId: redemptionId,
            rwaAmountIn: rwaAmountIn,
            dateTime: date
          };
          allRedeemptionList.push(redemptionRequest);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    const redemptionCompletedInterface = new Utils.Interface(REDEMPTION_COMPLETED_ABI);
    const redemptionCompletedSetTopics = redemptionCompletedInterface.encodeFilterTopics('RedemptionCompleted', []);

    let redeemCompletedlogs = await alchemy.core.getLogs({
      fromBlock: 6418358,
      toBlock: "latest",
      address: address,
      topics: redemptionCompletedSetTopics,
    });

    for (const log of redeemCompletedlogs) {
      try {
        const decodedLog = redemptionCompletedInterface.parseLog(log);
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        const user = decodedLog.args.user;
        const block = await alchemy.core.getBlock(log.blockNumber);
        const timestamp = block.timestamp;
        const date = new Date(timestamp * 1000).toISOString();

        if(user === userAddress) {
          let redemptionCompletedResponse: RedemptionCompletedResponse = {
            user: user,
            redemptionId: redemptionId,
            amountRwaTokenBurned: decodedLog.args.rwaAmountRequested,
            collateralDuePostFees: decodedLog.args.collateralAmountReturned,
            price: decodedLog.args.price,
            dateTime: date
          };
          redemptionCompletedList.push(redemptionCompletedResponse);
        }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    }

    allRedeemptionList.forEach((redemptionRequested) => {
      const redemptionCompleted = redemptionCompletedList.find(completed => completed.redemptionId === redemptionRequested.redemptionId);
      console.log(redemptionCompleted);
      try {
          if(redemptionCompleted){
            let transactionHistoryResponse: TransactionHistoryResponse = {
              id: redemptionRequested.redemptionId,
              stableAmount: ethers.utils.formatEther(ethers.BigNumber.from(redemptionCompleted.collateralDuePostFees).toBigInt()),
              tokenAmount: ethers.utils.formatEther(ethers.BigNumber.from(redemptionCompleted.amountRwaTokenBurned)),
              type: "Redeem",
              status: "COMPLETED",
              price: ethers.utils.formatEther(ethers.BigNumber.from(redemptionCompleted.price).toBigInt()),
              // priceId: ethers.BigNumber.from(mintCompleted.priceId).toString(),
              requestTime: redemptionRequested.dateTime,
              mintedTime: redemptionCompleted.dateTime,
              transactionDate: redemptionCompleted.dateTime
            };
            finalTransactionHistoryResponse.push(transactionHistoryResponse);
          } else {
            let transactionHistoryResponse: TransactionHistoryResponse = {
              id: redemptionRequested.redemptionId,
              tokenAmount: redemptionRequested.rwaAmountIn,
              type: "Redeem",
              status: "SUBMITTED",
              requestTime: redemptionRequested.dateTime,
              transactionDate: redemptionRequested.dateTime,
            };
            finalTransactionHistoryResponse.push(transactionHistoryResponse);
          }
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });
    finalTransactionHistoryResponse.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
    return finalTransactionHistoryResponse;
  }
}
