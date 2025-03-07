import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Navbar from './components/layout/Navbar';
import Alert from './components/common/Alert';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [error, setError] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            {error && <Alert type="error" message={error} />}
            <Dashboard onError={setError} />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
