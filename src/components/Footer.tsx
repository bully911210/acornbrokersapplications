import { Link } from "react-router-dom";
import acornLogo from "@/assets/acorn-logo.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-6">
        {/* Single Row: Logo/FSP on Left, Contact on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Logo + FSP (25% larger) */}
          <div className="flex items-center gap-3">
            <img 
              src={acornLogo} 
              alt="Acorn Brokers" 
              className="h-10 w-auto opacity-80" 
            />
            <span className="text-xs text-muted-foreground">
              Authorised FSP 47433
            </span>
          </div>

          {/* Right: Contact */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a 
              href="mailto:info@acornbrokers.co.za" 
              className="hover:text-foreground transition-colors"
            >
              info@acornbrokers.co.za
            </a>
            <span className="text-border">|</span>
            <a 
              href="tel:+27690076320" 
              className="hover:text-foreground transition-colors"
            >
              +27 (0)69 007 6320
            </a>
          </div>
        </div>

        {/* Disclaimer - Full Width, Compact */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[11px] leading-relaxed text-muted-foreground/80">
            © {currentYear} Acorn Brokers (Pty) Ltd. All rights reserved. Acorn Brokers (Pty) Ltd is an authorised Financial Services Provider (FSP 47433). The Firearms Guardian policy is administered by Firearms Guardian (Pty) Ltd (FSP 47115) and underwritten by GENRIC Insurance Company Limited (FSP 43638), an authorised financial services provider and licensed non-life insurer.
            {" "}
            <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            {" · "}
            <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
