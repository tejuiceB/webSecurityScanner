import { useState } from 'react';
import ScanForm from '../components/dashboard/ScanForm';
import VulnerabilityList from '../components/dashboard/VulnerabilityList';
import SecurityScore from '../components/dashboard/SecurityScore';
import Alert from '../components/common/Alert';
import NmapResults from '../components/dashboard/NmapResults';
import CensysResults from '../components/dashboard/CensysResults';
import { generatePDFReport } from '../utils/reportGenerator';

const Dashboard = () => {
  const [scanResults, setScanResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedUrl, setScannedUrl] = useState('');

  const getCategoryFromAlert = (alert = '') => {
    const lowerAlert = alert.toLowerCase();
    if (lowerAlert.includes('sql') || lowerAlert.includes('injection')) return 'SQL Injection';
    if (lowerAlert.includes('xss')) return 'Cross-Site Scripting (XSS)';
    if (lowerAlert.includes('http') || lowerAlert.includes('https')) return 'HTTP Security';
    if (lowerAlert.includes('csrf')) return 'CSRF';
    if (lowerAlert.includes('auth') || lowerAlert.includes('login')) return 'Authentication';
    if (lowerAlert.includes('ssl') || lowerAlert.includes('tls')) return 'SSL/TLS Issues';
    return 'Other Vulnerabilities';
  };

  const startPolling = async (token, scanId) => {
    let attempts = 0;
    const maxAttempts = 180; // 15 minutes maximum (5s intervals)
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/results/${scanId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        console.log('Poll Results:', data);

        if (data.status === 'completed' || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setScanResults({
            alerts: data.results?.zap_scan?.alerts || [],
            nmap: data.results?.nmap_scan || {},
          });
          setLoading(false);
        }
        attempts++;
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(pollInterval);
        setError('Error while getting scan results');
        setLoading(false);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  };

  const handleStartScan = async (url) => {
    setLoading(true);
    setError(null);
    setScanResults(null);
    setScannedUrl(url);
    
    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username=tejuice&password=7889&grant_type=password'
      });

      const authData = await response.json();
      const token = authData.access_token;

      const scanResponse = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url, scan_type: 'full' })
      });

      if (!scanResponse.ok) {
        throw new Error(await scanResponse.text() || 'Failed to start scan');
      }

      const scanData = await scanResponse.json();
      console.log('Scan Response:', scanData);

      // Set results directly if available
      if (scanData.results?.zap_scan?.alerts) {
        setScanResults({
          alerts: scanData.results.zap_scan.alerts,
          nmap: scanData.results.nmap_scan || {},
          censys: scanData.results.censys_scan || {}
        });
        setLoading(false);
      } else {
        // Start polling for results
        startPolling(token, scanData.id);
      }

    } catch (err) {
      setError(err.message);
      console.error('Scan Error:', err);
      setLoading(false);
    }
  };

  const calculateScore = (alerts) => {
    let score = 100;
    alerts.forEach(alert => {
      if (alert.risk === 3) score -= 15;
      else if (alert.risk === 2) score -= 7;
      else if (alert.risk === 1) score -= 3;
    });
    return Math.max(0, score);
  };

  const calculateGrade = (alerts) => {
    const highCount = alerts.filter(a => a.risk === 3).length;
    const mediumCount = alerts.filter(a => a.risk === 2).length;
    if (highCount > 0) return 'F';
    if (mediumCount > 5) return 'F';
    if (mediumCount > 3) return 'D';
    if (mediumCount > 0) return 'C';
    return alerts.length > 0 ? 'B' : 'A';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Security Scanner</h1>
      
      <div className="grid gap-6">
        <ScanForm onSubmit={handleStartScan} isLoading={loading} />
        
        {error && <Alert type="error" message={error} />}

        {loading && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Scanning in progress... This may take several minutes.
          </div>
        )}

        {scanResults && (
          <div className="space-y-6">
            <SecurityScore 
              alerts={scanResults.alerts} 
              scanUrl={scannedUrl}
            />
            
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Security Alerts ({scanResults.alerts.length})</h2>
              <VulnerabilityList vulnerabilities={scanResults.alerts} />
              
              <div className="grid md:grid-cols-2 gap-4">
                <NmapResults nmapData={scanResults.nmap} />
                <CensysResults censysData={scanResults.censys} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
