
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Space, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 relative overflow-hidden">
      {/* Stars effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNSIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgNSA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSIyLjUiIGN5PSIyLjUiIHJyPSIwLjUiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K')] opacity-50"></div>
      
      <div className="w-full max-w-6xl mx-auto p-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-left space-y-6 animate-fade-in z-10">
          <h1 className="text-8xl font-bold text-white mb-2">404</h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-6">
            Lost in Space
          </h2>
          
          <div className="space-y-4 text-gray-300 max-w-lg">
            <p className="text-xl">
              You've reached the edge of the universe.
              The page you requested could not be found.
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              variant="default"
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8"
              onClick={() => window.location.href = '/'}
            >
              Go Home
              <Space className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10 rounded-full px-8"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-md animate-float">
          <img 
            src="/lovable-uploads/a7e38fc6-e5bd-4231-bbee-228e97e93ed9.png"
            alt="Astronaut"
            className="w-full h-auto transform rotate-12"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
