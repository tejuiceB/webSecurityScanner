const Button = ({ children, loading, variant = 'primary', ...props }) => {
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]}`} 
      disabled={loading} 
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : children}
    </button>
  );
};

export default Button;
