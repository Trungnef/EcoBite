import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <Container className="flex-grow flex items-center justify-center py-16">
        <div className={`text-center max-w-md transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="text-8xl font-bold text-primary/10">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">Không tìm thấy trang</span>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể nó đã được di chuyển hoặc không tồn tại.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button asChild>
              <a href="/">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </a>
            </Button>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default NotFound;
