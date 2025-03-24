import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, ShoppingCart, Calendar, ShoppingBag, Store, Share2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AddToCartButton } from "@/components/AddToCartButton";
import { motion } from "framer-motion";

interface DealCardProps {
  id: string;
  title: string;
  store: string;
  storeImg?: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  image: string;
  expiresIn: string;
  category: string;
  location?: string;
  expiryDate?: string;
  featured?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export function DealCard({
  id,
  title,
  store,
  storeImg = "https://source.unsplash.com/random/100x100/?logo",
  originalPrice,
  discountPrice,
  discountPercent,
  image,
  expiresIn,
  expiryDate,
  category,
  location,
  featured = false,
  className,
  style,
  isFavorite: initialIsFavorite = false,
  onFavoriteToggle,
  ...props
}: DealCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isHovered, setIsHovered] = useState(false);
  
  // Update local favorite state when prop changes
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);
  
  // Calculate urgency level based on expiration time
  const getUrgencyLevel = () => {
    if (expiresIn.includes("hour")) {
      const hours = parseInt(expiresIn);
      if (hours <= 6) return "high";
      if (hours <= 24) return "medium";
    } else if (expiresIn.includes("day")) {
      const days = parseInt(expiresIn);
      if (days <= 1) return "medium";
    }
    return "normal";
  };
  
  const urgencyLevel = getUrgencyLevel();
  const urgencyClasses = {
    high: "bg-red-50 border-red-200 text-red-700",
    medium: "bg-amber-50 border-amber-200 text-amber-700",
    normal: "bg-blue-50 border-blue-200 text-blue-700"
  };
  
  const urgencyIcons = {
    high: <Clock className="h-3 w-3 mr-1 animate-pulse" />,
    medium: <Clock className="h-3 w-3 mr-1" />,
    normal: <Calendar className="h-3 w-3 mr-1" />
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Ưu đãi: ${title}`,
        text: `Giảm ${discountPercent}% - ${title} tại ${store}`,
        url: window.location.href,
      });
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You would typically show a toast notification here
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Call the parent handler if provided
    if (onFavoriteToggle) {
      onFavoriteToggle(newFavoriteState);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "overflow-hidden border relative", 
          featured ? "shadow-md" : "shadow-sm",
          "transition-all duration-300",
          isHovered && "shadow-lg border-primary/20",
          className
        )} 
        style={style}
        {...props}
      >
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Badge 
            className={cn(
              "absolute top-3 left-3 z-10 font-medium transition-all duration-300",
              discountPercent >= 50 
                ? "bg-red-500 text-white" 
                : "bg-primary text-primary-foreground"
            )}
          >
            Giảm {discountPercent}%
          </Badge>
          
          <motion.button 
            onClick={handleFavoriteToggle}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "absolute top-3 right-3 z-10 p-2 backdrop-blur-sm rounded-full transition-all",
              isFavorite 
                ? "bg-red-500 text-white" 
                : "bg-white/80 text-muted-foreground"
            )}
            aria-label={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all",
                isFavorite && "fill-white"
              )}
            />
          </motion.button>
          
          <Link to={`/product/${id}`}>
            <div className="overflow-hidden h-full">
              <img
                src={image}
                alt={title}
                className={cn(
                  "h-full w-full object-cover transition-all duration-700",
                  isImageLoaded ? "image-loaded scale-100" : "image-loading scale-110 blur-sm",
                  isHovered && "scale-110"
                )}
                onLoad={() => setIsImageLoaded(true)}
              />
              
              {/* Gradient overlay that appears on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300",
                isHovered && "opacity-100"
              )}>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/90 backdrop-blur-sm text-primary p-2 rounded-full"
                      onClick={handleShareClick}
                    >
                      <Share2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/90 backdrop-blur-sm text-primary p-2 rounded-full"
                    >
                      <Info className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="bg-gray-100 rounded-full p-1 mr-2">
              <img 
                src={storeImg} 
                alt={store}
                className="h-4 w-4 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://source.unsplash.com/random/100x100/?logo";
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground flex items-center">
              <Store className="h-3 w-3 mr-1 text-primary/60" />
              {store}
            </span>
            {location && (
              <span className="ml-2 text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                {location}
              </span>
            )}
          </div>
          
          {/* Expiration info - more noticeable */}
          <div className={cn(
            "flex items-center px-2 py-1.5 rounded-md text-xs font-medium mb-3 border",
            urgencyClasses[urgencyLevel]
          )}>
            {urgencyIcons[urgencyLevel]}
            <span>
              {urgencyLevel === "high" ? "Sắp hết hạn: " : "Hết hạn trong "}
              {expiresIn}
            </span>
          </div>
          
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-foreground mr-2">
                  {discountPrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {originalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <span className="text-xs text-green-600 font-medium">
                Tiết kiệm {(originalPrice - discountPrice).toLocaleString('vi-VN')}₫
              </span>
            </div>
            
            <Badge 
              variant="secondary" 
              className="px-2 py-0.5 text-xs bg-primary/10 text-primary"
            >
              {category}
            </Badge>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AddToCartButton 
              id={id}
              title={title}
              price={discountPrice}
              image={image}
              storeId="store1"
              storeName={store}
              className={cn(
                "w-full transition-all bg-gradient-to-r from-primary to-primary/90",
                isHovered && "from-primary/90 to-primary"
              )}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
