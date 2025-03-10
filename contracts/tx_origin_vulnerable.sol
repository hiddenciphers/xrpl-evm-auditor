// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TxOriginVulnerable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function isOwner() public view returns (bool) {
        return tx.origin == owner;
    }
}
