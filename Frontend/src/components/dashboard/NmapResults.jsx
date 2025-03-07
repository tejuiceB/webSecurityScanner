const NmapResults = ({ nmapData }) => {
  if (!nmapData || Object.keys(nmapData).length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Network Scan Results</h3>
      
      {Object.entries(nmapData.hosts || {}).map(([host, data]) => (
        <div key={host} className="mb-6 border-b pb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-medium">Host: {host}</h4>
            <span className={`px-2 py-1 rounded text-sm ${
              data.state === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data.state}
            </span>
          </div>

          {data.ports && Object.entries(data.ports).map(([port, info]) => (
            <div key={port} className="ml-4 mb-2 p-2 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="font-medium">Port {port}</span>
                <span className="text-gray-600">{info.name || 'Unknown Service'}</span>
              </div>
              {info.product && (
                <div className="text-sm text-gray-600 mt-1">
                  {info.product} {info.version || ''}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="mt-4 text-sm text-gray-500">
        <div className="font-medium">Scan Command:</div>
        <code className="bg-gray-100 p-2 rounded block mt-1 overflow-x-auto">
          {nmapData.command || 'N/A'}
        </code>
      </div>
    </div>
  );
};

export default NmapResults;
