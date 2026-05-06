const LAB_PATTERNS: [string, RegExp][] = [
  ["Invitae", /invitae/i],
  ["GeneDx", /genedx/i],
  ["Ambry Genetics", /ambry\s*genetics/i],
  ["Color Genomics", /color\s*(genomics|health)/i],
  ["Quest Diagnostics", /quest\s*diagnostics/i],
  ["Blueprint Genetics", /blueprint\s*genetics/i],
  ["Baylor Genetics", /baylor\s*genetics/i],
  ["Prevention Genetics", /prevention\s*genetics/i],
  ["Natera", /natera/i],
  ["Myriad Genetics", /myriad\s*genetics/i],
];

export function detectLab(rawText: string): string | null {
  const header = rawText.slice(0, 3000);
  for (const [name, pattern] of LAB_PATTERNS) {
    if (pattern.test(header)) return name;
  }
  return null;
}
