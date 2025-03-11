// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract UnboundedLoop {
    uint256[] public data;

    function process() public {
        for (uint256 i = 0; i < data.length; i++) {
            data[i] = data[i] * 2; // Gas grows with array size
        }
    }
}
