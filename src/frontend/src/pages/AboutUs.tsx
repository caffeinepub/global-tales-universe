import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/' })}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-card rounded-xl p-6 space-y-4">
        <h1 className="text-3xl font-bold">About Us</h1>
        
        <div className="space-y-4 text-muted-foreground">
          <p>
            Welcome to Global Tales Universe - your gateway to stories from around the world.
          </p>
          
          <p>
            We believe in the power of storytelling to connect cultures, inspire imagination, and bring joy to readers of all ages.
          </p>
          
          <p>
            Our mission is to make quality stories accessible to everyone, in multiple languages, with a focus on both entertainment and education.
          </p>
          
          <p className="text-sm">
            More information coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
