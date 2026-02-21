import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white border-2 border-black rounded-lg shadow-lg">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-4">Authentication Required</h2>
          <p className="text-gray-700 mb-6">
            You need to be logged in to access the admin panel.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white border-2 border-red-600 rounded-lg shadow-lg">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-4">Access Denied</h2>
          <p className="text-gray-700">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
