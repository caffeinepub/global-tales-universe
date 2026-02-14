import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { getLiveAppUrl, isProductionUrl } from '../lib/liveAppUrl';

export default function LiveAppUrlCard() {
  const [copied, setCopied] = useState(false);
  const liveUrl = getLiveAppUrl();
  const isProd = isProductionUrl(liveUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleOpen = () => {
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-primary" />
          Live App URL
        </CardTitle>
        <CardDescription>
          {isProd
            ? 'Your app is live on the Internet Computer blockchain'
            : 'Current app URL (development/preview mode)'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-background/50 rounded-md p-3 border border-border">
          <code className="text-sm text-foreground break-all font-mono">{liveUrl}</code>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" className="flex-1" disabled={copied}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </>
            )}
          </Button>

          <Button onClick={handleOpen} variant="default" className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>

        {!isProd && (
          <p className="text-xs text-muted-foreground mt-2">
            Note: This URL is for development/preview. Deploy to ICP for a production URL ending in
            .icp0.io or .ic0.app
          </p>
        )}
      </CardContent>
    </Card>
  );
}
