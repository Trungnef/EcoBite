import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AlertCircle, FileText, Search, ShieldAlert } from "lucide-react";

// Mock complaint data
const mockComplaints = [
  {
    id: "C-12345",
    status: "in-progress",
    type: "quality",
    severity: "medium",
    productName: "Organic Strawberries",
    storeName: "Fresh Market",
    submittedDate: "2023-10-15",
    lastUpdated: "2023-10-17",
  },
  {
    id: "C-12346",
    status: "pending",
    type: "packaging",
    severity: "low",
    productName: "Whole Grain Bread",
    storeName: "Family Bakery",
    submittedDate: "2023-10-16",
    lastUpdated: "2023-10-16",
  },
  {
    id: "C-12347",
    status: "resolved",
    type: "expiration",
    severity: "high",
    productName: "Greek Yogurt",
    storeName: "Healthy Foods",
    submittedDate: "2023-10-12",
    lastUpdated: "2023-10-18",
  },
  {
    id: "C-12348",
    status: "pending",
    type: "safety",
    severity: "high",
    productName: "Chicken Salad",
    storeName: "Quick Meal",
    submittedDate: "2023-10-17",
    lastUpdated: "2023-10-17",
  },
  {
    id: "C-12349",
    status: "resolved",
    type: "quality",
    severity: "medium",
    productName: "Orange Juice",
    storeName: "Fresh Market",
    submittedDate: "2023-10-10",
    lastUpdated: "2023-10-14",
  },
];

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "pending": { label: "Pending Review", variant: "secondary" },
  "in-progress": { label: "In Progress", variant: "default" },
  "resolved": { label: "Resolved", variant: "outline" },
};

const typeLabels: Record<string, string> = {
  "quality": "Quality Issue",
  "safety": "Safety Concern",
  "expiration": "Expiration Problem",
  "packaging": "Packaging Defect",
  "other": "Other Issue",
};

const severityLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "low": { label: "Low", variant: "outline" },
  "medium": { label: "Medium", variant: "secondary" },
  "high": { label: "High", variant: "destructive" },
};

export default function ComplaintSystem() {
  const [activeTab, setActiveTab] = useState("my-complaints");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredComplaints = mockComplaints.filter(complaint => 
    complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <ShieldAlert className="h-7 w-7 mr-2 text-primary" />
                  Complaint Management System
                </h1>
                <p className="text-muted-foreground">
                  Track and manage quality and safety reports
                </p>
              </div>
              
              <Button asChild>
                <Link to="/report-issue">
                  Report New Issue
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <TabsList>
                <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
                <TabsTrigger value="guidelines">Reporting Guidelines</TabsTrigger>
                <TabsTrigger value="faq">FAQs</TabsTrigger>
              </TabsList>
              
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID, product, or store..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-[250px]"
                />
              </div>
            </div>
            
            <TabsContent value="my-complaints" className="space-y-6">
              {filteredComplaints.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.id}</TableCell>
                          <TableCell>
                            <Badge variant={statusLabels[complaint.status].variant}>
                              {statusLabels[complaint.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>{typeLabels[complaint.type]}</TableCell>
                          <TableCell>
                            <Badge variant={severityLabels[complaint.severity].variant}>
                              {severityLabels[complaint.severity].label}
                            </Badge>
                          </TableCell>
                          <TableCell>{complaint.productName}</TableCell>
                          <TableCell>{complaint.storeName}</TableCell>
                          <TableCell>{complaint.submittedDate}</TableCell>
                          <TableCell>{complaint.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/complaint/${complaint.id}`}>
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No complaints found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {searchTerm 
                      ? `No complaints matching "${searchTerm}" were found. Try adjusting your search.` 
                      : "You haven't submitted any quality or safety reports yet."}
                  </p>
                  <Button asChild>
                    <Link to="/report-issue">
                      Report an Issue
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="guidelines" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality and Safety Reporting Guidelines</CardTitle>
                  <CardDescription>
                    Follow these guidelines when submitting quality or safety concerns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">When to Submit a Report</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Quality Issues</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Products that don't meet quality standards</li>
                          <li>• Damaged or deteriorated products</li>
                          <li>• Products that don't match their description</li>
                          <li>• Unexpected appearance, taste, or texture issues</li>
                        </ul>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Safety Concerns</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Signs of spoilage or contamination</li>
                          <li>• Foreign objects in products</li>
                          <li>• Incorrect labeling of allergens</li>
                          <li>• Food-related illness symptoms after consumption</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Information to Include</h3>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <span className="font-medium">1.</span>
                        <span>Specific product details (name, expiry date, batch number if available)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">2.</span>
                        <span>Store information where the product was purchased</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">3.</span>
                        <span>Clear description of the issue or concern</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">4.</span>
                        <span>Date and time when the issue was discovered</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">5.</span>
                        <span>Photos showing the issue (when possible)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium">6.</span>
                        <span>Contact information for follow-up</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">The Review Process</h3>
                    <ol className="space-y-3">
                      <li className="bg-muted p-3 rounded-lg flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          1
                        </div>
                        <div>
                          <span className="font-medium">Submission</span>
                          <p className="text-sm text-muted-foreground">Your report is received and assigned a unique ID</p>
                        </div>
                      </li>
                      <li className="bg-muted p-3 rounded-lg flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          2
                        </div>
                        <div>
                          <span className="font-medium">Initial Review</span>
                          <p className="text-sm text-muted-foreground">Our team reviews the report and assigns a severity level</p>
                        </div>
                      </li>
                      <li className="bg-muted p-3 rounded-lg flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          3
                        </div>
                        <div>
                          <span className="font-medium">Store Notification</span>
                          <p className="text-sm text-muted-foreground">The store is notified and asked to investigate and respond</p>
                        </div>
                      </li>
                      <li className="bg-muted p-3 rounded-lg flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          4
                        </div>
                        <div>
                          <span className="font-medium">Resolution</span>
                          <p className="text-sm text-muted-foreground">A resolution is determined and implemented</p>
                        </div>
                      </li>
                      <li className="bg-muted p-3 rounded-lg flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          5
                        </div>
                        <div>
                          <span className="font-medium">Feedback</span>
                          <p className="text-sm text-muted-foreground">You will be notified of the outcome and asked for feedback</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to="/report-issue">
                      Submit a Report
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Common questions about our quality and safety reporting system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">How long does it take to review my complaint?</h3>
                      <p className="text-sm text-muted-foreground">
                        Most complaints are initially reviewed within 24-48 hours. High severity issues are prioritized and may be reviewed sooner. The total resolution time depends on the complexity of the issue and the store's response time.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Will I get a refund if my complaint is valid?</h3>
                      <p className="text-sm text-muted-foreground">
                        Refund policies vary by store. As part of the resolution process, we work with stores to determine appropriate compensation, which may include refunds, replacements, or store credit. Our goal is to ensure fair treatment for all customers.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Can I update my complaint after submission?</h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, you can add additional information or photos to your complaint at any time by viewing the complaint details and using the "Add Comment" feature. This is particularly helpful if you discover new information after the initial submission.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">What happens if the store doesn't respond?</h3>
                      <p className="text-sm text-muted-foreground">
                        Stores are given 48 hours to respond to complaints. If they fail to respond, our team will follow up and may take administrative action. For high severity issues, we may escalate the matter and potentially suspend the store's listing privileges until the issue is addressed.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Are my complaint details private?</h3>
                      <p className="text-sm text-muted-foreground">
                        Your personal information is kept confidential. The store will receive details about the product and issue but not your personal contact information. Our system facilitates communication while protecting your privacy.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Have more questions?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        If you have additional questions about our complaint system or need assistance with a specific issue, please contact our support team:
                      </p>
                      <p className="text-sm">Email: <a href="mailto:support@expiringgoodies.com" className="text-primary hover:underline">support@expiringgoodies.com</a></p>
                      <p className="text-sm">Phone: (84) 123-456-789 (Mon-Fri, 9AM-5PM)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </>
  );
} 