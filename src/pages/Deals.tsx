import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { DealCard } from "@/components/DealCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X } from "lucide-react";

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
  }
];

const categories = Array.from(new Set(allDeals.map(deal => deal.category)));

const Deals = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 400000]);
  const [filteredDeals, setFilteredDeals] = useState(allDeals);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const filtered = allDeals.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            deal.store.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.includes(deal.category);
      
      const matchesPrice = deal.discountPrice >= priceRange[0] && 
                          deal.discountPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    
    setFilteredDeals(filtered);
  }, [searchTerm, selectedCategories, priceRange]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, 400000]);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Khám Phá Tất Cả Ưu Đãi</h1>
            <p className="text-muted-foreground">
              Tìm kiếm các ưu đãi giảm giá tuyệt vời cho thực phẩm chất lượng cao từ các cửa hàng đối tác trên khắp Việt Nam
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Bộ lọc - Di động */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <div className="relative w-full mr-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm ưu đãi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex-shrink-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {isFiltersOpen && (
              <div className="lg:hidden bg-white rounded-lg border p-4 mb-4 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Bộ lọc</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                    Xóa tất cả
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Danh Mục</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Badge
                          key={category}
                          variant={selectedCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Khoảng Giá</h4>
                    <Slider
                      defaultValue={priceRange}
                      max={400000}
                      step={10000}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                      <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => setIsFiltersOpen(false)}>
                  Áp dụng bộ lọc
                </Button>
              </div>
            )}
            
            {/* Bộ lọc - Máy tính */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-lg border p-6 sticky top-24">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm ưu đãi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Bộ lọc</h3>
                  {(searchTerm || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 400000) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Xóa tất cả
                    </Button>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Danh Mục</h4>
                    <div className="flex flex-col gap-2">
                      {categories.map(category => (
                        <div 
                          key={category}
                          className="flex items-center"
                        >
                          <Button
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
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Khoảng Giá</h4>
                    <Slider
                      defaultValue={priceRange}
                      max={400000}
                      step={10000}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                      <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lưới Ưu Đãi */}
            <div className="flex-grow">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Hiển thị <span className="font-medium text-foreground">{filteredDeals.length}</span> kết quả
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sắp xếp theo:</span>
                  <select className="bg-white border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="discount">Giảm giá cao nhất</option>
                    <option value="price-low">Giá: Thấp đến cao</option>
                    <option value="price-high">Giá: Cao đến thấp</option>
                    <option value="expiry">Sắp hết hạn</option>
                  </select>
                </div>
              </div>
              
              {filteredDeals.length > 0 ? (
                <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {filteredDeals.map((deal, index) => (
                    <DealCard
                      key={deal.id}
                      {...deal}
                      className="opacity-0 animate-fade-in-up"
                      style={{ 
                        animationDelay: `${100 * index}ms`, 
                        animationFillMode: 'forwards' 
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 animate-fade-in">
                  <div className="mb-4 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto opacity-20" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy ưu đãi nào</h3>
                  <p className="text-muted-foreground">
                    Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Xóa Tất Cả Bộ Lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Deals;
