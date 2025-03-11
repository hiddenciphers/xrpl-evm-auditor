// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WXRPDepositUnchecked {
    function deposit() external payable {
        // ❌ No require(msg.value > 0);
        // This is what we want to catch: 'Unchecked wXRP deposit value detected'
    }
}
