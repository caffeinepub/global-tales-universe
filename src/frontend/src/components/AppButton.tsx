import * as React from 'react';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

/**
 * AppButton - Application-owned button wrapper with reliable styling
 * 
 * Wraps shadcn Button with explicit variant styling to prevent regression
 * when CSS variables or Tailwind purge strips necessary classes in production.
 * Provides visible padding, background/border, and hover/focus-visible states
 * for all variants.
 */

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant = 'default', size, asChild = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        asChild={asChild}
        className={cn(
          // Ensure base button affordance is always present
          'inline-flex items-center justify-center gap-2',
          'whitespace-nowrap rounded-md text-sm font-medium',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Explicit variant styling to prevent regression
          variant === 'default' && [
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90',
            'shadow',
          ],
          variant === 'outline' && [
            'border border-input bg-background',
            'hover:bg-accent hover:text-accent-foreground',
          ],
          variant === 'secondary' && [
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80',
          ],
          variant === 'ghost' && [
            'hover:bg-accent hover:text-accent-foreground',
          ],
          variant === 'destructive' && [
            'bg-destructive text-destructive-foreground',
            'hover:bg-destructive/90',
            'shadow-sm',
          ],
          variant === 'link' && [
            'text-primary underline-offset-4',
            'hover:underline',
          ],
          // Size variants
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 rounded-md px-3',
          size === 'lg' && 'h-11 rounded-md px-8',
          size === 'icon' && 'h-10 w-10',
          className
        )}
        {...props}
      />
    );
  }
);

AppButton.displayName = 'AppButton';

export { AppButton, buttonVariants };
