
import { Link } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample related products data - in a real app this would come from an API
const getSampleProducts = (category: string, currentProductId: string) => {
  const allProducts = [
    {
      id: "1",
      title: "Organic Fresh Fruits Bundle",
      store: "Organic Market",
      storeImg: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=150",
      originalPrice: 250000,
      discountPrice: 150000,
      discountPercent: 40,
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800",
      expiresIn: "48 hours",
      category: "Produce"
    },
    {
      id: "2",
      title: "Artisanal Bakery Set",
      store: "Breadly",
      storeImg: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=150",
      originalPrice: 180000,
      discountPrice: 99000,
      discountPercent: 45,
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800",
      expiresIn: "24 hours",
      category: "Bakery"
    },
    {
      id: "3",
      title: "Premium Dairy Selection",
      store: "Fresh Farm",
      storeImg: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=150",
      originalPrice: 120000,
      discountPrice: 75000,
      discountPercent: 38,
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800",
      expiresIn: "36 hours",
      category: "Dairy"
    },
    {
      id: "4",
      title: "Ready-to-eat Meal Box",
      store: "Urban Kitchen",
      storeImg: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=150",
      originalPrice: 95000,
      discountPrice: 55000,
      discountPercent: 42,
      image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800",
      expiresIn: "12 hours",
      category: "Ready Meals"
    },
    {
      id: "5",
      title: "Seasonal Vegetables Pack",
      store: "Fresh Farm",
      storeImg: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=150",
      originalPrice: 150000,
      discountPrice: 90000,
      discountPercent: 40,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800",
      expiresIn: "24 hours",
      category: "Produce"
    },
    {
      id: "6",
      title: "Artisan Cheese Selection",
      store: "Dairy Delights",
      storeImg: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=150",
      originalPrice: 200000,
      discountPrice: 120000,
      discountPercent: 40,
      image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=800",
      expiresIn: "48 hours",
      category: "Dairy"
    }
  ];
  
  // Filter out the current product and get products from the same category
  return allProducts
    .filter(product => product.id !== currentProductId && product.category === category)
    .slice(0, 4);
};

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const relatedProducts = getSampleProducts(category, currentProductId);
  const isMobile = useIsMobile();
  
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Link 
          to="/deals" 
          className="text-primary hover:underline text-sm font-medium"
        >
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.slice(0, isMobile ? 2 : 4).map((product, index) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <DealCard
              {...product}
              className="opacity-0 animate-fade-in-up h-full"
              style={{ 
                animationDelay: `${100 * index}ms`, 
                animationFillMode: 'forwards' 
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
