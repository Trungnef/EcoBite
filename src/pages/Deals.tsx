import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { DealCard } from "@/components/DealCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Tag,
  X,
  Sparkles,
  Flame,
  ArrowDownAZ,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  Store,
  Percent,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Dữ liệu mẫu - mở rộng từ component FeaturedDeals
const allDeals = [
  {
    id: "1",
    title: "Gói Trái Cây Hữu Cơ Tươi",
    store: "Cửa Hàng Hữu Cơ",
    storeImg: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=150",
    originalPrice: 250000,
    discountPrice: 150000,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800",
    expiresIn: "48 giờ",
    category: "Rau Củ Quả",
    location: "Quận 1, TP.HCM"
  },
  {
    id: "2",
    title: "Bộ Bánh Làm Thủ Công",
    store: "Tiệm Bánh Breadly",
    storeImg: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=150",
    originalPrice: 180000,
    discountPrice: 99000,
    discountPercent: 45,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800",
    expiresIn: "24 giờ",
    category: "Bánh",
    location: "Quận 2, TP.HCM"
  },
  {
    id: "3",
    title: "Bộ Sưu Tập Sữa Cao Cấp",
    store: "Trang Trại Tươi",
    storeImg: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=150",
    originalPrice: 120000,
    discountPrice: 75000,
    discountPercent: 38,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800",
    expiresIn: "36 giờ",
    category: "Sữa",
    location: "Quận 3, TP.HCM"
  },
  {
    id: "4",
    title: "Hộp Thức Ăn Sẵn",
    store: "Nhà Bếp Đô Thị",
    storeImg: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=150",
    originalPrice: 95000,
    discountPrice: 55000,
    discountPercent: 42,
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800",
    expiresIn: "12 giờ",
    category: "Thức Ăn Sẵn",
    location: "Quận 4, TP.HCM"
  },
  {
    id: "5",
    title: "Hạt Cà Phê Cao Cấp",
    store: "Bean Palace",
    storeImg: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=150",
    originalPrice: 220000,
    discountPrice: 154000,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
    expiresIn: "72 giờ",
    category: "Đồ Uống",
    location: "Quận 5, TP.HCM"
  },
  {
    id: "6",
    title: "Bộ Sưu Tập Phô Mai Nhập Khẩu",
    store: "Gourmet Deli",
    storeImg: "https://images.unsplash.com/photo-1579551053957-ee77f9b970c7?q=80&w=150",
    originalPrice: 350000,
    discountPrice: 175000,
    discountPercent: 50,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=800",
    expiresIn: "36 giờ",
    category: "Sữa",
    location: "Quận 1, TP.HCM"
  },
  {
    id: "7",
    title: "Hộp Rau Củ Hữu Cơ",
    store: "Trang Trại Eco",
    storeImg: "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=150",
    originalPrice: 180000,
    discountPrice: 108000,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1567306226840-0a7b13dff158?q=80&w=800",
    expiresIn: "24 giờ",
    category: "Rau Củ Quả",
    location: "Quận 7, TP.HCM"
  },
  {
    id: "8",
    title: "Gói Quà Socola",
    store: "Sweet Treats",
    storeImg: "https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?q=80&w=150",
    originalPrice: 275000,
    discountPrice: 137500,
    discountPercent: 50,
    image: "https://images.unsplash.com/photo-1548907040-4d42bdffd89c?q=80&w=800",
    expiresIn: "48 giờ",
    category: "Bánh Kẹo",
    location: "Quận 2, TP.HCM"
  }
];

// Extract unique categories and locations
const categories = [...new Set(allDeals.map(deal => deal.category))];

// Cấu trúc lại locations thành nhóm theo thành phố
const locationGroups = {
  "Hà Nội": {
    name: "Hà Nội",
    districts: [
      "Quận Cầu Giấy", "Quận Đống Đa", "Quận Ba Đình", "Quận Hoàn Kiếm", 
      "Quận Hai Bà Trưng", "Quận Long Biên", "Quận Thanh Xuân", 
      "Quận Hà Đông", "Quận Nam Từ Liêm", "Quận Bắc Từ Liêm"
    ]
  },
  "TP.HCM": {
    name: "TP. Hồ Chí Minh",
    districts: [
      "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 7", 
      "Quận 10", "Quận Bình Thạnh", "Quận Phú Nhuận", "Quận Gò Vấp", 
      "Quận Tân Bình", "Quận Tân Phú", "Quận Thủ Đức"
    ]
  },
  "Đà Nẵng": {
    name: "Đà Nẵng",
    districts: [
      "Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", 
      "Quận Ngũ Hành Sơn", "Quận Liên Chiểu", "Quận Cẩm Lệ"
    ]
  }
};

// Flatten locations for backward compatibility
const locations = Object.entries(locationGroups).flatMap(([city, data]) => 
  data.districts.map(district => `${district}, ${city}`)
);

const uniqueTags = categories; // Use categories as tags for filtering

// Additional filter options
const discountRanges = [
  { label: "Giảm 30% trở lên", value: "30+" },
  { label: "Giảm 40% trở lên", value: "40+" },
  { label: "Giảm 50% trở lên", value: "50+" }
];

const expiryRanges = [
  { label: "Hôm nay", value: "today" },
  { label: "24 giờ tới", value: "24h" },
  { label: "Tuần này", value: "week" }
];

const priceRanges = [
  { label: "Dưới 50k", value: "0-50" },
  { label: "50k - 100k", value: "50-100" },
  { label: "100k - 200k", value: "100-200" },
  { label: "200k - 500k", value: "200-500" },
  { label: "Trên 500k", value: "500+" }
];

const ratingRanges = [
  { label: "4.5⭐ trở lên", value: "4.5+" },
  { label: "4.0⭐ trở lên", value: "4.0+" },
  { label: "3.5⭐ trở lên", value: "3.5+" }
];

const sortOptions = [
  { label: "Giảm giá cao nhất", value: "discount" },
  { label: "Giá: Thấp đến cao", value: "price-low" },
  { label: "Giá: Cao đến thấp", value: "price-high" },
  { label: "Sắp hết hạn", value: "expiry" },
  { label: "Mới nhất", value: "newest" },
  { label: "Đánh giá cao nhất", value: "rating" }
];

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20
  }
};

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDiscountRanges, setSelectedDiscountRanges] = useState<string[]>([]);
  const [selectedExpiryRanges, setSelectedExpiryRanges] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatingRanges, setSelectedRatingRanges] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("discount");
  const [filteredDeals, setFilteredDeals] = useState(allDeals);
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const { user, isAuthenticated, updateUser } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    locations: true,
    price: true,
    discount: true,
    expiry: true,
    rating: true
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({
    "TP.HCM": false,
    "Hà Nội": false,
    "Đà Nẵng": false
  });
  const [showFiltersBadge, setShowFiltersBadge] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Handle favorite toggle
  const handleToggleFavorite = (deal: typeof allDeals[0], isFavorite: boolean) => {
    if (!isAuthenticated || !user) {
      toast.error("Đăng nhập để lưu ưu đãi", {
        description: "Hãy đăng nhập để lưu ưu đãi yêu thích của bạn"
      });
      return;
    }

    // Create a copy of user's favorites or initialize if it doesn't exist
    const updatedFavorites = user.favorites ? [...user.favorites] : [];
    
    if (isFavorite) {
      // Add to favorites
      if (!updatedFavorites.some(fav => fav.id === deal.id)) {
        updatedFavorites.push(deal);
      }
    } else {
      // Remove from favorites
      const index = updatedFavorites.findIndex(fav => fav.id === deal.id);
      if (index !== -1) {
        updatedFavorites.splice(index, 1);
      }
    }
    
    // Update user context with new favorites
    updateUser({
      ...user,
      favorites: updatedFavorites
    });
    
    // Show toast notification
    if (isFavorite) {
      toast.success("Đã thêm vào yêu thích", {
        description: `${deal.title} đã được thêm vào danh sách yêu thích của bạn`
      });
    } else {
      toast.error("Đã xóa khỏi yêu thích", {
        description: `${deal.title} đã được xóa khỏi danh sách yêu thích của bạn`
      });
    }
  };

  // Check if a deal is in user's favorites
  const isInFavorites = (dealId: string) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some(fav => fav.id === dealId);
  };

  // Scroll to top and animate entry
  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  // Toggle city expansion in location filter
  const toggleCity = (city: string) => {
    setExpandedCities(prev => ({
      ...prev,
      [city]: !prev[city]
    }));
  };

  // Toggle filter sidebar visibility
  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(prev => !prev);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = allDeals.filter(deal => {
      const matchesSearch = searchTerm === "" || 
                            deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            deal.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            deal.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.includes(deal.category);
      
      const matchesLocation = selectedLocations.length === 0 || 
                            selectedLocations.includes(deal.location);
      
      // Discount range filter
      const matchesDiscount = selectedDiscountRanges.length === 0 || 
                             selectedDiscountRanges.some(range => {
                               const minDiscount = parseInt(range.replace('+', ''));
                               return deal.discountPercent >= minDiscount;
                             });
      
      // Expiry range filter
      const matchesExpiry = selectedExpiryRanges.length === 0 || 
                           selectedExpiryRanges.some(range => {
                             if (range === "today") {
                               return deal.expiresIn.includes("hour") && parseInt(deal.expiresIn) <= 24;
                             } else if (range === "24h") {
                               return deal.expiresIn.includes("hour") && parseInt(deal.expiresIn) <= 24;
                             } else if (range === "week") {
                               if (deal.expiresIn.includes("day")) {
                                 return parseInt(deal.expiresIn) <= 7;
                               } else if (deal.expiresIn.includes("hour")) {
                                 return true;
                               }
                             }
                             return false;
                           });
      
      // Price range filter
      const matchesPrice = selectedPriceRanges.length === 0 ||
                          selectedPriceRanges.some(range => {
                            if (range === "0-50") {
                              return deal.discountPrice < 50000;
                            } else if (range === "50-100") {
                              return deal.discountPrice >= 50000 && deal.discountPrice < 100000;
                            } else if (range === "100-200") {
                              return deal.discountPrice >= 100000 && deal.discountPrice < 200000;
                            } else if (range === "200-500") {
                              return deal.discountPrice >= 200000 && deal.discountPrice < 500000;
                            } else if (range === "500+") {
                              return deal.discountPrice >= 500000;
                            }
                            return false;
                          });
      
      // Rating filter (mock implementation since we don't have ratings in the current data)
      const matchesRating = selectedRatingRanges.length === 0;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesDiscount && 
             matchesExpiry && matchesPrice && matchesRating;
    });
    
    // Apply sorting
    switch (sortOption) {
      case "discount":
        filtered = [...filtered].sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "expiry":
        filtered = [...filtered].sort((a, b) => {
          // Sort by hours for hour-based expiry
          if (a.expiresIn.includes("hour") && b.expiresIn.includes("hour")) {
            return parseInt(a.expiresIn) - parseInt(b.expiresIn);
          }
          // Sort by days for day-based expiry
          if (a.expiresIn.includes("day") && b.expiresIn.includes("day")) {
            return parseInt(a.expiresIn) - parseInt(b.expiresIn);
          }
          // Hours come before days
          if (a.expiresIn.includes("hour") && b.expiresIn.includes("day")) {
            return -1;
          }
          // Days come after hours
          if (a.expiresIn.includes("day") && b.expiresIn.includes("hour")) {
            return 1;
          }
          return 0;
        });
        break;
      case "newest":
        // In a real app, you would sort by date added
        filtered = [...filtered];
        break;
      case "rating":
        // In a real app, you would sort by rating
        filtered = [...filtered];
        break;
    }
    
    setFilteredDeals(filtered);

    // Update active filters count for badge
    const totalActiveFilters = 
      selectedCategories.length + 
      selectedLocations.length + 
      selectedDiscountRanges.length + 
      selectedExpiryRanges.length + 
      selectedPriceRanges.length + 
      selectedRatingRanges.length;

    setActiveFiltersCount(totalActiveFilters);
    setShowFiltersBadge(totalActiveFilters > 0);
    
  }, [searchTerm, selectedCategories, selectedLocations, selectedDiscountRanges, 
      selectedExpiryRanges, selectedPriceRanges, selectedRatingRanges, sortOption]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleDiscountRange = (range: string) => {
    setSelectedDiscountRanges(prev => 
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const toggleExpiryRange = (range: string) => {
    setSelectedExpiryRanges(prev => 
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const toggleRatingRange = (range: string) => {
    setSelectedRatingRanges(prev => 
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedDiscountRanges([]);
    setSelectedExpiryRanges([]);
    setSelectedPriceRanges([]);
    setSelectedRatingRanges([]);
    setSortOption("discount");
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Improved FilterComponents with groups and animations
  const FilterComponents = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-primary flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc
          {showFiltersBadge && (
            <Badge variant="default" className="bg-primary text-white ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
        {(searchTerm || 
          selectedCategories.length > 0 || 
          selectedLocations.length > 0 || 
          selectedDiscountRanges.length > 0 ||
          selectedExpiryRanges.length > 0 ||
          selectedPriceRanges.length > 0 ||
          selectedRatingRanges.length > 0) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="h-8 px-2 text-xs hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X className="h-3 w-3 mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>
                
      <div className="space-y-3">
        {/* Categories Section */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Danh Mục</span>
              {selectedCategories.length > 0 && (
                <Badge variant="default" className="ml-2 bg-primary text-white">
                  {selectedCategories.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
            {categories.map(category => (
              <motion.div 
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center"
              >
                <Button
                  variant="ghost"
                  className={`justify-start h-8 px-2 w-full text-left rounded-md transition-all ${
                    selectedCategories.includes(category) 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-primary/5"
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
                  
        {/* Locations Section - Grouped by City */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('locations')}
            className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Khu Vực</span>
              {selectedLocations.length > 0 && (
                <Badge variant="default" className="ml-2 bg-primary text-white">
                  {selectedLocations.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.locations ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.locations && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {Object.entries(locationGroups).map(([cityKey, cityData]) => (
                    <div key={cityKey} className="space-y-1">
                      <button
                        className="w-full flex items-center justify-between p-2 bg-primary/5 hover:bg-primary/10 transition-colors rounded-md"
                        onClick={() => toggleCity(cityKey)}
                      >
                        <span className="font-medium text-sm">{cityData.name}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${expandedCities[cityKey] ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedCities[cityKey] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex flex-col gap-1 ml-2">
                              {cityData.districts.map(district => {
                                const fullLocation = `${district}, ${cityKey}`;
                                return (
                                  <motion.div 
                                    key={district}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center"
              >
                <Button
                  variant="ghost"
                                      className={`justify-start h-7 px-2 w-full text-left rounded-md transition-all text-sm ${
                                        selectedLocations.includes(fullLocation) 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-primary/5"
                  }`}
                                      onClick={() => toggleLocation(fullLocation)}
                >
                                      {district}
                </Button>
              </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
            ))}
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Price Range Section */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center">
              <Store className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Khoảng Giá</span>
              {selectedPriceRanges.length > 0 && (
                <Badge variant="default" className="ml-2 bg-primary text-white">
                  {selectedPriceRanges.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map(range => (
                    <Badge
                      key={range.value}
                      variant={selectedPriceRanges.includes(range.value) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedPriceRanges.includes(range.value)
                          ? "bg-primary hover:bg-primary/90"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => togglePriceRange(range.value)}
                    >
                      {range.label}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Discount Range Section */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('discount')}
            className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center">
              <Percent className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Mức Giảm Giá</span>
              {selectedDiscountRanges.length > 0 && (
                <Badge variant="default" className="ml-2 bg-primary text-white">
                  {selectedDiscountRanges.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.discount ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.discount && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
          <div className="flex flex-wrap gap-2">
            {discountRanges.map(range => (
              <Badge
                key={range.value}
                variant={selectedDiscountRanges.includes(range.value) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedDiscountRanges.includes(range.value)
                          ? "bg-primary hover:bg-primary/90"
                          : "hover:bg-primary/10"
                      }`}
                onClick={() => toggleDiscountRange(range.value)}
              >
                {range.label}
              </Badge>
            ))}
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Expiry Range Section */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('expiry')}
            className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Thời Gian Hết Hạn</span>
              {selectedExpiryRanges.length > 0 && (
                <Badge variant="default" className="ml-2 bg-primary text-white">
                  {selectedExpiryRanges.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.expiry ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.expiry && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
          <div className="flex flex-wrap gap-2">
            {expiryRanges.map(range => (
              <Badge
                key={range.value}
                variant={selectedExpiryRanges.includes(range.value) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedExpiryRanges.includes(range.value)
                          ? "bg-primary hover:bg-primary/90"
                          : "hover:bg-primary/10"
                      }`}
                onClick={() => toggleExpiryRange(range.value)}
              >
                {range.label}
              </Badge>
            ))}
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
                  
        {/* Rating Range Section */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('rating')}
            className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Đánh Giá</span>
              {selectedRatingRanges.length > 0 && (
                <Badge variant="default" className="ml-2 bg-primary text-white">
                  {selectedRatingRanges.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.rating && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
                <div className="flex flex-wrap gap-2">
                  {ratingRanges.map(range => (
                    <Badge
                      key={range.value}
                      variant={selectedRatingRanges.includes(range.value) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedRatingRanges.includes(range.value)
                          ? "bg-primary hover:bg-primary/90"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => toggleRatingRange(range.value)}
                    >
                      {range.label}
                </Badge>
              ))}
            </div>
              </motion.div>
        )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  // Compact Filter Icon Component
  const CompactFilterIcon = () => (
    <motion.button
      onClick={toggleFilterSidebar}
      className="fixed left-4 top-24 z-30 bg-primary text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <SlidersHorizontal className="h-5 w-5" />
      {showFiltersBadge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
        >
          {activeFiltersCount}
        </motion.div>
      )}
    </motion.button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main 
          className="flex-grow pt-24"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {/* Hero Section with Enhanced Background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-b from-primary/10 to-background py-16 mb-8 overflow-hidden"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,128,0,0.08),transparent_60%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,128,0,0.05),transparent_70%)]"></div>
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <Container>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                >
                  Khám phá ưu đãi mới
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Khám Phá Ưu Đãi Thực Phẩm
                </h1>
                
                <p className="text-muted-foreground mx-auto max-w-2xl mb-8 text-lg">
                  Cứu thực phẩm vẫn còn tốt từ việc trở thành rác thải và tận hưởng ưu đãi lên đến 50% từ các cửa hàng đối tác trên khắp Việt Nam
                </p>
                
                {/* Enhanced filter badges */}
                <motion.div 
                  className="flex flex-wrap justify-center gap-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span>Giảm tới 50%</span>
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Hạn dùng hôm nay</span>
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Gần bạn</span>
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>Bánh mới làm</span>
                  </Badge>
                </motion.div>
                
                {/* Enhanced search bar */}
                <motion.div 
                  className="relative max-w-xl mx-auto hidden sm:block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Tìm kiếm theo tên sản phẩm, cửa hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 h-12 text-base rounded-full border-primary/20 shadow-sm focus:border-primary transition-all duration-300"
                  />
                  <Button 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-10 transition-all duration-300 hover:scale-105"
                    size="sm"
                  >
                    Tìm kiếm
                  </Button>
                </motion.div>
                
                {/* Animated scroll indicator */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex justify-center mt-12"
                >
                  <motion.div
                    animate={{
                      y: [0, 10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ChevronDown className="h-8 w-8 text-primary opacity-70" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </Container>
          </motion.div>

          {/* Main Content */}
          <Container>
            <motion.div 
              className="flex flex-col lg:flex-row gap-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Compact Filter Icon - Shows when sidebar is collapsed */}
              {!isFilterSidebarOpen && <CompactFilterIcon />}
              
              {/* Desktop Filters - Collapsible */}
              <AnimatePresence mode="wait">
                {isFilterSidebarOpen && (
              <motion.div 
                    key="filter-sidebar"
                    initial={{ opacity: 0, width: 0, x: -50 }}
                    animate={{ opacity: 1, width: "18rem", x: 0 }}
                    exit={{ opacity: 0, width: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start"
                  >
                    <div className="bg-white rounded-lg border shadow-sm p-5 relative">
                      {/* Toggle button */}
                      <motion.button
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1 rounded-full shadow-md hover:shadow-lg transition-all"
                        onClick={toggleFilterSidebar}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronDown className="h-4 w-4 rotate-90" />
                      </motion.button>
                      
                  <FilterComponents />
                </div>
              </motion.div>
                )}
              </AnimatePresence>
              
              {/* Deals Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-grow"
                style={{ width: isFilterSidebarOpen ? "calc(100% - 18rem)" : "100%" }}
              >
                <div className="mb-6 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-muted-foreground text-sm"
                  >
                    Hiển thị <span className="font-medium text-primary">{filteredDeals.length}</span> kết quả
                  </motion.p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sắp xếp theo:</span>
                    <select 
                      className="bg-white border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {filteredDeals.length > 0 ? (
                    <motion.div 
                      key="deals-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {filteredDeals.map((deal, index) => (
                        <motion.div
                          key={deal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ 
                            y: -5, 
                            transition: { duration: 0.2 } 
                          }}
                        >
                          <DealCard
                            {...deal}
                            isFavorite={isInFavorites(deal.id)}
                            onFavoriteToggle={(isFav) => handleToggleFavorite(deal, isFav)}
                            className="h-full transition-shadow hover:shadow-md"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="no-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-16 bg-white rounded-lg shadow-sm"
                    >
                      <div className="mb-4 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto opacity-20" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Không tìm thấy ưu đãi nào</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn để xem các ưu đãi khác.
                      </p>
                      <Button 
                        variant="outline" 
                        className="hover:bg-primary/5" 
                        onClick={clearFilters}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Xóa Tất Cả Bộ Lọc
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Load more button */}
                {filteredDeals.length > 0 && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center"
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-8 border-primary/20 text-primary hover:bg-primary/5"
                    >
                      Xem thêm ưu đãi
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </Container>
        </motion.main>
      </AnimatePresence>
      
      <Footer />

      {/* Mobile filter button */}
      {!isDesktop && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="sticky top-16 z-10 bg-white border-b shadow-sm p-2"
        >
          <Drawer open={openMobileFilters} onOpenChange={setOpenMobileFilters}>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc & Tìm kiếm
                </div>
                {(selectedCategories.length > 0 || selectedLocations.length > 0) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2"
                  >
                    <Badge className="bg-primary text-white">
                      {selectedCategories.length + selectedLocations.length}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-4 pb-4">
              <DrawerHeader>
                <DrawerTitle className="text-center text-lg font-semibold text-primary">Bộ lọc ưu đãi</DrawerTitle>
                <DrawerDescription className="text-center">
                  Tùy chỉnh tìm kiếm để tìm các ưu đãi phù hợp với bạn
                </DrawerDescription>
              </DrawerHeader>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="px-1"
              >
                <FilterComponents />
              </motion.div>
              
              <DrawerFooter className="pt-2">
                <Button 
                  onClick={() => setOpenMobileFilters(false)} 
                  className="w-full hover:bg-primary/90 transition-colors"
                >
                  Xem {filteredDeals.length} kết quả
                </Button>
                <DrawerClose asChild>
                  <Button 
                    variant="outline" 
                    className="hover:bg-primary/5 transition-colors"
                  >
                    Hủy
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </motion.div>
      )}

      {/* Mobile search bar */}
      {!isDesktop && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sticky top-24 z-10 bg-white border-b shadow-sm p-2"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm ưu đãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 h-10 text-sm rounded-full border-primary/20 shadow-sm focus:border-primary transition-all duration-300"
            />
          </div>
        </motion.div>
      )}

      {/* Mobile sort button */}
      {!isDesktop && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="sticky top-32 z-10 bg-white border-b shadow-sm p-2"
        >
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            onClick={() => setOpenMobileFilters(true)}
          >
            <ArrowDownAZ className="h-4 w-4" />
            Sắp xếp theo: {sortOption === 'discount' ? 'Giảm giá cao nhất' : 
                          sortOption === 'price-low' ? 'Giá: Thấp đến cao' :
                          sortOption === 'price-high' ? 'Giá: Cao đến thấp' :
                          'Sắp hết hạn'}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Deals;
