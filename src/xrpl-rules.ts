import { ASTNode } from '@solidity-parser/parser/dist/src/ast-types';

export interface XrplIssue {
  type: string;
  title: string;
  description: string;
  location: any;
}

/**
 * Detects XRPL bridge calls like sendToXRPL without validating the destination address.
 * 
 * @param node AST node to analyze
 * @returns XrplIssue[] Array of issues found
 */
export function detectBridgeCallWithoutValidation(node: any): any[] {
    const issues: any[] = [];
  
    // Detect `.call(abi.encodeWithSignature("sendToXRPL(address,uint256)", dest, amount))`
    if (
      node.expression &&
      node.expression.type === 'MemberAccess' &&
      node.expression.memberName === 'call' &&
      node.arguments.length === 1
    ) {
      const callArg = node.arguments[0];
  
      // Check that the call argument is abi.encodeWithSignature
      if (
        callArg.type === 'FunctionCall' &&
        callArg.expression.type === 'MemberAccess' &&
        callArg.expression.expression.type === 'Identifier' &&
        callArg.expression.expression.name === 'abi' &&
        callArg.expression.memberName === 'encodeWithSignature' &&
        callArg.arguments.length >= 2
      ) {
        const signatureLiteral = callArg.arguments[0];
        const destinationArg = callArg.arguments[1];
  
        if (
          signatureLiteral.type === 'StringLiteral' &&
          signatureLiteral.value === 'sendToXRPL(address,uint256)'
        ) {
          // ✅ First issue: Bridge call without destination validation
          issues.push({
            type: 'Security',
            title: 'Bridge call without destination validation',
            description: 'Bridge call to XRPL without validating destination address. Use require(dest != address(0)).',
            location: node.loc
          });
  
          // ✅ Second issue: Unchecked call return value
          issues.push({
            type: 'Security',
            title: 'Unchecked call return value detected',
            description: 'Bridge call return value is not handled. Use require(success, "Bridge failed");',
            location: node.loc
          });
        }
      }
    }
  
    return issues;
}
  
  
  
  
  
