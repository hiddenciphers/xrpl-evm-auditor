// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract UncheckedERC20 {
    function transferTokens(
        address token,
        address recipient,
        uint256 amount
    ) public {
        IERC20(token).transfer(recipient, amount); // Not checked with require()
    }
}
