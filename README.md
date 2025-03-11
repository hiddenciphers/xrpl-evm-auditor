# 📦 XRPL EVM Solidity Smart Contract Security Analyzer

[![npm version](https://badge.fury.io/js/xrpl-evm-auditor.svg)](https://badge.fury.io/js/xrpl-evm-auditor)
[![GitHub release](https://img.shields.io/github/v/release/hiddenciphers/xrpl-evm-auditor)](https://github.com/hiddenciphers/xrpl-evm-auditor/releases)

A lightweight static analysis tool to detect common security vulnerabilities in Solidity smart contracts running on the XRPL EVM Sidechain.

## 🚀 Features

- 🔐 Detects tx.origin misuse.
- ⚙️ Detects low-level calls: .call, .delegatecall, .send.
- 💸 Detects unchecked ERC20 methods: transfer, approve, transferFrom.
- ⏰ Detects block.timestamp misuse.
- ⚔️ Detects dangerous opcodes: blockhash, selfdestruct.
- 🚪 Detects missing access control on state-changing public/external functions.
- 💨 Detects gas optimization issues: unbounded loops, storage writes inside loops, multiple writes to the same storage slot.
- 📜 Outputs reports in Markdown or JSON formats.

## 🎯 Why XRPL EVM-Specific?

While tools like Slither and Mythril are designed for Ethereum, **xrpl-evm-auditor** focuses on **XRPL EVM sidechain**, offering:

| Feature                                    | Why it matters for XRPL EVM                                     |
| ------------------------------------------ | --------------------------------------------------------------- |
| **Lightweight CLI-first analyzer**         | Fast security checks for XRPL EVM dApps and grants.             |
| **Pipeline-ready, GitHub CI/CD friendly**  | Easy integration to **block vulnerable contracts at PR level**. |
| **Markdown/JSON output**                   | Developer and client-shareable audit reports.                   |
| **XRPL ecosystem alignment (coming soon)** | Specific rules for XRPL bridges, wrapped XRP, governance.       |

---

## 🔮 Coming Soon (Next Releases)

- 🚀 **Bridge interaction patterns** detection (safe XRPL sidechain bridging).
- 💎 **Wrapped XRP handling** safety checks.
- 🔗 **Oracle usage** validation.
- 🏦 **XRPL-friendly multi-signature** pattern checks.
- 👥 **Governance models** tailored to XRPL expectations.
- ⚙️ **GitHub Actions** integration for automatic contract auditing.

## ⚙️ Installation (Optional for local use)

```
git clone https://github.com/hiddenciphers/xrpl-evm-auditor.git
cd xrpl-evm-auditor
npm install
```

## 💻 Usage (via NPX — no install required)

Analyze a Solidity contract directly:

```
npx xrpl-evm-auditor analyze ./contracts/YourContract.sol --format markdown
```

### Options:

- `--format markdown`: Output as Markdown.
- `--format json`: Output as JSON.

## 🧪 Run Tests (if cloned locally)

`npm test`

## 📄 Example Usage & Output

`npm start analyze ./contracts/sample.sol --format markdown
`

Example Output (Markdown):

```
# Audit Report for ./contracts/sample.sol

## Issues Found (2)

### 1. Use of tx.origin detected

**Type:** Security

**Description:** Avoid using tx.origin for authorization. Use msg.sender instead.

**Location:** Line 12
```

## 📬 Contributions

PRs are welcome! Please open an issue to discuss any major changes or ideas first.

📖 **See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.**

## 📜 License

MIT License

## 🌐 Links

- npm Package: https://www.npmjs.com/package/xrpl-evm-auditor

- GitHub Repo: https://github.com/hiddenciphers/xrpl-evm-auditor
