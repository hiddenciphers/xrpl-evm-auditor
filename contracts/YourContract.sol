// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YourContract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function isOwner() public view returns (bool) {
        return tx.origin == owner; // ❌ Bad practice: vulnerable to phishing
    }

    function withdraw() public {
        require(tx.origin == owner, "Not authorized"); // ❌ Bad practice again
        payable(msg.sender).transfer(address(this).balance);
    }

    // To receive ETH
    receive() external payable {}
}
