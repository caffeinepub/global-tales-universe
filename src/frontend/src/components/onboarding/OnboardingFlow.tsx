import { useState } from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { setOnboardingCompleted } from '../../lib/onboarding';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import StepTransition from './StepTransition';
import type { UILanguage, AgeMode } from '../../context/PreferencesContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const { language, setLanguage, mode, setMode } = usePreferences();
  const { theme, setTheme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [selectedLanguage, setSelectedLanguage] = useState<UILanguage>(language);
  const [selectedMode, setSelectedMode] = useState<AgeMode>(mode);
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || 'system');

  const handleNext = () => {
    setDirection('forward');
    
    if (step === 1) {
      // Persist language and advance to step 2
      setLanguage(selectedLanguage);
      setStep(2);
    } else if (step === 2) {
      // Persist mode and advance to step 3
      setMode(selectedMode);
      setStep(3);
    } else if (step === 3) {
      // Persist theme, mark complete, and exit
      setTheme(selectedTheme);
      setOnboardingCompleted();
      onComplete();
    }
  };

  const handleBack = () => {
    if (step <= 1) return;
    
    setDirection('backward');
    setStep(step - 1);
  };

  const handleSkip = () => {
    // Persist current selections
    setLanguage(selectedLanguage);
    setMode(selectedMode);
    setTheme(selectedTheme);
    
    // Mark onboarding as completed
    setOnboardingCompleted();
    
    // Exit onboarding immediately
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-1" />
            <div className="flex-1 flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                onClick={handleSkip}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                Skip
              </button>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Global Tales Universe</CardTitle>
          <CardDescription>Let's personalize your experience</CardDescription>
          <div className="flex justify-center gap-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-primary' : 'w-1.5 bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <StepTransition step={step} direction={direction} reducedMotion={prefersReducedMotion}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Choose Your Language</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language for the app interface
                  </p>
                </div>
                <RadioGroup value={selectedLanguage} onValueChange={(val) => setSelectedLanguage(val as UILanguage)}>
                  <div className="space-y-2">
                    <div className="option-row flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="en" id="lang-en" />
                      <Label htmlFor="lang-en" className="flex-1 cursor-pointer">English</Label>
                    </div>
                    <div className="option-row flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="hi" id="lang-hi" />
                      <Label htmlFor="lang-hi" className="flex-1 cursor-pointer">हिन्दी (Hindi)</Label>
                    </div>
                    <div className="option-row flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="ta" id="lang-ta" />
                      <Label htmlFor="lang-ta" className="flex-1 cursor-pointer">தமிழ் (Tamil)</Label>
                    </div>
                    <div className="option-row flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="te" id="lang-te" />
                      <Label htmlFor="lang-te" className="flex-1 cursor-pointer">తెలుగు (Telugu)</Label>
                    </div>
                    <div className="option-row flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="es" id="lang-es" />
                      <Label htmlFor="lang-es" className="flex-1 cursor-pointer">Español (Spanish)</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Who's Reading?</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the appropriate content mode
                  </p>
                </div>
                <RadioGroup value={selectedMode} onValueChange={(val) => setSelectedMode(val as AgeMode)}>
                  <div className="space-y-3">
                    <div className="option-row flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="kids" id="mode-kids" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="mode-kids" className="cursor-pointer font-medium">
                          Kids Mode
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Age-appropriate stories with fun illustrations
                        </p>
                      </div>
                    </div>
                    <div className="option-row flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="adults" id="mode-adults" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="mode-adults" className="cursor-pointer font-medium">
                          Adults Mode
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Full library with diverse genres and themes
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Choose Your Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Select how you want the app to look
                  </p>
                </div>
                <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme}>
                  <div className="space-y-3">
                    <div className="option-row flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="light" id="theme-light" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="theme-light" className="cursor-pointer font-medium">
                          Light
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bright and clear for daytime reading
                        </p>
                      </div>
                    </div>
                    <div className="option-row flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="dark" id="theme-dark" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="theme-dark" className="cursor-pointer font-medium">
                          Dark
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Easy on the eyes for night reading
                        </p>
                      </div>
                    </div>
                    <div className="option-row flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="system" id="theme-system" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="theme-system" className="cursor-pointer font-medium">
                          System
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Automatically match your device settings
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}
          </StepTransition>

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer font-medium"
              style={{ pointerEvents: 'auto' }}
            >
              {step === 3 ? 'Get Started' : 'Next'}
              {step < 3 && <ChevronRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
