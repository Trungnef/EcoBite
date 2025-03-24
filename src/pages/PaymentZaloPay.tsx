import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft, CheckCircle, Smartphone, QrCode,
  ShieldCheck, LockKeyhole, AlertCircle, ShoppingBag
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

const PaymentZaloPay: React.FC = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'processing' | 'success' | 'error'>('initial');
  const [paymentMethod, setPaymentMethod] = useState<'app' | 'qr'>('app');
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ localStorage
    const orderData = localStorage.getItem('pending_order');
    if (orderData) {
      setOrderInfo(JSON.parse(orderData));
    } else {
      // Không có thông tin đơn hàng, quay lại trang checkout
      toast.error("Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.");
      navigate('/checkout');
    }
  }, [navigate]);

  const handlePayment = () => {
    if (loading) return;
    
    setLoading(true);
    setStep('processing');
    
    // Giả lập xử lý thanh toán
    setTimeout(() => {
      setLoading(false);
      
      // 97% trường hợp thành công, 3% thất bại (giả lập)
      const isSuccess = Math.random() > 0.03;
      
      if (isSuccess) {
        setStep('success');
        
        // Clear cart after successful payment
        clearCart();
        
        // Xóa dữ liệu đơn hàng tạm thời từ localStorage
        localStorage.removeItem('pending_order');
        
        // Chờ hiển thị thông báo thành công trước khi chuyển trang
        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              ...orderInfo,
              success: true,
              paymentId: `ZALO${Date.now()}`
            }
          });
        }, 2000);
      } else {
        setStep('error');
      }
    }, 3000);
  };

  const handleRetry = () => {
    setStep('initial');
    setLoading(false);
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc muốn hủy thanh toán? Đơn hàng của bạn sẽ không được xử lý.')) {
      localStorage.removeItem('pending_order');
      navigate('/checkout');
    }
  };

  if (!orderInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-md overflow-hidden">
                <div className="bg-[#0068FF] text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCancel}
                        className="hover:bg-white/20 text-white h-9 w-9"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <h1 className="text-xl font-bold">Thanh toán ZaloPay</h1>
                    </div>
                    <img
                      src="/zalopay-logo.png"
                      alt="ZaloPay Logo"
                      className="h-10"
                    />
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Order summary */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                      <p className="font-medium">{orderInfo.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng tiền</p>
                      <p className="font-medium text-[#0068FF]">
                        {orderInfo.orderSummary?.total.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>

                  {step === 'processing' && (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4">
                      <div className="animate-spin h-12 w-12 border-4 border-[#0068FF] border-r-transparent rounded-full"></div>
                      <p className="text-center font-medium">Đang xử lý thanh toán...</p>
                      <p className="text-center text-sm text-muted-foreground">
                        Vui lòng không đóng trang này trong quá trình thanh toán
                      </p>
                    </div>
                  )}

                  {step === 'success' && (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-center">Thanh toán thành công!</h2>
                      <p className="text-center text-muted-foreground">
                        Đơn hàng của bạn đang được xử lý.
                      </p>
                      <p className="text-center text-sm">
                        Đang chuyển hướng đến trang xác nhận đơn hàng...
                      </p>
                    </div>
                  )}

                  {step === 'error' && (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4">
                      <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-center">Thanh toán thất bại</h2>
                      <p className="text-center text-muted-foreground">
                        Đã có lỗi xảy ra trong quá trình thanh toán.
                      </p>
                      <div className="flex gap-3">
                        <Button onClick={handleRetry} variant="outline">
                          Thử lại
                        </Button>
                        <Button onClick={handleCancel} variant="destructive">
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 'initial' && (
                    <>
                      <Tabs defaultValue="app" onValueChange={(v) => setPaymentMethod(v as 'app' | 'qr')}>
                        <TabsList className="grid grid-cols-2 mb-6">
                          <TabsTrigger value="app">
                            <Smartphone className="mr-2 h-4 w-4" />
                            Ứng dụng
                          </TabsTrigger>
                          <TabsTrigger value="qr">
                            <QrCode className="mr-2 h-4 w-4" />
                            Quét mã QR
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="app" className="space-y-4">
                          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                            <h3 className="font-medium">Thanh toán qua ứng dụng ZaloPay</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-sm">
                              <li>Nhấn vào "Thanh toán" bên dưới</li>
                              <li>Ứng dụng ZaloPay sẽ tự động mở (hoặc được yêu cầu mở)</li>
                              <li>Xác nhận thanh toán trên ứng dụng ZaloPay</li>
                              <li>Quay lại trang web để hoàn tất đơn hàng</li>
                            </ol>
                          </div>
                          
                          <Button 
                            onClick={handlePayment} 
                            className="w-full bg-[#0068FF] hover:bg-[#0055cc]"
                          >
                            Thanh toán với ZaloPay
                          </Button>
                        </TabsContent>
                        
                        <TabsContent value="qr" className="space-y-4">
                          <div className="flex flex-col items-center">
                            <div className="bg-white p-2 border rounded-md shadow-sm">
                              <div className="w-56 h-56 border-2 border-[#0068FF] rounded-lg flex items-center justify-center">
                                {/* Mã QR giả định, trong triển khai thực tế cần tạo mã QR thật */}
                                <img 
                                  src="/zalopay-qr.png"
                                  alt="QR Code"
                                  className="w-52 h-52 object-cover"
                                />
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="font-medium">Quét mã bằng ứng dụng ZaloPay</p>
                              <p className="text-muted-foreground text-sm mt-1">
                                Mở ứng dụng ZaloPay &gt; Quét mã &gt; Quét mã QR này
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <p className="text-sm text-center">
                              Sau khi hoàn tất thanh toán trên ứng dụng, hãy nhấn vào nút xác nhận bên dưới
                            </p>
                            <Button 
                              onClick={handlePayment} 
                              className="w-full mt-4 bg-[#0068FF] hover:bg-[#0055cc]"
                            >
                              Tôi đã hoàn tất thanh toán
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="flex items-center justify-between mt-6">
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <ShieldCheck className="h-3 w-3" />
                          Mã hóa an toàn
                        </Badge>
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <LockKeyhole className="h-3 w-3" />
                          Bảo mật 100%
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="text-xs text-muted-foreground text-center">
                        <p>Khi thực hiện thanh toán, bạn đồng ý với Điều khoản dịch vụ của ZaloPay</p>
                        <p className="mt-1">© 2023 ZaloPay. Bảo lưu mọi quyền.</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Thêm nút Tiếp tục mua sắm */}
              {step === 'error' && (
                <div className="mt-6 flex justify-center">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/deals')}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Tiếp tục mua sắm
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `
      }} />
    </>
  );
};

export default PaymentZaloPay; 