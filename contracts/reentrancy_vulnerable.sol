// --- reentrancy_vulnerable.sol ---

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReentrancyVulnerable {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: _amount}(""); // Vulnerable call
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount; // State change AFTER external call (vulnerable)
    }
}
