import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  QrCode, Shield, Lock, CheckCircle2, 
  AlertCircle, ArrowLeft, Smartphone, CreditCard 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const PaymentVNPay = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { amount, orderNumber, returnUrl } = location.state || {};

  useEffect(() => {
    if (!amount || !orderNumber || !returnUrl) {
      navigate("/checkout");
    }
  }, [amount, orderNumber, returnUrl, navigate]);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      setStep(2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(3);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      
      navigate(returnUrl, {
        state: {
          success: true,
          paymentId: `VNPAY${Date.now()}`,
          orderNumber
        }
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-12">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="pl-0 hover:pl-2 transition-all"
              onClick={() => navigate("/checkout")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Kết nối bảo mật</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img src="/vnpay-logo.png" alt="VNPay" className="h-8" />
                  <h1 className="text-2xl font-semibold">Thanh toán VNPay</h1>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-600">
                  Ưu đãi 50K
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Số tiền thanh toán</p>
                    <p className="text-2xl font-semibold">{amount?.toLocaleString()}₫</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                    <p className="font-medium">{orderNumber}</p>
                  </div>
                </div>

                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Tabs defaultValue="qr" className="space-y-6">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="qr" className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          Quét mã QR
                        </TabsTrigger>
                        <TabsTrigger value="app" className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Mở app
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="qr" className="space-y-4">
                        <div className="aspect-square max-w-xs mx-auto border-2 border-dashed rounded-lg p-4">
                          <img 
                            src="/vnpay-qr.png" 
                            alt="VNPay QR" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          Sử dụng app ngân hàng hoặc ví điện tử để quét mã
                        </div>
                      </TabsContent>

                      <TabsContent value="app" className="space-y-4">
                        <Button 
                          className="w-full h-12"
                          onClick={handlePayment}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                              <span>Đang xử lý...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-5 w-5" />
                              <span>Mở ứng dụng VNPay</span>
                            </div>
                          )}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                          Bạn sẽ được chuyển đến ứng dụng VNPay để hoàn tất thanh toán
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-600">
                        <Shield className="h-4 w-4" />
                        <span>Thanh toán an toàn qua cổng VNPay</span>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <img src="/bank-logo-1.png" alt="Bank" className="h-8 object-contain" />
                        <img src="/bank-logo-2.png" alt="Bank" className="h-8 object-contain" />
                        <img src="/bank-logo-3.png" alt="Bank" className="h-8 object-contain" />
                        <img src="/bank-logo-4.png" alt="Bank" className="h-8 object-contain" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center space-y-4"
                  >
                    <div className="flex justify-center">
                      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Đang xử lý giao dịch...</h3>
                      <p className="text-sm text-muted-foreground">
                        Vui lòng không đóng cửa sổ này
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center space-y-4"
                  >
                    <div className="flex justify-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Thanh toán thành công</h3>
                      <p className="text-sm text-muted-foreground">
                        Đang chuyển bạn đến trang xác nhận đơn hàng...
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Thanh toán an toàn qua VNPay</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ thanh toán từ hơn 40 ngân hàng tại Việt Nam
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default PaymentVNPay; 