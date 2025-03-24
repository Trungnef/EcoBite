import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type UserRole = "buyer" | "seller";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string; // Only for sellers
  profileImage?: string;
  favorites?: string[]; // Product IDs for buyers
  purchaseHistory?: string[]; // Order IDs for buyers
  loyaltyPoints?: number; // For buyer loyalty program
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - adding a few more for testing different roles
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Buyer",
    email: "buyer@example.com",
    role: "buyer",
    profileImage: "/images/avatars/buyer.jpg",
    favorites: ["1", "3", "5"],
    purchaseHistory: ["order-123", "order-456"],
    loyaltyPoints: 250
  },
  {
    id: "2",
    name: "Fresh Market",
    email: "store@example.com",
    role: "seller",
    storeId: "store-1",
    profileImage: "/images/avatars/seller.jpg"
  },
  {
    id: "3",
    name: "Buyer Test",
    email: "test@buyer.com",
    role: "buyer",
    favorites: [],
    purchaseHistory: [],
    loyaltyPoints: 0
  },
  {
    id: "4",
    name: "Seller Test",
    email: "test@seller.com",
    role: "seller",
    storeId: "store-2"
  }
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for saved authentication on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send credentials to a backend
      // For demo, we'll just check against our mock data
      
      // Find user in mock data (in real app, this would be an API call)
      const foundUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.role === role
      );
      
      if (foundUser) {
        setUser(foundUser);
        toast.success(`Chào mừng trở lại, ${foundUser.name}!`);
        setIsLoading(false);
        return true;
      } else {
        // If not found in the exact role, let's give a more specific error
        const userExists = mockUsers.find(u => 
          u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (userExists) {
          toast.error(`Email này đã đăng ký với vai trò ${userExists.role === 'buyer' ? 'người mua' : 'người bán'}. Vui lòng chọn đúng vai trò.`);
        } else {
          toast.error(`Không tìm thấy tài khoản ${role === 'buyer' ? 'người mua' : 'người bán'} với email này`);
        }
        
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập");
      setIsLoading(false);
      return false;
    }
  };
  
  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ): Promise<boolean> => {
    if (!email || !password || !name) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists (in real app, this would be an API call)
      const existingUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        toast.error("Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.");
        setIsLoading(false);
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        favorites: [],
        loyaltyPoints: 0,
        profileImage: role === 'buyer' 
          ? '/images/avatars/default-buyer.jpg' 
          : '/images/avatars/default-seller.jpg',
      };
      
      // In a real app, this would be an API call to create the user
      // For demo purposes, we'll just add it to our internal state
      // This won't persist on reload since we don't actually modify mockUsers
      
      setUser(newUser);
      toast.success(`Tạo tài khoản thành công! Chào mừng, ${name}!`);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Đã xảy ra lỗi khi đăng ký");
      setIsLoading(false);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Bạn đã đăng xuất thành công");
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      toast.success("Cập nhật thông tin thành công");
    }
  };
  
  const addToFavorites = (productId: string) => {
    if (user && user.role === "buyer") {
      const favorites = user.favorites || [];
      if (!favorites.includes(productId)) {
        updateUser({ 
          favorites: [...favorites, productId] 
        });
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    }
  };
  
  const removeFromFavorites = (productId: string) => {
    if (user && user.role === "buyer" && user.favorites) {
      updateUser({ 
        favorites: user.favorites.filter(id => id !== productId) 
      });
      toast.success("Đã xóa khỏi danh sách yêu thích");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 