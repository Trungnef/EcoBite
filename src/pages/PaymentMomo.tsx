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
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, CheckCircle, Smartphone, QrCode,
  ArrowRight, ShieldCheck, LockKeyhole, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

const PaymentMomo: React.FC = () => {
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
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.",
        variant: "destructive"
      });
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
      
      // 95% trường hợp thành công, 5% thất bại (giả lập)
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        setStep('success');
        
        // Clear cart after successful payment
        clearCart();
        
        // Chờ hiển thị thông báo thành công trước khi chuyển trang
        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              success: true,
              orderNumber: orderInfo?.orderNumber,
              paymentId: `MOMO${Date.now()}`
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
                <div className="bg-[#ae2070] text-white p-6">
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
                      <h1 className="text-xl font-bold">Thanh toán MoMo</h1>
                    </div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                      alt="MoMo Logo"
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
                      <p className="font-medium text-[#ae2070]">
                        {orderInfo.orderSummary?.total.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>

                  {step === 'processing' && (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4">
                      <div className="animate-spin h-12 w-12 border-4 border-[#ae2070] border-r-transparent rounded-full"></div>
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
                            <h3 className="font-medium">Thanh toán qua ứng dụng MoMo</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-sm">
                              <li>Nhấn vào "Thanh toán" bên dưới</li>
                              <li>Ứng dụng MoMo sẽ tự động mở (hoặc được yêu cầu mở)</li>
                              <li>Xác nhận thanh toán trên ứng dụng MoMo</li>
                              <li>Quay lại trang web để hoàn tất đơn hàng</li>
                            </ol>
                          </div>
                          
                          <Button 
                            onClick={handlePayment} 
                            className="w-full bg-[#ae2070] hover:bg-[#8a1a5a]"
                          >
                            Thanh toán 
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TabsContent>
                        
                        <TabsContent value="qr" className="space-y-4">
                          <div className="flex flex-col items-center">
                            <div className="bg-white p-2 border rounded-md shadow-sm">
                              <div className="w-56 h-56 border-2 border-[#ae2070] rounded-lg flex items-center justify-center">
                                {/* Mã QR giả định, trong triển khai thực tế cần tạo mã QR thật */}
                                <img 
                                  src="data:image/png;base64,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"
                                  alt="QR Code"
                                  className="w-52 h-52 object-cover"
                                />
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="font-medium">Quét mã bằng ứng dụng MoMo</p>
                              <p className="text-muted-foreground text-sm mt-1">
                                Mở ứng dụng MoMo &gt; Quét mã &gt; Quét mã QR này
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <p className="text-sm text-center">
                              Sau khi hoàn tất thanh toán trên ứng dụng, hãy nhấn vào nút xác nhận bên dưới
                            </p>
                            <Button 
                              onClick={handlePayment} 
                              className="w-full mt-4 bg-[#ae2070] hover:bg-[#8a1a5a]"
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
                        <p>Khi thực hiện thanh toán, bạn đồng ý với Điều khoản dịch vụ của MoMo</p>
                        <p className="mt-1">© 2023 MoMo Payment. Bảo lưu mọi quyền.</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
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

export default PaymentMomo; 