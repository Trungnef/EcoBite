import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoreProductList } from "@/components/StoreProductList";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  UserCog, 
  Bell, 
  MessageSquare, 
  Settings 
} from "lucide-react";

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  
  // Mock store data
  const storeData = {
    name: "Fresh Market",
    totalProducts: 15,
    productsNearExpiry: 5,
    totalOrders: 43,
    revenue: 12500000,
    avatarUrl: "/store-logo.jpg",
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-muted/30 min-h-screen">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center mb-2">
                <Store className="mr-2 h-7 w-7 text-primary" />
                Store Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your store, products, and monitor activity
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{storeData.totalProducts}</div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {storeData.productsNearExpiry} products expiring soon
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{storeData.totalOrders}</div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  12 new orders this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{formatCurrency(storeData.revenue)}</div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <UserCog className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on 86 reviews
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="profile">Store Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Manage Products</h2>
                <StoreProductList />
              </div>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    The orders management feature is coming in the next update. You'll be able to track and fulfill customer orders here.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Store Details</h2>
                <div className="text-center py-12">
                  <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    The store profile management feature is coming in the next update. You'll be able to update your store information, hours, and policies here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </>
  );
} 