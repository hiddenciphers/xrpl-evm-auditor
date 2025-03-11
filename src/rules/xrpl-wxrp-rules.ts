import parser from '@solidity-parser/parser';

export function detectWXRPDepositWithdrawIssues(node: any, currentFunction: any): any[] {
  const issues: any[] = [];

  const depositNames = ['deposit', 'wrap', 'mint'];
  const withdrawNames = ['withdraw', 'unwrap', 'burn'];

  // Deposit detection
  if (currentFunction && depositNames.includes(currentFunction.name)) {
    let hasMsgValue = false;
    let hasRequireMsgValue = false;

    parser.visit(currentFunction, {
      MemberAccess(innerNode: any) {
        if (innerNode.expression.name === 'msg' && innerNode.memberName === 'value') {
          hasMsgValue = true;
        }
      },
      FunctionCall(innerNode: any) {
        if (innerNode.expression.name === 'require' &&
            innerNode.arguments.length &&
            innerNode.arguments[0].operator === '>' &&
            innerNode.arguments[0].left.expression?.name === 'msg' &&
            innerNode.arguments[0].left.memberName === 'value'
        ) {
          hasRequireMsgValue = true;
        }
      }
    });

    if (hasMsgValue && !hasRequireMsgValue) {
      issues.push({
        type: 'Security',
        title: 'Unchecked wXRP deposit value detected',
        description: 'Deposit function uses msg.value but does not validate it properly.',
        location: node.loc
      });
    }
  }

  // Withdraw detection
  if (currentFunction && withdrawNames.includes(currentFunction.name)) {
    let hasRequireAmount = false;

    parser.visit(currentFunction, {
      FunctionCall(innerNode: any) {
        if (innerNode.expression.name === 'require' &&
            innerNode.arguments.length &&
            innerNode.arguments[0].operator === '>' &&
            innerNode.arguments[0].left.name === 'amount'
        ) {
          hasRequireAmount = true;
        }
      }
    });

    if (!hasRequireAmount) {
      issues.push({
        type: 'Security',
        title: 'Unchecked wXRP withdraw amount detected',
        description: 'Withdraw function does not validate withdrawal amount properly.',
        location: node.loc
      });
    }
  }

  return issues;
}
