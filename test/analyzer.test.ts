import { analyzeContract } from '../src/analyzer';
import { detectWXRPDepositWithdrawIssues } from '../src/xrpl-wxrp-rules';
import path from 'path';

describe('Security Analyzer', () => {
  const testCases = [
    {
      file: 'tx_origin_vulnerable.sol',
      expectedIssues: ['Use of tx.origin detected']
    },
    {
      file: 'low_level_call.sol',
      expectedIssues: ['Use of low-level call detected', 'Unchecked call return value detected']
    },
    {
      file: 'unchecked_erc20.sol',
      expectedIssues: ['Unchecked ERC20 transfer detected']
    },
    {
      file: 'timestamp_vulnerable.sol',
      expectedIssues: ['Use of block.timestamp detected']
    },
    {
      file: 'access_control_missing.sol',
      expectedIssues: ['Public/External function with state change lacks access control']
    },
    {
      file: 'safe_contract.sol',
      expectedIssues: [] // Safe contract should have no issues
    },
    // ✅ Combined vulnerability cases
    {
      file: 'reentrancy_vulnerable.sol',
      expectedIssues: [
        'Use of low-level call detected',
        'Unchecked call return value detected',
        'Potential reentrancy vulnerability detected'
      ]
    },
    {
      file: 'unchecked_call_vulnerable.sol',
      expectedIssues: ['Use of low-level call detected', 'Unchecked call return value detected']
    },
    // ✅ Gas Optimization test cases with consistent wording
    {
      file: 'unbounded_loop.sol',
      expectedIssues: ['Gas optimization issue: Expensive computation inside loop detected', 'Gas optimization issue: Unbounded loop detected']
    },
    {
      file: 'state_write_loop.sol',
      expectedIssues: ['Gas optimization issue: Storage write inside loop detected']
    },
    {
      file: 'multiple_write_same_slot.sol',
      expectedIssues: ['Gas optimization issue: Multiple writes to same storage slot']
    },
    {
      file: 'dynamic_array_allocation.sol',
      expectedIssues: ['Gas optimization issue: Dynamic array allocation detected']
    },
    {
      file: 'expensive_computation_loop.sol',
      expectedIssues: ['Gas optimization issue: Expensive computation inside loop detected']
    },

    // XRPL test cases
    {
      file: 'wxrp_deposit_unchecked.sol',
      expectedIssues: ['Unchecked wXRP deposit value detected']
    },
    {
      file: 'wxrp_withdraw_unchecked.sol',
      expectedIssues: ['Unchecked wXRP withdraw amount detected']
    }
    
  ];

  testCases.forEach(({ file, expectedIssues }) => {
    test(`Analyzes ${file} correctly`, () => {
      const filePath = path.join(__dirname, '../contracts/', file);

      // Create a more robust console.log spy
      const originalLog = console.log;
      let capturedOutput = '';
      
      console.log = jest.fn().mockImplementation((output) => {
        capturedOutput = output;
      });

      // Run the analyzer
      analyzeContract(filePath, 'json');
      
      // Restore console.log
      console.log = originalLog;

      // Parse the captured output
      let issues: string[] = [];
      try {
        const parsed = JSON.parse(capturedOutput);
        issues = parsed.issues.map((issue: any) => issue.title);
      } catch (e) {
        console.error('Failed to parse JSON output:', e);
      }

      // Log the actual issues for debugging
      console.log(`Expected issues for ${file}:`, expectedIssues);
      console.log(`Actual issues for ${file}:`, issues);

      // Assert all expected issues are detected
      expectedIssues.forEach(expected => {
        expect(issues).toContain(expected);
      });

      // Assert no extra issues if none expected
      if (expectedIssues.length === 0) {
        expect(issues.length).toBe(0);
      }

      // Special check for problematic cases
      if (
        ['low_level_call.sol', 'reentrancy_vulnerable.sol', 'unchecked_call_vulnerable.sol'].includes(file) &&
        !issues.includes('Use of low-level call detected')
      ) {
        fail(`Expected to find 'Use of low-level call detected' in ${file} but did not`);
      }

      if (
        ['state_write_loop.sol'].includes(file) &&
        !issues.includes('Gas optimization issue: Storage write inside loop detected')
      ) {
        fail(`Expected to find 'Gas optimization issue: Storage write inside loop detected' in ${file} but did not`);
      }

      if (
        ['multiple_write_same_slot.sol'].includes(file) &&
        !issues.includes('Gas optimization issue: Multiple writes to same storage slot')
      ) {
        fail(`Expected to find 'Gas optimization issue: Multiple writes to same storage slot' in ${file} but did not`);
      }
    });
  });
  test('Analyzes xrpl_bridge_unvalidated.sol correctly', () => {
    const filePath = path.join(__dirname, '../contracts/xrpl_bridge_unvalidated.sol');
    const expectedIssues = [
      'Bridge call without destination validation',
      'Unchecked call return value detected'
    ];
  
    const originalLog = console.log;
    let capturedOutput = '';
  
    console.log = jest.fn().mockImplementation((output) => {
      capturedOutput = output;
    });
  
    analyzeContract(filePath, 'json');
    console.log = originalLog;
  
    let issues: string[] = [];
    try {
      const parsed = JSON.parse(capturedOutput);
      issues = parsed.issues.map((issue: any) => issue.title);
    } catch (e) {
      console.error('Failed to parse JSON output:', e);
    }
  
    console.log('Expected issues for xrpl_bridge_unvalidated.sol:', expectedIssues);
    console.log('Actual issues for xrpl_bridge_unvalidated.sol:', issues);
  
    expect(issues).toEqual(expect.arrayContaining(expectedIssues));
  });   
});



