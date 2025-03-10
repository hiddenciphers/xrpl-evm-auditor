# 📦 XRPL EVM Solidity Smart Contract Security Analyzer

A lightweight static analysis tool to detect common security vulnerabilities in Solidity smart contracts running on the XRPL EVM Sidechain.

## 🚀 Features

Detects tx.origin misuse.
Detects low-level calls: .call, .delegatecall, .send.
Detects unchecked ERC20 methods: transfer, approve, transferFrom.
Detects block.timestamp misuse.
Detects blockhash and selfdestruct usage.
Detects missing access control on state-changing public/external functions.
Outputs reports in Markdown or JSON formats.

## ⚙️ Installation

```
git clone https://github.com/hiddenciphers/xrpl-evm-auditor.git
cd xrpl-evm-auditor
npm install
```

## 💻 Usage

```
npm start analyze ./contracts/YourContract.sol --format markdown
```

- `--format markdown`: Output as Markdown.
- `--format json`: Output as JSON.

## 🧪 Run Tests

`npm test`

## 📄 Example

`npm start analyze ./contracts/sample.sol --format markdown
`

Example Output:

```
## Audit Report for ./contracts/sample.sol

## Issues Found (2)

### 1. Use of tx.origin detected

**Type:** Security

**Description:** Avoid using tx.origin for authorization. Use msg.sender instead.

**Location:** Line 12
```

## 📬 Contributions

PRs are welcome. Please open an issue to discuss your idea first.

## 📜 License

MIT License
