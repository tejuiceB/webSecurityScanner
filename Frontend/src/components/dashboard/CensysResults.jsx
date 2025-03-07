const CensysResults = ({ censysData }) => {
  if (!censysData || Object.keys(censysData).length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Internet Exposure Analysis</h3>
      
      {/* Services */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Exposed Services</h4>
        <div className="grid gap-3">
          {censysData.services?.map((service, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="font-medium">{service.port}/{service.transport_protocol}</span>
                <span className="text-gray-600">{service.service_name}</span>
              </div>
              {service.software && (
                <div className="text-sm text-gray-600 mt-1">
                  Software: {service.software.map(s => s.version).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location Info */}
      {censysData.location && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Geographic Location</h4>
          <div className="p-3 bg-gray-50 rounded">
            <div>Country: {censysData.location.country}</div>
            {censysData.location.city && <div>City: {censysData.location.city}</div>}
          </div>
        </div>
      )}

      {/* Operating System */}
      {censysData.operating_system && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Operating System</h4>
          <div className="p-3 bg-gray-50 rounded">
            <div>{censysData.operating_system.product}</div>
            {censysData.operating_system.version && (
              <div className="text-sm text-gray-600">
                Version: {censysData.operating_system.version}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-4">
        Last Updated: {new Date(censysData.last_updated).toLocaleString()}
      </div>
    </div>
  );
};

export default CensysResults;
