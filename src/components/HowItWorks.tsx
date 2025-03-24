import { Container } from "@/components/ui/container";
import { Search, ShoppingBag, CreditCard } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Tìm kiếm & Khám phá",
      description: "Duyệt qua nhiều mặt hàng thực phẩm sắp hết hạn từ các siêu thị và cửa hàng địa phương với giá giảm."
    },
    {
      icon: ShoppingBag,
      title: "Đặt trước & Lấy hàng",
      description: "Đặt trước các món hàng thông qua nền tảng của chúng tôi và đến lấy tại cửa hàng trong khung giờ đã chỉ định."
    },
    {
      icon: CreditCard,
      title: "Thanh toán & Thưởng thức",
      description: "Thanh toán tại cửa hàng, mang về nhà và thưởng thức thực phẩm chất lượng cao đồng thời góp phần giảm lãng phí."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4 inline-block">
            Quy Trình Đơn Giản
          </span>
          <h2 className="text-3xl font-bold mb-4 animate-fade-in-up">EcoBite Hoạt Động Như Thế Nào</h2>
          <p className="text-muted-foreground text-balance animate-fade-in-up delay-100">
            Nền tảng của chúng tôi giúp bạn dễ dàng tiếp cận thực phẩm chất lượng với giá giảm
            đồng thời góp phần giảm lãng phí thực phẩm tại Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${150 * index}ms` }}>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full"></div>
                <div className="relative bg-white rounded-full p-5 shadow-sm border border-border">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border -translate-y-1/2">
                    <div className="absolute top-1/2 left-1/4 h-2 w-2 bg-primary rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-2/4 h-2 w-2 bg-primary rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-3/4 h-2 w-2 bg-primary rounded-full -translate-y-1/2"></div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
