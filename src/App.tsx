import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AlertTriangle } from "lucide-react";
import Index from "./pages/Index";
import Deals from "./pages/Deals";
import Stores from "./pages/Stores";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import StoreRegistration from "./pages/StoreRegistration";
import AddProduct from "./pages/AddProduct";
import StoreDashboard from "./pages/StoreDashboard";
import QualityGuidelines from "./pages/QualityGuidelines";
import ReportIssue from "./pages/ReportIssue";
import ComplaintSystem from "./pages/ComplaintSystem";
import UserProfile from "./pages/UserProfile";
import OrderConfirmation from "./pages/OrderConfirmation";
import StoreDetail from "./pages/StoreDetail";
import Payment3DSecure from "./pages/Payment3DSecure";
import PaymentMomo from "./pages/PaymentMomo";
import PaymentVNPay from "./pages/PaymentVNPay";
import PaymentZaloPay from "./pages/PaymentZaloPay";

// Tạo ErrorBoundary component để bắt lỗi
class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Container>
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-2">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Đã xảy ra lỗi!</h1>
              <p className="text-gray-600">
                Rất tiếc, ứng dụng đã gặp một lỗi không mong muốn. Vui lòng thử tải lại trang.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Tải lại trang
              </Button>
            </div>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/stores/:id" element={<StoreDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/3dsecure" element={<Payment3DSecure />} />
                <Route path="/payment/momo" element={<PaymentMomo />} />
                <Route path="/payment/vnpay" element={<PaymentVNPay />} />
                <Route path="/payment/zalopay" element={<PaymentZaloPay />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/store/register" element={<StoreRegistration />} />
                <Route path="/store/add-product" element={<AddProduct />} />
                <Route path="/store/dashboard" element={<StoreDashboard />} />
                <Route path="/quality-guidelines" element={<QualityGuidelines />} />
                <Route path="/report-issue" element={<ReportIssue />} />
                <Route path="/complaints" element={<ComplaintSystem />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
            
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
