import fs from 'fs';
const parser = require('@solidity-parser/parser');


export function parseSolidityFile(filePath: string): any | null {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const ast = parser.parse(content, { loc: true, range: true });
    return ast;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error parsing Solidity file:', err.message);
    } else {
      console.error('Unknown error parsing Solidity file:', err);
    }
    return null;
  }
}
