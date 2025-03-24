import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { ComplaintForm } from "@/components/ComplaintForm";
import { AlertCircle, ArrowLeft, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export default function ReportIssue() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/quality-guidelines" 
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Quality Guidelines
            </Link>
            
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="mr-2 h-7 w-7 text-primary" />
              Report a Quality or Safety Issue
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Your feedback helps us maintain high quality standards. Please use this form to report any concerns with products purchased through our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ComplaintForm />
            </div>
            
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Important Information
                </h3>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For urgent food safety concerns that may pose an immediate health risk, please contact the store directly and local food safety authorities.
                  </p>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">What happens next?</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Our team will review your report within 24-48 hours</li>
                      <li>The store will be notified and asked to respond</li>
                      <li>We'll follow up with you via email</li>
                      <li>A resolution will be provided within 7 days</li>
                    </ol>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Have questions?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Contact our support team for assistance with reporting issues:
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:support@expiringgoodies.com">
                        Email Support
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 text-sm">Reporting Policy</AlertTitle>
                <AlertDescription className="text-amber-700 text-xs">
                  We take all quality and safety reports seriously. False or malicious reports may result in account suspension. Please provide accurate information.
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Emergency Contacts</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Vietnam Food Administration</p>
                    <p className="text-muted-foreground">Hotline: 1800-6838</p>
                  </div>
                  <div>
                    <p className="font-medium">Consumer Protection Department</p>
                    <p className="text-muted-foreground">Hotline: 1800-6838</p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Medical Services</p>
                    <p className="text-muted-foreground">Call: 115</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
} 