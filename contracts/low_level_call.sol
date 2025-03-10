// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LowLevelCall {
    function vulnerableCall(address payable recipient, uint256 amount) public {
        (bool success, ) = recipient.call{value: amount}("");
        // Missing require(success);
    }

    // To receive ETH
    receive() external payable {}
}
