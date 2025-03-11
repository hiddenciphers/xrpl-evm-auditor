---
name: "\U0001F6A8 XRPL-Specific Security Rule Proposal"
about: Propose a new XRPL EVM-specific security rule to detect vulnerabilities
title: "[RULE PROPOSAL] Brief title for the rule"
labels: security-rule
assignees: ""
---

## 🚨 XRPL-Specific Rule Proposal

### 📜 Describe the Rule

> **What vulnerability, pattern, or behavior should this rule detect?**  
> Example: Detect unsafe handling of `wXRP.deposit{value: amount}();` without validating value/amount.

---

### 💡 Example of Bad Code (Should Trigger Warning)

```solidity
// Example of vulnerable or improper code that should be flagged

contract Example {
    function bridgeXRP(address dest, uint256 amount) public {
        bridge.sendToXRPL(dest, amount); // No validation on dest
    }
}
```

---

## ✅ Example of Good Code (Should NOT Trigger Warning)

```solidity
// Example of proper/secure code that should pass without issues

contract Example {
    function bridgeXRP(address dest, uint256 amount) public onlyOwner {
        require(dest != address(0), "Invalid destination");
        bridge.sendToXRPL(dest, amount);
    }
}
```

---

## 🧭 Why is this Important for XRPL EVM?

Why is this unique to XRPL EVM? What risks are involved if ignored?

---

## ✅ Optional

🔴 Suggested Severity: Low / Medium / High

🛠 Suggested Fix or Refactor (Example):

```typescript
require(dest != address(0), "Invalid destination");
```
