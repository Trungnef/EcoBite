import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DealCard } from "@/components/DealCard";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data
const featuredDeals = [
  {
    id: "1",
    title: "Bộ trái cây hữu cơ tươi",
    store: "Cửa hàng Organic",
    storeImg: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=150",
    originalPrice: 250000,
    discountPrice: 150000,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800",
    expiresIn: "48 hours",
    category: "Produce",
    featured: true
  },
  {
    id: "2",
    title: "Bộ bánh mì thủ công",
    store: "Tiệm bánh Breadly",
    storeImg: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=150",
    originalPrice: 180000,
    discountPrice: 99000,
    discountPercent: 45,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800",
    expiresIn: "24 hours",
    category: "Bakery",
    featured: true
  },
  {
    id: "3",
    title: "Bộ sản phẩm sữa cao cấp",
    store: "Trang trại Tươi Sạch",
    storeImg: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=150",
    originalPrice: 120000,
    discountPrice: 75000,
    discountPercent: 38,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800",
    expiresIn: "36 hours",
    category: "Dairy",
    featured: true
  },
  {
    id: "4",
    title: "Hộp thức ăn sẵn",
    store: "Bếp Đô Thị",
    storeImg: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=150",
    originalPrice: 95000,
    discountPrice: 55000,
    discountPercent: 42,
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800",
    expiresIn: "12 hours",
    category: "Ready Meals",
    featured: true
  }
];

export function FeaturedDeals() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [visibleDeals, setVisibleDeals] = useState(isMobile ? 2 : 4);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setVisibleDeals(isMobile ? 2 : 4);
  }, [isMobile]);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-3 animate-fade-in-up">Ưu Đãi Tốt Nhất Hôm Nay</h2>
            <p className="text-muted-foreground text-balance animate-fade-in-up delay-100">
              Khám phá các mặt hàng thực phẩm chất lượng cao với mức giảm giá không thể tin được, 
              vốn sẽ bị lãng phí. Tiết kiệm tiền và góp phần bảo vệ hành tinh.
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 animate-fade-in">
            Xem Tất Cả Ưu Đãi <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {featuredDeals.slice(0, visibleDeals).map((deal, index) => (
            <DealCard
              key={deal.id}
              {...deal}
              className="opacity-0 animate-fade-in-up"
              style={{ 
                animationDelay: `${150 * index}ms`, 
                animationFillMode: 'forwards' 
              }}
            />
          ))}
        </div>

        {isMobile && visibleDeals < featuredDeals.length && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline"
              onClick={() => setVisibleDeals(featuredDeals.length)}
            >
              Xem Thêm Ưu Đãi
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
