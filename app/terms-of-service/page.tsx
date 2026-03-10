export const metadata = {
  title: 'Terms of Service | Epoch Press',
  description: 'Terms of Service for Epoch Press commercial printing services.',
};

export default function TermsOfServicePage() {
  return (
    <main className="bg-[var(--surface)] py-16 md:py-20">
      <div className="container-content max-w-4xl rounded-2xl border border-[var(--border)] bg-white p-8 md:p-12">
        <h1 className="font-serif text-[var(--navy)]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">Effective date: March 10, 2026</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--charcoal)]">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the Epoch Press website and
            printing services. By requesting quotes, submitting files, placing orders, or using our
            website, you agree to these Terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">1. Scope of Services</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Epoch Press provides commercial printing and related production services. Quotes,
            timelines, and deliverables are based on submitted specifications, available materials,
            and production capacity.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">2. Orders and Client Responsibilities</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--charcoal)]">
            <li>You are responsible for accuracy of all submitted files, copy, and specifications.</li>
            <li>
              You represent that you own or have required rights and permissions for submitted
              content.
            </li>
            <li>
              Client approvals (proofs, color references, quantities, and shipping details) are final
              once confirmed for production.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">3. Pricing and Payment</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Pricing is provided by quote and may vary based on scope, file readiness, materials,
            finishing, freight, and schedule requirements. Payment terms are specified at order time.
            Late or failed payments may delay fulfillment.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">4. Production, Shipping, and Risk</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Production and delivery estimates are targets, not guarantees. Epoch Press is not liable
            for delays caused by carriers, force majeure events, vendor disruptions, or inaccurate
            client-provided information.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">5. Color and Print Variance</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Reasonable variation in color, trim, registration, and finishing can occur in print
            production. Unless otherwise agreed in writing, such standard variances are considered
            acceptable performance.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">6. Claims and Reprints</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            Any quality or fulfillment claim must be submitted promptly after delivery with supporting
            details. If a claim is validated, remedy may include correction, partial credit, or
            reprint at our discretion.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">7. Intellectual Property</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            You retain rights to your submitted content. You grant Epoch Press a limited license to
            reproduce and process submitted materials solely to fulfill your order and related service
            needs.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">8. Limitation of Liability</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            To the maximum extent permitted by law, Epoch Press is not liable for indirect,
            incidental, special, consequential, or punitive damages. Our aggregate liability related
            to a claim will not exceed the amount paid for the specific order at issue.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">9. Changes to Terms</h2>
          <p className="mt-3 text-sm text-[var(--charcoal)]">
            We may update these Terms at any time. Updated Terms are effective when posted on this
            page unless otherwise stated.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[var(--navy)]">10. Contact Information</h2>
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
