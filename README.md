# Digital Asset Securitisation

## Overview
Digital Asset Securitisation is a streamlined solution for issuers looking to launch tokenised funds with minimal effort. By leveraging smart contract-based fund management, the platform automates fund operations, ensuring security, efficiency, and compliance. Built on ERC4626 and ERC20 standards, it incorporates a multi-sig administrative structure with roles for fund management, security oversight, and asset transfers, all secured through Safe Wallet integration. All-in-one KYC is also implemented via Sumsub integration, whereby KYC processes such as identity document approvals can be done manually or automatically in the Sumsub admin console.

## Features
- **Rapid Fund Deployment**: Issue tokenised funds quickly with minimal setup.
- **Smart Contract-Based Management**: Automates fund operations through Solidity contracts.
- **ERC4626 & ERC20 Compliance**: Ensures compatibility with widely used token standards.
- **KYC**: Ensures KYC/AML compliance via Sumsub integration.
- **DOCUSIGN**: DocuSign is integrated to provide a contract for the investor to sign during the KYC process.
- **Multi-Sig Admin Roles**:
  - **ManagerAdmin**: Oversees fund operations and key decision-making.
  - **Guardian**: Ensures fund security via whitelisting (allowlist).
  - **Asset Sender**: Handles asset transfers and token distribution.
- **Safe Wallet Integration**: All administrative roles operate via multi-signature wallets for enhanced security.

## Installation
To set up Digital Asset Securitisation, follow these steps:

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the project root and configure the required environment variables.
3. **Run the development server:**
   ```sh
   npm run dev
   ```

## Usage
### Issuing Tokenised Funds
- Deploy ERC4626-based vaults to manage assets efficiently.
- Issue ERC20 fund tokens for investor participation.
- The vaults are launched through hardhat scripts, where the admin can specify details of the vault and the blockchain network.

### KYC Process (Sumsub)
- The investor clicks 'Sign Up' when they land in the homepage.
- This directs them to a stepper form where they need to enter details including:
  - full name
  - email address
  - wallet address
  - date of birth
  - upload KYC document (passport/driver's license)
  - sign document (DocuSign)
- The investor also sets a password which will be used for login in conjunction with their email address.
- Once all details are entered step-by-step the form is submitted at the end after the investor clicks on 'Submit'.
- Once the investor logs in, their KYC status must change to 'approved' in their 'PROFILE' page before they can interact with any funds available on the platform.

### Allowlisting (Guardian)
- Once the investor signs up and passes KYC checks, the guardian admin must add the investor's wallet address to the allowlist (whitelist) as this is required for the investor to deposit/redeem fund tokens.
- In the guardian view, there is an 'Allowlist' page which has a 'Add To Allowlist' and 'Remove From Allowlist' button:
  - each button opens up their respective modals where the guardian can simply enter the wallet address and sign transactions using Safe Wallet
  - Due to a 2 by 3 quorum, two guardians must sign and execute the transaction in the Safe Wallet console.

### Fund Subscription (Deposit)
- The investor clicks on the 'Deposit' button in the 'INVEST' page.
- The deposit modal opens, prompting the investor to enter the amount of fund tokens (AUDY/AEMF) they wish to deposit their ERC20 tokens for (stablecoin).
- The investor will sign two transactions (one for spending approval of their ERC20 tokens and one for transferring their ERC20 tokens to the vault).

### Fund Pricing
- The Manager Admin will set a price at the start of each day which will be determined by the fund's real-time performance.
- They can either add a new price (priceID) or update an existing priceID with the new price using the 'Add New PriceID' or 'Update PriceID' buttons in the Manager Admin's view under the 'PRICING' tab.
- All existing priceIDs are present in a table shown below these two modal buttons.

### Set Price ID For A Given Deposit ID
- Once the investor signs their deposit transactions, the deposit request will appear in the Manager Admin's view under the 'DEPOSIT REQUESTS' tab.
- Includes details such as investor wallet, ERC20 token amount (deposit amount) and deposit timestamp.
- The Manager Admin must then click on the 'Add Price' and 'Set Claim Timestamp' buttons to open up the two modals:
  - They can add a price ID for the deposit request by clicking on any of the four latest price IDs which are shown with checkboxes.
  - They can set a claim timestamp using the date input in the 'Set Claim Timestamp' modal.

### End of Deposit Flow
- The investor can view these claimable AUDY/AEMF tokens (fund tokens) in their 'PORTFOLIO' tab in the 'AUDY/AEMF' accordion (pending tokens).
- The 'claim' button is disabled until the time specified in the claim timestamp.
- Once enabled, the investor simply clicks on the button and signs a transaction which will then transfer the AUDY/AEMF tokens to their wallet address.
  - This is shown in their portfolio value, as well as the TVL of the fund which will increase or decrease depending on fund performance as well as subsequence deposits/redemptions by other investors on the platform.

### Multi-Sig Admin Management
- Configure **Manager Admin**, **Guardian**, and **Asset Sender** roles using Safe Wallet.
- Ensure secure fund management through multi-signature transactions.

### Asset Transfers & Distributions
- Tokenised assets can be securely transferred and distributed according to smart contract rules.

## Technologies Used
- **Solidity**: Smart contract development
- **React & Next.js**: Frontend framework
- **Node.js & Express**: Backend services
- **Sepolia**: Blockchain networks
- **Safe Wallet (Gnosis Safe)**: Multi-signature wallet integration
- **Wagmi & ethers.js**: Blockchain interaction
