import { Button } from './ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Dev-only component to visually verify button styling across variants.
 * Renders multiple button variants to catch missing styles after builds.
 */
export default function ButtonStyleRegressionCheck() {
  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs z-50">
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold mb-1">Button Style Check (Dev Only)</p>
          <p className="text-muted-foreground">Verify visible padding, background, border, hover & focus states:</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button size="sm" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Default Variant
        </Button>
        <Button size="sm" variant="outline" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Outline Variant
        </Button>
        <Button size="sm" variant="secondary" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Secondary Variant
        </Button>
        <Button size="sm" variant="ghost" className="w-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ghost Variant
        </Button>
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-3 leading-tight">
        All buttons should have visible styling. If they look like plain text, CSS tokens may be broken.
      </p>
    </div>
  );
}
