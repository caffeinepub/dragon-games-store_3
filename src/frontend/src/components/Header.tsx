import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  
  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      navigate({ to: '/' });
    } else {
      await login();
    }
  };

  return (
    <header className="bg-white border-b-2 border-black shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-md">
              <img 
                src="/assets/generated/dgs-logo.dim_200x200.png" 
                alt="DGS Logo" 
                className="w-14 h-14 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Dragon Games Store</h1>
              <p className="text-sm text-gray-600">Your Trusted Gaming Marketplace</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                onClick={() => navigate({ to: '/admin' })}
                variant="outline"
                className="border-black text-black hover:bg-gray-100"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
            >
              {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
