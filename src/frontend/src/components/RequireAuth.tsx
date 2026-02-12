import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';
import { iconSizes, cardRadius, cardPadding, cardElevation } from '../lib/uiPolish';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.medium} max-w-md w-full text-center space-y-6`}>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className={`${iconSizes.lg} text-primary`} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Login Required</h2>
            <p className="text-muted-foreground">
              You need to be logged in to access this feature. Please login to continue.
            </p>
          </div>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            size="lg"
            className="w-full"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login with Internet Identity'}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
