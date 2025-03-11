#!/usr/bin/env node

const { analyzeContract } = require('../dist/analyzer'); // Points to built code
const path = require('path');

// Parse CLI arguments
const args = process.argv.slice(2);

if (args.length < 3 || args[0] !== 'analyze') {
  console.error(`
Usage:
  xrpl-evm-auditor analyze <file_path> --format <format>

Example:
  xrpl-evm-auditor analyze ./contracts/MyContract.sol --format markdown

Options:
  --format markdown|json  Output format (default: markdown)
`);
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), args[1]);
const formatIndex = args.indexOf('--format');
const format = formatIndex !== -1 ? args[formatIndex + 1] : 'markdown';

// Call the analyzer
analyzeContract(filePath, format);
