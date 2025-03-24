import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Check, ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  id: string;
  title: string;
  price: number;
  image: string;
  storeId: string;
  storeName: string;
  className?: string;
  quantity?: number;
  originalPrice?: number; 
  expiryDate?: string;
  category?: string;
}

export function AddToCartButton({
  id,
  title,
  price,
  image,
  storeId,
  storeName,
  className,
  quantity = 1,
  originalPrice,
  expiryDate,
  category
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    try {
      if (typeof addToCart !== 'function') {
        console.error("addToCart is not a function", addToCart);
        return;
      }

      addToCart({
        id,
        title,
        price,
        image,
        storeId,
        storeName,
        quantity,
        originalPrice,
        expiryDate,
        category
      });
      
      setAdded(true);
      
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart}
      className={className}
      variant={added ? "secondary" : "default"}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Đã thêm
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm vào giỏ
        </>
      )}
    </Button>
  );
}
