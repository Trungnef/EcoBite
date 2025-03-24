import { useState, useEffect } from "react";
import { DealCard } from "@/components/DealCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Organic Strawberries",
    category: "produce",
    originalPrice: 45000,
    discountPrice: 25000,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    quantity: 10,
    image: "/images/strawberries.jpg",
    storeName: "Fresh Market",
    storeLocation: "District 1",
  },
  {
    id: "2",
    name: "Whole Grain Bread",
    category: "bakery",
    originalPrice: 35000,
    discountPrice: 20000,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    quantity: 5,
    image: "/images/bread.jpg",
    storeName: "Family Bakery",
    storeLocation: "District 2",
  },
  {
    id: "3",
    name: "Greek Yogurt",
    category: "dairy",
    originalPrice: 30000,
    discountPrice: 15000,
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    quantity: 8,
    image: "/images/yogurt.jpg",
    storeName: "Healthy Foods",
    storeLocation: "District 1",
  },
  {
    id: "4",
    name: "Prawn Fried Rice",
    category: "prepared",
    originalPrice: 60000,
    discountPrice: 30000,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    quantity: 3,
    image: "/images/fried-rice.jpg",
    storeName: "Quick Meal",
    storeLocation: "District 3",
  },
  {
    id: "5",
    name: "Orange Juice",
    category: "beverages",
    originalPrice: 25000,
    discountPrice: 15000,
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    quantity: 12,
    image: "/images/orange-juice.jpg",
    storeName: "Fresh Market",
    storeLocation: "District 1",
  },
  {
    id: "6",
    name: "Chocolate Cake",
    category: "bakery",
    originalPrice: 120000,
    discountPrice: 70000,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    quantity: 2,
    image: "/images/chocolate-cake.jpg",
    storeName: "Sweet Treats",
    storeLocation: "District 7",
  },
  {
    id: "7",
    name: "Chicken Salad",
    category: "prepared",
    originalPrice: 50000,
    discountPrice: 35000,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    quantity: 4,
    image: "/images/chicken-salad.jpg",
    storeName: "Healthy Foods",
    storeLocation: "District 1",
  },
  {
    id: "8",
    name: "Bananas (Bundle)",
    category: "produce",
    originalPrice: 15000,
    discountPrice: 10000,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    quantity: 15,
    image: "/images/bananas.jpg",
    storeName: "Fresh Market",
    storeLocation: "District 1",
  },
];

const categories = [
  { value: "produce", label: "Fresh Produce" },
  { value: "bakery", label: "Bakery" },
  { value: "dairy", label: "Dairy & Eggs" },
  { value: "meat", label: "Meat & Seafood" },
  { value: "pantry", label: "Pantry & Dry Goods" },
  { value: "beverages", label: "Beverages" },
  { value: "snacks", label: "Snacks & Sweets" },
  { value: "prepared", label: "Prepared Foods" },
  { value: "frozen", label: "Frozen Foods" },
];

const districts = [
  { value: "district-1", label: "District 1" },
  { value: "district-2", label: "District 2" },
  { value: "district-3", label: "District 3" },
  { value: "district-5", label: "District 5" },
  { value: "district-7", label: "District 7" },
  { value: "binh-thanh", label: "Binh Thanh" },
  { value: "tan-binh", label: "Tan Binh" },
];

type ProductGridProps = {
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  showFilters?: boolean;
  initialSearchTerm?: string;
  initialCategory?: string;
  productCountCallback?: (count: number) => void;
};

export function ProductGrid({
  title = "All Products",
  subtitle = "Browse our discounted products near expiration",
  showTitle = true,
  showFilters = true,
  initialSearchTerm = "",
  initialCategory = "",
  productCountCallback,
}: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [discountMin, setDiscountMin] = useState(0);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("expiry-asc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter products based on criteria
  const filteredProducts = mockProducts.filter((product) => {
    // Search term filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Price range filter
    if (
      product.discountPrice < priceRange[0] || 
      product.discountPrice > priceRange[1]
    ) {
      return false;
    }
    
    // Discount percentage filter
    const discountPercentage = ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100;
    if (discountPercentage < discountMin) {
      return false;
    }
    
    // District filter
    if (
      selectedDistricts.length > 0 && 
      !selectedDistricts.includes(product.storeLocation.toLowerCase().replace(" ", "-"))
    ) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.discountPrice - b.discountPrice;
      case "price-desc":
        return b.discountPrice - a.discountPrice;
      case "discount-desc":
        const discountA = ((a.originalPrice - a.discountPrice) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.discountPrice) / b.originalPrice) * 100;
        return discountB - discountA;
      case "expiry-asc":
        return a.expiryDate.getTime() - b.expiryDate.getTime();
      default:
        return 0;
    }
  });
  
  useEffect(() => {
    if (productCountCallback) {
      productCountCallback(sortedProducts.length);
    }
  }, [sortedProducts.length, productCountCallback]);
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => 
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const handleDistrictToggle = (district: string) => {
    setSelectedDistricts((prev) => 
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, 200000]);
    setDiscountMin(0);
    setSelectedDistricts([]);
    setSortOption("expiry-asc");
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      )}
      
      {showFilters && (
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
          <div className="flex-1 w-full lg:max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1.5 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Select
              value={sortOption}
              onValueChange={setSortOption}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiry-asc">Expiring Soon</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="discount-desc">Biggest Discount</SelectItem>
              </SelectContent>
            </Select>
            
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {(selectedCategories.length > 0 || selectedDistricts.length > 0 || discountMin > 0) && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedCategories.length + selectedDistricts.length + (discountMin > 0 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down products based on your preferences
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <Accordion type="single" collapsible defaultValue="category" className="w-full">
                    <AccordionItem value="category">
                      <AccordionTrigger>Categories</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`category-${category.value}`} 
                                checked={selectedCategories.includes(category.value)}
                                onCheckedChange={() => handleCategoryToggle(category.value)}
                              />
                              <label
                                htmlFor={`category-${category.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="price">
                      <AccordionTrigger>Price Range</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="pt-4">
                          <Slider
                            value={priceRange}
                            min={0}
                            max={200000}
                            step={5000}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">{priceRange[0].toLocaleString()}₫</p>
                          <p className="text-sm">{priceRange[1].toLocaleString()}₫</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="discount">
                      <AccordionTrigger>Minimum Discount</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="pt-4">
                          <Slider
                            value={[discountMin]}
                            min={0}
                            max={90}
                            step={10}
                            onValueChange={(value) => setDiscountMin(value[0])}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">0%</p>
                          <p className="text-sm font-medium">{discountMin}% or more</p>
                          <p className="text-sm">90%</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="location">
                      <AccordionTrigger>Location</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {districts.map((district) => (
                            <div key={district.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`district-${district.value}`} 
                                checked={selectedDistricts.includes(district.value)}
                                onCheckedChange={() => handleDistrictToggle(district.value)}
                              />
                              <label
                                htmlFor={`district-${district.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {district.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <SheetFooter className="sm:justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full sm:w-auto"
                  >
                    Reset Filters
                  </Button>
                  <SheetClose asChild>
                    <Button className="w-full sm:w-auto">
                      View {sortedProducts.length} Products
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
      
      {/* Active filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategories.map((category) => {
            const categoryLabel = categories.find((c) => c.value === category)?.label;
            return (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {categoryLabel}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleCategoryToggle(category)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {categoryLabel}</span>
                </Button>
              </Badge>
            );
          })}
          
          {selectedDistricts.map((district) => {
            const districtLabel = districts.find((d) => d.value === district)?.label;
            return (
              <Badge key={district} variant="secondary" className="flex items-center gap-1">
                {districtLabel}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleDistrictToggle(district)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {districtLabel}</span>
                </Button>
              </Badge>
            );
          })}
          
          {discountMin > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {discountMin}%+ Off
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setDiscountMin(0)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove discount filter</span>
              </Button>
            </Badge>
          )}
          
          {(selectedCategories.length > 0 || selectedDistricts.length > 0 || discountMin > 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
      
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            // Calculate discount percentage
            const discountPercent = Math.round(
              ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
            );
            
            // Calculate expiration time
            const now = new Date();
            const diffTime = product.expiryDate.getTime() - now.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            let expiresIn = "";
            if (diffDays > 0) {
              expiresIn = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
            } else {
              expiresIn = `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
            }
            
            return (
              <DealCard
                key={product.id}
                id={product.id}
                title={product.name}
                store={product.storeName}
                storeImg="/placeholder-store.jpg"
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice}
                discountPercent={discountPercent}
                image={product.image || '/placeholder-product.jpg'}
                expiresIn={expiresIn}
                category={product.category}
                expiryDate={product.expiryDate.toISOString()}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {searchTerm 
              ? `We couldn't find any products matching "${searchTerm}". Try adjusting your search or filters.`
              : "No products match your current filters. Try changing or clearing some filters."}
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
} 