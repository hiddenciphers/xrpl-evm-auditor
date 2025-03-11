// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract StateWriteLoop {
    uint256 public total;
    function accumulate(uint256[] calldata data) public {
        for (uint256 i = 0; i < data.length; i++) {
            total += data[i]; // Gas costly: writes to storage inside loop
        }
    }
}
