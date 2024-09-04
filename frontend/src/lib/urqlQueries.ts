import { gql } from "urql";

export const GET_ACCOUNT_STATUS = gql`
  query GetAccountStatus {
    latestUniqueAccountStatusSetByAdmins(
      first: 1000
      orderBy: date
      orderDirection: desc
    ) {
      id
      account
      termIndex
      status
      date
    }
  }
`;

export const GET_PRICE_LIST = gql`
  query GetPriceList {
    priceAddeds(first: 1000, orderBy: date, orderDirection: desc) {
      id
      priceId
      price
      date
      status
    }
  }
`;

export const GET_TRANSACTION_PRICING = gql`
  query GetTransactionPricing {
    latestPriceUpdateds(first: 1000, orderBy: date, orderDirection: desc) {
      id
      priceId
      price
      date
      status
    }
  }
`;

export const GET_PENDING_DEPOSIT_REQUESTS = gql`
  query GetPendingDepositRequests {
    pendingDepositRequests(first: 1000, orderBy: id) {
      id
      user
      collateralAmountDeposited
      depositAmountAfterFee
      feeAmount
      status
      price
      priceId
      claimableTimestamp
      requestTimestamp
    }
  }
`;

export const GET_TRANSACTION_HISTORY = gql`
  query GetTransactionHistory($user: String!) {
    depositTransactionHistories(
      where: { user: $user }
      first: 1000
      orderBy: transactionDate
      orderDirection: desc
    ) {
      id
      user
      stableAmount
      tokenAmount
      type
      currency
      status
      requestTime
      completedTime
      transactionDate
    }
    redemptionTransactionHistories(
      where: { user: $user }
      first: 1000
      orderBy: transactionDate
      orderDirection: desc
    ) {
      id
      user
      stableAmount
      tokenAmount
      type
      currency
      status
      requestTime
      completedTime
      transactionDate
    }
  }
`;

export const GET_CLAIMABLE_DETAILS = gql`
  query GetClaimableDetails($user: String!) {
    pendingDepositRequests(
      where: {
        user: $user
        price_not: null
        priceId_not: null
        claimableTimestamp_not: null
      }
      orderBy: id
    ) {
      id
      user
      collateralAmountDeposited
      depositAmountAfterFee
      feeAmount
      status
      claimableAmount
      priceId
      claimableTimestamp
      requestTimestamp
    }
  }
`;

export const GET_PENDING_APPROVAL_REDEMPTION_LIST = gql`
  query GetPendingApprovalRedemptionList {
    redemptionRequests(
      where: { price_not: null, priceId_not: null, claimApproved: false }
      first: 1000
      orderBy: requestTimestamp
      orderDirection: desc
    ) {
      id
      user
      rwaAmountIn
      priceId
      requestTimestamp
      price
      requestedRedeemAmount
      requestedRedeemAmountAfterFee
      feeAmount
      status
      redeemAmount
      claimApproved
    }
  }
`;

export const GET_CLAIMABLE_REDEMPTION_LIST = gql`
  query GetClaimableRedemptionList($user: String!) {
    redemptionRequests(
      where: {
        user: $user
        price_not: null
        priceId_not: null
        claimApproved: true
      }
      first: 1000
      orderBy: requestTimestamp
      orderDirection: desc
    ) {
      id
      user
      rwaAmountIn
      priceId
      requestTimestamp
      price
      requestedRedeemAmount
      requestedRedeemAmountAfterFee
      feeAmount
      status
      redeemAmount
      claimApproved
    }
  }
`;

export const GET_PENDING_REDEMPTION_REQUEST_LIST = gql`
  query GetPendingRedemptionRequestList {
    redemptionRequests(
      first: 1000
      orderBy: requestTimestamp
      orderDirection: desc
    ) {
      id
      user
      rwaAmountIn
      priceId
      requestTimestamp
      price
      requestedRedeemAmount
      requestedRedeemAmountAfterFee
      feeAmount
      status
      redeemAmount
      claimApproved
    }
  }
`;
