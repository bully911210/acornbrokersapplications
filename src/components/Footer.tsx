import { Link } from "react-router-dom";
import acornLogo from "@/assets/acorn-logo.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-3">
            <img 
              src={acornLogo} 
              alt="Acorn Brokers" 
              className="h-10 w-auto opacity-80" 
            />
            <p className="text-sm text-muted-foreground">
              Authorised Financial Services Provider
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Apply Now
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a 
                  href="mailto:info@acornbrokers.co.za" 
                  className="hover:text-foreground transition-colors"
                >
                  info@acornbrokers.co.za
                </a>
              </li>
              <li>
                <a 
                  href="tel:+27690076320" 
                  className="hover:text-foreground transition-colors"
                >
                  +27 (0)69 007 6320
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal / Regulatory Block */}
        <div className="mt-10 pt-8 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
              © {currentYear} Acorn Brokers (Pty) Ltd. All rights reserved.
            </p>
            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
              Acorn Brokers (Pty) Ltd is an authorised Financial Services Provider (FSP 47433).
            </p>
            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
              The Firearms Guardian policy is administered by Firearms Guardian (Pty) Ltd (FSP 47115) 
              and underwritten by GENRIC Insurance Company Limited (FSP 43638), 
              an authorised financial services provider and licensed non-life insurer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
