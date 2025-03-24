import { Container } from "@/components/ui/container";
import { Leaf, DollarSign, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Benefits() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Tiết kiệm tiền",
      description: "Tiết kiệm đến 70% cho các mặt hàng thực phẩm chất lượng cao sắp hết hạn nhưng vẫn hoàn toàn tốt để sử dụng."
    },
    {
      icon: Leaf,
      title: "Giảm lãng phí",
      description: "Góp phần giảm lãng phí thực phẩm bằng cách mua các sản phẩm đáng lẽ sẽ bị vứt bỏ, góp phần tạo nên môi trường bền vững hơn."
    },
    {
      icon: Clock,
      title: "Tiện lợi",
      description: "Dễ dàng duyệt qua các mặt hàng có sẵn từ các cửa hàng gần đó, đặt trước trực tuyến và nhận hàng theo thời gian thuận tiện cho bạn."
    },
    {
      icon: ShieldCheck,
      title: "Đảm bảo chất lượng",
      description: "Tất cả các mặt hàng đều được kiểm tra đảm bảo chất lượng. Chúng sắp hết hạn nhưng vẫn còn tươi và an toàn để sử dụng."
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 to-white"></div>
      <Container>
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4 inline-block">
            Tại Sao Chọn Chúng Tôi
          </span>
          <h2 className="text-3xl font-bold mb-4 animate-fade-in-up">Lợi Ích Khi Sử Dụng EcoBite</h2>
          <p className="text-muted-foreground text-balance animate-fade-in-up delay-100">
            Tham gia cộng đồng của chúng tôi và trải nghiệm nhiều lợi ích khi mua sắm với EcoBite
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className={cn(
                "border hover:shadow-md transition-all animate-fade-in-up", 
                "overflow-hidden backdrop-blur-sm",
                "bg-white/90",
              )}
              style={{ animationDelay: `${150 * index}ms` }}
            >
              <div className="h-1.5 bg-primary w-full"></div>
              <CardContent className="p-6 flex flex-col items-start">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary mb-5">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
