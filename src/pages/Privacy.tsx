import { Layout } from "@/components/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p>
              Acorn Brokers (Pty) Ltd ("we", "us", "our") is committed to protecting your personal information in compliance with the Protection of Personal Information Act 4 of 2013 (POPIA). This policy explains how we collect, use, store, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal identification information (name, ID number, contact details)</li>
              <li>Financial information (banking details for debit order processing)</li>
              <li>Firearm licence information</li>
              <li>Technical data (IP address, browser type, device information)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p>We process your personal information for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Processing your insurance application</li>
              <li>Administering your policy and claims</li>
              <li>Communicating with you about your policy</li>
              <li>Complying with legal and regulatory obligations</li>
              <li>Fraud prevention and detection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, and for a period thereafter as required by law or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p>Under POPIA, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Object to the processing of your information</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p>
              For privacy-related queries, contact our Information Officer at: <br />
              Email: privacy@acornbrokers.co.za<br />
              Phone: 0800 123 456
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
