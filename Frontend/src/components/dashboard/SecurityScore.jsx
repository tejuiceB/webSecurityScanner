import { useState } from 'react';
import { generatePDFReport } from '../../utils/reportGenerator';
import Button from '../common/Button';

const SecurityScore = ({ alerts = [], scanUrl = '' }) => {
  const [generatingReport, setGeneratingReport] = useState(false);

  const calculateScore = () => {
    if (!alerts || !Array.isArray(alerts)) {
      return { score: 0, grade: 'F', details: 'No scan data available' };
    }

    let score = 100;
    let high = 0, medium = 0, low = 0, info = 0;
    const issues = { high: [], medium: [], low: [], info: [] };

    alerts.forEach(alert => {
      switch(alert.risk) {
        case 3: // High
          score -= 15;
          high++;
          issues.high.push(alert);
          break;
        case 2: // Medium
          score -= 7;
          medium++;
          issues.medium.push(alert);
          break;
        case 1: // Low
          score -= 3;
          low++;
          issues.low.push(alert);
          break;
        default:
          info++;
          issues.info.push(alert);
          break;
      }
    });

    score = Math.max(0, score);
    let grade = 'F';
    let description = '';

    if (high === 0 && medium === 0 && low < 5) {
      grade = 'A';
      description = 'Excellent security posture';
    } else if (high === 0 && medium < 3) {
      grade = 'B';
      description = 'Good security, minor improvements needed';
    } else if (high === 0 && medium < 5) {
      grade = 'C';
      description = 'Moderate security risks present';
    } else if (high < 2) {
      grade = 'D';
      description = 'Significant security concerns';
    } else {
      description = 'Critical security issues detected';
    }

    return { score, grade, description, counts: { high, medium, low, info }, issues };
  };

  const handleDownloadReport = async () => {
    setGeneratingReport(true);
    try {
      const { grade, score, counts, issues } = calculateScore();
      await generatePDFReport({
        issues,
        grade,
        score,
        scanDate: new Date(),
        target: scanUrl,
        counts
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const { score, grade, description, counts, issues } = calculateScore();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold">Security Score</h3>
        <Button
          onClick={handleDownloadReport}
          disabled={generatingReport}
          variant="primary"
        >
          {generatingReport ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
      </div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-4xl font-bold" style={{ 
            color: grade === 'A' ? '#22c55e' : 
                   grade === 'B' ? '#3b82f6' :
                   grade === 'C' ? '#eab308' :
                   grade === 'D' ? '#f97316' : '#ef4444'
          }}>
            {grade}
          </div>
          <div className="text-2xl text-gray-600 mt-2">{score}/100</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Vulnerability Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-red-600">High Risk: {counts.high}</div>
            <div className="text-orange-500">Medium Risk: {counts.medium}</div>
            <div className="text-yellow-500">Low Risk: {counts.low}</div>
            <div className="text-blue-500">Info: {counts.info}</div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Assessment:</p>
          <p>{description}</p>
        </div>

        {counts.high > 0 && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            ⚠️ Critical: Immediate attention required for {counts.high} high-risk vulnerabilities!
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityScore;
