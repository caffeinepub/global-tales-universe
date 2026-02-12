import { AppButton } from './AppButton';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Dev-only component to visually verify button styling across variants.
 * Renders multiple button variants to catch missing styles after builds.
 * Includes explicit checklist for /premium and /nonexistent routes.
 */
export default function ButtonStyleRegressionCheck() {
  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 bg-card border-2 border-warning/50 rounded-lg p-4 shadow-lg max-w-xs z-50">
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold mb-1 text-warning">⚠️ Button Style Check (Dev Only)</p>
          <p className="text-muted-foreground leading-tight">
            Verify visible padding, background, border, hover & focus states on:
          </p>
        </div>
      </div>
      
      <div className="mb-3 text-xs space-y-1 pl-1">
        <p className="font-semibold">Test Routes:</p>
        <p className="text-muted-foreground">• /premium (default & outline)</p>
        <p className="text-muted-foreground">• /nonexistent (default)</p>
      </div>
      
      <div className="space-y-2">
        <AppButton size="sm" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Default Variant
        </AppButton>
        <AppButton size="sm" variant="outline" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Outline Variant
        </AppButton>
        <AppButton size="sm" variant="secondary" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Secondary Variant
        </AppButton>
        <AppButton size="sm" variant="ghost" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ghost Variant
        </AppButton>
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-3 leading-tight">
        ✓ All buttons should have visible styling
        <br />
        ✗ If they look like plain text, CSS tokens are broken
      </p>
    </div>
  );
}
