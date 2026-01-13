import { Layout } from "@/components/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Acorn Brokers website and services, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Insurance Coverage</h2>
            <p>
              Coverage is subject to the terms, conditions, and exclusions set out in your policy documents. The information on this website is for general information purposes only and does not constitute advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Waiting Periods</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Legal advice hotline: Available immediately upon policy activation</li>
              <li>Legal representation: 3-month waiting period applies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Premium Payments</h2>
            <p>
              Premiums are collected monthly via debit order on your selected date. Failure to maintain premium payments may result in policy lapse and loss of cover.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Claims</h2>
            <p>
              All claims must be reported within 48 hours of the incident. Claims are subject to assessment and approval based on policy terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Cancellation</h2>
            <p>
              You may cancel your policy at any time by providing 30 days written notice. No refunds are provided for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Acorn Brokers shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
