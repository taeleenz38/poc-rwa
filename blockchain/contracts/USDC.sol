// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//check
contract USDC is ERC20 {
    constructor()
        ERC20("USDC", "USDC"){
        _mint(msg.sender, 10000000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        amount = amount * 10 ** decimals();
        _mint(to, amount);
    }
}
