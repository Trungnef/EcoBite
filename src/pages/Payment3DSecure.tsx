import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, Calendar, X, Check, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from "@/contexts/CartContext";

// Schema cho form thanh toán
const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, { message: "Số thẻ phải có ít nhất 16 số" })
    .max(19, { message: "Số thẻ không được vượt quá 19 số" })
    .regex(/^[0-9\s]+$/, { message: "Số thẻ chỉ được chứa chữ số" }),
  cardholderName: z.string().min(3, { message: "Vui lòng nhập họ tên trên thẻ" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { 
    message: "Định dạng ngày hết hạn không hợp lệ (MM/YY)" 
  }),
  cvv: z.string()
    .min(3, { message: "CVV phải có ít nhất 3 số" })
    .max(4, { message: "CVV không được vượt quá 4 số" })
    .regex(/^[0-9]+$/, { message: "CVV chỉ được chứa chữ số" }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const Payment: React.FC = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state || { amount: 0, orderNumber: "" };
  const [loading, setLoading] = useState(false);
  const [secure3dVerification, setSecure3dVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [processingVerification, setProcessingVerification] = useState(false);

  // Lấy thông tin đơn hàng từ localStorage nếu không có từ location state
  const savedOrderData = localStorage.getItem('pending_order');
  const pendingOrder = savedOrderData ? JSON.parse(savedOrderData) : null;

  // Kiểm tra nếu không có thông tin đơn hàng
  useEffect(() => {
    if (!pendingOrder && !orderData.orderNumber) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      navigate("/checkout");
    }
  }, [pendingOrder, orderData, navigate]);

  // Form cho thông tin thẻ
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Format số thẻ khi nhập
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format ngày hết hạn khi nhập
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Xử lý submit form thanh toán
  const onSubmit = (data: PaymentFormValues) => {
    setLoading(true);

    // Giả lập xử lý thanh toán và 3D Secure
    setTimeout(() => {
      setLoading(false);
      setSecure3dVerification(true);
    }, 2000);
  };

  // Xử lý xác thực 3D Secure
  const handleVerification = () => {
    if (!verificationCode) {
      toast.error("Vui lòng nhập mã xác thực");
      return;
    }

    setProcessingVerification(true);

    // Giả lập xử lý xác thực
    setTimeout(() => {
      setProcessingVerification(false);
      
      // Nếu không có dữ liệu đơn hàng, quay lại trang checkout
      if (!pendingOrder) {
        toast.error("Không tìm thấy thông tin đơn hàng");
        navigate("/checkout");
        return;
      }

      try {
        // Đảm bảo orderDate là đối tượng Date
        const orderData = {
          ...pendingOrder,
          orderDate: new Date()
        };

        // Xóa dữ liệu đơn hàng tạm thời
        localStorage.removeItem('pending_order');
        
        // Xóa giỏ hàng sau khi thanh toán thành công
        clearCart();
        
        // Chuyển đến trang xác nhận đơn hàng
        toast.success("Thanh toán thành công!");
        
        // Ngắt context hiện tại trước khi chuyển trang để tránh lỗi
        setTimeout(() => {
          navigate("/order-confirmation", { 
            state: {
              ...orderData,
              success: true,
              paymentId: `3DS${Date.now()}`,
            },
            replace: true  // Thay thế trang hiện tại trong history để ngăn quay lại
          });
        }, 100);
      } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }, 2000);
  };

  const cancelPayment = () => {
    navigate("/checkout");
  };

  // Hiển thị form xác thực 3D Secure
  if (secure3dVerification) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
          <Container>
            <div className="max-w-md mx-auto">
              <Card className="shadow-md">
                <CardHeader className="text-center border-b bg-blue-50">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    Xác thực 3D Secure
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-2">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ngân hàng của bạn yêu cầu xác thực bổ sung để hoàn tất giao dịch
                      </p>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md text-sm mb-4">
                      <p className="font-medium">Mã xác thực đã được gửi đến</p>
                      <p>+84 *** *** 789</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Nhập mã xác thực</Label>
                      <Input 
                        id="verification-code" 
                        placeholder="Nhập mã 6 số"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="text-center text-lg"
                      />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Mã sẽ hết hạn sau <span className="font-medium">04:59</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 flex flex-col space-y-2">
                  <Button 
                    className="w-full relative" 
                    onClick={handleVerification}
                    disabled={processingVerification}
                  >
                    {processingVerification ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      "Xác thực thanh toán"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    type="button"
                    onClick={cancelPayment}
                    disabled={processingVerification}
                  >
                    Hủy
                  </Button>
                </CardFooter>
              </Card>
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
      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-2 transition-all">
              <Link to="/checkout" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại thanh toán</span>
              </Link>
            </Button>
            
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <Card className="shadow-md">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Thông tin thẻ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số thẻ</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="1234 5678 9012 3456" 
                                  {...field} 
                                  onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value);
                                    field.onChange(formatted);
                                  }}
                                  maxLength={19}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên chủ thẻ</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="NGUYEN VAN A" 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e.target.value.toUpperCase());
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ngày hết hạn</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="MM/YY" 
                                    {...field} 
                                    onChange={(e) => {
                                      const formatted = formatExpiryDate(e.target.value);
                                      field.onChange(formatted);
                                    }}
                                    maxLength={5}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="123" 
                                    {...field} 
                                    type="password"
                                    maxLength={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
                                <span>Đang xử lý...</span>
                              </div>
                            ) : (
                              "Thanh toán"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="p-4 bg-muted/50 border-t flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Lock className="h-4 w-4 text-Eco-600" />
                      <span>Thanh toán an toàn 128-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-Eco-600" />
                      <span>Bảo mật PCI DSS</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="shadow-md">
                  <CardHeader className="border-b">
                    <CardTitle>Thông tin đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mã đơn hàng:</span>
                      <span className="font-medium">{orderData.orderNumber || (pendingOrder?.orderNumber || "")}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tổng số lượng:</span>
                        <span>{pendingOrder?.orderItems?.length || "N/A"} sản phẩm</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí vận chuyển:</span>
                        <span>{pendingOrder?.orderSummary?.shippingFee > 0 
                          ? `${pendingOrder.orderSummary.shippingFee.toLocaleString()}₫` 
                          : "Miễn phí"}</span>
                      </div>
                      
                      {pendingOrder?.orderSummary?.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Giảm giá:</span>
                          <span className="text-Eco-600">-{pendingOrder.orderSummary.discount.toLocaleString()}₫</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span>{(orderData.amount || pendingOrder?.orderSummary?.total || 0).toLocaleString()}₫</span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-4 bg-blue-50 rounded-md p-4 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Lock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">Giao dịch an toàn</p>
                      <p className="text-blue-600">Thông tin thẻ của bạn được bảo mật và mã hóa.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">Hỗ trợ đa thẻ</p>
                      <p className="text-blue-600">Chấp nhận thanh toán bằng Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Payment; 