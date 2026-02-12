import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { CheckCircle, Crown, Home, User } from 'lucide-react';
import PremiumBadge from '../components/PremiumBadge';
import { iconSizes, cardPadding, rowSpacing } from '../lib/uiPolish';

export default function PremiumSuccess() {
  const navigate = useNavigate();

  const benefits = [
    'Ad-free reading experience',
    'Unlimited premium stories',
    'Exclusive content access',
    'Daily exclusive story',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center shadow-lg">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-4 border-background shadow-md">
              <CheckCircle className={iconSizes.lg} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Premium Active!</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to Premium. Enjoy all exclusive features.
          </p>
        </div>

        <div className={`bg-card rounded-xl ${cardPadding.default} ${rowSpacing.default} text-left border shadow-sm`}>
          <div className="flex items-center justify-center mb-2">
            <PremiumBadge variant="default" />
          </div>
          <h3 className="font-semibold text-center mb-4">Your Premium Benefits</h3>
          <div className={`${rowSpacing.default} text-sm`}>
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className={`${iconSizes.md} text-green-500 shrink-0 mt-0.5`} />
                <span className="flex-1">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={() => navigate({ to: '/' })}
          >
            <Home className={`${iconSizes.sm} mr-2`} />
            Go to Home
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={() => navigate({ to: '/profile' })}
          >
            <User className={`${iconSizes.sm} mr-2`} />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
