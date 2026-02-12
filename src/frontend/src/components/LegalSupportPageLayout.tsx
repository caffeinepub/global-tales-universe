import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface LegalSupportPageLayoutProps {
  children: ReactNode;
}

export default function LegalSupportPageLayout({ children }: LegalSupportPageLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    // Try to go back in history, fallback to home if no history
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: '/' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 py-6 w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm">
          {children}
        </div>

        <footer className="text-center text-xs text-muted-foreground py-8 mt-6">
          <p>
            © 2026 Global Tales Universe – Built with{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
