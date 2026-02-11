interface AdPlaceholderProps {
  type: 'banner' | 'inline' | 'interstitial' | 'rewarded';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  if (type === 'interstitial' || type === 'rewarded') {
    return null;
  }

  return (
    <div className="bg-muted border border-dashed border-border rounded-lg p-4 text-center">
      <p className="text-xs text-muted-foreground">
        [{type === 'banner' ? 'Banner' : 'Inline'} Ad Placeholder]
      </p>
    </div>
  );
}
