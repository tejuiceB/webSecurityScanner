import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen py-6 px-4">
      <div className="space-y-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Security Scanner</h2>
        </div>
        
        <nav className="space-y-2">
          <Link 
            to="/"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link 
            to="/scans"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Past Scans
          </Link>
          <Link 
            to="/reports"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Reports
          </Link>
          <Link 
            to="/settings"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Settings
          </Link>
        </nav>

        <div className="pt-8 mt-8 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            <p>Scan Status</p>
            <div className="mt-2 flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
