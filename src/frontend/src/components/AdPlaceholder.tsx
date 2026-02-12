import { useAppUser } from '../hooks/useAppUser';

interface AdPlaceholderProps {
  type: 'banner' | 'inline';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  const { isPremium } = useAppUser();

  // Hide ads for premium users
  if (isPremium) {
    return null;
  }

  const isBanner = type === 'banner';

  return (
    <div
      className={`bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center ${
        isBanner ? 'h-24' : 'h-32'
      }`}
    >
      <p className="text-sm text-muted-foreground">Ad Space ({type})</p>
    </div>
  );
}
