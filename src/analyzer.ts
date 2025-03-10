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
  require('@solidity-parser/parser').visit(ast, {
    // ✅ Detect tx.origin usage and block.timestamp
    MemberAccess(node: any) {
      if (node.memberName === 'origin' && node.expression.name === 'tx') {
        issues.push({
          type: 'Security',
          title: 'Use of tx.origin detected',
          description: 'Avoid using tx.origin for authorization. Use msg.sender instead.',
          location: node.loc
        });
      }

      // ✅ Detect block.timestamp properly
      if (node.expression.name === 'block' && node.memberName === 'timestamp') {
        issues.push({
          type: 'Security',
          title: 'Use of block.timestamp detected',
          description: 'block.timestamp can be manipulated by miners. Avoid for critical logic (e.g., randomness).',
          location: node.loc
        });
      }
    },

    // ✅ Detect FunctionCall issues including low-level calls and ERC20 transfers
    FunctionCall(node: any) {
      let memberName: string | null = null;
    
      // ✅ Handle recipient.call{value: amount}("") pattern
      if (node.expression.type === 'NameValueExpression') {
        if (node.expression.expression.type === 'MemberAccess') {
          memberName = node.expression.expression.memberName;
        }
      }
    
      // ✅ Handle recipient.call("") pattern
      if (node.expression.type === 'MemberAccess') {
        memberName = node.expression.memberName;
      }
    
      // ✅ Detect low-level calls (call, delegatecall, send)
      if (memberName && ['call', 'delegatecall', 'send'].includes(memberName)) {
        issues.push({
          type: 'Security',
          title: `Use of low-level ${memberName} detected`,
          description: `Avoid using low-level ${memberName}. It can introduce reentrancy vulnerabilities. Prefer function calls or use checks-effects-interactions pattern.`,
          location: node.loc
        });
      }
    
      // ✅ Detect unchecked ERC20 functions (transfer, transferFrom, approve)
      const erc20Functions = ['transfer', 'transferFrom', 'approve'];
      if (memberName && erc20Functions.includes(memberName)) {
        issues.push({
          type: 'Security',
          title: `Unchecked ERC20 ${memberName} detected`,
          description: `Consider wrapping ${memberName} in a require() to handle failures properly.`,
          location: node.loc
        });
      }
    
      // ✅ Detect blockhash and selfdestruct
      if (node.expression.type === 'Identifier') {
        if (node.expression.name === 'blockhash') {
          issues.push({
            type: 'Security',
            title: 'Use of blockhash detected',
            description: 'blockhash should not be used for randomness or critical logic. It can be predictable.',
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

    // ✅ Detect public/external state-changing functions lacking access control
    FunctionDefinition(node: any) {
      const visibility = node.visibility;
      const stateMutability = node.stateMutability;
      const functionName = node.name || (node.isConstructor ? 'constructor' : (node.isReceiveEther ? 'receive' : (node.isFallback ? 'fallback' : 'unnamed')));
      const isStateChanging = !['pure', 'view'].includes(stateMutability || '');

      if (['public', 'external'].includes(visibility) && isStateChanging) {
        const hasModifier = (node.modifiers && node.modifiers.length > 0);
        if (!hasModifier) {
          issues.push({
            type: 'Security',
            title: `Public/External function with state change lacks access control`,
            description: `Function "${functionName}" is public/external and changes state but has no access control modifier (e.g., onlyOwner).`,
            location: node.loc
          });
        }
      }
    }
  });
}



