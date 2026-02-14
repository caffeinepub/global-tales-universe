import LegalSupportPageLayout from '../components/LegalSupportPageLayout';
import LiveAppUrlCard from '../components/LiveAppUrlCard';
import { SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function HelpAndSupport() {
  return (
    <LegalSupportPageLayout>
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Help & Support</h1>

        {/* Live App URL Card */}
        <LiveAppUrlCard />

        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">Need help?</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong className="text-foreground">App slow?</strong> Try restarting or clearing cache.
              </li>
              <li>
                <strong className="text-foreground">Story not loading?</strong> Check internet.
              </li>
              <li>
                <strong className="text-foreground">Language issues?</strong> Select from top dropdown.
              </li>
              <li>
                <strong className="text-foreground">Favorites missing?</strong> They save locally.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact us</h2>
            <p className="text-muted-foreground leading-relaxed">
              <a 
                href="mailto:support@globaltales.com" 
                className="text-primary hover:underline font-medium"
              >
                support@globaltales.com
              </a>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Or email{' '}
              <a 
                href="mailto:george@example.com" 
                className="text-primary hover:underline font-medium"
              >
                george@example.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Follow for updates</h2>
            <p className="text-muted-foreground leading-relaxed flex items-center gap-2">
              <SiInstagram className="w-5 h-5" />
              Instagram{' '}
              <a 
                href="https://instagram.com/globaltalesapp" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                @globaltalesapp
              </a>{' '}
              (placeholder)
            </p>
          </section>

          <section className="bg-muted/30 rounded-lg p-4 mt-6">
            <p className="text-muted-foreground leading-relaxed flex items-center gap-1.5">
              Made with <Heart className="w-4 h-4 fill-red-500 text-red-500 inline" /> in Tirunelveli, Tamil Nadu.
            </p>
          </section>
        </div>
      </div>
    </LegalSupportPageLayout>
  );
}
