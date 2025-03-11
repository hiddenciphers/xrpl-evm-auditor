// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract ExpensiveComputationLoop {
    uint256 public total;

    function compute(uint256[] calldata data) public {
        for (uint256 i = 0; i < data.length; i++) {
            total += (data[i] ** 3) / 2; // Complex computation inside loop
        }
    }
}
