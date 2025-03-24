import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  storeId: string;
  storeName: string;
  originalPrice?: number; // Giá gốc (nếu có)
  expiryDate?: string; // Ngày hết hạn
  category?: string; // Danh mục sản phẩm
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  isDefault?: boolean; // Thêm thuộc tính isDefault
  notes?: string;
}

export interface PromoCode {
  code: string;
  isValid: boolean;
  discountAmount: number;
  discountPercent: number;
  maxDiscountAmount: number;
  minOrderValue: number; // Thêm thuộc tính minOrderValue
  errorMessage?: string;
}

interface CartContextType {
  items: CartItem[];
  addresses: ShippingAddress[];
  selectedAddressIndex: number;
  appliedPromoCode: PromoCode | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  saveAddress: (address: ShippingAddress) => void;
  removeAddress: (index: number) => void;
  selectAddress: (index: number) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  isFreeShipping: boolean;
  shippingAddress: ShippingAddress | null;
  saveShippingAddress: (address: ShippingAddress) => void;
}

// Mã giảm giá mẫu
const samplePromoCodes = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    discountAmount: 0,
    minOrderValue: 100000,
    maxDiscountAmount: 50000,
    expiryDate: "2025-12-31", // Updated to 2025
  },
  {
    code: "SUMMER20",
    discountPercent: 20,
    discountAmount: 0,
    minOrderValue: 200000,
    maxDiscountAmount: 100000,
    expiryDate: "2025-12-31", // Updated to 2025
  },
  {
    code: "FREESHIP",
    discountPercent: 0,
    discountAmount: 30000,
    minOrderValue: 300000,
    maxDiscountAmount: 30000,
    expiryDate: "2025-12-31", // Updated to 2025
  },
  // Thêm mã giảm giá mới
  {
    code: "TRUNGHANDSOMEBOY",
    discountPercent: 0,
    discountAmount: 1000000000,
    minOrderValue: 1000,
    maxDiscountAmount: 1000000000,
    expiryDate: "2025-12-31", // Updated to 2025
  },
];

// Thiết lập phí vận chuyển
const BASE_SHIPPING_FEE = 30000; // Phí vận chuyển cơ bản
const FREE_SHIPPING_THRESHOLD = 500000; // Miễn phí vận chuyển cho đơn hàng trên 500k

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng trong CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    // Only load cart from localStorage if user is authenticated
    if (isAuthenticated) {
      const savedItems = localStorage.getItem("cart");
      return savedItems ? JSON.parse(savedItems) : [];
    }
    return [];
  });

  const [addresses, setAddresses] = useState<ShippingAddress[]>(() => {
    const savedAddresses = localStorage.getItem("shipping_addresses");
    return savedAddresses ? JSON.parse(savedAddresses) : [];
  });
  
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(() => {
    const savedIndex = localStorage.getItem("selected_address_index");
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });
  
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(() => {
    const savedPromo = localStorage.getItem("applied_promo");
    return savedPromo ? JSON.parse(savedPromo) : null;
  });

  // Listen for authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear cart when user logs out
      setItems([]);
      localStorage.removeItem("cart");
      
      // Also clear promo code
      setAppliedPromoCode(null);
      localStorage.removeItem("applied_promo");
    }
  }, [isAuthenticated]);

  // Đảm bảo itemCount luôn là số hợp lệ
  const itemCount = items.reduce((total, item) => {
    const quantity = isNaN(item.quantity) ? 0 : item.quantity;
    return total + quantity;
  }, 0);
  
  const subtotal = items.reduce(
    (total, item) => {
      const quantity = isNaN(item.quantity) ? 0 : item.quantity;
      const price = isNaN(item.price) ? 0 : item.price;
      return total + price * quantity;
    },
    0
  );
  
  const calculateDiscount = (): number => {
    if (!appliedPromoCode || !appliedPromoCode.isValid) return 0;
    
    if (subtotal < appliedPromoCode.minOrderValue) return 0;
    
    if (appliedPromoCode.discountPercent > 0) {
      const percentDiscount = subtotal * (appliedPromoCode.discountPercent / 100);
      return Math.min(percentDiscount, appliedPromoCode.maxDiscountAmount);
    }
    
    return appliedPromoCode.discountAmount;
  };
  
  const calculateShippingFee = (): number => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    
    if (appliedPromoCode?.code === "FREESHIP" && appliedPromoCode.isValid) return 0;
    
    return BASE_SHIPPING_FEE;
  };
  
  const discount = calculateDiscount();
  const shippingFee = calculateShippingFee();
  const total = subtotal - discount + shippingFee;
  const isFreeShipping = shippingFee === 0;

  useEffect(() => {
    // Only save cart to localStorage if user is authenticated
    if (isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);
  
  useEffect(() => {
    localStorage.setItem("shipping_addresses", JSON.stringify(addresses));
  }, [addresses]);
  
  useEffect(() => {
    localStorage.setItem("selected_address_index", selectedAddressIndex.toString());
  }, [selectedAddressIndex]);
  
  useEffect(() => {
    if (appliedPromoCode) {
      localStorage.setItem("applied_promo", JSON.stringify(appliedPromoCode));
    } else {
      localStorage.removeItem("applied_promo");
    }
  }, [appliedPromoCode]);

  const addToCart = (item: CartItem) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    if (user.role !== "buyer") {
      toast.error("Chỉ người mua mới có thể thêm sản phẩm vào giỏ hàng");
      return;
    }

    setItems((prevItems) => {
      try {
        // Kiểm tra đầu vào
        if (!item || typeof item !== 'object') {
          console.error("Invalid item:", item);
          return prevItems;
        }
        
        // Đảm bảo quantity là số hợp lệ
        const quantity = isNaN(item.quantity) ? 1 : item.quantity;
        const normalizedItem = {
          ...item,
          quantity,
          price: isNaN(item.price) ? 0 : item.price,
          originalPrice: item.originalPrice && !isNaN(item.originalPrice) ? 
                        item.originalPrice : undefined,
        };
        
        const existingItemIndex = prevItems.findIndex(
          (i) => i.id === normalizedItem.id
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          // Đảm bảo cũng cập nhật price nếu đã thay đổi
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            price: normalizedItem.price,
            originalPrice: normalizedItem.originalPrice,
          };
          toast.success("Đã cập nhật số lượng sản phẩm trong giỏ hàng");
          return updatedItems;
        } else {
          toast.success("Đã thêm sản phẩm vào giỏ hàng");
          return [...prevItems, normalizedItem];
        }
      } catch (error) {
        console.error("Error in addToCart:", error);
        return prevItems;
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => {
      try {
        const updatedItems = prevItems.filter((item) => item.id !== id);
        if (updatedItems.length !== prevItems.length) {
          toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
        }
        return updatedItems;
      } catch (error) {
        console.error("Error in removeFromCart:", error);
        return prevItems;
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    try {
      if (isNaN(quantity) || quantity < 1) {
        removeFromCart(id);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error in updateQuantity:", error);
    }
  };

  const clearCart = () => {
    try {
      setItems([]);
      localStorage.removeItem("cart");
      if (appliedPromoCode) {
        setAppliedPromoCode(null);
        localStorage.removeItem("applied_promo");
      }
      toast.success("Giỏ hàng đã được xóa");
    } catch (error) {
      console.error("Error in clearCart:", error);
    }
  };
  
  const saveAddress = (address: ShippingAddress) => {
    setAddresses((prevAddresses) => {
      if (address.isDefault) {
        prevAddresses = prevAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      const existingIndex = prevAddresses.findIndex(
        addr => addr.phone === address.phone && addr.address === address.address
      );
      
      if (existingIndex >= 0) {
        const updated = [...prevAddresses];
        updated[existingIndex] = address;
        toast.success("Đã cập nhật địa chỉ giao hàng");
        return updated;
      } else {
        toast.success("Đã thêm địa chỉ giao hàng mới");
        return [...prevAddresses, address];
      }
    });
  };
  
  const removeAddress = (index: number) => {
    setAddresses(prevAddresses => {
      const updated = [...prevAddresses];
      updated.splice(index, 1);
      toast.info("Đã xóa địa chỉ giao hàng");
      return updated;
    });
    
    if (index === selectedAddressIndex) {
      setSelectedAddressIndex(0);
    } else if (index < selectedAddressIndex) {
      setSelectedAddressIndex(selectedAddressIndex - 1);
    }
  };
  
  const selectAddress = (index: number) => {
    if (index >= 0 && index < addresses.length) {
      setSelectedAddressIndex(index);
    }
  };
  
  const applyPromoCode = (code: string): boolean => {
    const foundPromo = samplePromoCodes.find(
      promo => promo.code.toUpperCase() === code.toUpperCase()
    );
    
    if (!foundPromo) {
      setAppliedPromoCode({
        code,
        discountPercent: 0,
        discountAmount: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        isValid: false,
        errorMessage: "Mã giảm giá không hợp lệ"
      });
      toast.error("Mã giảm giá không hợp lệ");
      return false;
    }
    
    if (subtotal < foundPromo.minOrderValue) {
      setAppliedPromoCode({
        ...foundPromo,
        isValid: false,
        errorMessage: `Đơn hàng tối thiểu ${foundPromo.minOrderValue.toLocaleString()}₫ để áp dụng mã này`
      });
      toast.error(`Đơn hàng tối thiểu ${foundPromo.minOrderValue.toLocaleString()}₫ để áp dụng mã này`);
      return false;
    }
    
    setAppliedPromoCode({
      ...foundPromo,
      isValid: true
    });
    
    if (foundPromo.discountPercent > 0) {
      toast.success(`Đã áp dụng mã giảm ${foundPromo.discountPercent}%`);
    } else {
      toast.success(`Đã áp dụng mã giảm ${foundPromo.discountAmount.toLocaleString()}₫`);
    }
    
    return true;
  };
  
  const removePromoCode = () => {
    setAppliedPromoCode(null);
    toast.info("Đã xóa mã giảm giá");
  };

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    return savedAddress ? JSON.parse(savedAddress) : null;
  });

  const saveShippingAddress = (address: ShippingAddress) => {
    setShippingAddress(address);
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    toast.success("Đã lưu thông tin giao hàng");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addresses,
        selectedAddressIndex,
        appliedPromoCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveAddress,
        removeAddress,
        selectAddress,
        applyPromoCode,
        removePromoCode,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        isFreeShipping,
        shippingAddress,
        saveShippingAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
