# Alchemy API

This API provides endpoints to interact with various services, including pricing, transaction history, account status, and redemption requests. It is built using NestJS and integrates with a service called `AlchemyService`.

## Table of Contents

- [Endpoints](#endpoints)
- [Request Parameters](#request-parameters)
- [Response Objects](#response-objects)
- [Setup and Running](#setup-and-running)

## Endpoints

### Pricing Endpoints

- **GET `/price-list`**  
  Fetches a list of all available prices.

- **GET `/transaction-pricing`**  
  Fetches pricing information specifically related to transactions.

### Allow List and Term Index Endpoints

- **GET `/term-index-list`**  
  Fetches a list of term indexes available in the allow list.

### Account Status Endpoints

- **GET `/account-status`**  
  Fetches a list of account statuses.

### Mint Request Endpoints

- **GET `/pending-deposit-request-list`**  
  Fetches a list of pending deposit requests (mint requests).

### Claimable Timestamps and Details Endpoints

- **GET `/claimable-timestamp-list`**  
  Fetches a list of claimable timestamps.

- **GET `/claimable-details`**  
  Fetches detailed information about claimable redemptions.

### Redemption Request Endpoints

- **GET `/pending-redemption-request-list`**  
  Fetches a list of pending redemption requests.

- **GET `/pending-approval-redemption-list`**  
  Fetches a list of pending redemption requests that are awaiting approval.

- **GET `/claimable-redemption-list`**  
  Fetches a list of claimable redemptions.

### Transaction History Endpoint

- **GET `/transaction-history/:user`**  
  Fetches the transaction history for a specific user.  
  - **:user** - The user ID for which transaction history is being fetched.

## Request Parameters

- **user**: The identifier for the user whose transaction history you want to retrieve (used in `/transaction-history/:user`).

## Response Objects

The API returns various response objects, including:

- **`PricingResponse[]`**: An array of pricing information.
- **`AllowListResponse[]`**: An array of allow list responses.
- **`AccountStatusResponse[]`**: An array of account statuses.
- **`MintRequestedResponse[]`**: An array of pending mint requests.
- **`ClaimableTimestampResponse[]`**: An array of claimable timestamps.
- **`RedemptionRequestResponse[]`**: An array of redemption request responses.
- **`ClaimableList[]`**: An array of detailed claimable information.
- **`TransactionHistoryResponse[]`**: An array of transaction history entries.

## Setup and Running

To run this API locally, follow these steps:

1. **Install dependencies:**

   ```bash
   npm install

2. **Run the service locally:**

   ```bash
   npm run start
