import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">
              Security Scanner
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
