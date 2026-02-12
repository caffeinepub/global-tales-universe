import LegalSupportPageLayout from '../components/LegalSupportPageLayout';

export default function TermsAndConditions() {
  return (
    <LegalSupportPageLayout>
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Terms and Conditions</h1>
        
        <p className="text-sm text-muted-foreground">Last updated: February 12, 2026</p>

        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Terms of Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              By using Global Tales Universe, you agree:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Stories are for personal entertainment only.</li>
              <li>No commercial use or redistribution.</li>
              <li>Content is placeholder/generated; no ownership claimed.</li>
              <li>We are not liable for any issues from reading.</li>
              <li>
                <strong className="text-foreground">Premium:</strong> Subscription removes ads + unlocks extras (if implemented).
              </li>
              <li>We can change features anytime.</li>
              <li>
                <strong className="text-foreground">Governed by Indian laws</strong> (Tiruchirappalli, Tamil Nadu).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions, email{' '}
              <a 
                href="mailto:george@example.com" 
                className="text-primary hover:underline font-medium"
              >
                george@example.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </LegalSupportPageLayout>
  );
}
