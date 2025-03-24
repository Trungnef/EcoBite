import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { StoreCard } from "@/components/StoreCard";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data
const partnerStores = [
  {
    id: "1",
    name: "Cửa hàng Hữu cơ Xanh",
    logo: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800",
    location: "Quận 1, TP. Hồ Chí Minh",
    dealCount: 12,
    category: "Cửa hàng Hữu cơ",
    openingHours: "8:00 - 22:00",
    isVerified: true
  },
  {
    id: "2",
    name: "Tiệm bánh Breadly",
    logo: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=800",
    location: "Quận Ba Đình, Hà Nội",
    dealCount: 8,
    category: "Tiệm bánh",
    openingHours: "7:00 - 20:00",
    isVerified: true
  },
  {
    id: "3",
    name: "Cửa hàng Trang trại Tươi",
    logo: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800",
    location: "Quận Hải Châu, Đà Nẵng",
    dealCount: 10,
    category: "Siêu thị",
    openingHours: "8:30 - 21:30",
    isVerified: false
  }
];

export function PartnerStores() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [visibleStores, setVisibleStores] = useState(isMobile ? 1 : 3);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setVisibleStores(isMobile ? 1 : 3);
  }, [isMobile]);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-3 animate-fade-in-up">Cửa Hàng Đối Tác</h2>
            <p className="text-muted-foreground text-balance animate-fade-in-up delay-100">
              Chúng tôi hợp tác với các cửa hàng và siêu thị tốt nhất trên khắp Việt Nam để mang đến
              thực phẩm chất lượng cao với giá giảm.
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 animate-fade-in">
            Xem Tất Cả Đối Tác <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {partnerStores.slice(0, visibleStores).map((store, index) => (
            <StoreCard
              key={store.id}
              {...store}
              className="opacity-0 animate-fade-in-up"
              style={{ 
                animationDelay: `${150 * index}ms`, 
                animationFillMode: 'forwards' 
              }}
            />
          ))}
        </div>

        {isMobile && visibleStores < partnerStores.length && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline"
              onClick={() => setVisibleStores(partnerStores.length)}
            >
              Xem Thêm Cửa Hàng
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
