import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, ShoppingCart, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AddToCartButton } from "@/components/AddToCartButton";

interface DealCardProps {
  id: string;
  title: string;
  store: string;
  storeImg: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  image: string;
  expiresIn: string;
  category: string;
  expiryDate?: string;
  featured?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function DealCard({
  id,
  title,
  store,
  storeImg,
  originalPrice,
  discountPrice,
  discountPercent,
  image,
  expiresIn,
  expiryDate,
  category,
  featured = false,
  className,
  style,
  ...props
}: DealCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Calculate urgency level based on expiration time
  const getUrgencyLevel = () => {
    if (expiresIn.includes("hour")) {
      const hours = parseInt(expiresIn);
      if (hours <= 12) return "high";
      if (hours <= 24) return "medium";
    }
    return "normal";
  };
  
  const urgencyLevel = getUrgencyLevel();
  const urgencyClasses = {
    high: "bg-red-50 border-red-200 text-red-700",
    medium: "bg-amber-50 border-amber-200 text-amber-700",
    normal: "bg-blue-50 border-blue-200 text-blue-700"
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border card-hover", 
        featured ? "shadow-md" : "shadow-sm",
        className
      )} 
      style={style}
      {...props}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Badge 
          className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground font-medium"
        >
          Giảm {discountPercent}%
        </Badge>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full"
          aria-label={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </button>
        
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              isImageLoaded ? "image-loaded" : "image-loading"
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
        </Link>
        
        {featured && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-medium text-lg line-clamp-1">{title}</h3>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        {!featured && (
          <Link to={`/product/${id}`}>
            <h3 className="font-medium text-base mb-1 line-clamp-1 hover:text-primary transition-colors">{title}</h3>
          </Link>
        )}
        
        <div className="flex items-center mb-3">
          <img 
            src={storeImg} 
            alt={store}
            className="h-5 w-5 rounded-full mr-2 object-cover"
          />
          <span className="text-xs text-muted-foreground">{store}</span>
        </div>
        
        {/* Expiration info - more noticeable */}
        <div className={cn(
          "flex items-center px-2 py-1 rounded-md text-xs font-medium mb-3 border",
          urgencyClasses[urgencyLevel]
        )}>
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {urgencyLevel === "high" ? "Sắp hết hạn: " : "Hết hạn trong "}
            {expiresIn}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {discountPrice.toLocaleString('vi-VN')}₫
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {originalPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>
          
          <Badge variant="secondary" className="px-2 py-0 text-xs">
            {category}
          </Badge>
        </div>
        
        <div>
          <AddToCartButton 
            id={id}
            title={title}
            price={discountPrice}
            image={image}
            storeId="store1"
            storeName={store}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
