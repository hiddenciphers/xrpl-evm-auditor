export function generateMarkdownReport(filePath: string, issues: any[]): string {
  let output = `# Audit Report for ${filePath}\n\n`;
  if (issues.length === 0) {
    output += `✅ No vulnerabilities detected.\n`;
  } else {
    output += `## Issues Found (${issues.length})\n`;
    issues.forEach((issue, idx) => {
      output += `\n### ${idx + 1}. ${issue.title}\n`;
      output += `**Type:** ${issue.type}\n\n`;
      output += `**Description:** ${issue.description}\n\n`;
      output += `**Location:** Line ${issue.location.start.line}\n`;
    });
  }
  return output;
}

export function generateJsonReport(filePath: string, issues: any[]): object {
  return { file: filePath, issues };
}