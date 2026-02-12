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

  const handleSubscribe = () => {
    updateUserState({ isPremium: true });
    navigate({ to: '/premium/success' });
  };

  const benefits = [
    'No ads',
    'Unlimited premium stories',
    'Exclusive content',
    'Daily exclusive story',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/profile' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">{t('goPremium', language)}</h1>
      </div>

      <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-8 text-white mb-6">
        <Crown className="w-16 h-16 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Unlock Premium</h2>
        <p className="text-white/90">Get unlimited access to all stories and features</p>
      </div>

      <div className="bg-card rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Premium Benefits</h3>
        <div className="space-y-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <div className="bg-card rounded-xl p-6 border-2 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Yearly Plan</h3>
              <p className="text-sm text-muted-foreground">Best value</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹799</p>
              <p className="text-sm text-muted-foreground">/year</p>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={handleSubscribe}>
            Subscribe Now
          </Button>
        </div>

        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Monthly Plan</h3>
              <p className="text-sm text-muted-foreground">Flexible billing</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹99</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>
          <Button className="w-full" variant="outline" size="lg" onClick={handleSubscribe}>
            Subscribe Now
          </Button>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-6">
        This is a placeholder subscription. No actual payment will be processed.
      </p>
    </div>
  );
}
