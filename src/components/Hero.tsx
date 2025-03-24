import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-muted/30"></div>
      <div 
        className="absolute inset-0 -z-20 opacity-20 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2080')] bg-cover bg-center"
        style={{ opacity: isLoaded ? 0.1 : 0 }}
      ></div>

      <Container className={`py-16 md:py-24 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Giảm lãng phí thực phẩm tại Việt Nam
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 animate-fade-in-up text-balance">
            Tiết kiệm tiền, Tiết kiệm thực phẩm, <br className="hidden sm:block" /> 
            <span className="text-primary">Bảo vệ hành tinh</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100 text-balance">
            EcoBite kết nối bạn với thực phẩm chất lượng cao sắp hết hạn
            với giá giảm đáng kể, đồng thời giúp giảm lãng phí thực phẩm tại Việt Nam.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Button size="lg" className="rounded-full px-6 w-full sm:w-auto">
              Khám phá ưu đãi
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-6 w-full sm:w-auto">
              Trở thành đối tác
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto animate-fade-in-up delay-300">
          <div className="bg-white/80 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="font-semibold text-xl mb-1">30%+</div>
            <p className="text-muted-foreground text-sm">Giảm giá trung bình trên tất cả sản phẩm</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="font-semibold text-xl mb-1">100+</div>
            <p className="text-muted-foreground text-sm">Cửa hàng đối tác trên khắp Việt Nam</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="font-semibold text-xl mb-1">5000kg+</div>
            <p className="text-muted-foreground text-sm">Lượng thực phẩm được cứu mỗi tháng</p>
          </div>
        </div>

        <div className="flex items-center justify-center mt-12 text-muted-foreground animate-fade-in-up delay-400">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">Hiện có mặt tại Hà Nội, TP. Hồ Chí Minh và Đà Nẵng</span>
        </div>
      </Container>
    </section>
  );
}
