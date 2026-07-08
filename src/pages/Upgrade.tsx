import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { UpgradeForm } from "@/components/upgrade/UpgradeForm";
import { ComplianceStrip } from "@/components/ComplianceStrip";
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

          <ComplianceStrip />
        </div>
      </div>
    </Layout>
  );
};

export default Upgrade;
