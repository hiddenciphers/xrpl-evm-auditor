// --- analyzer.ts (Final Fix for Reentrancy Detection) ---

import { parseSolidityFile } from './parser';
import { generateMarkdownReport, generateJsonReport } from './reports';

export function analyzeContract(filePath: string, format: string) {
  const ast = parseSolidityFile(filePath);
  if (!ast) return;

  const issues: any[] = [];

  traverseASTForIssues(ast, issues);

  if (format === 'markdown') {
    console.log(generateMarkdownReport(filePath, issues));
  } else if (format === 'json') {
    console.log(JSON.stringify({ file: filePath, issues }, null, 2));
  } else {
    console.error('Invalid format specified. Use markdown or json.');
  }
}

function traverseASTForIssues(ast: any, issues: any[]) {
  const parser = require('@solidity-parser/parser');
  let insideFunction = false;
  let lowLevelCallDetected = false;

  parser.visit(ast, {
    // --- Detect tx.origin and block.timestamp ---
    MemberAccess(node: any) {
      if (node.memberName === 'origin' && node.expression.name === 'tx') {
        issues.push({
          type: 'Security',
          title: 'Use of tx.origin detected',
          description: 'Avoid using tx.origin for authorization. Use msg.sender instead.',
          location: node.loc
        });
      }
      if (node.expression.name === 'block' && node.memberName === 'timestamp') {
        issues.push({
          type: 'Security',
          title: 'Use of block.timestamp detected',
          description: 'block.timestamp can be manipulated by miners. Avoid for critical logic.',
          location: node.loc
        });
      }
    },

    // --- Detect Low-Level Calls and Unchecked Calls ---
    FunctionCall(node: any) {
      let memberName: string | null = null;

      if (node.expression.type === 'NameValueExpression' && node.expression.expression.type === 'MemberAccess') {
        memberName = node.expression.expression.memberName;
      }

      if (node.expression.type === 'MemberAccess') {
        memberName = node.expression.memberName;
      }

      if (memberName && ['call', 'delegatecall', 'send'].includes(memberName)) {
        lowLevelCallDetected = true;
        issues.push({
          type: 'Security',
          title: `Use of low-level ${memberName} detected`,
          description: `Avoid using low-level ${memberName}. Prefer checks-effects-interactions pattern.`,
          location: node.loc
        });

        // Check for unchecked call (basic detection)
        if (!node.expression.name && !node.expression.expression?.name) {
          issues.push({
            type: 'Security',
            title: `Unchecked ${memberName} return value detected`,
            description: `External call via ${memberName} is not checked. Use require(success).`,
            location: node.loc
          });
        }
      }

      // ERC20 functions detection
      const erc20Functions = ['transfer', 'transferFrom', 'approve'];
      if (memberName && erc20Functions.includes(memberName)) {
        issues.push({
          type: 'Security',
          title: `Unchecked ERC20 ${memberName} detected`,
          description: `Consider wrapping ${memberName} in require() to handle failures properly.`,
          location: node.loc
        });
      }

      // Detect blockhash and selfdestruct
      if (node.expression.type === 'Identifier') {
        if (node.expression.name === 'blockhash') {
          issues.push({
            type: 'Security',
            title: 'Use of blockhash detected',
            description: 'blockhash should not be used for randomness. It can be predictable.',
            location: node.loc
          });
        }
        if (node.expression.name === 'selfdestruct') {
          issues.push({
            type: 'Security',
            title: 'Use of selfdestruct detected',
            description: 'Use of selfdestruct can lead to unexpected contract removal. Use cautiously.',
            location: node.loc
          });
        }
      }
    },

    ExpressionStatement(node: any) {
      if (lowLevelCallDetected) {
        // Detect regular assignment (a = b)
        if (node.expression.type === 'Assignment') {
          issues.push({
            type: 'Security',
            title: 'Potential reentrancy vulnerability detected',
            description: 'State changes after external calls can enable reentrancy. Use checks-effects-interactions pattern.',
            location: node.loc
          });
        }
    
        // Detect compound assignments (a += b, a -= b, a *= b, etc.)
        if (node.expression.type === 'BinaryOperation' && ['+=', '-=', '*=', '/=', '%='].includes(node.expression.operator)) {
          issues.push({
            type: 'Security',
            title: 'Potential reentrancy vulnerability detected',
            description: 'State changes after external calls can enable reentrancy. Use checks-effects-interactions pattern.',
            location: node.loc
          });
        }
    
        // Detect unary operations (a++, a--)
        if (node.expression.type === 'UnaryOperation' && ['++', '--'].includes(node.expression.operator)) {
          issues.push({
            type: 'Security',
            title: 'Potential reentrancy vulnerability detected',
            description: 'State changes after external calls can enable reentrancy. Use checks-effects-interactions pattern.',
            location: node.loc
          });
        }
      }
    },

    // --- Detect unprotected state-changing public/external functions ---
    FunctionDefinition(node: any) {
      insideFunction = true;
      lowLevelCallDetected = false; // reset at function start

      const visibility = node.visibility;
      const stateMutability = node.stateMutability;
      const functionName = node.name || (node.isConstructor ? 'constructor' : (node.isReceiveEther ? 'receive' : (node.isFallback ? 'fallback' : 'unnamed')));
      const isStateChanging = !['pure', 'view'].includes(stateMutability || '');

      if (['public', 'external'].includes(visibility) && isStateChanging && (!node.modifiers || node.modifiers.length === 0)) {
        issues.push({
          type: 'Security',
          title: `Public/External function with state change lacks access control`,
          description: `Function "${functionName}" is public/external and changes state but has no access control modifier (e.g., onlyOwner).`,
          location: node.loc
        });
      }
    },

    // --- Reset state on function exit ---
    'FunctionDefinition:exit'() {
      insideFunction = false;
      lowLevelCallDetected = false;
    }
  });
}




