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

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/918757242995', '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="bg-white border-b-2 border-black shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Steam and WhatsApp Icons */}
            <div className="flex flex-col gap-2 mr-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/assets/generated/steam-icon.dim_64x64.png" 
                  alt="Steam" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <button
                onClick={handleWhatsAppClick}
                className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Contact us on WhatsApp"
              >
                <img 
                  src="/assets/generated/whatsapp-icon.dim_64x64.png" 
                  alt="WhatsApp" 
                  className="w-10 h-10 object-contain"
                />
              </button>
            </div>

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
          </div>

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
