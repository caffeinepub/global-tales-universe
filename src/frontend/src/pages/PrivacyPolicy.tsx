import LegalSupportPageLayout from '../components/LegalSupportPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalSupportPageLayout>
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Privacy Policy</h1>
        
        <p className="text-sm text-muted-foreground">Last updated: February 12, 2026</p>

        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Privacy Policy for Global Tales Universe</h2>
            <p className="text-muted-foreground leading-relaxed">
              We at Global Tales Universe value your privacy. This app is a story reading platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">What we collect:</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong className="text-foreground">Local data:</strong> Favorites, reading progress (stored on your device only).
              </li>
              <li>
                <strong className="text-foreground">If you login:</strong> Email for account (optional).
              </li>
              <li>
                <strong className="text-foreground">No personal data shared without consent.</strong>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Ads</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use AdMob or similar for banner/interstitial ads.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              <strong className="text-foreground">No selling of data.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Children</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kids mode filters content; no data collection from under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions, email{' '}
              <a 
                href="mailto:george@example.com" 
                className="text-primary hover:underline font-medium"
              >
                george@example.com (replace with your real email)
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Changes</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this policy; check back here.
            </p>
          </section>
        </div>
      </div>
    </LegalSupportPageLayout>
  );
}
