import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart4, 
  Eye, 
  ChevronDown, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Check, 
  Package,
  MapPin, 
  CircleX, 
  Filter, 
  CircleCheck,
  Camera,
  RotateCw,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

// Định nghĩa các kiểu dữ liệu
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

type OrderStatus = 
  | "pending" 
  | "processing" 
  | "ready" 
  | "shipping" 
  | "completed" 
  | "cancelled";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  deliveryMethod: "shipping" | "pickup";
  address?: string;
  pickupTime?: string;
  totalAmount: number;
  items: OrderItem[];
  paymentMethod: string;
  note?: string;
}

// Helper function để định dạng giá tiền
const formatCurrency = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
};

// Map cho status badge
const orderStatusInfo: Record<OrderStatus, { color: string; label: string; nextAction?: string }> = {
  pending: { 
    color: "bg-amber-500", 
    label: "Chờ xử lý", 
    nextAction: "Chuẩn bị hàng" 
  },
  processing: { 
    color: "bg-blue-500", 
    label: "Đang chuẩn bị", 
    nextAction: "Sẵn sàng giao hàng" 
  },
  ready: { 
    color: "bg-indigo-500", 
    label: "Sẵn sàng giao hàng", 
    nextAction: "Quét mã & Giao hàng" 
  },
  shipping: { 
    color: "bg-violet-500", 
    label: "Đang giao hàng", 
    nextAction: "Đã giao hàng" 
  },
  completed: { 
    color: "bg-green-500", 
    label: "Đã hoàn thành" 
  },
  cancelled: { 
    color: "bg-red-500", 
    label: "Đã hủy" 
  }
};

// Dữ liệu mẫu
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2025-5678",
    customerName: "Nguyễn Văn A",
    orderDate: "2025-05-18T07:30:00",
    status: "pending",
    deliveryMethod: "shipping",
    address: "123 Đường Lê Lợi, Quận 1, TP HCM",
    totalAmount: 320000,
    items: [
      { id: "item1", productId: "prod1", productName: "Dưa lưới Nhật Bản", quantity: 1, price: 85000, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38" },
      { id: "item2", productId: "prod2", productName: "Sữa chua vị dâu", quantity: 3, price: 25000, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777" },
      { id: "item3", productId: "prod3", productName: "Bánh mì sandwich", quantity: 2, price: 80000 }
    ],
    paymentMethod: "COD"
  },
  {
    id: "2",
    orderNumber: "ORD-2025-5677",
    customerName: "Trần Thị B",
    orderDate: "2025-05-17T14:45:00",
    status: "processing",
    deliveryMethod: "pickup",
    pickupTime: "2025-05-18T17:00:00",
    totalAmount: 185000,
    items: [
      { id: "item4", productId: "prod4", productName: "Nước ép cam nguyên chất", quantity: 2, price: 40000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba" },
      { id: "item5", productId: "prod5", productName: "Rau cải thìa hữu cơ", quantity: 1, price: 18000, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38" },
      { id: "item6", productId: "prod2", productName: "Sữa chua vị dâu", quantity: 3, price: 25000, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777" }
    ],
    paymentMethod: "Chuyển khoản ngân hàng",
    note: "Khách sẽ đến lấy vào buổi chiều"
  },
  {
    id: "3",
    orderNumber: "ORD-2025-5675",
    customerName: "Lê Văn C",
    orderDate: "2025-05-17T10:15:00",
    status: "ready",
    deliveryMethod: "shipping",
    address: "45 Đường Nguyễn Huệ, Quận 1, TP HCM",
    totalAmount: 450000,
    items: [
      { id: "item7", productId: "prod1", productName: "Dưa lưới Nhật Bản", quantity: 2, price: 85000, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38" },
      { id: "item8", productId: "prod4", productName: "Nước ép cam nguyên chất", quantity: 4, price: 40000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba" },
      { id: "item9", productId: "prod3", productName: "Bánh mì sandwich", quantity: 5, price: 30000 }
    ],
    paymentMethod: "COD"
  },
  {
    id: "4",
    orderNumber: "ORD-2025-5673",
    customerName: "Đỗ Thị D",
    orderDate: "2025-05-16T09:20:00",
    status: "shipping",
    deliveryMethod: "shipping",
    address: "67 Đường Cao Thắng, Quận 3, TP HCM",
    totalAmount: 275000,
    items: [
      { id: "item10", productId: "prod5", productName: "Rau cải thìa hữu cơ", quantity: 3, price: 18000, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38" },
      { id: "item11", productId: "prod2", productName: "Sữa chua vị dâu", quantity: 5, price: 25000, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777" },
      { id: "item12", productId: "prod3", productName: "Bánh mì sandwich", quantity: 2, price: 30000 }
    ],
    paymentMethod: "VNPAY"
  },
  {
    id: "5",
    orderNumber: "ORD-2025-5670",
    customerName: "Vũ Minh E",
    orderDate: "2025-05-15T16:10:00",
    status: "completed",
    deliveryMethod: "pickup",
    pickupTime: "2025-05-15T18:00:00",
    totalAmount: 520000,
    items: [
      { id: "item13", productId: "prod1", productName: "Dưa lưới Nhật Bản", quantity: 3, price: 85000, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38" },
      { id: "item14", productId: "prod4", productName: "Nước ép cam nguyên chất", quantity: 5, price: 40000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba" },
      { id: "item15", productId: "prod3", productName: "Bánh mì sandwich", quantity: 3, price: 30000 }
    ],
    paymentMethod: "MOMO"
  }
];

export function StoreDashboardOrders() {
  // States
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [orderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [scanDialogOpen, setScanDialogOpen] = useState<boolean>(false);
  const [processingOrder, setProcessingOrder] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    // Apply status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
      const matchesCustomerName = order.customerName.toLowerCase().includes(query);
      const matchesAddress = order.address?.toLowerCase().includes(query) || false;
      
      if (!matchesOrderNumber && !matchesCustomerName && !matchesAddress) {
        return false;
      }
    }
    
    // Apply date filter
    if (dateFilter) {
      const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
      if (orderDate !== dateFilter) {
        return false;
      }
    }
    
    return true;
  });
  
  // Xử lý khi cập nhật trạng thái đơn hàng
  const handleUpdateOrderStatus = (orderId: string) => {
    setProcessingOrder(true);
    
    // Tìm đơn hàng cần update
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (!orderToUpdate) {
      toast.error("Không tìm thấy đơn hàng");
      setProcessingOrder(false);
      return;
    }
    
    // Map trạng thái tiếp theo dựa trên trạng thái hiện tại
    const statusTransitions: Record<OrderStatus, OrderStatus> = {
      pending: "processing",
      processing: "ready",
      ready: "shipping",
      shipping: "completed",
      completed: "completed",
      cancelled: "cancelled"
    };
    
    // Cập nhật trạng thái đơn hàng
    const newStatus = statusTransitions[orderToUpdate.status];
    
    // Giả lập delay cho API call
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      );
      
      setOrders(updatedOrders);
      toast.success(`Cập nhật trạng thái đơn hàng ${orderToUpdate.orderNumber} thành công`);
      setProcessingOrder(false);
      
      // Nếu đơn hàng đang được xem chi tiết, cập nhật selected order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      // Đóng dialog quét mã nếu đã hoàn thành quét
      if (orderToUpdate.status === "ready") {
        setScanDialogOpen(false);
      }
    }, 800);
  };
  
  // Format ngày giờ
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Format thời gian
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Xử lý khi mở chi tiết đơn hàng
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };
  
  // Xử lý khi quét mã và giao hàng
  const handleScanAndShip = (order: Order) => {
    setSelectedOrder(order);
    setScanDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Xem và xử lý đơn đặt hàng từ khách hàng
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-9 h-9 w-full md:w-[250px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Input 
              type="date" 
              className="h-9 w-[160px]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đơn hàng</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="processing">Đang chuẩn bị</SelectItem>
              <SelectItem value="ready">Sẵn sàng giao hàng</SelectItem>
              <SelectItem value="shipping">Đang giao hàng</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <BarChart4 className="h-4 w-4 mr-2" />
            Báo cáo
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="px-4">Tất cả</TabsTrigger>
          <TabsTrigger value="pending" className="px-4">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="processing" className="px-4">Đang chuẩn bị</TabsTrigger>
          <TabsTrigger value="ready" className="px-4">Sẵn sàng giao</TabsTrigger>
          <TabsTrigger value="shipping" className="px-4">Đang giao</TabsTrigger>
          <TabsTrigger value="completed" className="px-4">Hoàn thành</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <AnimatePresence>
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10 bg-muted/20 rounded-lg"
              >
                <Package className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                <h3 className="text-lg font-medium">Không tìm thấy đơn hàng nào</h3>
                <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              </motion.div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05
                  }}
                >
                  <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: orderStatusInfo[order.status].color.replace('bg-', '') }}>
                    <div className="bg-muted/30 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 sm:mb-0">
                          <span className="font-medium">{order.orderNumber}</span>
                          <Badge className={orderStatusInfo[order.status].color}>
                            {orderStatusInfo[order.status].label}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <span>{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDateTime(order.orderDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Chi tiết
                        </Button>
                        
                        {orderStatusInfo[order.status].nextAction && (
                          <Button 
                            size="sm"
                            onClick={() => {
                              if (order.status === "ready") {
                                handleScanAndShip(order);
                              } else {
                                handleUpdateOrderStatus(order.id);
                              }
                            }}
                            disabled={processingOrder}
                          >
                            {processingOrder ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang xử lý
                              </>
                            ) : (
                              <>{orderStatusInfo[order.status].nextAction}</>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Phương thức nhận hàng:</span>
                          <span className="font-medium">
                            {order.deliveryMethod === "shipping" ? "Giao hàng tận nơi" : "Khách lấy tại cửa hàng"}
                          </span>
                        </div>
                        
                        {order.deliveryMethod === "shipping" ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                            <span className="font-medium">{order.address}</span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Thời gian lấy hàng:</span>
                            <span className="font-medium">{formatDateTime(order.pickupTime || "")}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Số lượng sản phẩm:</span>
                          <span className="font-medium">{order.items.length} sản phẩm</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tổng tiền:</span>
                          <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                        </div>
                        
                        {order.status === "ready" && order.deliveryMethod === "shipping" && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-sm font-medium mb-2">Quy trình giao hàng:</div>
                            <ol className="text-sm space-y-2">
                              <li className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">1</div>
                                <span>Quét mã sản phẩm trước khi giao (để trừ số lượng tồn kho)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">2</div>
                                <span>Chụp ảnh lúc giao hàng cho đối tác vận chuyển</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">3</div>
                                <span>Xác nhận người vận chuyển đã nhận hàng</span>
                              </li>
                            </ol>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </TabsContent>
        
        {/* Các TabsContent khác sẽ được thêm ở phần tiếp theo */}
      </Tabs>
      
      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      Chi tiết đơn hàng {selectedOrder.orderNumber}
                      <Badge className={orderStatusInfo[selectedOrder.status].color}>
                        {orderStatusInfo[selectedOrder.status].label}
                      </Badge>
                    </DialogTitle>
                    <DialogDescription>
                      Đặt hàng lúc {formatDateTime(selectedOrder.orderDate)}
                    </DialogDescription>
                  </div>
                  
                  {orderStatusInfo[selectedOrder.status].nextAction && (
                    <Button 
                      className="mt-2 sm:mt-0"
                      onClick={() => {
                        if (selectedOrder.status === "ready") {
                          setOrderDetailsOpen(false);
                          handleScanAndShip(selectedOrder);
                        } else {
                          handleUpdateOrderStatus(selectedOrder.id);
                        }
                      }}
                      disabled={processingOrder}
                    >
                      {processingOrder ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang xử lý
                        </>
                      ) : (
                        <>{orderStatusInfo[selectedOrder.status].nextAction}</>
                      )}
                    </Button>
                  )}
                </div>
              </DialogHeader>
              
              <ScrollArea className="w-full max-h-[calc(90vh-180px)] pr-4">
                <div className="py-4 space-y-6">
                  {/* Thông tin khách hàng */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-3">Thông tin đơn hàng</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Khách hàng</p>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phương thức thanh toán</p>
                        <p className="font-medium">{selectedOrder.paymentMethod}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phương thức nhận hàng</p>
                        <p className="font-medium">
                          {selectedOrder.deliveryMethod === "shipping" ? "Giao hàng tận nơi" : "Khách lấy tại cửa hàng"}
                        </p>
                      </div>
                      
                      {selectedOrder.deliveryMethod === "shipping" ? (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Địa chỉ giao hàng</p>
                          <p className="font-medium">{selectedOrder.address}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Thời gian lấy hàng</p>
                          <p className="font-medium">{formatDateTime(selectedOrder.pickupTime || "")}</p>
                        </div>
                      )}
                      
                      {selectedOrder.note && (
                        <div className="sm:col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                          <p className="font-medium">{selectedOrder.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Danh sách sản phẩm */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Sản phẩm đặt hàng</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3 border-b pb-3"
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.productName} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-grow">
                            <p className="font-medium">{item.productName}</p>
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                              <span>{formatCurrency(item.price)} x {item.quantity}</span>
                              <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tổng tiền */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>0₫</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Giảm giá</span>
                      <span>0₫</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t mt-2">
                      <span>Tổng cộng</span>
                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                  
                  {/* Lịch sử trạng thái */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Lịch sử trạng thái</h3>
                    <ol className="relative border-l border-muted-foreground/20 ml-3 space-y-6">
                      <li className="mb-6 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                          <Check className="w-3 h-3 text-green-800" />
                        </span>
                        <h3 className="flex items-center mb-1 text-sm font-semibold">
                          Đơn hàng đã được đặt
                        </h3>
                        <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                          {formatDateTime(selectedOrder.orderDate)}
                        </time>
                      </li>
                      
                      {selectedOrder.status !== "pending" && (
                        <li className="mb-6 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                            <Package className="w-3 h-3 text-blue-800" />
                          </span>
                          <h3 className="flex items-center mb-1 text-sm font-semibold">
                            Đơn hàng đang được chuẩn bị
                          </h3>
                          <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                            30 phút sau khi đặt hàng
                          </time>
                        </li>
                      )}
                      
                      {(selectedOrder.status === "ready" || selectedOrder.status === "shipping" || selectedOrder.status === "completed") && (
                        <li className="mb-6 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3 ring-8 ring-white">
                            <Check className="w-3 h-3 text-indigo-800" />
                          </span>
                          <h3 className="flex items-center mb-1 text-sm font-semibold">
                            Đơn hàng sẵn sàng giao
                          </h3>
                          <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                            1 giờ sau khi đặt hàng
                          </time>
                        </li>
                      )}
                      
                      {(selectedOrder.status === "shipping" || selectedOrder.status === "completed") && (
                        <li className="mb-6 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-violet-100 rounded-full -left-3 ring-8 ring-white">
                            <MapPin className="w-3 h-3 text-violet-800" />
                          </span>
                          <h3 className="flex items-center mb-1 text-sm font-semibold">
                            Đơn hàng đang được giao
                          </h3>
                          <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                            2 giờ sau khi đặt hàng
                          </time>
                        </li>
                      )}
                      
                      {selectedOrder.status === "completed" && (
                        <li className="ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                            <Check className="w-3 h-3 text-green-800" />
                          </span>
                          <h3 className="flex items-center mb-1 text-sm font-semibold">
                            Đơn hàng đã hoàn thành
                          </h3>
                          <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                            3 giờ sau khi đặt hàng
                          </time>
                        </li>
                      )}
                      
                      {selectedOrder.status === "cancelled" && (
                        <li className="ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -left-3 ring-8 ring-white">
                            <CircleX className="w-3 h-3 text-red-800" />
                          </span>
                          <h3 className="flex items-center mb-1 text-sm font-semibold">
                            Đơn hàng đã bị hủy
                          </h3>
                          <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                            3 giờ sau khi đặt hàng
                          </time>
                        </li>
                      )}
                    </ol>
                  </div>
                </div>
              </ScrollArea>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
                  Đóng
                </Button>
                
                {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      // Logic để hủy đơn hàng
                      const updatedOrders = orders.map(order => 
                        order.id === selectedOrder.id 
                          ? { ...order, status: "cancelled" as OrderStatus } 
                          : order
                      );
                      
                      setOrders(updatedOrders);
                      setSelectedOrder({ ...selectedOrder, status: "cancelled" });
                      toast.success(`Đã hủy đơn hàng ${selectedOrder.orderNumber}`);
                    }}
                  >
                    Hủy đơn hàng
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog quét mã vạch và giao hàng */}
      <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Quét mã & Giao hàng</DialogTitle>
                <DialogDescription>
                  Quét mã QR của sản phẩm trước khi giao để cập nhật tồn kho
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="aspect-square bg-black rounded-md flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-dashed border-primary w-3/4 h-3/4 flex items-center justify-center">
                      <span className="text-primary text-xs">Đặt mã QR vào khung quét</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tiến trình quét</Label>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">
                    Đã quét 3/4 sản phẩm
                  </div>
                </div>
                
                <div className="border rounded-md p-3 bg-muted/20">
                  <h4 className="text-sm font-medium mb-2">Sản phẩm đã quét:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CircleCheck className="h-4 w-4 text-green-500" />
                      <span>{selectedOrder.items[0]?.productName} x{selectedOrder.items[0]?.quantity}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CircleCheck className="h-4 w-4 text-green-500" />
                      <span>{selectedOrder.items[1]?.productName} x{selectedOrder.items[1]?.quantity}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CircleCheck className="h-4 w-4 text-green-500" />
                      <span>{selectedOrder.items[2]?.productName} x{selectedOrder.items[2]?.quantity}</span>
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Quét {selectedOrder.items[3]?.productName || "sản phẩm còn lại"}...</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-3 space-y-2">
                  <h4 className="text-sm font-medium mb-1">Bước tiếp theo:</h4>
                  <div className="flex items-center gap-2">
                    <Button className="w-full gap-2" disabled>
                      <Camera className="h-4 w-4" />
                      Chụp ảnh giao hàng
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setScanDialogOpen(false)}>
                  Hủy
                </Button>
                <Button 
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id);
                    toast.success("Quét mã thành công! Đơn hàng đã được chuyển sang trạng thái đang giao");
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Hoàn tất & Giao hàng
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 