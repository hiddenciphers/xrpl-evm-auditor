// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimestampVulnerable {
    uint256 public lastAction;

    function update() public {
        lastAction = block.timestamp; // Should be flagged
    }
}
