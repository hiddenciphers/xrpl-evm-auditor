// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WXRPWithdrawUnchecked {
    function withdraw(uint256 amount) external {
        // ❌ No require(amount > 0);
        // This is what we want to catch: 'Unchecked wXRP withdraw amount detected'
    }
}
