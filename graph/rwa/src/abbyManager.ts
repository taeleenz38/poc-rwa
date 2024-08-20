import { store } from "@graphprotocol/graph-ts"
import {
    MintRequested as MintRequestedEvent,
    PriceIdSetForDeposit as PriceIdSetForDepositEvent,
    ClaimableTimestampSet as ClaimableTimestampSetEvent,
    MintCompleted as MintCompletedEvent

} from "../generated/ABBYManager/ABBYManager"
import {
    PendingDepositRequest,
    TransactionHistory,
    PriceIdIndex,
    LatestPriceUpdated,

} from "../generated/schema"

import { BigInt } from "@graphprotocol/graph-ts";

export function handleMintRequestedEvent(event: MintRequestedEvent): void {
    const requestTimeStamp = formatDate(event.block.timestamp);

    let pendingDepositRequestEntity = new PendingDepositRequest(event.params.depositId)
    pendingDepositRequestEntity.user = event.params.user
    pendingDepositRequestEntity.collateralAmountDeposited = event.params.collateralAmountDeposited
    pendingDepositRequestEntity.depositAmountAfterFee = event.params.depositAmountAfterFee
    pendingDepositRequestEntity.feeAmount = event.params.feeAmount
    pendingDepositRequestEntity.status = "REQUESTED"
    pendingDepositRequestEntity.blockNumber = event.block.number
    pendingDepositRequestEntity.blockTimestamp = event.block.timestamp
    pendingDepositRequestEntity.transactionHash = event.transaction.hash
    pendingDepositRequestEntity.save()

    let transactionHistoryEntity = new TransactionHistory(event.params.depositId)
    transactionHistoryEntity.stableAmount = event.params.collateralAmountDeposited
    transactionHistoryEntity.type = "Invest"
    transactionHistoryEntity.currency = "AUDC"
    transactionHistoryEntity.status = "SUBMITTED"
    transactionHistoryEntity.depositAmountAfterFee = event.params.depositAmountAfterFee
    transactionHistoryEntity.feeAmount = event.params.feeAmount
    transactionHistoryEntity.requestTime = requestTimeStamp
    transactionHistoryEntity.transactionDate = requestTimeStamp
    transactionHistoryEntity.save()
}

export function handlePriceIdSetForDepositEvent(event: PriceIdSetForDepositEvent): void {
    let depositId = event.params.depositIdSet;

    let pendingDepositRequestEntity = PendingDepositRequest.load(depositId);
    if (pendingDepositRequestEntity != null) {
        pendingDepositRequestEntity.priceId = event.params.priceIdSet;

        let priceIdIndex = PriceIdIndex.load(event.params.priceIdSet.toHex())
        if (priceIdIndex != null) {
            let latestPriceEntity = LatestPriceUpdated.load(priceIdIndex.latestPriceId)

            if (latestPriceEntity != null) {
                let price = latestPriceEntity.newPrice;

                if (price && price.notEqual(BigInt.fromI32(0))) {
                    pendingDepositRequestEntity.price = price
                    let depositAmountAfterFee = pendingDepositRequestEntity.depositAmountAfterFee;

                    let scaledDepositAmount = depositAmountAfterFee.times(BigInt.fromI32(100));
                    let claimableAmount = scaledDepositAmount.div(price);

                    pendingDepositRequestEntity.claimableAmount = claimableAmount;
                }
            }
        }
        pendingDepositRequestEntity.save();
    }
}

export function handleClaimableTimestampSetEvent(event: ClaimableTimestampSetEvent): void {
    let depositId = event.params.depositId;
    const claimTimestampFormatted = formatDate(event.params.claimTimestamp);

    let pendingDepositRequestEntity = PendingDepositRequest.load(depositId);
    if (pendingDepositRequestEntity != null) {
        pendingDepositRequestEntity.claimableTimestamp = claimTimestampFormatted;

        let price = pendingDepositRequestEntity.price;

        if (price && price.notEqual(BigInt.fromI32(0))) {
            let depositAmountAfterFee = pendingDepositRequestEntity.depositAmountAfterFee;

            let scaledDepositAmount = depositAmountAfterFee.times(BigInt.fromI32(100));
            let claimableAmount = scaledDepositAmount.div(price);

            pendingDepositRequestEntity.claimableAmount = claimableAmount;
        }

        pendingDepositRequestEntity.save();
    }
}

export function handleMintCompletedEvent(event: MintCompletedEvent): void {
    let depositId = event.params.depositId;
    const mintTimestamp = formatDate(event.block.timestamp);

    let pendingDepositRequestEntity = PendingDepositRequest.load(depositId);
    if (pendingDepositRequestEntity != null) {
        store.remove("PendingDepositRequest", depositId.toHex());
    }

    let transactionHistoryEntity = TransactionHistory.load(depositId);
    if (transactionHistoryEntity != null) {
        transactionHistoryEntity.status = "COMPLETED"

        let priceIdIndex = PriceIdIndex.load(event.params.priceId.toHex())
        if (priceIdIndex != null) {
            let latestPriceEntity = LatestPriceUpdated.load(priceIdIndex.latestPriceId)

            if (latestPriceEntity != null) {
                transactionHistoryEntity.price = latestPriceEntity.newPrice
            }
        }
        transactionHistoryEntity.transactionDate = mintTimestamp
        transactionHistoryEntity.mintedTime = mintTimestamp

        let rwaAmountOut = event.params.rwaAmountOut;
        let rwaAmountOutConverted = rwaAmountOut.div(BigInt.fromI32(10).pow(16));

        transactionHistoryEntity.tokenAmount = rwaAmountOutConverted
        transactionHistoryEntity.save()
    }
}



const formatDate = (timestamp: BigInt): string => {
    const timestampNumber = timestamp.toI64();
    const date = new Date(timestampNumber * 1000);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toISOString().split("T")[1].split(".")[0];
    return `${formattedDate} ${formattedTime}`;
};