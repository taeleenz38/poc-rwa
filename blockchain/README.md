# Pre-requisites
Node v16.18.1

# Setup
npm install

# Deploy contracts:
All EOAs and contract addresses are available in "addresses.txt".
If using a UNIX machine the backward slash should be "/"
Note: Execute during low Sepolia congestion periods.

## Deploy AUDC contract:
```
npx hardhat run .\test-deploy\usdy\sepolia\1_deploy_token.ts --network sepolia
```

Output: 
```
deployed A$DC address: 0xAe2E85cfc8378416Ce9Da64Cbb6C473066595508
```
Edit ```test-deploy\mainnet_constants.ts```, set the ```A$DC address as``` the ```USDC_MAINNET``` address.

## Deploy Allowlist:

```
npx hardhat run .\test-deploy\usdy\sepolia\2_deploy_allowlist.ts --network sepolia
```

## Deploy Blocklist:

```
npx hardhat run .\test-deploy\usdy\sepolia\3_deploy_blocklist.ts --network sepolia
```

## Deploy pricer:

```
npx hardhat run .\test-deploy\usdy\sepolia\4_deploy_pricer.ts --network sepolia
```

## Deploy USDY factory:

```
npx hardhat run .\test-deploy\usdy\sepolia\5_deploy_usdy_factory.ts --network sepolia
```

## Deploy USDY manager:

```
npx hardhat run .\test-deploy\usdy\sepolia\6_deploy_usdyManager.ts --network sepolia
```

## End-to-End flow:
```
npx hardhat run .\scripts\ci\event_coverage_sepolia.ts --network sepolia
```

### The above scripts does the following:

1. Guardian adds the user address to the allowlist.
2. AUDC Whale signer transfers AUDC to user, and approves USDY manager to spend AUDC on user's behalf.
3. User requests subscription parsing an AUDC amount 
     a. AUDC is deposited to the asset receipient.
     b. A deposit ID is generated.
4. Manager Admin sets the price for the deposit ID.
5. Manager Admin sets the claim timestamp (i.e., a block timestamp after which the user can receive USDY tokens).
6. User invokes "claimMint" with their deposit ID to receive USDY tokens.
7. USDY manager address granted approval to spend USDY tokens.
8. User requests redemption of USDY tokens back to AUDC - in this step the USDY of the user is burnt.
9. Manager admin sets the price for the redemption by invoking "setPriceIdForRedemptions".
10. AUDC whale signer transfers AUDC to asset sender, and the asset sender provides approval to the user.
11. User invokes "claimRedemption" parsing the deposit ID, and the user is refunded AUDC.

### Evidence of execution:
1. Request subscription - ```https://sepolia.etherscan.io/tx/0xbd497a871779bcc713fc4de2d251e5f642d88b33ddc4f5eafa68ab4d42a9f78c```
2. Claim mint - ```https://sepolia.etherscan.io/tx/0x21e85ddccf6273d9d8b463ab2cab0ea6c07f10ceb347627cddd485e56b6ed5fb```
3. Request redemption - ```https://sepolia.etherscan.io/tx/0x0d30d5f69f984cadedbcce34fc9bf7de7d5ab76749d93d2c80eb7bb52de87f89```
4. Claim redemption - ```https://sepolia.etherscan.io/tx/0x421c947ceaa344b7d366e9ba07fbd38932605ffcfe7bc2dbbf5eb744f47586f1```
