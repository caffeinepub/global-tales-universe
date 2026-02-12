import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { CheckCircle, Crown, Home } from 'lucide-react';

export default function PremiumSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-4 border-background">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Subscribed successfully!</h1>
          <p className="text-lg text-muted-foreground">Enjoy premium features.</p>
        </div>

        <div className="bg-card rounded-xl p-6 space-y-3 text-left">
          <h3 className="font-semibold text-center mb-4">Your Premium Benefits</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>No ads • Ad-free experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>Unlimited premium stories</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>Exclusive content</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>Daily exclusive story</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={() => navigate({ to: '/' })}>
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/profile' })}>
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
