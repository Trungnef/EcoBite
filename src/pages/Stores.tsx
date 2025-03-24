import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { StoreCard } from "@/components/StoreCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Store, X, Map, Grid3X3, Star, TrendingUp, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Sample data - expanded from the PartnerStores component
const allStores = [
  {
    id: "1",
    name: "Green Organic Market",
    logo: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800",
    location: "District 1, Ho Chi Minh City",
    dealCount: 12,
    category: "Organic Market",
    openingHours: "8:00 AM - 10:00 PM",
    isVerified: true,
    rating: 4.7,
    reviewCount: 128,
    isFeatured: true
  },
  {
    id: "2",
    name: "Breadly Bakery",
    logo: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=800",
    location: "Ba Dinh District, Hanoi",
    dealCount: 8,
    category: "Bakery",
    openingHours: "7:00 AM - 8:00 PM",
    isVerified: true,
    rating: 4.5,
    reviewCount: 87,
    isFeatured: true
  },
  {
    id: "3",
    name: "Fresh Farm Groceries",
    logo: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800",
    location: "Hai Chau District, Da Nang",
    dealCount: 10,
    category: "Supermarket",
    openingHours: "8:30 AM - 9:30 PM",
    isVerified: false,
    rating: 4.2,
    reviewCount: 56
  },
  {
    id: "4",
    name: "Urban Kitchen",
    logo: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800",
    location: "Thu Duc City, Ho Chi Minh City",
    dealCount: 15,
    category: "Restaurant",
    openingHours: "10:00 AM - 9:00 PM",
    isVerified: true,
    rating: 4.8,
    reviewCount: 143,
    isFeatured: true
  },
  {
    id: "5",
    name: "Bean Palace",
    logo: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?q=80&w=800",
    location: "Hoan Kiem District, Hanoi",
    dealCount: 6,
    category: "Cafe",
    openingHours: "7:00 AM - 11:00 PM",
    isVerified: true,
    rating: 4.3,
    reviewCount: 92
  },
  {
    id: "6",
    name: "Gourmet Deli",
    logo: "https://images.unsplash.com/photo-1579551053957-ee77f9b970c7?q=80&w=150",
    coverImage: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=800",
    location: "District 3, Ho Chi Minh City",
    dealCount: 9,
    category: "Delicatessen",
    openingHours: "9:00 AM - 8:00 PM",
    isVerified: true,
    rating: 4.6,
    reviewCount: 78
  }
];

const cities = ["Ho Chi Minh City", "Hanoi", "Da Nang"];
const categories = Array.from(new Set(allStores.map(store => store.category)));
const sortOptions = [
  { value: "deals", label: "Nhiều Ưu Đãi Nhất" },
  { value: "name", label: "Tên: A đến Z" },
  { value: "rating", label: "Đánh Giá Cao Nhất" },
  { value: "popular", label: "Phổ Biến Nhất" }
];

interface FilterComponentsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCities: string[];
  selectedCategories: string[];
  showOnlyVerified: boolean;
  minRating: number;
  clearFilters: () => void;
  toggleCity: (city: string) => void;
  toggleCategory: (category: string) => void;
  setShowOnlyVerified: (value: boolean) => void;
  setMinRating: (value: number) => void;
}

const FilterComponents = ({
  searchTerm,
  setSearchTerm,
  selectedCities,
  selectedCategories,
  showOnlyVerified,
  minRating,
  clearFilters,
  toggleCity,
  toggleCategory,
  setShowOnlyVerified,
  setMinRating
}: FilterComponentsProps) => {
  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm cửa hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Bộ lọc</h3>
        {(searchTerm || selectedCities.length > 0 || selectedCategories.length > 0 || showOnlyVerified || minRating > 0) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
            <X className="h-3 w-3 mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
            <h4 className="text-sm font-medium mb-2">Thành phố</h4>
          </div>
          <div className="flex flex-col gap-2">
            {cities.map(city => (
              <Button
                key={city}
                variant="ghost"
                className={`justify-start h-8 px-2 w-full text-left ${
                  selectedCities.includes(city) 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground"
                }`}
                onClick={() => toggleCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Danh mục</h4>
          <div className="flex flex-col gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant="ghost"
                className={`justify-start h-8 px-2 w-full text-left ${
                  selectedCategories.includes(category) 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground"
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Đánh giá tối thiểu</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {[0, 3, 3.5, 4, 4.5].map(rating => (
              <Badge
                key={rating}
                variant={minRating === rating ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setMinRating(rating)}
              >
                <div className="flex items-center gap-1">
                  <Star className={cn("h-4 w-4", minRating >= rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
                  <span>{rating > 0 ? rating : "Tất cả"}</span>
                </div>
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="verified-filter"
            checked={showOnlyVerified}
            onCheckedChange={() => setShowOnlyVerified(!showOnlyVerified)}
          />
          <Label htmlFor="verified-filter" className="ml-2 text-sm cursor-pointer">
            Chỉ hiển thị cửa hàng đã xác minh
          </Label>
        </div>
      </div>
    </>
  );
};

const Stores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredStores, setFilteredStores] = useState(allStores);
  const [featuredStores, setFeaturedStores] = useState(allStores.filter(store => store.isFeatured));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("deals");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let filtered = allStores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCities.length === 0 || 
                         cities.some(city => 
                           selectedCities.includes(city) && store.location.includes(city)
                         );
      
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(store.category);
      
      const matchesVerification = !showOnlyVerified || store.isVerified;
      
      const matchesRating = store.rating && store.rating >= minRating;
      
      return matchesSearch && matchesCity && matchesCategory && matchesVerification && matchesRating;
    });
    
    // Sort stores
    filtered = sortStoresList(filtered, sortBy);
    
    setFilteredStores(filtered);
  }, [searchTerm, selectedCities, selectedCategories, sortBy, showOnlyVerified, minRating]);

  const sortStoresList = (stores: typeof allStores, sortOption: string) => {
    switch (sortOption) {
      case "deals":
        return [...stores].sort((a, b) => b.dealCount - a.dealCount);
      case "name":
        return [...stores].sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return [...stores].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "popular":
        return [...stores].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      default:
        return stores;
    }
  };

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCities([]);
    setSelectedCategories([]);
    setShowOnlyVerified(false);
    setMinRating(0);
  };

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
                  Khám phá cửa hàng đối tác
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Cửa Hàng Đối Tác
                </h1>
                
                <p className="text-muted-foreground mx-auto max-w-2xl mb-8 text-lg">
                  Khám phá mạng lưới cửa hàng và siêu thị đối tác của chúng tôi trên khắp Việt Nam
                </p>
                
                {/* Enhanced search bar */}
                <motion.div 
                  className="relative max-w-xl mx-auto hidden sm:block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Tìm kiếm cửa hàng..."
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
              className="flex flex-col lg:flex-row gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Desktop Filters */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:block w-72 flex-shrink-0"
              >
                <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-24">
                  <FilterComponents 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCities={selectedCities}
                    selectedCategories={selectedCategories}
                    showOnlyVerified={showOnlyVerified}
                    minRating={minRating}
                    clearFilters={clearFilters}
                    toggleCity={toggleCity}
                    toggleCategory={toggleCategory}
                    setShowOnlyVerified={setShowOnlyVerified}
                    setMinRating={setMinRating}
                  />
                </div>
              </motion.div>
              
              {/* Stores Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-grow"
              >
                <div className="mb-6 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-muted-foreground text-sm"
                  >
                    Hiển thị <span className="font-medium text-primary">{filteredStores.length}</span> kết quả
                  </motion.p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sắp xếp theo:</span>
                    <select 
                      className="bg-white border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {filteredStores.length > 0 ? (
                    <motion.div 
                      key="stores-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {filteredStores.map((store, index) => (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ 
                            y: -5, 
                            transition: { duration: 0.2 } 
                          }}
                        >
                          <StoreCard
                            {...store}
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
                        <Store className="h-12 w-12 mx-auto opacity-20" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Không tìm thấy cửa hàng nào</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn để xem các cửa hàng khác.
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
                {filteredStores.length > 0 && !isLoading && (
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
                      Xem thêm cửa hàng
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </Container>
        </motion.main>
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default Stores;
