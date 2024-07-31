import { Injectable } from '@nestjs/common';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { PricingResponse } from '../dto/PricingResponse';
import { ALLOW_LIST_ABI, ALLOW_LIST_ADDRESS, API_KEY, PRICE_ADDED_ABI, PRICE_CHANGED_ABI, PRICING_ADDRESS, ACCOUNT_STATUS_ABI, ABBY_MANAGER_ADDRESS, MINT_REQESTED_ABI, MINT_COMPLETED_ABI, CLAIMABLETIMESTAMP_ABI, PRICEIDSETFORDEPOSIT_ABI, REDEMPTION_COMPLETED_ABI, REDEMPTION_REQUESTED_ABI } from '../constants';
import { AllowListResponse } from '../dto/AllowListResponse';
import { AccountStatusResponse } from '../dto/AccountStatusResponse';
import { MintRequestedResponse } from '../dto/MIntRequestResponse';
import { ClaimableTimestampResponse } from '../dto/ClaimableTimestampResponse';
import { PriceIdForDeposit } from '../dto/PriceIdForDeposit';
import { RedemptionRequestResponse } from '../dto/RedemptionRequestResponse';

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
        // priceId: ethers.BigNumber.from(log.topics[1]).toString(),
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
    let mintRequestResponse: MintRequestedResponse[] = [];
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
        mintRequestResponse.push(mintRequestList);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    const priceIdSetFoDeposit = new Utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    const priceIdSetFoDepositTopics = priceIdSetFoDeposit.encodeFilterTopics('PriceIdSetForDeposit', []);

    let logs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: priceIdSetFoDepositTopics,
    });

    const mintCompleted = new ethers.utils.Interface(PRICEIDSETFORDEPOSIT_ABI);
    logs.forEach((log) => {
      try {
        const decodedLog = mintCompleted.parseLog(log);
        const depositIdSet = decodedLog.args.depositIdSet;
        mintRequestResponse = mintRequestResponse.filter(item => item.depositId !== depositIdSet);

      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });
    return mintRequestResponse;
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
        const claimTimestamp = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.claimTimestamp).toBigInt());
        console.log(decodedLog);
        let claimableTimestampList: ClaimableTimestampResponse = {
          depositId: depositId,
          claimTimestamp: claimTimestamp,
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

  async getStableCoinsAmmount(): Promise<string> {

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

    const priceList = this.getPricing();
    const claimableList = this.getClaimableTimestampList();
    const mintList = this.getPendingDepositRequestList();


    //we have all required data need to combine and get the list
    //mintRequestResponse ->depositAmountAfterFee, depositId
    //priceIdForDeposit -> depositId,priceId
    //priceList ->priceid,price
    //claimableList ->depositId, claimTimestamp

    //return {depositAmountAfterFee/price, claimTimestamp}
    return "ok";
  }


  async getRedemptionRequestedList(): Promise<RedemptionRequestResponse[]> {
    let redemptionRequestResponse: RedemptionRequestResponse[] = []
    const settings = {
      apiKey: API_KEY,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    let address = ABBY_MANAGER_ADDRESS;

    const redemptionRequestedStatusInterface = new Utils.Interface(REDEMPTION_REQUESTED_ABI);
    const redemptionRequestedStatusSetTopics = redemptionRequestedStatusInterface.encodeFilterTopics('RedemptionRequested', []);

    const redemptionCompletedStatusInterface = new Utils.Interface(REDEMPTION_COMPLETED_ABI);
    const redemptionCompletedStatusSetTopics = redemptionCompletedStatusInterface.encodeFilterTopics('RedemptionCompleted', []);


    let redemptionRequestedLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionRequestedStatusSetTopics,
    });
    let iface = new ethers.utils.Interface(REDEMPTION_REQUESTED_ABI);

    redemptionRequestedLogs.forEach((log) => {
      try {
        const decodedLog = iface.parseLog(log);
        const user = decodedLog.args.user;
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        const rwaAmountIn = ethers.utils.formatEther(ethers.BigNumber.from(decodedLog.args.rwaAmountIn).toBigInt());

        let redemptionRequest: RedemptionRequestResponse = {
          user: user,
          redemptionId: redemptionId,
          rwaAmountIn: rwaAmountIn,
        };
        redemptionRequestResponse.push(redemptionRequest);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    let redemptionCompletedLogs = await alchemy.core.getLogs({
      fromBlock: "0x0",
      toBlock: "latest",
      address: address,
      topics: redemptionCompletedStatusSetTopics,
    });
    iface = new ethers.utils.Interface(REDEMPTION_COMPLETED_ABI);

    let completedRedemptionIds = new Set();

    redemptionCompletedLogs.forEach((log) => {
      try {
        const decodedLog = iface.parseLog(log);
        const redemptionId = ethers.BigNumber.from(decodedLog.args.redemptionId).toString();
        completedRedemptionIds.add(redemptionId);
      } catch (error) {
        console.error("Error decoding log:", error);
      }
    });

    // Filter out the completed redemption requests
    let filteredRedemptionRequests = redemptionRequestResponse.filter(request => !completedRedemptionIds.has(request.redemptionId));

    console.log('Filtered Redemption Requests:', filteredRedemptionRequests);
    return filteredRedemptionRequests;
  }
}