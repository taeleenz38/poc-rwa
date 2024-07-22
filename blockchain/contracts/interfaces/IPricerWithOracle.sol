// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "contracts/interfaces/IPricer.sol";

interface IPricerWithOracle is IPricer {
  /**
   * @notice Updates a price in the pricer by pulling it from the oracle
   */
  function addLatestOraclePrice() external;
}
