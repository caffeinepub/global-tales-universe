import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { t } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { ArrowLeft, Check, Crown } from 'lucide-react';
import { Separator } from '../components/ui/separator';

export default function GoPremium() {
  const navigate = useNavigate();
  const { language } = usePreferences();
  const { updateUserState } = useAppUser();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (isSubscribing) return;
    
    setIsSubscribing(true);
    setSelectedPlan(plan);
    
    // Simulate brief processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateUserState({ isPremium: true });
    navigate({ to: '/premium/success' });
  };

  const benefits = [
    { text: 'No ads', description: 'Ad-free reading experience' },
    { text: 'Unlimited premium stories', description: 'Access all exclusive content' },
    { text: 'Exclusive content', description: 'Early access to new stories' },
    { text: 'Daily exclusive story', description: 'Fresh content every day' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate({ to: '/profile' })}
          disabled={isSubscribing}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">{t('goPremium', language)}</h1>
      </div>

      <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <Crown className="w-16 h-16 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Unlock Premium</h2>
        <p className="text-white/90 text-lg">Get unlimited access to all stories and features</p>
      </div>

      <div className="bg-card rounded-xl p-6 mb-8 border shadow-sm">
        <h3 className="font-semibold text-lg mb-5">Premium Benefits</h3>
        <div className="space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit.text} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{benefit.text}</p>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <div 
          className={`bg-card rounded-xl p-6 border-2 transition-all cursor-pointer ${
            selectedPlan === 'yearly' 
              ? 'border-primary shadow-lg scale-[1.02]' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => !isSubscribing && setSelectedPlan('yearly')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">Yearly Plan</h3>
                <span className="text-xs font-semibold bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 33%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Best value • ₹67/month</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹799</p>
              <p className="text-sm text-muted-foreground">/year</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={(e) => {
              e.stopPropagation();
              handleSubscribe('yearly');
            }}
            disabled={isSubscribing}
          >
            {isSubscribing && selectedPlan === 'yearly' ? 'Processing...' : 'Subscribe Now'}
          </Button>
        </div>

        <div 
          className={`bg-card rounded-xl p-6 border-2 transition-all cursor-pointer ${
            selectedPlan === 'monthly' 
              ? 'border-primary shadow-lg scale-[1.02]' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => !isSubscribing && setSelectedPlan('monthly')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg">Monthly Plan</h3>
              <p className="text-sm text-muted-foreground">Flexible billing</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹99</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            variant="outline" 
            size="lg" 
            onClick={(e) => {
              e.stopPropagation();
              handleSubscribe('monthly');
            }}
            disabled={isSubscribing}
          >
            {isSubscribing && selectedPlan === 'monthly' ? 'Processing...' : 'Subscribe Now'}
          </Button>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-8 leading-relaxed">
        This is a placeholder subscription. No actual payment will be processed.
        <br />
        Cancel anytime from your profile settings.
      </p>
    </div>
  );
}
