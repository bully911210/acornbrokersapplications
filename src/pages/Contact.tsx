import { Layout } from "@/components/Layout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Have questions about your application or policy? Our team is here to help.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-muted-foreground">+27 (0)69 007 6320</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">info@acornbrokers.co.za</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p className="text-muted-foreground">
                    123 Main Street<br />
                    Sandton, Gauteng<br />
                    South Africa
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Business Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 08:00 - 17:00<br />
                    Saturday: 08:00 - 13:00<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Complaints Process</h2>
            <p className="text-muted-foreground mb-4">
              We take all complaints seriously. If you have a complaint:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
              <li>Contact our customer service team first</li>
              <li>If unresolved, escalate to our Complaints Officer at complaints@acornbrokers.co.za</li>
              <li>If still unresolved after 6 weeks, contact the FAIS Ombud</li>
            </ol>
            <div className="mt-6 p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>FAIS Ombud</strong><br />
                Tel: 012 762 5000<br />
                Email: info@faisombud.co.za
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
