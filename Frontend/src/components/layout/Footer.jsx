const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Security Scanner</h3>
            <p className="text-gray-400 text-sm">
              Advanced web security scanning and vulnerability detection
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="/docs" className="hover:text-white">Documentation</a></li>
              <li><a href="/api" className="hover:text-white">API</a></li>
              <li><a href="/support" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Email: support@securityscanner.com</li>
              <li>GitHub: github.com/security-scanner</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Security Scanner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
