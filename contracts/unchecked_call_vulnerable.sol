// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UncheckedCallVulnerable {
    function unsafeCall(address payable recipient, uint256 amount) external {
        recipient.call{value: amount}(""); // Unchecked call, no require(success)
    }

    receive() external payable {}
}
