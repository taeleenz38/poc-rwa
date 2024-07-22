// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "contracts/external/openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol";

contract AllowlistProxy is TransparentUpgradeableProxy {
  constructor(
    address _logic,
    address _admin,
    bytes memory _data
  ) TransparentUpgradeableProxy(_logic, _admin, _data) {}
}
