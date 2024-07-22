// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface IABBYManager {
  function setClaimableTimestamp(
    uint256 claimDate,
    bytes32[] calldata depositIds
  ) external;

  /**
   * @notice Event emitted when claimable timestamp is set
   *
   * @param claimTimestamp The timestamp at which the mint can be claimed
   * @param depositId      The depositId that can claim at the given 
                           `claimTimestamp`
   */
  event ClaimableTimestampSet(
    uint256 indexed claimTimestamp,
    bytes32 indexed depositId
  );

  /// ERRORS ///
  error MintNotYetClaimable();
  error ClaimableTimestampInPast();
  error ClaimableTimestampNotSet();
}
