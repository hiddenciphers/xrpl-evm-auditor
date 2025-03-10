import { analyzeContract } from '../src/analyzer';
import path from 'path';

describe('Security Analyzer', () => {
  const testCases = [
    {
      file: 'tx_origin_vulnerable.sol',
      expectedIssues: ['Use of tx.origin detected']
    },
    {
      file: 'low_level_call.sol',
      expectedIssues: ['Use of low-level call detected']
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
    }
  ];

  testCases.forEach(({ file, expectedIssues }) => {
    test(`Analyzes ${file} correctly`, () => {
      const filePath = path.join(__dirname, '../contracts/', file);

      // Mock console.log to capture output from analyzeContract
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      let issues: any[] = [];

      // ✅ Override console.log to capture JSON output when format === 'json'
      const mockConsoleLog = (output: string) => {
        try {
          const parsed = JSON.parse(output);
          issues = parsed.issues.map((issue: any) => issue.title); // Capture only titles for comparison
        } catch (e) {
          // Ignore invalid JSON (if any)
        }
      };

      consoleSpy.mockImplementation(mockConsoleLog);

      // ✅ Run the real analyzer with json output
      analyzeContract(filePath, 'json');

      consoleSpy.mockRestore(); // Clean up mock

      // ✅ Assert expected issues are detected
      expectedIssues.forEach(expected => {
        expect(issues).toContain(expected);
      });

      // ✅ Assert no extra issues if none expected
      if (expectedIssues.length === 0) {
        expect(issues.length).toBe(0);
      }
    });
  });
});
