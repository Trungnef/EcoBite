import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DealCard } from "@/components/DealCard";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, Mail, Phone, Gift, Heart, ShoppingBag, 
  Bell, Settings, LogOut, Edit, Save, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Mock data for favorites and purchase history
const mockFavorites = [
  {
    id: "1",
    title: "Organic Strawberries",
    store: "Fresh Market",
    storeImg: "/images/stores/fresh-market.jpg",
    originalPrice: 45000,
    discountPrice: 25000,
    discountPercent: 44,
    image: "/images/strawberries.jpg",
    expiresIn: "2 days",
    category: "produce",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false
  },
  {
    id: "3",
    title: "Greek Yogurt",
    store: "Healthy Foods",
    storeImg: "/images/stores/healthy-foods.jpg",
    originalPrice: 30000,
    discountPrice: 15000,
    discountPercent: 50,
    image: "/images/yogurt.jpg",
    expiresIn: "3 days",
    category: "dairy",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false
  },
  {
    id: "5",
    title: "Orange Juice",
    store: "Fresh Market",
    storeImg: "/images/stores/fresh-market.jpg",
    originalPrice: 25000,
    discountPrice: 15000,
    discountPercent: 40,
    image: "/images/orange-juice.jpg",
    expiresIn: "4 days",
    category: "beverages",
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false
  }
];

const mockOrders = [
  {
    id: "order-123",
    date: "2023-05-15T10:30:00Z",
    status: "Delivered",
    total: 85000,
    items: [
      { id: "1", name: "Organic Strawberries", quantity: 2, price: 25000 },
      { id: "3", name: "Greek Yogurt", quantity: 1, price: 15000 },
      { id: "8", name: "Bananas (Bundle)", quantity: 2, price: 10000 }
    ],
    store: "Fresh Market"
  },
  {
    id: "order-456",
    date: "2023-04-28T14:15:00Z",
    status: "Delivered",
    total: 130000,
    items: [
      { id: "4", name: "Prawn Fried Rice", quantity: 1, price: 30000 },
      { id: "6", name: "Chocolate Cake", quantity: 1, price: 70000 },
      { id: "7", name: "Chicken Salad", quantity: 1, price: 35000 }
    ],
    store: "Quick Meal"
  }
];

export default function UserProfile() {
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    notifyExpiring: true,
    notifyDeals: true,
    notifyOrders: true
  });

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  // Show loading state
  if (isLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p>Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Make sure it's a buyer account
  if (user.role !== "buyer") {
    return <Navigate to="/store/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleUpdateProfile = () => {
    setUpdatingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({
        name: formData.name,
        // In a real app, you would update more user data here
      });
      
      setIsEditing(false);
      setUpdatingProfile(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Summary Card */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.profileImage || "/images/avatars/default.jpg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Buyer Account
                      </Badge>
                    </div>
                    
                    <div className="w-full max-w-xs bg-muted/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Loyalty Points</span>
                        <span className="text-sm font-bold">{user.loyaltyPoints || 0}</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${Math.min(100, ((user.loyaltyPoints || 0) / 500) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {500 - (user.loyaltyPoints || 0)} points until your next reward
                      </p>
                    </div>
                    
                    <div className="w-full space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditing(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1">
              {isEditing ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>Update your personal information and preferences</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button onClick={handleUpdateProfile} disabled={updatingProfile}>
                        {updatingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Bell className="mr-2 h-5 w-5" />
                        Notification Preferences
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notify-expiring">Expiring Products</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about products that match your interests when they're about to expire
                            </p>
                          </div>
                          <Switch
                            id="notify-expiring"
                            checked={formData.notifyExpiring}
                            onCheckedChange={(checked) => handleSwitchChange("notifyExpiring", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notify-deals">Special Deals</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about special deals and promotions
                            </p>
                          </div>
                          <Switch
                            id="notify-deals"
                            checked={formData.notifyDeals}
                            onCheckedChange={(checked) => handleSwitchChange("notifyDeals", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notify-orders">Order Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notifications about your order status and delivery updates
                            </p>
                          </div>
                          <Switch
                            id="notify-orders"
                            checked={formData.notifyOrders}
                            onCheckedChange={(checked) => handleSwitchChange("notifyOrders", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="favorites" className="w-full">
                  <TabsList className="mb-8 grid grid-cols-3 md:w-auto">
                    <TabsTrigger value="favorites" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Favorites</span>
                      <span className="sm:hidden">Favs</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Purchase History</span>
                      <span className="sm:hidden">Orders</span>
                    </TabsTrigger>
                    <TabsTrigger value="rewards" className="flex items-center">
                      <Gift className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Loyalty Program</span>
                      <span className="sm:hidden">Rewards</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="favorites" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Favorite Products</h2>
                      <Button variant="outline" size="sm">
                        <Bell className="mr-2 h-4 w-4" />
                        Notify When On Sale
                      </Button>
                    </div>
                    
                    {user.favorites && user.favorites.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockFavorites.map(product => (
                          <DealCard
                            key={product.id}
                            {...product}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Start adding products to your favorites by clicking the heart icon on any product you're interested in.
                        </p>
                        <Button asChild>
                          <a href="/deals">Browse Deals</a>
                        </Button>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="orders" className="space-y-6">
                    <h2 className="text-2xl font-bold">Purchase History</h2>
                    
                    {user.purchaseHistory && user.purchaseHistory.length > 0 ? (
                      <div className="space-y-4">
                        {mockOrders.map(order => (
                          <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <CardTitle className="text-base">Order #{order.id.split('-')[1]}</CardTitle>
                                  <CardDescription>
                                    {new Date(order.date).toLocaleDateString()} · {order.store}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge variant="secondary">
                                    {order.status}
                                  </Badge>
                                  <p className="font-semibold">{order.total.toLocaleString()}₫</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <ul className="divide-y">
                                {order.items.map(item => (
                                  <li key={item.id} className="py-2 first:pt-0 last:pb-0 flex justify-between">
                                    <span>
                                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                                    </span>
                                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No purchase history</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          You haven't made any purchases yet. Browse our deals to find great products at discounted prices.
                        </p>
                        <Button asChild>
                          <a href="/deals">Browse Deals</a>
                        </Button>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="rewards" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Loyalty Program</h2>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {user.loyaltyPoints || 0} Points
                      </Badge>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>How it Works</CardTitle>
                        <CardDescription>
                          Earn points with every purchase and redeem them for discounts on future orders
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-muted/30 p-4 rounded-lg text-center">
                            <div className="bg-primary/10 text-primary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                              <ShoppingBag className="h-6 w-6" />
                            </div>
                            <h3 className="font-medium mb-1">Earn Points</h3>
                            <p className="text-sm text-muted-foreground">
                              Get 1 point for every 1,000₫ spent
                            </p>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg text-center">
                            <div className="bg-primary/10 text-primary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Gift className="h-6 w-6" />
                            </div>
                            <h3 className="font-medium mb-1">Redeem Rewards</h3>
                            <p className="text-sm text-muted-foreground">
                              Use points for discounts and special offers
                            </p>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg text-center">
                            <div className="bg-primary/10 text-primary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Bell className="h-6 w-6" />
                            </div>
                            <h3 className="font-medium mb-1">Exclusive Deals</h3>
                            <p className="text-sm text-muted-foreground">
                              Get early access to special promotions
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-3">Available Rewards</h3>
                          <ul className="space-y-3">
                            <li className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">10% Off Your Next Order</p>
                                <p className="text-sm text-muted-foreground">Valid for 30 days after redemption</p>
                              </div>
                              <Button size="sm" disabled={!user.loyaltyPoints || user.loyaltyPoints < 200}>
                                Redeem for 200 Points
                              </Button>
                            </li>
                            
                            <li className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">Free Delivery</p>
                                <p className="text-sm text-muted-foreground">On your next order</p>
                              </div>
                              <Button size="sm" disabled={!user.loyaltyPoints || user.loyaltyPoints < 150}>
                                Redeem for 150 Points
                              </Button>
                            </li>
                            
                            <li className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">VIP Early Access</p>
                                <p className="text-sm text-muted-foreground">48-hour early access to new deals</p>
                              </div>
                              <Button size="sm" disabled={!user.loyaltyPoints || user.loyaltyPoints < 500}>
                                Redeem for 500 Points
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
} 