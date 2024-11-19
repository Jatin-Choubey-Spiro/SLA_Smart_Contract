**This is the repository for SLA Signing DApp**
*Tested on Ganache UI.*

Tech stack used:-
- Solidity Compiler (v0.8.0)
- Truffle (v5.11.5)
- Ganache CLI (v.7.9.1)
- Node (v22.11.0)
- Web3.js (v1.10.0)
- Metamask Wallet
- Ganache UI (v2.7.1.0)

Note: Ganache CLI doesn't support EIP-1559.
Steps to see the code work in the local test environment (Ganache UI).
- truffle init
- npm install
- Run the Ganache UI and quickstart, Ethereum Project.
- Add a network manually in Metamask for the Ganache UI and switch to it.
    - RPC URL: HTTP:\\127.0.0.1:7545
    - ChainID: 1337
- Import the first private two keys from the Ganache UI wallets to Metamask.

**Deploy Contract and interact with DApp**
1. Compile the Smart Contract
    - truffle compile

2. Deploy the contract
    - truffle migrate --network ganacheUI (You can now see this contract got deployed on the 'transaction' section of the Local dummy blockchain (Ganache UI)).

3. Move the newly created build folder, consisting of Contracts ABI .json file, to the frontend's src folder.(So that frontend can interact with the smart contract)

4. cd frontend

5. npm start

6. Login

7. Connect Wallet 1, and sign the contract. Disconnect. (Transaction gets recorded on the Local Dummy Blockchain)

8. Connect Wallet 2, and sign the contract.  (Transaction gets recorded on the Local Dummy Blockchain)