import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { 
  Trash2, Plus, Minus, ArrowRight, ShoppingBag, 
  ShoppingCart, Truck, AlertCircle, Tag, X, Clock,
  ShieldCheck, CheckCircle, Sparkles, Gift, BadgeCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Thêm animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function Cart() {
  const { 
    items, removeFromCart, updateQuantity, clearCart, 
    subtotal, shippingFee, total, isFreeShipping
  } = useCart();

  const [fadeIn, setFadeIn] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  // Hiệu ứng khi mới vào trang
  useEffect(() => {
    // Trigger animation
    setFadeIn(true);
  }, []);

  // Phần còn thiếu để được miễn phí vận chuyển
  const freeShippingRemaining = 500000 - subtotal;
  const freeShippingProgress = Math.min(100, (subtotal / 500000) * 100);

  // Giả lập thời gian giao hàng dự kiến
  const estimatedDeliveryTime = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2); // Giao hàng dự kiến sau 2 ngày
    
    return format(deliveryDate, "EEEE, dd/MM/yyyy", { locale: vi });
  };

  // Hiển thị khi giỏ hàng trống
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
          <Container>
            <div 
              className={`text-center space-y-6 transition-all duration-500 ease-out ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Giỏ hàng của bạn đang trống</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm giảm giá ngay hôm nay!
                </p>
              </div>
              <Button asChild size="lg" className="px-8 group animate-pulse">
                <Link to="/deals" className="flex items-center gap-2">
                  Khám phá sản phẩm
                  <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
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
      <main className="pt-24 pb-16 bg-gray-50">
        <Container>
          <div 
            className={`space-y-8 transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
          >
            <div>
              <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
              <p className="text-muted-foreground">
                Xem lại và cập nhật sản phẩm trước khi thanh toán.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden shadow-sm">
                  <div className="bg-muted px-4 py-3 rounded-t-lg text-sm font-medium flex items-center justify-between">
                    <span>Sản phẩm trong giỏ ({items.length})</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      onClick={clearCart}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Xóa tất cả
                    </Button>
                  </div>
                  <CardContent className="p-0">
                    {items.map((item, index) => {
                      const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;
                      const expiryDateText = expiryDate 
                        ? format(expiryDate, "dd/MM/yyyy", { locale: vi })
                        : "";
                      
                      const discountPercent = item.originalPrice 
                        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
                        : 0;
                      
                      const isHighlighted = highlightedItem === "combo";
                      
                      return (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, y: -20 }}
                          className={cn(
                            "border-b last:border-b-0 relative transition-all duration-300",
                            isHighlighted && "bg-primary/5",
                            "hover:bg-muted/30"
                          )}
                        >
                          <div className="p-4 flex flex-col sm:flex-row gap-4">
                            <motion.div 
                              className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 border"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                              />
                            </motion.div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between">
                                  <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                                    {item.title}
                                  </h3>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </motion.button>
                                </div>
                                <div className="flex flex-wrap gap-2 my-1">
                                  <span className="text-sm text-muted-foreground">
                                    Cửa hàng: {item.storeName}
                                  </span>
                                  {item.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {item.category}
                                    </Badge>
                                  )}
                                  {discountPercent > 0 && (
                                    <Badge className="bg-primary text-white text-xs">
                                      Giảm {discountPercent}%
                                    </Badge>
                                  )}
                                </div>
                                {expiryDateText && (
                                  <motion.div 
                                    className="flex items-center text-amber-600 text-xs mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>HSD: {expiryDateText}</span>
                                  </motion.div>
                                )}
                              </div>
                              <div className="flex justify-between items-end mt-2">
                                <div className="flex items-center space-x-1">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                      "h-7 w-7 rounded-full flex items-center justify-center border",
                                      "hover:border-primary hover:text-primary transition-colors",
                                      item.quantity <= 1 && "opacity-50 cursor-not-allowed"
                                    )}
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </motion.button>
                                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-7 w-7 rounded-full flex items-center justify-center border hover:border-primary hover:text-primary transition-colors"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </motion.button>
                                </div>
                                <div className="text-right">
                                  <motion.div 
                                    className="font-medium"
                                    key={item.quantity}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                  </motion.div>
                                  {item.originalPrice && (
                                    <div className="text-xs text-muted-foreground line-through">
                                      {(item.originalPrice * item.quantity).toLocaleString('vi-VN')}₫
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                <div className="mt-8 space-y-6">
                  <div>
                    <Button asChild variant="outline" className="group transition-all hover:bg-primary/10 hover:text-primary">
                      <Link to="/deals" className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                        Tiếp tục mua sắm
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="shadow-sm sticky top-24">
                  <CardContent className="p-6 space-y-5">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <h3 className="font-medium text-lg">Tóm tắt đơn hàng</h3>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Tạm tính ({items.length} sản phẩm)</span>
                          <motion.span
                            key={subtotal}
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.3 }}
                          >
                            {subtotal.toLocaleString('vi-VN')}₫
                          </motion.span>
                        </div>
                        
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Phí vận chuyển (dự kiến)</span>
                          {isFreeShipping ? (
                            <motion.span
                              className="text-primary font-medium"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              Miễn phí
                            </motion.span>
                          ) : (
                            <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2 text-muted-foreground text-sm">
                          <Clock className="h-3 w-3" />
                          <span>Giao hàng dự kiến: {estimatedDeliveryTime()}</span>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-between font-medium text-lg">
                          <span>Tổng cộng</span>
                          <motion.div
                            key={total}
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.3 }}
                            className="text-right"
                          >
                            <span className="text-lg font-semibold">{total.toLocaleString('vi-VN')}₫</span>
                            {isFreeShipping && (
                              <div className="text-xs text-muted-foreground line-through">
                                {(subtotal + shippingFee).toLocaleString('vi-VN')}₫
                              </div>
                            )}
                          </motion.div>
                        </div>
                        
                        <div className="mt-3 text-xs text-muted-foreground">
                          <p>* Mã giảm giá sẽ được áp dụng ở bước thanh toán</p>
                        </div>
                      </div>

                      {!isFreeShipping && freeShippingRemaining > 0 && (
                        <motion.div 
                          className="mt-3 text-sm text-primary"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <p>Mua thêm {freeShippingRemaining.toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển</p>
                          <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${freeShippingProgress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      )}

                      <Button 
                        asChild 
                        className="w-full relative overflow-hidden group"
                        disabled={items.length === 0}
                      >
                        <Link to="/checkout" className="flex items-center justify-center">
                          <span>Tiến hành thanh toán</span>
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                          <span className="absolute inset-0 h-full w-full bg-white/20 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-700"></span>
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />

      <style 
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            
            .animate-shine {
              animation: shine 1.5s infinite linear;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out forwards;
            }
          `
        }}
      />
    </>
  );
}
