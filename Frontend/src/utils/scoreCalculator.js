export const calculateSecurityScore = (scanResults) => {
  let score = 100;
  const weights = {
    HIGH: 10,
    MEDIUM: 5,
    LOW: 2
  };

  if (!scanResults) return { score: 0, grade: 'F' };

  // Calculate deductions based on vulnerabilities
  scanResults.forEach(vulnerability => {
    score -= weights[vulnerability.severity] || 0;
  });

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  // Convert score to grade
  let grade;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  return { score, grade };
};
