import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = async ({ issues, grade, score, scanDate, target, nmapResults, censysResults }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title and Header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text('Security Scan Report', pageWidth / 2, 20, { align: 'center' });

  // Target and Summary
  doc.setFontSize(12);
  doc.text(`Target: ${target}`, 20, 35);
  doc.text(`Scan Date: ${scanDate.toLocaleString()}`, 20, 42);
  doc.text(`Security Grade: ${grade}`, 20, 49);
  doc.text(`Security Score: ${score}/100`, 20, 56);

  // Vulnerability Summary Table
  const summaryData = [
    ['Risk Level', 'Count', 'Impact'],
    ['High Risk', issues.high.length, 'Critical - Immediate Action Required'],
    ['Medium Risk', issues.medium.length, 'Important - Action Required'],
    ['Low Risk', issues.low.length, 'Moderate - Should be Addressed'],
    ['Informational', issues.info.length, 'Low - Good to Know']
  ];

  doc.autoTable({
    startY: 65,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 10 }
  });

  // Detailed Findings
  let currentY = doc.lastAutoTable.finalY + 15;

  // High Risk Vulnerabilities
  if (issues.high.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(192, 57, 43);
    doc.text('High Risk Vulnerabilities', 20, currentY);
    
    doc.autoTable({
      startY: currentY + 5,
      head: [['Vulnerability', 'Description', 'Solution']],
      body: issues.high.map(v => [v.name, v.description, v.solution]),
      theme: 'striped',
      headStyles: { fillColor: [192, 57, 43] },
      styles: { fontSize: 9 }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Add Network Scan Results
  if (Object.keys(nmapResults).length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Network Scan Results', 20, 20);
    
    const nmapData = Object.entries(nmapResults.hosts || {}).map(([host, data]) => [
      host,
      data.state,
      Object.keys(data.ports || {}).join(', ')
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Host', 'State', 'Open Ports']],
      body: nmapData,
      theme: 'grid'
    });
  }

  // Save the PDF
  const fileName = `security-scan-${target.replace(/[^a-z0-9]/gi, '_')}-${scanDate.toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  console.log('PDF Report generated successfully:', fileName);
};
