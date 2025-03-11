# Contributing to XRPL EVM Auditor

👋 **Thank you for considering contributing to XRPL EVM Auditor!**  
We welcome contributions to improve and extend this Solidity smart contract security analyzer for the XRPL EVM Sidechain.

---

## 📜 Code of Conduct

Please be respectful and considerate in all discussions. See [CODE OF CONDUCT](https://opensource.guide/code-of-conduct/) (if added later).

---

## ✅ How to Contribute

### 1. Fork the Repository

Click **Fork** at the top right of the [main repo](https://github.com/hiddenciphers/xrpl-evm-auditor).

### 2. Clone Your Fork

```
git clone https://github.com/YOUR-USERNAME/xrpl-evm-auditor.git
cd xrpl-evm-auditor
```

### 3. Create a Feature/Issue Branch

```
git checkout -b feature/your-feature-name
```

### 4. Install Dependencies

```
npm install
```

---

### 🧪 Running Tests

Please run tests and ensure they pass before submitting a PR.

```
npm test
```

✅ All PRs are required to pass tests (enforced via GitHub Actions).

---

### 💻 Development Workflow

#### Making a Contribution:

1. Create a branch for your feature or fix.

2. Commit your changes with clear commit messages.

3. Push your branch to your fork:

```
git push origin feature/your-feature-name
```

4. Open a Pull Request (PR) against main on the upstream repo.

---

### 🔐 Branch Protection Rules

- Direct pushes to main are blocked — all changes must go via Pull Requests.

- Passing tests are required before a PR can be merged.

- At least one review may be required before merge (if maintainers are set).

---

### ✅ Example Commit Message

```
feat: add detection for dangerous fallback functions

Fixes #12
```

---

### 🤝 Need Help?

Open an [Issue](https://github.com/hiddenciphers/xrpl-evm-auditor/issues) if you need help, or want to suggest features/bugs.

---

### 🙌 Thank You for Contributing!

Together, we can build a safer XRPL EVM ecosystem! 🚀

---

## 🧩 Contributing XRPL-Specific Security Rules

We also welcome XRPL EVM-specific security rules to detect vulnerabilities unique to XRPL EVM smart contracts.
These may include bridge interaction patterns, wXRP handling, oracle usage, or multi-signature patterns.

---

## 🎯 What are XRPL-Specific Rules?

Rules that target XRPL-specific behaviors or vulnerabilities that may not apply to standard EVM chains, including:

Unsafe use of wXRP (wrapped XRP) without proper validation.
Missing destination validation in XRPL bridge calls (e.g., sendToXRPL).
Incorrect use of XRPL oracles without verification of data sources.
Improper implementation of XRPL-aligned multi-signature or governance patterns.
Attempted native XRP transfers that don't follow XRPL EVM logic.

---

## ✍️ How to Propose a New Rule

To propose a rule, open an Issue using the format below:

<details> <summary>📜 Click to expand Rule Proposal Template</summary>

## 🚨 XRPL-Specific Rule Proposal

### 📜 Describe the Rule

> **What vulnerability, pattern, or behavior should this rule detect?**  
> Example: Detect unsafe handling of `wXRP.deposit{value: amount}();` without validating value/amount.

---

### 💡 Example of Bad Code (Should Trigger Warning)

```solidity
contract Example {
    function bridgeXRP(address dest, uint256 amount) public {
        bridge.sendToXRPL(dest, amount); // No validation on dest
    }
}
```

---

## ✅ Example of Good Code (Should NOT Trigger Warning)

```solidity
contract Example {
    function bridgeXRP(address dest, uint256 amount) public onlyOwner {
        require(dest != address(0), "Invalid destination");
        bridge.sendToXRPL(dest, amount);
    }
}
```

---

## 🧭 Why is this Important for XRPL EVM?

On XRPL EVM, failing to validate bridge destinations may cause unrecoverable locked assets.

---

## ✅ Optional

🔴 Suggested Severity:
Low / Medium / High

🛠 Suggested Fix or Refactor:

```
require(dest != address(0), "Invalid destination");
```

</details>

---

## 💡 Example Rule Ideas to Inspire You

- XRPL Bridge call validations (e.g., `sendToXRPL(dest, amount)` without `require(dest != address(0))`).
- Proper `wXRP` deposit/withdraw patterns.
- Safe oracle result handling.
- Multi-signature enforcement in alignment with XRPL governance.
- Incorrect native XRP transfer attempts inside EVM.

---

## 🤝 How to Submit a Rule

1. **Open an Issue** using the template above.
2. Provide good/bad code examples and reasoning.
3. (Optional) If you want to contribute code, open a PR implementing the rule!

---

## ⚙️ Why Help?

- Strengthen XRPL EVM security.
- Help other XRPL developers avoid common pitfalls.
- Showcase your expertise in the XRPL ecosystem.
- Contribute to making this **the standard security tool for XRPL EVM**!

---

🚀 **Ready to propose a rule? [Open an issue now](https://github.com/hiddenciphers/xrpl-evm-auditor/issues/new/choose)**
