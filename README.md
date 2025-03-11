# 📦 XRPL EVM Solidity Smart Contract Security Analyzer

[![npm version](https://badge.fury.io/js/xrpl-evm-auditor.svg)](https://badge.fury.io/js/xrpl-evm-auditor)

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

## 📜 License

MIT License

## 🌐 Links

- npm Package: https://www.npmjs.com/package/xrpl-evm-auditor

- GitHub Repo: https://github.com/hiddenciphers/xrpl-evm-auditor
