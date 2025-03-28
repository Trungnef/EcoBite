import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Store, 
  Bell, 
  MessageSquare, 
  Settings,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  StoreDashboardOverview,
  StoreDashboardProducts,
  StoreDashboardOrders,
  StoreDashboardSchedule,
  StoreDashboardProfile
} from "@/components/store-dashboard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showExpiryWarning, setShowExpiryWarning] = useState(true);
  const location = useLocation();
  
  // Kiểm tra nếu người dùng vừa đăng ký xong
  useEffect(() => {
    if (location.state?.newRegistration) {
      setShowWelcome(true);
      // Tự động ẩn thông báo sau 10 giây
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  // Mock store data
  const storeData = {
    name: "Fresh Market",
    totalProducts: 15,
    productsNearExpiry: 5,
    totalOrders: 43,
    revenue: 12500000,
    avatarUrl: "/store-logo.jpg",
    pendingOrders: 3
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
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <AlertTitle className="text-green-800 flex items-center justify-between">
                      <span>Chào mừng đến với EcoBite Seller!</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowWelcome(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Đăng ký cửa hàng của bạn đã hoàn tất thành công. Bắt đầu bằng cách tải lên sản phẩm đầu tiên của bạn.
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showExpiryWarning && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <AlertTitle className="text-red-800 flex items-center justify-between">
                      <span>Cảnh báo sản phẩm gần hết hạn!</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowExpiryWarning(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                      Bạn có 5 sản phẩm sẽ hết hạn trong vòng 7 ngày tới. Vui lòng kiểm tra tab Sản phẩm để xem chi tiết.
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={storeData.avatarUrl} alt={storeData.name} />
                <AvatarFallback className="bg-primary/10 text-primary">FM</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Store className="h-6 w-6 text-primary" />
                  <span>Fresh Market</span>
                </h1>
                <p className="text-muted-foreground">
                  Quản lý cửa hàng, sản phẩm và theo dõi hoạt động
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Activity className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hiệu suất cửa hàng</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Báo cáo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      {storeData.pendingOrders > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                          {storeData.pendingOrders}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Thông báo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tin nhắn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cài đặt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[750px]">
              <TabsTrigger value="dashboard">Tổng quan</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="schedule">Lịch giao hàng</TabsTrigger>
              <TabsTrigger value="profile">Thông tin cửa hàng</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <StoreDashboardOverview formatCurrency={formatCurrency} />
            </TabsContent>
            
            <TabsContent value="products">
              <StoreDashboardProducts />
            </TabsContent>
            
            <TabsContent value="orders">
              <StoreDashboardOrders />
            </TabsContent>
            
            <TabsContent value="schedule">
              <StoreDashboardSchedule />
            </TabsContent>
            
            <TabsContent value="profile">
              <StoreDashboardProfile />
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </>
  );
} 