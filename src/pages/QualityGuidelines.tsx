import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Leaf, 
  ThumbsUp, 
  MessageSquare,
  ClipboardCheck,
  Users,
  Scale,
  FileCheck
} from "lucide-react";

export default function QualityGuidelines() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container>
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Quality Control & Food Safety</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our commitment to ensuring safe, quality food products for all customers
            </p>
          </div>
          
          {/* Important Notice */}
          <Alert className="mb-8 border-amber-200 bg-amber-50">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">Food Safety Notice</AlertTitle>
            <AlertDescription className="text-amber-700">
              All products listed on our platform must comply with Vietnam's food safety regulations. Products with signs of spoilage or contamination should not be listed.
            </AlertDescription>
          </Alert>
          
          {/* Key Principles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Key Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle>Safety First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All products must be safe for consumption and meet health standards. No compromises on food safety.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>Expiration Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Clear communication of product expiration dates, with a minimum of 24 hours remaining shelf life.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <ThumbsUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <CardTitle>Quality Assurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Products must maintain acceptable quality standards despite approaching expiration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Guidelines Tabs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Detailed Guidelines</h2>
            <Tabs defaultValue="sellers" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sellers">For Sellers</TabsTrigger>
                <TabsTrigger value="buyers">For Buyers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sellers" className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-medium">
                      Food Safety Guidelines
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 pt-2">
                      <p className="text-muted-foreground">
                        All stores must adhere to these food safety principles when listing products:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Products must be stored according to manufacturer specifications (temperature, humidity, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>No products with compromised packaging (tears, punctures, broken seals)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>No products with visible mold, unusual odor, or discoloration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Perishable products must be kept at proper temperatures until purchase</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Cross-contamination prevention should be practiced at all times</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-medium">
                      Quality Assurance Protocols
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 pt-2">
                      <p className="text-muted-foreground">
                        Ensure quality standards are maintained with these protocols:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Regular inspection of products approaching expiration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Clear photos showing the actual condition of the product</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Honest description of any quality issues (dents, bruising, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Appropriate pricing reflecting the product's condition</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Remove listings promptly if quality deteriorates</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-medium">
                      Expiration Date Requirements
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 pt-2">
                      <p className="text-muted-foreground">
                        Follow these guidelines for expiration dates:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Products must have at least 24 hours of shelf life remaining</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Clearly display actual expiration date in your listing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Understand the difference between "Best Before" and "Use By" dates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Include batch numbers when available</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Remove expired products immediately from both platform and store</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              
              <TabsContent value="buyers" className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-medium">
                      Smart Shopping Tips
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 pt-2">
                      <p className="text-muted-foreground">
                        Tips for purchasing near-expiry products safely:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Check expiration dates and plan to consume before expiry</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Inspect products upon pickup or delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Refrigerate or freeze perishable items promptly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Trust your senses - don't consume if you notice unusual appearance, odor, or texture</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Consider preservation methods like freezing to extend shelf life when appropriate</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-medium">
                      Understanding Food Labels
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 pt-2">
                      <p className="text-muted-foreground">
                        Important information about food labeling:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Best Before (Hạn sử dụng tốt nhất):</strong> Indicates quality, not safety. Food is usually still safe to eat after this date, but may not be at its best quality.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Use By/Expiry Date (Hạn sử dụng):</strong> Related to safety. Food should not be consumed after this date.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Packed On/Manufactured Date:</strong> When the food was packaged or produced.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Storage Instructions:</strong> Follow these guidelines even for near-expiry products.</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-medium">
                      Reporting Issues
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 pt-2">
                      <p className="text-muted-foreground">
                        If you encounter quality or safety issues:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Contact the store directly first to resolve the issue</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>If not resolved, use our platform's reporting system</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Include photos and detailed descriptions when reporting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>For serious safety concerns, report to local food safety authorities</span>
                        </li>
                      </ul>
                      <Button className="mt-4">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Report an Issue
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Our Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Our Quality Control Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <ClipboardCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Vendor Verification</CardTitle>
                  <CardDescription>Step 1</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We verify all store registrations to ensure they're legitimate businesses with proper food handling certifications.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Listing Review</CardTitle>
                  <CardDescription>Step 2</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our system screens product listings to ensure they meet our safety and quality guidelines.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community Feedback</CardTitle>
                  <CardDescription>Step 3</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Customer ratings and reports help us monitor the quality of products and sellers on our platform.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Regular Audits</CardTitle>
                  <CardDescription>Step 4</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We conduct periodic reviews of sellers to ensure continued compliance with our quality standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Complaint Resolution */}
          <div className="mb-12 bg-muted/30 p-8 rounded-lg border">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                Complaint Resolution System
              </h2>
              <p className="text-muted-foreground mb-6">
                If you encounter issues with product quality or safety, our complaint resolution process is designed to address concerns quickly and fairly.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-medium text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Submit a Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Use our reporting form to submit details about the issue, including photos and order information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-medium text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Seller Response</h3>
                    <p className="text-sm text-muted-foreground">
                      The seller is notified and has 48 hours to respond to your complaint and offer a resolution.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-medium text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Platform Mediation</h3>
                    <p className="text-sm text-muted-foreground">
                      If the issue isn't resolved directly with the seller, our team will review the case and help mediate.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-medium text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Final Resolution</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll work to ensure a fair outcome, which may include refunds, replacements, or other appropriate actions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button>
                  Submit a Complaint
                </Button>
                <Button variant="outline">
                  Check Complaint Status
                </Button>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>
                  Is it safe to eat food close to its expiration date?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, it's generally safe to consume food close to (but not beyond) its expiration date, especially for "Best Before" dates which relate to quality rather than safety. Foods with "Use By" dates should be consumed before the date for safety reasons. Always check the product for any signs of spoilage regardless of the date.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-2">
                <AccordionTrigger>
                  How do you ensure sellers maintain proper food storage?
                </AccordionTrigger>
                <AccordionContent>
                  All sellers must agree to our food safety guidelines which include proper storage requirements. We verify store credentials during registration, conduct random audits, and rely on customer feedback. Sellers with repeated complaints about improper storage are removed from our platform.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-3">
                <AccordionTrigger>
                  What should I do if I receive a product in poor condition?
                </AccordionTrigger>
                <AccordionContent>
                  First, document the issue with photos. Contact the seller directly through our platform to report the problem. If the seller doesn't resolve the issue satisfactorily, submit a formal complaint through our system, and our team will investigate and help reach a resolution.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-4">
                <AccordionTrigger>
                  Are there certain products that shouldn't be sold near expiration?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, high-risk perishable items like raw seafood, certain dairy products, and prepared foods with highly perishable ingredients have stricter guidelines. These products must have more remaining shelf life and meet additional safety criteria to be listed on our platform.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
} 