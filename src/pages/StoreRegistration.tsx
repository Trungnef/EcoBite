import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Building, Clock, MapPin, Phone, Mail, Check, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const storeFormSchema = z.object({
  storeName: z.string().min(3, { message: "Store name must be at least 3 characters" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  district: z.string().min(1, { message: "Please select a district" }),
  city: z.string().min(1, { message: "Please select a city" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  openingTime: z.string().min(1, { message: "Please enter opening time" }),
  closingTime: z.string().min(1, { message: "Please enter closing time" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

type LocationState = {
  email?: string;
  name?: string;
};

export default function StoreRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const locationState = location.state as LocationState;
  
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeName: locationState?.name || "",
      address: "",
      district: "",
      city: "",
      phone: "",
      email: locationState?.email || "",
      openingTime: "",
      closingTime: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: StoreFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Register the user first
      const success = await registerUser(
        data.email, 
        data.password, 
        data.storeName, 
        "seller"
      );
      
      if (success) {
        // In a real app, you would then create the store profile with store-specific info
        // and link it to the user account
        
        console.log("Store registration data:", data);
        setIsRegistered(true);
        
        toast.success("Registration successful! Your store account has been created.");
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      setIsSubmitting(false);
    }
  };
  
  if (isRegistered) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-[70vh]">
          <Container>
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Registration Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Your store account has been created successfully. You can now start managing your inventory
                and posting products that are near expiration to reduce waste and increase sales.
              </p>
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <a href="/store/dashboard">Go to Store Dashboard</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/">Return to Homepage</a>
                </Button>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Register Your Store</h1>
              <p className="text-muted-foreground">
                Join our network of stores and help reduce food waste while increasing your revenue.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium flex items-center mb-4">
                      <Building className="h-5 w-5 mr-2" />
                      Store Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="storeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your store name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email address" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-lg font-medium flex items-center mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      Store Location
                    </h2>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your store address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter district" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-lg font-medium flex items-center mb-4">
                      <Clock className="h-5 w-5 mr-2" />
                      Business Hours & Contact
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="openingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opening Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="closingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closing Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-lg font-medium flex items-center mb-4">
                      <Lock className="h-5 w-5 mr-2" />
                      Account Security
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Use at least 8 characters with letters, numbers and symbols
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={isSubmitting || isLoading}
                    >
                      {isSubmitting ? "Registering..." : "Register Store"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
