import { useState, useEffect } from 'react';

const ScanProgress = ({ scanId }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    if (!scanId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/scan/${scanId}/progress`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        setProgress(data.progress);
        setStatus(data.status);

        if (data.progress === 100 || data.status === 'completed') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error fetching scan progress:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [scanId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Scan Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {status} ({progress}%)
      </div>
    </div>
  );
};

export default ScanProgress;
