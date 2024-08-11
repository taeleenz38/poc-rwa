# Pre-requisites
Node v16.18.1

# Setup
npm install

## Deploy AUDC contract:
```
npx hardhat run .\test-deploy\abby\sepolia-safe\1_deploy_token.ts --network sepolia-safe
```

Output: 
```
deployed AUDC address: 0xAe2E85cfc8378416Ce9Da64Cbb6C473066595508
```
Edit ```test-deploy\mainnet_constants.ts```, set the ```AUDC address as``` the ```USDC_MAINNET``` address.

## Deploy Allowlist:

```
npx hardhat run .\test-deploy\abby\sepolia-safe\2_deploy_allowlist.ts --network sepolia-safe
```

## Deploy Blocklist:

```
npx hardhat run .\test-deploy\abby\sepolia-safe\3_deploy_blocklist.ts --network sepolia-safe
```

## Deploy pricer:

```
npx hardhat run .\test-deploy\abby\sepolia-safe\4_deploy_pricer.ts --network sepolia-safe
```

## Deploy ABBY factory:

```
npx hardhat run .\test-deploy\abby\sepolia-safe\5_deploy_abby_factory.ts --network sepolia-safe
```

## Deploy ABBY manager:

```
npx hardhat run .\test-deploy\abby\sepolia-safe\6_deploy_abbyManager.ts --network sepolia-safe
```

## End-to-End flow:
## Add account to allow list:
```
npx hardhat run .\scripts\ci\safe\util\1_allow_listing_all.ts --network sepolia-safe

```
## Add price and update price:
```
npx hardhat run .\scripts\ci\safe\util\3_add_pricing.ts --network sepolia-safe
npx hardhat run .\scripts\ci\safe\util\3.1_update_pricing.ts --network sepolia-safe

```
## Deposit flow:
```
npx hardhat run .\scripts\ci\safe\util\2_request_subscription.ts --network sepolia-safe
npx hardhat run .\scripts\ci\safe\util\4_update_pricing_id_for_deposit.ts --network sepolia-safe
npx hardhat run .\scripts\ci\safe\util\5_set_claimable_timestamp.ts --network sepolia-safe
npx hardhat run .\scripts\ci\safe\util\6_claim_mint.ts --network sepolia-safe

```
## Redemption flow:
```
npx hardhat run .\scripts\ci\safe\util\7_request_for_redemption.ts --network sepolia-safe
npx hardhat run .\scripts\ci\safe\util\8_update_pricing_id_for_redemption.ts --network sepolia-safe
npx hardhat run .\scripts\ci\safe\util\7.1_approval_for_redemption.ts --network sepolia-safe
npx hardhat run .\scripts\ci\safe\util\10_claim_redemption.ts --network sepolia-safe
```

### Functionality of deposit flow:

1. Guardian adds the user address to the allowlist.
2. User approves ABBY manager to spend AUDC on user's behalf.
3. User requests subscription parsing an AUDC amount 
     a. AUDC is deposited to the asset receipient.
     b. A deposit ID is generated.
4. Manager Admin sets the price for the deposit ID.
5. Manager Admin sets the claim timestamp (i.e., a block timestamp after which the user can receive ABBY tokens).

### Functionality of redeem flow:
1. User requests redemption of ABBY tokens back to AUDC - in this step the ABBY of the user is burnt.
2. Manager admin sets the price for the redemption by invoking "setPriceIdForRedemptions".
3. Asset sender provides approval to the abby manager to transfer audc to user.
4. User invokes "claimRedemption" parsing the redeem ID, and the user is refunded AUDC.
