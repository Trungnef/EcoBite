import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  BarChart4, 
  LineChart, 
  PieChart, 
  ArrowUp, 
  ArrowDown,
  ShoppingCart, 
  DollarSign, 
  Package, 
  Activity, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye,
  Info,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface StoreDashboardOverviewProps {
  formatCurrency: (amount: number) => string;
}

export function StoreDashboardOverview({ formatCurrency }: StoreDashboardOverviewProps) {
  const [dateRange, setDateRange] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("today");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chartType, setChartType] = useState<"revenue" | "orders" | "products">("revenue");

  // Update the current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to refresh the dashboard data
  const refreshData = () => {
    setIsRefreshing(true);
    toast.success("Dữ liệu đang được cập nhật");
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Đã cập nhật dữ liệu thành công");
    }, 1500);
  };

  // Date formatting helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Time formatting helper
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Get date range text based on selected filter
  const getDateRangeText = () => {
    const today = new Date();
    const startDate = new Date();
    
    switch(dateRange) {
      case "today":
        return `Dữ liệu hôm nay (${formatDate(today)})`;
      case "week":
        startDate.setDate(today.getDate() - 7);
        return `Dữ liệu từ ${formatDate(startDate)} đến ${formatDate(today)}`;
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        return `Dữ liệu từ ${formatDate(startDate)} đến ${formatDate(today)}`;
      case "quarter":
        startDate.setMonth(today.getMonth() - 3);
        return `Dữ liệu từ ${formatDate(startDate)} đến ${formatDate(today)}`;
      case "year":
        startDate.setFullYear(today.getFullYear() - 1);
        return `Dữ liệu từ ${formatDate(startDate)} đến ${formatDate(today)}`;
      default:
        return "Dữ liệu hiện tại";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Tổng quan doanh nghiệp</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {getDateRangeText()} · Cập nhật lần cuối: {formatTime(currentTime)}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="h-9 rounded-md border border-input px-3 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={refreshData}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Làm mới dữ liệu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="outline" size="sm">
            <BarChart4 className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Tổng doanh thu"
          value={formatCurrency(dateRange === "today" ? 2500000 : 12500000)}
          icon={<DollarSign className="h-5 w-5" />}
          change={15}
          trend="up"
          description="so với kỳ trước"
        />
        
        <StatsCard 
          title="Tổng đơn hàng"
          value={dateRange === "today" ? "8" : "43"}
          icon={<ShoppingCart className="h-5 w-5" />}
          change={12}
          trend="up"
          description="so với kỳ trước"
        />
        
        <StatsCard 
          title="Sản phẩm"
          value={dateRange === "today" ? "15" : "15"}
          icon={<Package className="h-5 w-5" />}
          secondaryValue="5 sắp hết hạn"
          variant="warning"
        />
        
        <StatsCard 
          title="Tỷ lệ hoàn thành"
          value="98%"
          icon={<Activity className="h-5 w-5" />}
          change={3}
          trend="up"
          description="dựa trên 86 đơn hàng"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Phân tích hiệu suất</CardTitle>
              <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)} className="hidden md:block">
                <TabsList className="h-8">
                  <TabsTrigger value="revenue" className="text-xs px-3">Doanh thu</TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs px-3">Đơn hàng</TabsTrigger>
                  <TabsTrigger value="products" className="text-xs px-3">Sản phẩm</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Mobile dropdown for chart type */}
              <select 
                className="h-8 rounded-md border border-input px-2 text-xs md:hidden"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as any)}
              >
                <option value="revenue">Doanh thu</option>
                <option value="orders">Đơn hàng</option>
                <option value="products">Sản phẩm</option>
              </select>
            </div>
            <CardDescription className="text-xs mt-1">
              {chartType === "revenue" && "Biểu đồ doanh thu trong kỳ"}
              {chartType === "orders" && "Biểu đồ đơn hàng trong kỳ"}
              {chartType === "products" && "Biểu đồ sản phẩm bán ra trong kỳ"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80 w-full bg-muted/20 rounded-md flex items-center justify-center">
              <div className="text-center">
                {chartType === "revenue" && <LineChart className="h-12 w-12 mx-auto text-primary/60" />}
                {chartType === "orders" && <BarChart4 className="h-12 w-12 mx-auto text-primary/60" />}
                {chartType === "products" && <BarChart4 className="h-12 w-12 mx-auto text-primary/60" />}
                <p className="mt-2 text-sm text-muted-foreground">
                  {chartType === "revenue" && "Biểu đồ doanh thu theo thời gian"}
                  {chartType === "orders" && "Biểu đồ số lượng đơn hàng theo thời gian"}
                  {chartType === "products" && "Biểu đồ số lượng sản phẩm bán ra theo thời gian"}
                </p>
                <p className="text-xs text-muted-foreground">Dữ liệu từ 01/05/2023 đến 18/05/2023</p>
              </div>
            </div>
            
            {/* Interactive legend */}
            <div className="flex justify-center mt-4 gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span>{chartType === "revenue" ? "Doanh thu" : chartType === "orders" ? "Đơn hàng" : "Sản phẩm"}</span>
              </div>
              {chartType === "revenue" && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                  <span>Mục tiêu</span>
                </div>
              )}
              {chartType === "products" && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <span>Tồn kho</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4 px-6">
            <div className="w-full flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Thứ 2</span>
              <span className="text-muted-foreground">Thứ 3</span>
              <span className="text-muted-foreground">Thứ 4</span>
              <span className="text-muted-foreground">Thứ 5</span>
              <span className="text-muted-foreground">Thứ 6</span>
              <span className="text-muted-foreground">Thứ 7</span>
              <span className="text-muted-foreground">CN</span>
            </div>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Thống kê hiệu suất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatCurrency(3800000)}</div>
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>12.5%</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Doanh thu hiện tại</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Đơn hàng hoàn thành</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tồn kho</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-dashed">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mục tiêu tuần này: {formatCurrency(5000000)}</span>
                  <Button variant="link" className="p-0 h-auto text-xs">Điều chỉnh</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors rounded-t-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Rau cải ngọt hữu cơ</div>
                      <div className="text-xs text-muted-foreground">120 đơn vị</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatCurrency(1200000)}</div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Cà chua bio</div>
                      <div className="text-xs text-muted-foreground">95 đơn vị</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatCurrency(950000)}</div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors rounded-b-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Chanh tươi hữu cơ</div>
                      <div className="text-xs text-muted-foreground">87 đơn vị</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatCurrency(870000)}</div>
                </div>
              </div>
              
              <div className="p-3 border-t">
                <Button variant="ghost" className="w-full text-xs justify-center">
                  Xem tất cả sản phẩm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add bottom section with three cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Phân bổ đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto text-primary/60" />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="text-xs flex items-center">
                    <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                    <span>Đang chờ (15%)</span>
                  </div>
                  <div className="text-xs flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Đang xử lý (25%)</span>
                  </div>
                  <div className="text-xs flex items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Đang giao (20%)</span>
                  </div>
                  <div className="text-xs flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Hoàn thành (40%)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-dashed">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-3.5 w-3.5 mr-2" />
                Xem chi tiết đơn hàng
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-base">Sản phẩm gần hết hạn</CardTitle>
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">5 sản phẩm</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-60 overflow-auto">
              <div className="flex justify-between items-center p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">Dưa lưới Nhật Bản</div>
                  <div className="text-xs text-red-500">Còn 2 ngày</div>
                </div>
                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">12 đơn vị</Badge>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">Sữa chua vị dâu</div>
                  <div className="text-xs text-red-500">Còn 3 ngày</div>
                </div>
                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">15 đơn vị</Badge>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">Bánh mì sandwich</div>
                  <div className="text-xs text-red-500">Còn 3 ngày</div>
                </div>
                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">8 đơn vị</Badge>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">Nước ép táo</div>
                  <div className="text-xs text-amber-500">Còn 4 ngày</div>
                </div>
                <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">20 đơn vị</Badge>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">Xà lách trộn sẵn</div>
                  <div className="text-xs text-amber-500">Còn 5 ngày</div>
                </div>
                <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">10 đơn vị</Badge>
              </div>
            </div>
            <div className="p-3 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <AlertCircle className="h-3.5 w-3.5 mr-2" />
                Quản lý hàng sắp hết hạn
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
            <Badge variant="outline" className="text-muted-foreground hover:bg-muted cursor-pointer">Làm mới</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-60 overflow-auto">
              <ActivityItem
                icon={<ShoppingCart className="h-4 w-4 text-blue-600" />}
                bgColor="bg-blue-100"
                title="Đơn hàng mới #5678"
                time="45 phút trước"
              />
              <ActivityItem
                icon={<DollarSign className="h-4 w-4 text-green-600" />}
                bgColor="bg-green-100"
                title="Thanh toán 350.000₫"
                time="1 giờ trước"
              />
              <ActivityItem
                icon={<Package className="h-4 w-4 text-purple-600" />}
                bgColor="bg-purple-100"
                title="Thêm 20 sản phẩm mới"
                time="2 giờ trước"
              />
              <ActivityItem
                icon={<Activity className="h-4 w-4 text-amber-600" />}
                bgColor="bg-amber-100"
                title="Cập nhật tồn kho"
                time="3 giờ trước"
              />
              <ActivityItem
                icon={<AlertCircle className="h-4 w-4 text-red-600" />}
                bgColor="bg-red-100"
                title="Cảnh báo hết hàng: Rau cải"
                time="5 giờ trước"
              />
            </div>
            <div className="p-3 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                Xem tất cả hoạt động
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for stats cards
function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  trend, 
  description, 
  secondaryValue,
  variant = "default" 
}: { 
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: number;
  trend?: "up" | "down";
  description?: string;
  secondaryValue?: string;
  variant?: "default" | "warning" | "success" | "danger";
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
          {title}
          <div className={`p-2 rounded-full ${
            variant === "warning" ? "bg-amber-100 text-amber-600" :
            variant === "success" ? "bg-green-100 text-green-600" :
            variant === "danger" ? "bg-red-100 text-red-600" :
            "bg-primary/10 text-primary"
          }`}>
            {icon}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold"
            >
              {value}
            </motion.div>
            
            {secondaryValue && (
              <div className={`text-xs mt-1 ${
                variant === "warning" ? "text-amber-600" : 
                variant === "danger" ? "text-red-600" : 
                "text-muted-foreground"
              }`}>
                {secondaryValue}
              </div>
            )}
            
            {change !== undefined && trend && (
              <div className="flex items-center mt-1">
                <div className={`flex items-center text-sm ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {trend === "up" ? 
                    <ArrowUp className="h-4 w-4 mr-1" /> : 
                    <ArrowDown className="h-4 w-4 mr-1" />
                  }
                  <span>{change}%</span>
                </div>
                {description && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for activity items
function ActivityItem({ 
  icon, 
  bgColor, 
  title, 
  time 
}: { 
  icon: React.ReactNode, 
  bgColor: string, 
  title: string, 
  time: string 
}) {
  return (
    <div className="p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 ${bgColor} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{time}</div>
        </div>
      </div>
    </div>
  );
} 