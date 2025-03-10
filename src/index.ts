#!/usr/bin/env node

import { Command } from 'commander';
import { analyzeContract } from './analyzer';

const program = new Command();

program
  .name('xrpl-evm-auditor')
  .description('XRPL EVM Smart Contract Security Analyzer')
  .version('0.1.0');

program
  .command('analyze')
  .description('Analyze a Solidity smart contract for vulnerabilities')
  .argument('<file>', 'Solidity contract file path')
  .option('-f, --format <format>', 'Output format: markdown or json', 'markdown')
  .action((file, options) => {
    analyzeContract(file, options.format);
  });

program.parse();