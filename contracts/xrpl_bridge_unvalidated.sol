// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract XRPLBridgeExample {
    address public bridge;

    constructor(address _bridge) {
        bridge = _bridge;
    }

    function bridgeXRP(address dest, uint256 amount) public {
        // ❌ No validation of destination address
        bridge.call(
            abi.encodeWithSignature("sendToXRPL(address,uint256)", dest, amount)
        );
    }

    function bridgeSafeXRP(address dest, uint256 amount) public {
        // ✅ Proper validation
        require(dest != address(0), "Invalid destination");
        bridge.call(
            abi.encodeWithSignature("sendToXRPL(address,uint256)", dest, amount)
        );
    }
}
