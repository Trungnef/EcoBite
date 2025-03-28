import { useState, useEffect } from "react";
import { Navigate, useSearchParams, useLocation, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DealCard } from "@/components/DealCard";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, Mail, Phone, Gift, Heart, ShoppingBag, 
  Bell, Settings, LogOut, Edit, Save, Loader2, MapPin, Check, Clock, Package, Plus, MoreVertical, Star, Trash, ArrowRight, Truck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Internationalization object for supporting both English and Vietnamese
const translations = {
  tabs: {
    favorites: {
      en: "Favorites",
      vi: "Yêu thích"
    },
    orders: {
      en: "Orders",
      vi: "Đơn hàng"
    },
    rewards: {
      en: "Rewards",
      vi: "Ưu đãi"
    },
    address: {
      en: "Addresses",
      vi: "Địa chỉ"
    }
  },
  profile: {
    title: {
      en: "My Account",
      vi: "Tài khoản của tôi"
    },
    description: {
      en: "View and manage your account information",
      vi: "Xem và quản lý thông tin tài khoản"
    },
    buyerAccount: {
      en: "Buyer Account",
      vi: "Tài khoản mua hàng"
    },
    loyaltyPoints: {
      en: "Loyalty Points",
      vi: "Điểm tích lũy"
    },
    pointsUntilNextReward: {
      en: "points until your next reward",
      vi: "điểm nữa để nhận phần thưởng tiếp theo"
    },
    accountSettings: {
      en: "Account Settings",
      vi: "Cài đặt tài khoản"
    },
    logOut: {
      en: "Log Out",
      vi: "Đăng xuất"
    },
    loading: {
      en: "Loading your profile...",
      vi: "Đang tải thông tin cá nhân..."
    }
  },
  orders: {
    latest: {
      en: "Latest Order",
      vi: "Đơn hàng gần đây nhất"
    },
    processing: {
      en: "Processing",
      vi: "Đang xử lý"
    },
    delivered: {
      en: "Delivered",
      vi: "Đã giao hàng"
    },
    orderDetails: {
      en: "Order Details",
      vi: "Chi tiết đơn hàng"
    },
    trackOrder: {
      en: "Track Order",
      vi: "Theo dõi đơn hàng"
    },
    buyAgain: {
      en: "Buy Again",
      vi: "Mua lại"
    },
    total: {
      en: "Total",
      vi: "Tổng cộng"
    },
    otherItems: {
      en: "other items",
      vi: "sản phẩm khác"
    },
    orderHistory: {
      en: "Your Order History",
      vi: "Lịch sử đơn hàng của bạn"
    },
    noOrders: {
      en: "You don't have any orders yet",
      vi: "Bạn chưa có đơn hàng nào"
    },
    shopNow: {
      en: "Shop Now",
      vi: "Mua sắm ngay"
    },
    hideTracking: {
      en: "Hide Tracking Info",
      vi: "Ẩn thông tin theo dõi"
    },
    viewAllOrders: {
      en: "View All Orders",
      vi: "Xem tất cả đơn hàng"
    },
    contactDelivery: {
      en: "Contact Delivery Person",
      vi: "Liên hệ người giao hàng"
    },
    items: {
      en: "items",
      vi: "sản phẩm"
    }
  },
  rewards: {
    title: {
      en: "Rewards Program",
      vi: "Chương trình ưu đãi"
    },
    points: {
      en: "Points",
      vi: "Điểm"
    },
    howItWorks: {
      en: "How it Works",
      vi: "Cách thức hoạt động"
    },
    earnPointsTitle: {
      en: "Earn Points",
      vi: "Tích điểm"
    },
    earnPointsDesc: {
      en: "Get 1 point for every 1,000₫ spent",
      vi: "Nhận 1 điểm cho mỗi 1.000₫ chi tiêu"
    },
    redeemRewardsTitle: {
      en: "Redeem Rewards",
      vi: "Đổi phần thưởng"
    },
    redeemRewardsDesc: {
      en: "Use points for discounts and special offers",
      vi: "Dùng điểm để đổi ưu đãi và giảm giá"
    },
    exclusiveDealsTitle: {
      en: "Exclusive Deals",
      vi: "Ưu đãi độc quyền"
    },
    exclusiveDealsDesc: {
      en: "Get early access to special promotions",
      vi: "Tiếp cận sớm các chương trình khuyến mãi"
    },
    availableRewards: {
      en: "Available Rewards",
      vi: "Phần thưởng hiện có"
    },
    redeemFor: {
      en: "Redeem for",
      vi: "Đổi với"
    }
  },
  address: {
    title: {
      en: "Your Shipping Addresses",
      vi: "Địa chỉ giao hàng của bạn"
    },
    addNew: {
      en: "Add New Address",
      vi: "Thêm địa chỉ mới"
    },
    noAddresses: {
      en: "You don't have any shipping addresses yet",
      vi: "Bạn chưa có địa chỉ giao hàng nào"
    },
    default: {
      en: "Default",
      vi: "Mặc định"
    },
    edit: {
      en: "Edit",
      vi: "Sửa"
    },
    delete: {
      en: "Delete",
      vi: "Xóa"
    },
    setAsDefault: {
      en: "Set as default",
      vi: "Đặt làm mặc định"
    },
    openMenu: {
      en: "Open menu",
      vi: "Mở menu"
    },
    addNewTitle: {
      en: "Add New Address",
      vi: "Thêm địa chỉ mới"
    },
    addNewDesc: {
      en: "Add a new shipping address to your account",
      vi: "Thêm địa chỉ giao hàng mới vào tài khoản của bạn"
    },
    labelName: {
      en: "Address Name",
      vi: "Tên địa chỉ"
    },
    labelFullName: {
      en: "Full Name",
      vi: "Họ và tên"
    },
    labelPhone: {
      en: "Phone Number",
      vi: "Số điện thoại"
    },
    labelAddress: {
      en: "Address",
      vi: "Địa chỉ"
    },
    labelDistrict: {
      en: "District",
      vi: "Quận/Huyện"
    },
    labelCity: {
      en: "City/Province",
      vi: "Tỉnh/Thành phố"
    },
    setAsDefaultCheckbox: {
      en: "Set as default address",
      vi: "Đặt làm địa chỉ mặc định"
    },
    saveAddress: {
      en: "Save Address",
      vi: "Lưu địa chỉ"
    }
  },
  tracking: {
    orderTracking: {
      en: "Order Tracking",
      vi: "Theo dõi đơn hàng"
    },
    estimated: {
      en: "Estimated delivery",
      vi: "Dự kiến giao hàng"
    },
    orderConfirmed: {
      en: "Order Confirmed",
      vi: "Đơn hàng đã được xác nhận"
    },
    orderConfirmedDesc: {
      en: "Your order has been confirmed and is being prepared",
      vi: "Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị"
    },
    preparing: {
      en: "Order is Being Prepared",
      vi: "Đơn hàng đang được chuẩn bị"
    },
    preparingDesc: {
      en: "The store is preparing your order",
      vi: "Nhà cung cấp đang chuẩn bị đơn hàng của bạn"
    },
    shipped: {
      en: "Order Shipped",
      vi: "Đơn hàng đã được giao cho đơn vị vận chuyển"
    },
    shippedDesc: {
      en: "Your order has been handed to the delivery service",
      vi: "Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển"
    },
    delivering: {
      en: "Delivering",
      vi: "Đang giao hàng"
    },
    deliveringDesc: {
      en: "Your order is on the way to your delivery address",
      vi: "Đơn hàng của bạn đang được giao đến địa chỉ nhận hàng"
    },
    realtimeUpdate: {
      en: "Updating real-time location",
      vi: "Đang cập nhật vị trí thời gian thực"
    },
    delivered: {
      en: "Delivery Successful",
      vi: "Giao hàng thành công"
    },
    locationTitle: {
      en: "Order Location",
      vi: "Vị trí đơn hàng"
    },
    demoImage: {
      en: "Demo image",
      vi: "Ảnh minh họa"
    },
    leftWarehouse: {
      en: "Left warehouse",
      vi: "Đã rời kho hàng"
    },
    timeAgo: {
      en: "About 20 minutes ago",
      vi: "Khoảng 20 phút trước"
    },
    deliveryPerson: {
      en: "Delivery Person",
      vi: "Người giao hàng"
    },
    contactDelivery: {
      en: "Contact delivery person",
      vi: "Liên hệ người giao hàng"
    }
  },
  editProfile: {
    title: {
      en: "Edit Profile",
      vi: "Chỉnh sửa hồ sơ"
    },
    description: {
      en: "Update your personal information and preferences",
      vi: "Cập nhật thông tin cá nhân và tùy chọn"
    },
    cancel: {
      en: "Cancel",
      vi: "Hủy"
    },
    saving: {
      en: "Saving...",
      vi: "Đang lưu..."
    },
    saveChanges: {
      en: "Save Changes",
      vi: "Lưu thay đổi"
    },
    personalInfo: {
      en: "Personal Information",
      vi: "Thông tin cá nhân"
    },
    fullName: {
      en: "Full Name",
      vi: "Họ và tên"
    },
    email: {
      en: "Email Address",
      vi: "Địa chỉ email"
    },
    emailCannotBeChanged: {
      en: "Email cannot be changed",
      vi: "Không thể thay đổi email"
    },
    phone: {
      en: "Phone Number",
      vi: "Số điện thoại"
    },
    phoneEnter: {
      en: "Enter your phone number",
      vi: "Nhập số điện thoại của bạn"
    },
    notificationPrefs: {
      en: "Notification Preferences",
      vi: "Tùy chọn thông báo"
    },
    expiringProducts: {
      en: "Expiring Products",
      vi: "Sản phẩm sắp hết hạn"
    },
    expiringProductsDesc: {
      en: "Get notified about products that match your interests when they're about to expire",
      vi: "Nhận thông báo về sản phẩm phù hợp với sở thích của bạn khi sắp hết hạn"
    },
    specialDeals: {
      en: "Special Deals",
      vi: "Ưu đãi đặc biệt"
    },
    specialDealsDesc: {
      en: "Receive notifications about special deals and promotions",
      vi: "Nhận thông báo về ưu đãi đặc biệt và khuyến mãi"
    },
    orderUpdates: {
      en: "Order Updates",
      vi: "Cập nhật đơn hàng"
    },
    orderUpdatesDesc: {
      en: "Get notifications about your order status and delivery updates",
      vi: "Nhận thông báo về trạng thái đơn hàng và cập nhật giao hàng"
    }
  }
};

// Mock data for favorites and purchase history
const mockFavorites = [
  {
    id: "1",
    title: "Organic Strawberries",
    store: "Fresh Market",
    storeImg: "/images/stores/fresh-market.jpg",
    originalPrice: 45000,
    discountPrice: 25000,
    discountPercent: 44,
    image: "/images/strawberries.jpg",
    expiresIn: "2 days",
    category: "produce",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false
  },
  {
    id: "3",
    title: "Greek Yogurt",
    store: "Healthy Foods",
    storeImg: "/images/stores/healthy-foods.jpg",
    originalPrice: 30000,
    discountPrice: 15000,
    discountPercent: 50,
    image: "/images/yogurt.jpg",
    expiresIn: "3 days",
    category: "dairy",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false
  },
  {
    id: "5",
    title: "Orange Juice",
    store: "Fresh Market",
    storeImg: "/images/stores/fresh-market.jpg",
    originalPrice: 25000,
    discountPrice: 15000,
    discountPercent: 40,
    image: "/images/orange-juice.jpg",
    expiresIn: "4 days",
    category: "beverages",
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false
  }
];

const mockOrders = [
  {
    id: "order-789",
    date: new Date().toISOString(),
    status: "Processing",
    total: 110000,
    items: [
      { id: "2", name: "Fresh Sourdough Bread", quantity: 1, price: 35000 },
      { id: "5", name: "Orange Juice", quantity: 2, price: 15000 },
      { id: "9", name: "Avocado", quantity: 3, price: 15000 }
    ],
    store: "Green Grocer"
  },
  {
    id: "order-123",
    date: "2023-05-15T10:30:00Z",
    status: "Delivered",
    total: 85000,
    items: [
      { id: "1", name: "Organic Strawberries", quantity: 2, price: 25000 },
      { id: "3", name: "Greek Yogurt", quantity: 1, price: 15000 },
      { id: "8", name: "Bananas (Bundle)", quantity: 2, price: 10000 }
    ],
    store: "Fresh Market"
  },
  {
    id: "order-456",
    date: "2023-04-28T14:15:00Z",
    status: "Delivered",
    total: 130000,
    items: [
      { id: "4", name: "Prawn Fried Rice", quantity: 1, price: 30000 },
      { id: "6", name: "Chocolate Cake", quantity: 1, price: 70000 },
      { id: "7", name: "Chicken Salad", quantity: 1, price: 35000 }
    ],
    store: "Quick Meal"
  }
];

// Add the mock addresses after the mock orders
const mockAddresses = [
  {
    id: "addr-1",
    name: "Nhà riêng",
    fullName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường Lê Lợi",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    isDefault: true
  },
  {
    id: "addr-2",
    name: "Văn phòng",
    fullName: "Nguyễn Văn A",
    phone: "0987654321",
    address: "456 Đường Nguyễn Huệ",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    isDefault: false
  }
];

// Cast product with an interface to fix type issues
interface DealProduct {
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
}

// Function to add a recent order if available from localStorage
const addRecentOrderIfAvailable = () => {
  // Try to get order data from localStorage
  const trackingData = localStorage.getItem('track_order_data');
  
  if (trackingData) {
    try {
      const data = JSON.parse(trackingData);
      // Check if it's a recent order (less than 1 hour old)
      const isRecent = data.timestamp > (Date.now() - 60 * 60 * 1000);
      
      if (isRecent && !mockOrders.some(order => order.id === data.orderId)) {
        // Convert order items format from OrderConfirmation to UserProfile format
        const orderItems = data.orderItems?.map(item => ({
          id: item.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: item.title || "Sản phẩm",
          quantity: item.quantity || 1,
          price: item.price || 0
        })) || [
          { id: "recent-1", name: "Sản phẩm mới", quantity: 1, price: 75000 },
          { id: "recent-2", name: "Sản phẩm mới", quantity: 1, price: 75000 },
        ];
        
        // Add a new mock order at the beginning of the array
        mockOrders.unshift({
          id: data.orderId,
          date: new Date(data.timestamp).toISOString(),
          status: "Processing",
          total: data.orderSummary?.total || 150000,
          items: orderItems,
          store: "EcoBite Store"
        });
      }
    } catch (e) {
      console.error("Error parsing order data:", e);
    }
  }
};

// Call the function to add recent order
addRecentOrderIfAvailable();

export default function UserProfile() {
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("favorites");
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    isDefault: false
  });
  const [lang, setLang] = useState("vi"); // "vi" for Vietnamese, "en" for English
  
  const { addToCart } = useCart();

  // Function to get translated text
  const t = (key: keyof typeof translations, subKey: string): string => {
    if (!translations[key]) return `Missing key: ${key}`;
    
    // Type casting to any to avoid TypeScript complexity
    const subSection = (translations[key] as any)[subKey];
    if (!subSection) return `Missing subKey: ${key}.${subKey}`;
    
    const value = subSection[lang] || `Missing translation: ${key}.${subKey}.${lang}`;
    return String(value); // Ensure we always return a string
  };

  // Function to handle address operations
  const handleAddressOperation = (operation: string, addressId?: string) => {
    // In a real app, these would make API calls
    switch (operation) {
      case 'add':
        toast.success('New address added successfully');
        setIsAddressDialogOpen(false);
        break;
      case 'edit':
        if (addressId) {
          const addressToEdit = mockAddresses.find(addr => addr.id === addressId);
          if (addressToEdit) {
            setAddressFormData({
              name: addressToEdit.name,
              fullName: addressToEdit.fullName,
              phone: addressToEdit.phone,
              address: addressToEdit.address,
              district: addressToEdit.district,
              city: addressToEdit.city,
              isDefault: addressToEdit.isDefault || false
            });
            setEditingAddressId(addressId);
            setIsAddressDialogOpen(true);
          }
        }
        break;
      case 'delete':
        if (addressId) {
          toast.success('Address deleted successfully');
        }
        break;
      case 'setDefault':
        if (addressId) {
          toast.success('Default address updated');
        }
        break;
      default:
        break;
    }
  };

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    notifyExpiring: true,
    notifyDeals: true,
    notifyOrders: true
  });

  // Set active tab based on URL params or location state
  useEffect(() => {
    // First try to get tab from path if using direct paths like /profile/orders
    const pathSegments = location.pathname.split('/');
    const pathTab = pathSegments[pathSegments.length - 1];
    
    if (pathTab && ['orders', 'favorites', 'rewards', 'address'].includes(pathTab)) {
      setActiveTab(pathTab);
    } else {
      // Fall back to query params if not using path-based navigation
      const tabParam = searchParams.get('tab');
      if (tabParam && ['favorites', 'orders', 'rewards', 'address'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
    
    // Check if we're tracking a specific order from order confirmation via state
    if (location.state?.trackOrder) {
      // If we have state, prioritize it absolutely
      console.log("Setting tracking order from state:", location.state.trackOrder);
      setActiveTab('orders');
      setTrackingOrder(location.state.trackOrder);
      
      // Also update localStorage as backup
      localStorage.setItem('track_order', location.state.trackOrder);
      localStorage.setItem('track_order_timestamp', Date.now().toString());
    } else {
      // Check localStorage as fallback for order tracking
      const savedOrderId = localStorage.getItem('track_order');
      const savedTimestamp = localStorage.getItem('track_order_timestamp');
      
      // Use localStorage tracking if it exists and is recent (within 1 hour)
      if (savedOrderId && savedTimestamp) {
        const timestamp = parseInt(savedTimestamp);
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        
        if (timestamp > oneHourAgo) {
          console.log("Setting tracking order from localStorage:", savedOrderId);
          setActiveTab('orders');
          setTrackingOrder(savedOrderId);
        }
      }
    }
  }, [searchParams, location.pathname, location.state]);

  // Add cleanup effect for localStorage tracking data
  useEffect(() => {
    // Clear tracking data from localStorage if it's older than 24 hours
    const savedTimestamp = localStorage.getItem('track_order_timestamp');
    if (savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      
      if (timestamp < oneDayAgo) {
        localStorage.removeItem('track_order');
        localStorage.removeItem('track_order_timestamp');
      }
    }
    
    // Cleanup function
    return () => {
      // If we're navigating away from tracking view, clear state
      if (trackingOrder) {
        // Keep localStorage but remove from state
        setTrackingOrder(null);
      }
    };
  }, []);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  // Show loading state
  if (isLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p>{t('profile', 'loading')}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Make sure it's a buyer account
  if (user.role !== "buyer") {
    return <Navigate to="/store/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleUpdateProfile = () => {
    setUpdatingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({
        name: formData.name,
        // In a real app, you would update more user data here
      });
      
      setIsEditing(false);
      setUpdatingProfile(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  const handleBuyAgain = (items: any[]) => {
    if (!items || items.length === 0) {
      toast.error("Không có sản phẩm nào để mua lại");
      return;
    }
    
    let successCount = 0;
    
    // Add all items from the order to cart
    items.forEach(item => {
      try {
        addToCart({
          id: item.id,
          title: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: `/images/products/${item.id}.jpg`, // Fallback image
          storeId: `store-${Math.floor(Math.random() * 5) + 1}`,
          storeName: "EcoBite Store", // Fallback store name
        });
        successCount++;
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    });
    
    if (successCount > 0) {
      toast.success(`Đã thêm ${successCount} sản phẩm vào giỏ hàng`, {
        description: "Bạn có thể điều chỉnh số lượng trong giỏ hàng",
        action: {
          label: "Giỏ hàng",
          onClick: () => navigate("/cart")
        }
      });
    } else {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng", {
        description: "Vui lòng thử lại sau"
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Summary Card */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.profileImage || "/images/avatars/default.jpg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {t('profile', 'buyerAccount')}
                      </Badge>
                    </div>
                    
                    <div className="w-full max-w-xs bg-muted/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{t('profile', 'loyaltyPoints')}</span>
                        <span className="text-sm font-bold">{user.loyaltyPoints || 0}</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${Math.min(100, ((user.loyaltyPoints || 0) / 500) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {500 - (user.loyaltyPoints || 0)} {t('profile', 'pointsUntilNextReward')}
                      </p>
                      
                      {/* Add language toggle */}
                      {/* <div className="flex items-center justify-between mt-4 pt-3 border-t border-muted">
                        <span className="text-xs text-muted-foreground">Language</span>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant={lang === "vi" ? "default" : "outline"} 
                            className={`h-7 px-2 text-xs ${lang === "vi" ? "bg-primary" : ""}`}
                            onClick={() => setLang("vi")}
                          >
                            Tiếng Việt
                          </Button>
                          <Button 
                            size="sm" 
                            variant={lang === "en" ? "default" : "outline"} 
                            className={`h-7 px-2 text-xs ${lang === "en" ? "bg-primary" : ""}`}
                            onClick={() => setLang("en")}
                          >
                            English
                          </Button>
                        </div>
                      </div> */}
                    </div>
                    
                    <div className="w-full space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditing(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        {t('profile', 'accountSettings')}
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('profile', 'logOut')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1">
              {isEditing ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{t('editProfile', 'title')}</CardTitle>
                      <CardDescription>{t('editProfile', 'description')}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>{t('editProfile', 'cancel')}</Button>
                      <Button onClick={handleUpdateProfile} disabled={updatingProfile}>
                        {updatingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('editProfile', 'saving')}
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {t('editProfile', 'saveChanges')}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        {t('editProfile', 'personalInfo')}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('editProfile', 'fullName')}</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('editProfile', 'email')}</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">
                            {t('editProfile', 'emailCannotBeChanged')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('editProfile', 'phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('editProfile', 'phoneEnter')}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Bell className="mr-2 h-5 w-5" />
                        {t('editProfile', 'notificationPrefs')}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notify-expiring">{t('editProfile', 'expiringProducts')}</Label>
                            <p className="text-sm text-muted-foreground">
                              {t('editProfile', 'expiringProductsDesc')}
                            </p>
                          </div>
                          <Switch
                            id="notify-expiring"
                            checked={formData.notifyExpiring}
                            onCheckedChange={(checked) => handleSwitchChange("notifyExpiring", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notify-deals">{t('editProfile', 'specialDeals')}</Label>
                            <p className="text-sm text-muted-foreground">
                              {t('editProfile', 'specialDealsDesc')}
                            </p>
                          </div>
                          <Switch
                            id="notify-deals"
                            checked={formData.notifyDeals}
                            onCheckedChange={(checked) => handleSwitchChange("notifyDeals", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notify-orders">{t('editProfile', 'orderUpdates')}</Label>
                            <p className="text-sm text-muted-foreground">
                              {t('editProfile', 'orderUpdatesDesc')}
                            </p>
                          </div>
                          <Switch
                            id="notify-orders"
                            checked={formData.notifyOrders}
                            onCheckedChange={(checked) => handleSwitchChange("notifyOrders", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('profile', 'title')}</CardTitle>
                    <CardDescription>{t('profile', 'description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="mb-8 grid grid-cols-4 md:w-auto">
                    <TabsTrigger value="favorites" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                          <span>{t('tabs', 'favorites')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                          <span>{t('tabs', 'orders')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="rewards" className="flex items-center">
                      <Gift className="mr-2 h-4 w-4" />
                          <span>{t('tabs', 'rewards')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="address" className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{t('tabs', 'address')}</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="favorites" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Favorite Products</h2>
                      <Button variant="outline" size="sm">
                        <Bell className="mr-2 h-4 w-4" />
                        Notify When On Sale
                      </Button>
                    </div>
                    
                    {user.favorites && user.favorites.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.favorites.map(product => {
                          // Cast product to ensure it has the right type
                          const dealProduct = product as DealProduct;
                          return (
                            <DealCard
                              key={dealProduct.id}
                              {...dealProduct}
                              isFavorite={true}
                              onFavoriteToggle={(isFavorite) => {
                                if (!isFavorite) {
                                  // Only handle removal since we know it's already a favorite
                                  if (user && user.favorites) {
                                    const updatedFavorites = user.favorites.filter(
                                      item => item.id !== dealProduct.id
                                    );
                                    updateUser({
                                      ...user,
                                      favorites: updatedFavorites
                                    });
                                    toast.error(`${dealProduct.title} đã được xóa khỏi danh sách yêu thích của bạn`);
                                  }
                                }
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Start adding products to your favorites by clicking the heart icon on any product you're interested in.
                        </p>
                        <Button asChild>
                          <a href="/deals">Browse Deals</a>
                        </Button>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="orders" className="space-y-6">
                        {!trackingOrder && mockOrders.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8 p-5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                {t('orders', 'latest')}
                              </h3>
                              <Badge variant="outline" className={cn(
                                "px-2 py-0.5",
                                mockOrders[0].status === 'Processing' 
                                  ? "bg-amber-100 text-amber-700 border-amber-200"
                                  : "bg-green-100 text-green-700 border-green-200"
                              )}>
                                {mockOrders[0].status === 'Processing' ? 'Đang xử lý' : 'Đã giao hàng'}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-baseline justify-between">
                                  <p className="font-medium">#{mockOrders[0].id.replace('order-', '')}</p>
                                  <p className="text-sm text-muted-foreground">{format(new Date(mockOrders[0].date), 'dd/MM/yyyy')}</p>
                                </div>
                                
                                <div className="space-y-1.5">
                                  {mockOrders[0].items.slice(0, 2).map((item, index) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                      <span>{item.quantity}x {item.name}</span>
                                      <span>{item.price.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                  ))}
                                  
                                  {mockOrders[0].items.length > 2 && (
                                    <p className="text-xs text-muted-foreground">
                                      +{mockOrders[0].items.length - 2} {t('orders', 'otherItems')}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="pt-2 mt-2 border-t border-border flex justify-between items-center">
                                  <p className="font-medium">{t('orders', 'total')}: {mockOrders[0].total.toLocaleString('vi-VN')}đ</p>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary hover:text-primary hover:bg-primary/5"
                                    onClick={() => setTrackingOrder(mockOrders[0].id)}
                                  >
                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                    {t('orders', 'orderDetails')}
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="w-full sm:w-auto flex flex-col gap-2">
                                <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto" size="sm" onClick={() => setTrackingOrder(mockOrders[0].id)}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  {t('orders', 'trackOrder')}
                                </Button>
                                <Button variant="outline" className="w-full sm:w-auto" size="sm" onClick={() => handleBuyAgain(mockOrders[0].items)}>
                                  <ShoppingBag className="mr-2 h-4 w-4" />
                                  {t('orders', 'buyAgain')}
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {trackingOrder && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                                <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{t('tracking', 'orderTracking')} #{trackingOrder.replace('order-', '')}</h3>
                                  <p className="text-sm text-muted-foreground">{t('tracking', 'estimated')} {format(new Date(Date.now() + 86400000), "HH:mm, dd/MM/yyyy")}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-primary text-white border-none px-3 py-1 h-auto">
                                60% Hoàn thành
                                  </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                              <div className="col-span-2">
                                <div className="relative">
                                  {/* Timeline bar */}
                                  <div className="absolute left-[22px] top-4 bottom-4 w-[3px] bg-muted rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ height: 0 }}
                                      animate={{ height: "60%" }}
                                      transition={{ duration: 1.5, ease: "easeOut" }}
                                      className="w-full bg-primary rounded-full"
                                    />
                                  </div>
                                  
                                  <ol className="space-y-6 relative">
                                    <motion.li 
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.1 }}
                                      className="relative pl-12"
                                    >
                                      <div className="absolute left-0 rounded-full flex items-center justify-center w-6 h-6 bg-primary text-white shadow-sm shadow-primary/30">
                                        <Check className="h-3.5 w-3.5" />
                                      </div>
                                      <time className="block text-xs text-muted-foreground mb-1">
                                        {format(new Date(Date.now() - 86400000), "HH:mm, dd/MM/yyyy")}
                                      </time>
                                      <h4 className="font-medium">{t('tracking', 'orderConfirmed')}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('tracking', 'orderConfirmedDesc')}
                                      </p>
                                    </motion.li>
                                    
                                    <motion.li 
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.2 }}
                                      className="relative pl-12"
                                    >
                                      <div className="absolute left-0 rounded-full flex items-center justify-center w-6 h-6 bg-primary text-white shadow-sm shadow-primary/30">
                                        <Check className="h-3.5 w-3.5" />
                                      </div>
                                      <time className="block text-xs text-muted-foreground mb-1">
                                        {format(new Date(Date.now() - 43200000), "HH:mm, dd/MM/yyyy")}
                                      </time>
                                      <h4 className="font-medium">{t('tracking', 'preparing')}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('tracking', 'preparingDesc')}
                                      </p>
                                    </motion.li>
                                    
                                    <motion.li 
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.3 }}
                                      className="relative pl-12"
                                    >
                                      <div className="absolute left-0 rounded-full flex items-center justify-center w-6 h-6 bg-primary text-white shadow-sm shadow-primary/30">
                                        <Check className="h-3.5 w-3.5" />
                                      </div>
                                      <time className="block text-xs text-muted-foreground mb-1">
                                        {format(new Date(Date.now() - 10800000), "HH:mm, dd/MM/yyyy")}
                                      </time>
                                      <h4 className="font-medium">{t('tracking', 'shipped')}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('tracking', 'shippedDesc')}
                                      </p>
                                    </motion.li>
                                    
                                    <motion.li 
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.4 }}
                                      className="relative pl-12"
                                    >
                                      <div className="absolute left-0 rounded-full flex items-center justify-center w-6 h-6 bg-primary/15 text-primary border border-primary/30 shadow-sm">
                                        <motion.div
                                          animate={{ scale: [0.8, 1.2, 0.8] }}
                                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                          <Clock className="h-3.5 w-3.5" />
                                        </motion.div>
                                      </div>
                                      <h4 className="font-medium">{t('tracking', 'delivering')}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('tracking', 'deliveringDesc')}
                                      </p>
                                      <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                                        <motion.div
                                          animate={{ 
                                            x: [0, 5, 0],
                                            transition: { duration: 1.5, repeat: Infinity }
                                          }}
                                        >
                                          <ArrowRight className="h-3.5 w-3.5" />
                                        </motion.div>
                                        <span>{t('tracking', 'realtimeUpdate')}</span>
                                      </div>
                                    </motion.li>
                                    
                                    <motion.li 
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.5 }}
                                      className="relative pl-12 opacity-60"
                                    >
                                      <div className="absolute left-0 rounded-full flex items-center justify-center w-6 h-6 bg-muted border border-muted-foreground/20 text-muted-foreground">
                                        <Package className="h-3.5 w-3.5" />
                                      </div>
                                      <h4 className="font-medium text-muted-foreground">{t('tracking', 'delivered')}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('tracking', 'estimated')} {format(new Date(Date.now() + 86400000), "HH:mm, dd/MM/yyyy")}
                                      </p>
                                    </motion.li>
                                  </ol>
                                </div>
                              </div>
                              
                              <div className="col-span-1">
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg border p-4 h-full">
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    {t('tracking', 'locationTitle')}
                                  </h4>
                                  <div className="bg-muted/50 rounded-lg mb-3 overflow-hidden relative aspect-video">
                                    <img 
                                      src="https://maps.googleapis.com/maps/api/staticmap?center=10.8231,106.6297&zoom=13&size=400x200&maptype=roadmap&markers=color:red%7C10.8231,106.6297&key=AIzaSyBxxxxx" 
                                      alt="Vị trí đơn hàng (Mock Map)" 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <motion.div 
                                        className="h-5 w-5 bg-primary/20 rounded-full"
                                        animate={{ scale: [1, 1.8, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                      >
                                        <motion.div 
                                          className="h-5 w-5 bg-primary rounded-full opacity-50"
                                          animate={{ scale: [1, 0.5, 1] }}
                                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                      </motion.div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium">
                                      {t('tracking', 'demoImage')}
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                      <div className="min-w-4 mt-0.5">
                                        <Truck className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{t('tracking', 'leftWarehouse')}</p>
                                        <p className="text-xs text-muted-foreground">{t('tracking', 'timeAgo')}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <div className="min-w-4 mt-0.5">
                                        <User className="h-4 w-4 text-primary" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{t('tracking', 'deliveryPerson')} Nguyễn Văn A</p>
                                        <p className="text-xs text-muted-foreground">{t('tracking', 'contactDelivery')} 0900 123 456</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 justify-end mt-4">
                              <Button variant="outline" size="sm" onClick={() => setTrackingOrder(null)}>
                                {t('tracking', 'hideTracking')}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => {
                                // Clear tracking data completely
                                setTrackingOrder(null);
                                localStorage.removeItem('track_order');
                                localStorage.removeItem('track_order_timestamp');
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('tracking', 'viewAllOrders')}
                              </Button>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <Phone className="mr-2 h-4 w-4" />
                                {t('tracking', 'contactDelivery')}
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        <div>
                          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            {t('orders', 'orderHistory')}
                          </h3>
                          
                          {mockOrders.length === 0 ? (
                            <div className="text-center py-12 px-4 border rounded-lg bg-muted/20">
                              <ShoppingBag className="h-14 w-14 mx-auto text-muted-foreground/50 mb-3" />
                              <p className="text-muted-foreground mb-2">{t('orders', 'noOrders')}</p>
                              <p className="text-sm text-muted-foreground mb-5">{t('orders', 'shopNow')}</p>
                              <Button variant="outline" className="mt-4" asChild>
                                <Link to="/deals">{t('orders', 'shopNow')}</Link>
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              {mockOrders.map((order) => (
                                <motion.div 
                                  key={order.id}
                                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card
                                    className={cn(
                                      "overflow-hidden transition-all duration-200",
                                      trackingOrder === order.id 
                                        ? "border-primary/50 bg-primary/[0.02] shadow-md shadow-primary/10" 
                                        : "hover:border-primary/30 hover:bg-primary/[0.01]"
                                    )}
                                  >
                                    <CardHeader className="bg-card p-4 pb-3">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <p className="font-medium">Đơn hàng #{order.id.replace('order-', '')}</p>
                                            <Badge variant={
                                              order.status === 'Delivered' ? 'outline' : 
                                              order.status === 'Processing' ? 'secondary' : 'default'
                                            } className="ml-2 transition-colors">
                                              {order.status === 'Delivered' ? 'Đã giao hàng' : 
                                               order.status === 'Processing' ? 'Đang xử lý' : 
                                               order.status}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <p><time dateTime={order.date}>{format(new Date(order.date), 'dd/MM/yyyy')}</time></p>
                                            <span className="text-muted-foreground/30">•</span>
                                            <p>{order.items.length} {t('orders', 'items')}</p>
                                            <span className="text-muted-foreground/30">•</span>
                                            <p className="flex items-center gap-1">
                                              <Store className="h-3 w-3" /> {order.store}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                          <p className="font-semibold text-base sm:text-lg">{order.total.toLocaleString('vi-VN')}đ</p>
                                          {trackingOrder === order.id && (
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-none mt-1">
                                              Đang theo dõi
                                            </Badge>
                                          )}
                                </div>
                              </div>
                            </CardHeader>
                                    <CardContent className="p-0">
                                      <div className="p-4 border-t border-muted/60">
                                        <div className="space-y-3 mb-4">
                                          {order.items.map((item, index) => (
                                            <motion.div 
                                              key={item.id}
                                              initial={trackingOrder === order.id ? { opacity: 0, y: 10 } : false}
                                              animate={trackingOrder === order.id ? { opacity: 1, y: 0 } : false}
                                              transition={{ duration: 0.2, delay: index * 0.1 }}
                                              className="flex justify-between items-center"
                                            >
                                              <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-muted-foreground/30 text-muted-foreground">
                                                  {item.quantity}
                                                </Badge>
                                                <span className="font-medium">{item.name}</span>
                                              </div>
                                              <span>{item.price.toLocaleString('vi-VN')}đ</span>
                                            </motion.div>
                        ))}
                      </div>
                                        
                                        <div className="flex flex-wrap sm:flex-nowrap justify-between gap-3 mt-4">
                                          <Button variant="outline" className="flex-1" size="sm" onClick={() => handleBuyAgain(order.items)}>
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                            {t('orders', 'buyAgain')}
                                          </Button>
                                          {trackingOrder !== order.id ? (
                                            <Button className="flex-1 bg-primary hover:bg-primary/90" size="sm" onClick={() => setTrackingOrder(order.id)}>
                                              <Clock className="mr-2 h-4 w-4" />
                                              {t('orders', 'trackOrder')}
                                            </Button>
                                          ) : (
                                            <Button className="flex-1" size="sm" variant="outline" onClick={() => setTrackingOrder(null)}>
                                              <Eye className="mr-2 h-4 w-4" />
                                              {t('orders', 'hideTracking')}
                        </Button>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                      </Card>
                                </motion.div>
                              ))}
                            </div>
                    )}
                        </div>
                  </TabsContent>
                  
                  <TabsContent value="rewards" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">{t('rewards', 'title')}</h2>
                      <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                          <div className="w-1 h-1 rounded-full bg-primary/40"></div>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 text-sm px-3 py-1">
                          {user.loyaltyPoints || 0} {t('rewards', 'points')}
                      </Badge>
                      </div>
                    </div>
                    
                    {/* Points Progress Card */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/80 to-primary p-6 text-white shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Gift className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{t('rewards', 'title')}</h3>
                              <p className="text-sm text-white/80 mt-0.5">
                                {t('profile', 'loyaltyPoints')}: <span className="font-bold text-white">{user.loyaltyPoints || 0}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>0</span>
                              <span>500 {t('rewards', 'points')}</span>
                            </div>
                            <div className="w-full bg-white/30 h-2.5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${Math.min(100, ((user.loyaltyPoints || 0) / 500) * 100)}%` 
                                }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="bg-white h-full rounded-full"
                              />
                            </div>
                            <p className="text-sm text-white/90">
                              {500 - (user.loyaltyPoints || 0)} {t('profile', 'pointsUntilNextReward')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="md:border-l md:border-white/20 md:pl-6 flex flex-col justify-center">
                          <div className="text-center md:text-left">
                            <p className="font-medium mb-2">{t('rewards', 'redeemRewardsTitle')}</p>
                            <Button 
                              variant="secondary" 
                              className="bg-white hover:bg-white/90 text-primary"
                              disabled={!user.loyaltyPoints || user.loyaltyPoints < 200}
                            >
                              <Gift className="mr-2 h-4 w-4" />
                              {t('rewards', 'redeemFor')} 200 {t('rewards', 'points')}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-16 -mr-16"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -mb-8 -ml-8"></div>
                    </motion.div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('rewards', 'howItWorks')}</CardTitle>
                        <CardDescription>
                          {t('rewards', 'redeemRewardsDesc')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-muted/30 p-4 rounded-lg text-center border border-border"
                          >
                            <div className="bg-primary/10 text-primary h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-3">
                              <ShoppingBag className="h-7 w-7" />
                            </div>
                            <h3 className="font-medium mb-2">{t('rewards', 'earnPointsTitle')}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t('rewards', 'earnPointsDesc')}
                            </p>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-muted/30 p-4 rounded-lg text-center border border-border"
                          >
                            <div className="bg-primary/10 text-primary h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Gift className="h-7 w-7" />
                            </div>
                            <h3 className="font-medium mb-2">{t('rewards', 'redeemRewardsTitle')}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t('rewards', 'redeemRewardsDesc')}
                            </p>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-muted/30 p-4 rounded-lg text-center border border-border"
                          >
                            <div className="bg-primary/10 text-primary h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Bell className="h-7 w-7" />
                            </div>
                            <h3 className="font-medium mb-2">{t('rewards', 'exclusiveDealsTitle')}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t('rewards', 'exclusiveDealsDesc')}
                            </p>
                          </motion.div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-4 flex items-center gap-2">
                            <Gift className="h-5 w-5 text-primary" />
                            {t('rewards', 'availableRewards')}
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between p-4 border rounded-lg group hover:border-primary/30 hover:bg-primary/5 transition-colors"
                            >
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">10% Off Your Next Order</p>
                                <p className="text-sm text-muted-foreground">Valid for 30 days after redemption</p>
                              </div>
                              <Button 
                                size="sm" 
                                disabled={!user.loyaltyPoints || user.loyaltyPoints < 200}
                                className={!user.loyaltyPoints || user.loyaltyPoints < 200 ? "" : "bg-primary hover:bg-primary/90"}
                              >
                                {t('rewards', 'redeemFor')} 200
                              </Button>
                            </motion.div>
                            
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between p-4 border rounded-lg group hover:border-primary/30 hover:bg-primary/5 transition-colors"
                            >
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">Free Delivery</p>
                                <p className="text-sm text-muted-foreground">On your next order</p>
                              </div>
                              <Button 
                                size="sm" 
                                disabled={!user.loyaltyPoints || user.loyaltyPoints < 150}
                                className={!user.loyaltyPoints || user.loyaltyPoints < 150 ? "" : "bg-primary hover:bg-primary/90"}
                              >
                                {t('rewards', 'redeemFor')} 150
                              </Button>
                            </motion.div>
                            
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between p-4 border rounded-lg group hover:border-primary/30 hover:bg-primary/5 transition-colors"
                            >
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">VIP Early Access</p>
                                <p className="text-sm text-muted-foreground">48-hour early access to new deals</p>
                              </div>
                              <Button 
                                size="sm" 
                                disabled={!user.loyaltyPoints || user.loyaltyPoints < 500}
                                className={!user.loyaltyPoints || user.loyaltyPoints < 500 ? "" : "bg-primary hover:bg-primary/90"}
                              >
                                {t('rewards', 'redeemFor')} 500
                              </Button>
                            </motion.div>
                            
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between p-4 border rounded-lg group hover:border-primary/30 hover:bg-primary/5 transition-colors border-dashed"
                            >
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">Birthday Gift</p>
                                <p className="text-sm text-muted-foreground">Special surprise on your birthday</p>
                              </div>
                              <Button 
                                size="sm" 
                                disabled={!user.loyaltyPoints || user.loyaltyPoints < 350}
                                className={!user.loyaltyPoints || user.loyaltyPoints < 350 ? "" : "bg-primary hover:bg-primary/90"}
                              >
                                {t('rewards', 'redeemFor')} 350
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="address" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {t('address', 'title')}
                      </h3>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => {
                          setAddressFormData({
                            name: "",
                            fullName: "",
                            phone: "",
                            address: "",
                            district: "",
                            city: "",
                            isDefault: false
                          });
                          setEditingAddressId(null);
                          setIsAddressDialogOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('address', 'addNew')}
                      </Button>
                    </div>
                    
                    {mockAddresses.length === 0 ? (
                      <div className="text-center py-12 px-4 border rounded-xl bg-muted/20">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MapPin className="h-12 w-12 mx-auto text-muted-foreground/70 mb-3" />
                          <p className="text-muted-foreground mb-3">{t('address', 'noAddresses')}</p>
                          <Button 
                            className="mt-2 bg-primary hover:bg-primary/90"
                            onClick={() => {
                              setAddressFormData({
                                name: "",
                                fullName: "",
                                phone: "",
                                address: "",
                                district: "",
                                city: "",
                                isDefault: false
                              });
                              setEditingAddressId(null);
                              setIsAddressDialogOpen(true);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('address', 'addNew')}
                          </Button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
                        {mockAddresses.map((address) => (
                          <motion.div
                            key={address.id}
                            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card className={cn(
                              "h-full transition-all duration-200 hover:border-primary/30",
                              address.isDefault ? "border-primary shadow-md shadow-primary/5" : ""
                            )}>
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant="outline" 
                                      className="h-8 w-8 rounded-full p-0 flex items-center justify-center border-primary/20 bg-primary/5"
                                    >
                                      <MapPin className="h-4 w-4 text-primary" />
                                    </Badge>
                                    <div>
                                      <CardTitle className="text-base font-medium">{address.name}</CardTitle>
                                      {address.isDefault && (
                                        <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/20 h-5 text-[10px]">
                                          {t('address', 'default')}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">{t('address', 'openMenu')}</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                      <DropdownMenuItem 
                                        className="cursor-pointer py-2 focus:bg-primary/5"
                                        onClick={() => handleAddressOperation('edit', address.id)}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        {t('address', 'edit')}
                                      </DropdownMenuItem>
                                      {!address.isDefault && (
                                        <DropdownMenuItem 
                                          className="cursor-pointer py-2 focus:bg-primary/5"
                                          onClick={() => handleAddressOperation('setDefault', address.id)}
                                        >
                                          <Star className="mr-2 h-4 w-4" />
                                          {t('address', 'setAsDefault')}
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-destructive cursor-pointer py-2 focus:bg-red-50"
                                        onClick={() => handleAddressOperation('delete', address.id)}
                                      >
                                        <Trash className="mr-2 h-4 w-4" />
                                        {t('address', 'delete')}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-1 text-sm mb-6">
                                  <div className="font-medium">{address.fullName}</div>
                                  <div className="text-muted-foreground flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {address.phone}
                                  </div>
                                  <div className="text-muted-foreground mt-1 pl-0.5">
                                    {address.address}, {address.district}, {address.city}
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                                    onClick={() => handleAddressOperation('edit', address.id)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t('address', 'edit')}
                                  </Button>
                                  {!address.isDefault ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                                      onClick={() => handleAddressOperation('setDefault', address.id)}
                                    >
                                      <Star className="mr-2 h-4 w-4" />
                                      {t('address', 'setAsDefault')}
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30"
                                      onClick={() => handleAddressOperation('delete', address.id)}
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      {t('address', 'delete')}
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                        
                        {/* Add New Address Card */}
                        <motion.div
                          whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card 
                            className="h-full border-dashed hover:border-primary/30 cursor-pointer flex flex-col items-center justify-center p-6"
                            onClick={() => {
                              setAddressFormData({
                                name: "",
                                fullName: "",
                                phone: "",
                                address: "",
                                district: "",
                                city: "",
                                isDefault: false
                              });
                              setEditingAddressId(null);
                              setIsAddressDialogOpen(true);
                            }}
                          >
                            <div className="flex flex-col items-center text-center p-4">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Plus className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="font-medium mb-2">{t('address', 'addNew')}</h3>
                              <p className="text-sm text-muted-foreground">
                                Add a new shipping address for faster checkout
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      </div>
                    )}

                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>
                            {editingAddressId ? t('address', 'edit') : t('address', 'addNewTitle')}
                          </DialogTitle>
                          <DialogDescription>
                            {t('address', 'addNewDesc')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              {t('address', 'labelName')}
                            </Label>
                            <Input 
                              id="name" 
                              value={addressFormData.name}
                              onChange={(e) => setAddressFormData({...addressFormData, name: e.target.value})}
                              className="col-span-3" 
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">
                              {t('address', 'labelFullName')}
                            </Label>
                            <Input 
                              id="fullName" 
                              value={addressFormData.fullName}
                              onChange={(e) => setAddressFormData({...addressFormData, fullName: e.target.value})}
                              className="col-span-3" 
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              {t('address', 'labelPhone')}
                            </Label>
                            <Input 
                              id="phone" 
                              value={addressFormData.phone}
                              onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})}
                              className="col-span-3" 
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                              {t('address', 'labelAddress')}
                            </Label>
                            <Input 
                              id="address" 
                              value={addressFormData.address}
                              onChange={(e) => setAddressFormData({...addressFormData, address: e.target.value})}
                              className="col-span-3" 
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="district" className="text-right">
                              {t('address', 'labelDistrict')}
                            </Label>
                            <Input 
                              id="district" 
                              value={addressFormData.district}
                              onChange={(e) => setAddressFormData({...addressFormData, district: e.target.value})}
                              className="col-span-3" 
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">
                              {t('address', 'labelCity')}
                            </Label>
                            <Input 
                              id="city" 
                              value={addressFormData.city}
                              onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                              className="col-span-3" 
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div></div>
                            <div className="col-span-3 flex items-center space-x-2">
                              <Checkbox 
                                id="default" 
                                checked={addressFormData.isDefault}
                                onCheckedChange={(checked) => setAddressFormData({...addressFormData, isDefault: checked as boolean})}
                              />
                              <label
                                htmlFor="default"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {t('address', 'setAsDefaultCheckbox')}
                              </label>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddressDialogOpen(false)}
                          >
                            {t('editProfile', 'cancel')}
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => handleAddressOperation(editingAddressId ? 'update' : 'add', editingAddressId || undefined)}
                          >
                            {t('address', 'saveAddress')}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>
                </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
} 