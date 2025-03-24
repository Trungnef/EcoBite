import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface StoreCardProps {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  location: string;
  dealCount: number;
  category: string;
  openingHours: string;
  isVerified?: boolean;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function StoreCard({
  id,
  name,
  logo,
  coverImage,
  location,
  dealCount,
  category,
  openingHours,
  isVerified = false,
  rating = 0,
  reviewCount = 0,
  isFeatured = false,
  className,
  style,
  ...props
}: StoreCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border card-hover group relative", 
        isFeatured && "ring-2 ring-primary/50",
        className
      )} 
      style={style}
      {...props}
    >
      {isFeatured && (
        <Badge className="absolute top-2 right-2 z-10 bg-primary/90">
          Phổ biến
        </Badge>
      )}
      
      <button 
        onClick={toggleFavorite}
        className="absolute top-2 left-2 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full p-1.5 transition-all"
      >
        <Heart 
          className={cn(
            "h-5 w-5 transition-colors", 
            isFavorite ? "fill-red-500 text-red-500" : "text-white"
          )} 
        />
      </button>
      
      <div className="relative aspect-video overflow-hidden">
        <img
          src={coverImage}
          alt={name}
          className={cn(
            "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
            isImageLoaded ? "image-loaded" : "image-loading"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full border-2 border-white bg-white shadow-md overflow-hidden mr-3">
              <img 
                src={logo} 
                alt={`${name} logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg line-clamp-1 flex items-center">
                {name}
                {isVerified && (
                  <span className="ml-1 text-xs bg-primary/90 text-white rounded-full px-1.5 py-0.5">✓</span>
                )}
              </h3>
              <div className="flex items-center text-white/80 text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            {category}
          </Badge>
          <span className="text-sm font-medium text-foreground">
            {dealCount} ưu đãi hiện có
          </span>
        </div>
        
        {rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5", 
                    i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              ({reviewCount} đánh giá)
            </span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mb-4">
          <span className="block">
            <span className="font-medium">Giờ mở cửa:</span> {openingHours}
          </span>
        </div>
        
        <Button className="w-full" size="sm" asChild>
          <Link to={`/stores/${id}`}>
            Xem cửa hàng
            <ExternalLink className="h-3.5 w-3.5 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
