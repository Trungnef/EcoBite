
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg border bg-background">
        <img
          src={images[activeImage]}
          alt={`${title} - image ${activeImage + 1}`}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4 overflow-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                activeImage === index && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => setActiveImage(index)}
            >
              <img
                src={image}
                alt={`${title} - thumbnail ${index + 1}`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
