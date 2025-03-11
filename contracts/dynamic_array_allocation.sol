// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract DynamicArrayUsage {
    uint256[] public data;

    function allocate(uint256 length) public {
        uint256[] memory temp = new uint256[](length); // Unnecessary dynamic array
        for (uint256 i = 0; i < length; i++) {
            temp[i] = i;
        }
        // Only storing sum, could optimize
        uint256 sum;
        for (uint256 i = 0; i < length; i++) {
            sum += temp[i];
        }
        data.push(sum);
    }
}
