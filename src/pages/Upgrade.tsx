import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { UpgradeForm } from "@/components/upgrade/UpgradeForm";
import { ArrowRight } from "lucide-react";

const Upgrade = () => {
  return (
    <Layout showStepIndicator={false}>
      <div className="application-page-frame">
        <div className="application-page-inner">
          <div className="mb-4 flex justify-end">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary md:text-sm"
            >
              New application
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </Link>
          </div>

          <section className="application-dossier">
            <div className="application-dossier-header">
              <div className="application-dossier-meta">
                <div className="application-dossier-title-block">
                  <h1 className="text-xl font-semibold text-foreground md:text-[1.5rem] leading-tight">
                    Upgrade your existing policy
                  </h1>
                  <p className="max-w-3xl text-sm leading-snug text-muted-foreground">
                    For existing Firearms Guardian policyholders. Submit this short authorisation and an Acorn Brokers consultant will confirm and process your upgrade.
                  </p>
                </div>
              </div>
            </div>

            <div className="application-shell application-shell-dossier">
              <div className="application-shell-inner application-shell-inner-dossier">
                <UpgradeForm />
              </div>
            </div>
          </section>

          <div className="application-compliance-strip mt-10" aria-label="Regulatory disclosures">
            <div>
              <p className="application-compliance-label">Intermediary</p>
              <p className="application-compliance-value">Acorn Brokers (Pty) Ltd · FSP 47433</p>
            </div>
            <div>
              <p className="application-compliance-label">Administrator</p>
              <p className="application-compliance-value">Firearms Guardian (Pty) Ltd · FSP 47115</p>
            </div>
            <div>
              <p className="application-compliance-label">Underwriter</p>
              <p className="application-compliance-value">GENRIC Insurance Company Ltd · FSP 43638</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upgrade;
