// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract MultipleWritesSameSlot {
    uint256 public x;

    function update() public {
        x = 1;
        x = 2; // Multiple writes to same slot
        x = 3;
    }
}
