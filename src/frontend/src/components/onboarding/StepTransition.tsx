import { ReactNode } from 'react';

interface StepTransitionProps {
  children: ReactNode;
  step: number;
  direction: 'forward' | 'backward';
  reducedMotion: boolean;
}

/**
 * Lightweight transition wrapper for onboarding steps with direction-aware animations.
 * Renders the current step immediately with enter animation, ensuring buttons remain responsive.
 */
export default function StepTransition({ children, step, direction, reducedMotion }: StepTransitionProps) {
  const getAnimationClass = () => {
    if (reducedMotion) {
      // No animation for reduced motion - instant transition
      return '';
    }
    
    // Apply enter animation based on direction
    return direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';
  };

  return (
    <div 
      key={step}
      className={getAnimationClass()}
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </div>
  );
}
