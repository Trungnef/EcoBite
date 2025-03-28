import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, ShoppingBag, Truck, Clock, 
  ArrowRight, MapPin, Phone, CalendarClock, 
  CreditCard, User, File, ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OrderConfirmationProps {}

const OrderConfirmation: React.FC<OrderConfirmationProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState('processing');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra dữ liệu từ location state (từ các trang thanh toán)
    const stateData = location.state;
    if (stateData?.success && stateData?.orderNumber) {
      // Đã redirect từ trang thanh toán
      if (Object.keys(stateData).length > 3) {
        // Nếu stateData chứa đầy đủ thông tin đơn hàng (từ ZaloPay, MoMo, VNPay)
        setOrder(stateData);
        setPaymentInfo({
          paymentId: stateData.paymentId || `PAY${Date.now()}`,
          method: stateData.paymentMethod,
          status: 'completed',
          time: new Date()
        });
      } else {
        // Trường hợp stateData chỉ chứa thông tin cơ bản, lấy từ localStorage
        const pendingOrder = localStorage.getItem('pending_order');
        if (pendingOrder) {
          const orderData = JSON.parse(pendingOrder);
          setOrder(orderData);
          setPaymentInfo({
            paymentId: stateData?.paymentId || `PAY${Date.now()}`,
            method: orderData.paymentMethod,
            status: 'completed',
            time: new Date()
          });
          // Xóa dữ liệu từ localStorage sau khi đã lấy
          localStorage.removeItem('pending_order');
        } else {
          // Trường hợp không tìm thấy dữ liệu đơn hàng
          setOrder({
            orderNumber: stateData.orderNumber,
            orderDate: new Date()
          });
          setPaymentInfo({
            paymentId: stateData?.paymentId || `PAY${Date.now()}`,
            method: 'unknown',
            status: 'completed',
            time: new Date()
          });
        }
      }
    } else if (location.state) {
      // Đã redirect trực tiếp từ trang checkout (thanh toán khi nhận hàng)
      setOrder(location.state);
      setPaymentInfo({
        method: location.state.paymentMethod,
        status: location.state.paymentMethod === 'cod' ? 'pending' : 'processing',
        time: new Date()
      });
    } else {
      // Không có dữ liệu, chuyển về trang chủ
      navigate('/');
    }
  }, [location, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
      </div>
    );
  }

  // Format thời gian và ngày
  const formattedDate = order.orderDate 
    ? format(new Date(order.orderDate), 'EEEE, dd/MM/yyyy', { locale: vi })
    : format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi });
  
  // Dự đoán thời gian giao hàng dựa trên phương thức
  const estimatedDelivery = getEstimatedDelivery(order.deliveryMethod || 'standard');

  return (
    <>
      <Navbar />
      <main className="py-16 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-primary p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Đặt hàng thành công!</h1>
                    <p>Cảm ơn bạn đã mua hàng tại EcoBite Vietnam</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground">Mã đơn hàng</p>
                    <p className="text-lg font-semibold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ngày đặt hàng</p>
                    <p>{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trạng thái</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">
                        Đã xác nhận
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Thông tin thanh toán */}
                {paymentInfo && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Thông tin thanh toán
                    </h2>
                    
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                          <p className="font-medium">
                            {getPaymentMethodText(paymentInfo.method)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Trạng thái thanh toán</p>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                paymentInfo.status === 'completed' 
                                  ? 'bg-green-500' 
                                  : paymentInfo.status === 'processing' 
                                    ? 'bg-amber-500' 
                                    : 'bg-muted'
                              }
                            >
                              {paymentInfo.status === 'completed' 
                                ? 'Đã thanh toán' 
                                : paymentInfo.status === 'processing' 
                                  ? 'Đang xử lý' 
                                  : 'Chờ thanh toán'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {paymentInfo.paymentId && (
                        <div>
                          <p className="text-sm text-muted-foreground">Mã giao dịch</p>
                          <p className="font-medium">{paymentInfo.paymentId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Thông tin giao hàng */}
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Thông tin giao hàng
                  </h2>
                  
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div>
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {order.shippingAddress?.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.shippingAddress?.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-sm">Địa chỉ giao hàng</p>
                        <p>
                          {order.shippingAddress?.address}, {order.shippingAddress?.district}, {order.shippingAddress?.city}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-sm">Phương thức giao hàng</p>
                        <p>{getDeliveryMethodText(order.deliveryMethod)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-sm">Thời gian giao hàng dự kiến</p>
                        <p>{estimatedDelivery}</p>
                      </div>
                    </div>
                    
                    {order.note && (
                      <div className="flex items-start gap-2">
                        <File className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Ghi chú</p>
                          <p>{order.note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Sản phẩm đã đặt */}
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Sản phẩm đã đặt
                  </h2>
                  
                  <div className="space-y-3">
                    {(order.orderItems || []).map((item: any, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-muted/30 rounded-lg">
                        <div className="h-16 w-16 border rounded-md overflow-hidden mr-3">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="font-medium">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="flex gap-3 text-sm text-muted-foreground">
                              <p>SL: {item.quantity}</p>
                              {item.expiryDate && (
                                <p className="flex items-center gap-1 text-amber-600">
                                  <Clock className="h-3 w-3" />
                                  HSD: {format(new Date(item.expiryDate), 'dd/MM/yyyy', { locale: vi })}
                                </p>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tóm tắt đơn hàng */}
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Tóm tắt đơn hàng
                  </h2>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span>{order.orderSummary?.subtotal.toLocaleString('vi-VN')}₫</span>
                      </div>
                      
                      {order.orderSummary?.discount > 0 && (
                        <div className="flex justify-between text-primary">
                          <span>Giảm giá</span>
                          <span>-{order.orderSummary?.discount.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phí vận chuyển</span>
                        <span>{order.orderSummary?.shippingFee.toLocaleString('vi-VN')}₫</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-medium text-lg">
                        <span>Tổng cộng</span>
                        <span>{order.orderSummary?.total.toLocaleString('vi-VN')}₫</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="outline" className="px-8 group">
                    <Link 
                      to="/profile/orders"
                      state={{ trackOrder: order.orderNumber || order.id || `order-${Date.now()}` }}
                      className="flex items-center gap-2"
                      onClick={() => {
                        // Save comprehensive order data to localStorage
                        const trackingData = {
                          orderId: order.orderNumber || order.id || `order-${Date.now()}`,
                          timestamp: Date.now(),
                          orderSummary: {
                            total: order.orderSummary?.total || 0,
                            items: (order.orderItems || []).length
                          },
                          orderItems: order.orderItems || []
                        };
                        localStorage.setItem('track_order', trackingData.orderId);
                        localStorage.setItem('track_order_timestamp', trackingData.timestamp.toString());
                        localStorage.setItem('track_order_data', JSON.stringify(trackingData));
                        
                        console.log("Saving order tracking data:", trackingData);
                      }}
                    >
                      <ClipboardList className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      Theo dõi đơn hàng
                    </Link>
                  </Button>
                  
                  <Button asChild size="lg" className="px-8 group bg-primary hover:bg-primary/90">
                    <Link to="/deals" className="flex items-center gap-2">
                      Tiếp tục mua sắm
                      <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

// Helper functions
function getPaymentMethodText(method: string): string {
  switch (method) {
    case 'cod': return 'Thanh toán khi nhận hàng (COD)';
    case 'banking': return 'Chuyển khoản ngân hàng';
    case 'credit': return 'Thẻ tín dụng/ghi nợ (Visa, Mastercard)';
    case 'momo': return 'Ví MoMo';
    case 'vnpay': return 'VNPay';
    case 'zalopay': return 'ZaloPay';
    case 'shopeepay': return 'ShopeePay';
    default: return 'Không xác định';
  }
}

function getDeliveryMethodText(method: string): string {
  switch (method) {
    case 'standard': return 'Giao hàng tiêu chuẩn';
    case 'express': return 'Giao hàng nhanh';
    case 'same_day': return 'Giao hàng trong ngày';
    case 'scheduled': return 'Giao hàng theo lịch hẹn';
    case 'pickup': return 'Nhận tại cửa hàng';
    case 'eco': return 'Giao hàng Eco';
    case 'locker': return 'Giao hàng đến tủ đồ';
    default: return 'Giao hàng tiêu chuẩn';
  }
}

function getEstimatedDelivery(method: string): string {
  const today = new Date();
  switch (method) {
    case 'standard':
      // 3-5 ngày
      const standardDate = new Date(today);
      standardDate.setDate(today.getDate() + 5);
      return `${format(today, 'dd/MM', { locale: vi })} - ${format(standardDate, 'dd/MM/yyyy', { locale: vi })}`;
    case 'express':
      // 1-2 ngày
      const expressDate = new Date(today);
      expressDate.setDate(today.getDate() + 2);
      return `${format(today, 'dd/MM', { locale: vi })} - ${format(expressDate, 'dd/MM/yyyy', { locale: vi })}`;
    case 'same_day':
      // Hôm nay
      return `Hôm nay (${format(today, 'dd/MM/yyyy', { locale: vi })})`;
    case 'scheduled':
      // Ngày đã chọn
      return 'Theo lịch hẹn đã chọn';
    case 'pickup':
      // Có thể lấy ngay
      return `Có thể lấy từ hôm nay (${format(today, 'dd/MM/yyyy', { locale: vi })})`;
    case 'eco':
      // 4-7 ngày
      const ecoDate = new Date(today);
      ecoDate.setDate(today.getDate() + 7);
      return `${format(today, 'dd/MM', { locale: vi })} - ${format(ecoDate, 'dd/MM/yyyy', { locale: vi })}`;
    case 'locker':
      // 2-3 ngày
      const lockerDate = new Date(today);
      lockerDate.setDate(today.getDate() + 3);
      return `${format(today, 'dd/MM', { locale: vi })} - ${format(lockerDate, 'dd/MM/yyyy', { locale: vi })}`;
    default:
      return 'Trong vòng 3-5 ngày';
  }
}

export default OrderConfirmation; 