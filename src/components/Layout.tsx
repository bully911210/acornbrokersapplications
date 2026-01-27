import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  currentStep?: number;
  showStepIndicator?: boolean;
}

export const Layout = ({ 
  children, 
  showFooter = true, 
  currentStep = 1,
  showStepIndicator = true 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentStep={currentStep} showStepIndicator={showStepIndicator} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
