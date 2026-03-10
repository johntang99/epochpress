export const metadata = {
  title: 'Privacy Policy | Epoch Press',
  description: 'Privacy Policy for Epoch Press commercial printing services.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[var(--surface)] py-16 md:py-20">
      <div className="container-content max-w-4xl rounded-2xl border border-[var(--border)] bg-white p-8 md:p-12">
        <h1 className="font-serif text-[var(--navy)]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">Effective date: March 10, 2026</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--charcoal)]">
          <p>
            Epoch Press (&quot;Epoch Press,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy. This
            Privacy Policy explains how we collect, use, disclose, and protect information when you
            visit our website, request quotes, place orders, or communicate with our team.
          </p>
          <p>
            By using our website and services, you acknowledge the practices described in this policy.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">1. Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--charcoal)]">
            <li>Contact details such as name, company, email, phone number, and shipping address.</li>
            <li>Project and order information including files, print specifications, and job notes.</li>
            <li>Billing and payment-related information necessary to process transactions.</li>
            <li>Technical and usage data such as IP address, browser type, and page interactions.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">2. How We Use Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--charcoal)]">
            <li>Provide quotes, process orders, fulfill deliveries, and support customer accounts.</li>
            <li>Communicate about production status, approvals, scheduling, and support requests.</li>
            <li>Improve our website, customer experience, and service operations.</li>
            <li>Comply with legal obligations, accounting standards, and fraud prevention measures.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">3. How We Share Information</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            We do not sell personal information. We may share information with trusted service
            providers (for example, payment processors, hosting providers, shipping carriers, or
            communications tools) strictly as needed to operate our business and deliver services.
            We may also disclose information when required by law or to protect rights, safety, or
            security.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">4. File Handling and Print Content</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Client-uploaded files are used to provide print services and maintain order records. You
            are responsible for ensuring you have rights to the content you submit. We may retain
            production files and proofs for operational continuity, reorder support, and quality
            assurance, subject to our internal retention practices.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">5. Data Security</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            We use reasonable administrative, technical, and physical safeguards to protect
            information. No system can guarantee absolute security, and you use online services at
            your own risk.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">6. Your Choices</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            You may request to review, correct, or delete certain personal information by contacting
            us. We may retain some records as required for legal, accounting, tax, or operational
            purposes.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">7. Cookies and Analytics</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Our website may use cookies and similar technologies to maintain functionality, remember
            preferences, and understand website traffic and usage patterns.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">8. Policy Updates</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            We may update this Privacy Policy periodically. Updated versions will be posted on this
            page with a revised effective date.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">9. Contact Us</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Epoch Press
            <br />
            7 Highpoint Drive, Wayne, NJ 07470
            <br />
            Email: info@epochpress.com
            <br />
            Phone: 973.694.3600
          </p>
        </section>
      </div>
    </main>
  );
}
