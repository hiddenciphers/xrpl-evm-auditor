// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControlMissing {
    uint256 public value;

    function updateValue(uint256 newValue) public {
        value = newValue; // No onlyOwner or access control
    }
}
