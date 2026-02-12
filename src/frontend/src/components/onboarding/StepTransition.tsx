import { ReactNode, useEffect, useState } from 'react';

interface StepTransitionProps {
  children: ReactNode;
  step: number;
  direction: 'forward' | 'backward';
  reducedMotion: boolean;
}

/**
 * Lightweight transition wrapper for onboarding steps with direction-aware animations.
 * Handles enter/exit animations and maintains stable layout during transitions.
 */
export default function StepTransition({ children, step, direction, reducedMotion }: StepTransitionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedStep, setDisplayedStep] = useState(step);

  useEffect(() => {
    if (step !== displayedStep) {
      setIsAnimating(true);
      
      // Wait for exit animation before changing content
      const timeout = setTimeout(() => {
        setDisplayedStep(step);
        setIsAnimating(false);
      }, reducedMotion ? 150 : 300);

      return () => clearTimeout(timeout);
    }
  }, [step, displayedStep, reducedMotion]);

  const getAnimationClass = () => {
    if (reducedMotion) {
      // Minimal fade for reduced motion
      return isAnimating ? 'onboarding-fade-out' : 'onboarding-fade-in';
    }
    
    // Full slide + fade animations
    if (isAnimating) {
      return direction === 'forward' ? 'onboarding-slide-out-left' : 'onboarding-slide-out-right';
    }
    return direction === 'forward' ? 'onboarding-slide-in-right' : 'onboarding-slide-in-left';
  };

  return (
    <div className={`onboarding-step-container ${getAnimationClass()}`}>
      {children}
    </div>
  );
}
