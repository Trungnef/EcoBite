import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StoreProductList } from "@/components/StoreProductList";
import { 
  Upload, 
  Save, 
  Camera, 
  Barcode, 
  Filter, 
  Search, 
  Calendar, 
  Tag, 
  ShoppingBag, 
  Package,
  Trash2,
  Eye,
  Edit,
  ChevronDown,
  Plus,
  AlertCircle,
  FileText,
  Image,
  X,
  Info,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroup as UIRadioGroup } from "@/components/ui/radio-group";

// Define the Product interface to match our usage throughout the component
interface Product {
  id: string;
  name: string;
  category: string;
  originalPrice: number | null;
  salePrice: number | null;
  expiryDate: string;
  manufacturingDate?: string;
  quantity: number;
  image?: string;
  description?: string;
  barcode?: string;
  productStatus?: string;
  tags?: string[];
}

// Define the ProductForm interface for the form state
interface ProductForm {
  id?: string;
  name: string;
  category: string;
  originalPrice: number | null;
  salePrice: number | null;
  expiryDate: string;
  manufacturingDate: string;
  quantity: number | null;
  imageUrl: string;
  description: string;
  barcode: string;
  productStatus?: string;
  tags?: string[];
}

// Category labels for dropdown
const categoryLabels: Record<string, string> = {
  "thuc-pham": "Thực phẩm",
  "do-uong": "Đồ uống",
  "rau-cu": "Rau củ quả",
  "trai-cay": "Trái cây",
  "dong-lanh": "Thực phẩm đông lạnh",
  "banh-keo": "Bánh kẹo",
  "sua": "Sữa & Sản phẩm từ sữa"
};

// Helper functions
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Mock data for demonstration
const generateMockProducts = (): Product[] => {
  return [
    {
      id: "1",
      name: "Dưa lưới Nhật Bản",
      category: "trai-cay",
      originalPrice: 120000,
      salePrice: 85000,
      expiryDate: "2025-06-30",
      manufacturingDate: "2025-06-20",
      quantity: 15,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      description: "Dưa lưới Nhật Bản ngọt, thơm, chất lượng cao",
      barcode: "8936086726001",
      productStatus: "active",
      tags: ["Ngon", "Rẻ"]
    },
    {
      id: "2",
      name: "Sữa chua vị dâu",
      category: "sua",
      originalPrice: 35000,
      salePrice: 25000,
      expiryDate: "2025-06-25",
      manufacturingDate: "2025-06-15",
      quantity: 30,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      description: "Sữa chua vị dâu, giàu men vi sinh tốt cho tiêu hóa",
      barcode: "8934673579018",
      productStatus: "active",
      tags: ["Sắp hết hạn"]
    },
    {
      id: "3",
      name: "Bánh mì sandwich",
      category: "thuc-pham",
      originalPrice: 45000,
      salePrice: 30000,
      expiryDate: "2025-06-23",
      manufacturingDate: "2025-06-21",
      quantity: 10,
      description: "Bánh mì sandwich mềm, vẫn tươi và giữ được độ mềm, vẫn rất ngon",
      barcode: "8935036722508",
      productStatus: "promotion",
      tags: ["Sắp hết hạn", "Rẻ"]
    },
    {
      id: "4",
      name: "Nước ép cam nguyên chất",
      category: "do-uong",
      originalPrice: 55000,
      salePrice: 40000,
      expiryDate: "2025-06-24",
      manufacturingDate: "2025-06-22",
      quantity: 8,
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      description: "Nước ép cam tươi ép 100%, không đường, không chất bảo quản",
      barcode: "8936024599564",
      productStatus: "hidden",
      tags: ["Ngon", "Hữu cơ"]
    },
    {
      id: "5",
      name: "Rau cải thìa hữu cơ",
      category: "rau-cu",
      originalPrice: 25000,
      salePrice: 18000,
      expiryDate: "2025-06-26",
      manufacturingDate: "2025-06-24",
      quantity: 20,
      description: "Rau cải thìa hữu cơ tươi ngon, trồng theo phương pháp hữu cơ, không thuốc trừ sâu",
      barcode: "8936181699002",
      productStatus: "active",
      tags: ["Hữu cơ", "Rẻ"]
    }
  ];
};

export function StoreDashboardProducts() {
  const navigate = useNavigate();
  
  // Initialize product form with proper defaults
  const initialProductForm: ProductForm = {
    name: '',
    category: '',
    originalPrice: null,
    salePrice: null,
    expiryDate: '',
    manufacturingDate: '',
    quantity: null,
    imageUrl: '',
    description: '',
    barcode: '',
    productStatus: 'active',
    tags: []
  };

  // State management
  const [activeTab, setActiveTab] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showExpiring, setShowExpiring] = useState<boolean>(false);
  const [bulkUploadMode, setBulkUploadMode] = useState<boolean>(false);
  const [barcodeScanning, setBarcodeScanning] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(generateMockProducts());
  const [productForm, setProductForm] = useState<ProductForm>(initialProductForm);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  // Filter products based on search and category
  const filteredProducts = products
    .filter(product => {
      // Text search
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !(product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== "all" && product.category !== categoryFilter) {
        return false;
      }
      
      // Expiry filter (when toggled)
      if (showExpiring) {
        const expiryDate = new Date(product.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 7;
      }
      
      return true;
    });

  // Handle barcode scanning
  const toggleBarcodeScanning = () => {
    setBarcodeScanning(!barcodeScanning);
  };

  // Handle saving/updating product
  const handleSaveProduct = () => {
    // Validation (simple example)
    if (!productForm.name || !productForm.category || !productForm.expiryDate) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    if (productForm.id) {
      // Update existing product
      const updatedProducts = products.map(product => 
        product.id === productForm.id ? {
          ...product,
          name: productForm.name,
          category: productForm.category,
          originalPrice: productForm.originalPrice,
          salePrice: productForm.salePrice,
          expiryDate: productForm.expiryDate,
          manufacturingDate: productForm.manufacturingDate,
          quantity: productForm.quantity || 0,
          description: productForm.description,
          barcode: productForm.barcode,
          productStatus: productForm.productStatus,
          tags: productForm.tags,
          image: productForm.imageUrl
        } : product
      );
      setProducts(updatedProducts);
      toast.success("Cập nhật sản phẩm thành công");
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productForm.name,
        category: productForm.category,
        originalPrice: productForm.originalPrice,
        salePrice: productForm.salePrice,
        expiryDate: productForm.expiryDate,
        manufacturingDate: productForm.manufacturingDate,
        quantity: productForm.quantity || 0,
        description: productForm.description,
        barcode: productForm.barcode,
        productStatus: productForm.productStatus,
        tags: productForm.tags,
        image: productForm.imageUrl
      };
      setProducts([...products, newProduct]);
      toast.success("Thêm sản phẩm thành công");
    }

    // Reset form and switch to product list
    resetForm();
    setActiveTab("list");
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      expiryDate: product.expiryDate,
      manufacturingDate: product.manufacturingDate || '',
      quantity: product.quantity,
      imageUrl: product.image || '',
      description: product.description || '',
      barcode: product.barcode || '',
      productStatus: product.productStatus || 'active',
      tags: product.tags || []
    });
    setEditDialogOpen(true);
  };

  // Handle edit product save
  const handleEditProductSave = () => {
    if (!productForm.name || !productForm.category || !productForm.expiryDate) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    // Update existing product
    const updatedProducts = products.map(product => 
      product.id === productForm.id ? {
        ...product,
        name: productForm.name,
        category: productForm.category,
        originalPrice: productForm.originalPrice,
        salePrice: productForm.salePrice,
        expiryDate: productForm.expiryDate,
        manufacturingDate: productForm.manufacturingDate,
        quantity: productForm.quantity || 0,
        description: productForm.description,
        barcode: productForm.barcode,
        productStatus: productForm.productStatus,
        tags: productForm.tags,
        image: productForm.imageUrl
      } : product
    );
    setProducts(updatedProducts);
    toast.success("Cập nhật sản phẩm thành công");
    setEditDialogOpen(false);
  };

  // Handle delete product
  const handleDeleteProduct = () => {
    if (selectedProductId) {
      setProducts(products.filter(product => product.id !== selectedProductId));
      setDeleteDialogOpen(false);
      toast.success("Xóa sản phẩm thành công");
    }
  };

  // Reset form
  const resetForm = () => {
    setProductForm(initialProductForm);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({...productForm, imageUrl: reader.result as string});
      };
      reader.readAsDataURL(file);
      toast.success("Đã tải ảnh sản phẩm thành công!");
    }
  };

  const getExpiryStatus = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysUntilExpiry = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 1) {
      return "critical";
    } else if (daysUntilExpiry <= 3) {
      return "warning";
    } else {
      return "normal";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
          <div>
            <h2 className="text-xl font-semibold">Quản lý sản phẩm</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Thêm, chỉnh sửa và quản lý sản phẩm trong cửa hàng của bạn
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-9 h-9 w-full md:w-[250px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Lọc</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  Tất cả sản phẩm
                </DropdownMenuItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <DropdownMenuItem 
                    key={value} 
                    onClick={() => setCategoryFilter(value)}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
                <Separator className="my-1" />
                <DropdownMenuItem onClick={() => setShowExpiring(!showExpiring)}>
                  {showExpiring ? "✓ " : ""} Hiển thị sản phẩm sắp hết hạn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <TabsList className="h-9">
              <TabsTrigger value="upload" className="text-xs px-3">
                <Upload className="h-3.5 w-3.5 mr-2" />
                Thêm sản phẩm
              </TabsTrigger>
              <TabsTrigger value="list" className="text-xs px-3">
                <Package className="h-3.5 w-3.5 mr-2" />
                Danh sách
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="upload">
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <Info className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Hướng dẫn đăng sản phẩm</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Tất cả sản phẩm phải đảm bảo an toàn thực phẩm và còn hạn sử dụng</li>
                    <li>• Nêu rõ bất kỳ vấn đề về chất lượng (nếu có)</li>
                    <li>• Đặt mức giảm giá hợp lý dựa trên tình trạng sản phẩm</li>
                    <li>• Đăng hình ảnh rõ ràng và chính xác của sản phẩm thực tế</li>
                    <li>• Sản phẩm nên có ít nhất 24 giờ hạn sử dụng còn lại</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{productForm.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</CardTitle>
                    <CardDescription>
                      {productForm.id 
                        ? "Cập nhật thông tin sản phẩm hiện có" 
                        : "Đăng sản phẩm mới sắp hết hạn với giá ưu đãi"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setBulkUploadMode(!bulkUploadMode)}>
                      <FileText className="h-4 w-4 mr-2" />
                      {bulkUploadMode ? "Nhập đơn lẻ" : "Nhập hàng loạt"}
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleBarcodeScanning}>
                            <Barcode className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Quét mã vạch</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {barcodeScanning && (
                  <div className="mt-3 border rounded-md p-3 bg-muted/30">
                    <div className="aspect-video max-h-[220px] bg-black rounded-md flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-dashed border-primary w-3/4 h-1/3 flex items-center justify-center">
                          <span className="text-primary text-xs">Đặt mã vạch vào khung</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Button variant="secondary" size="sm" onClick={() => setBarcodeScanning(false)}>
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                {bulkUploadMode ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <div className="mx-auto flex flex-col items-center justify-center gap-1">
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <div className="text-sm font-medium">Kéo và thả file Excel hoặc nhấp để tải lên</div>
                        <div className="text-xs text-muted-foreground">
                          Hỗ trợ file .xlsx, .csv tối đa 50MB
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Upload className="h-3.5 w-3.5 mr-2" />
                          Chọn file
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted/40 rounded-lg p-3">
                      <h3 className="text-sm font-medium mb-2">Yêu cầu định dạng file</h3>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Cần có các cột: Mã sản phẩm, Tên, Giá gốc, Giá khuyến mãi, Số lượng, Ngày sản xuất, Hạn sử dụng, Danh mục</li>
                        <li>• Mỗi sản phẩm một dòng</li>
                        <li>• Hãy tải <Button variant="link" className="h-auto p-0 text-xs">mẫu file Excel</Button></li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 md:col-span-1">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Tên sản phẩm</Label>
                        <Input
                          id="productName"
                          placeholder="Nhập tên sản phẩm"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="originalPrice">Giá gốc (VNĐ)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            placeholder="100.000"
                            value={productForm.originalPrice || ''}
                            onChange={(e) => setProductForm({...productForm, originalPrice: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salePrice">Giá ưu đãi (VNĐ)</Label>
                          <Input
                            id="salePrice"
                            type="number"
                            placeholder="70.000"
                            value={productForm.salePrice || ''}
                            onChange={(e) => setProductForm({...productForm, salePrice: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="discount">Phần trăm giảm giá</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="discount"
                            type="number"
                            placeholder="30"
                            min="0"
                            max="100"
                            value={
                              productForm.originalPrice && productForm.salePrice 
                                ? Math.round((1 - productForm.salePrice / productForm.originalPrice) * 100) 
                                : ''
                            }
                            onChange={(e) => {
                              const discount = Number(e.target.value);
                              if (productForm.originalPrice) {
                                setProductForm({
                                  ...productForm, 
                                  salePrice: Math.round(productForm.originalPrice * (1 - discount / 100))
                                });
                              }
                            }}
                          />
                          <span className="text-sm font-medium">%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="category">Danh mục</Label>
                          <Select 
                            value={productForm.category}
                            onValueChange={(value) => setProductForm({...productForm, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(categoryLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Số lượng</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            placeholder="10"
                            value={productForm.quantity || ''}
                            onChange={(e) => setProductForm({...productForm, quantity: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="manufacturingDate">Ngày sản xuất</Label>
                          <Input
                            id="manufacturingDate"
                            type="date"
                            value={productForm.manufacturingDate}
                            onChange={(e) => setProductForm({...productForm, manufacturingDate: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Hạn sử dụng</Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            value={productForm.expiryDate}
                            onChange={(e) => setProductForm({...productForm, expiryDate: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Mô tả sản phẩm</Label>
                        <Textarea
                          id="description"
                          placeholder="Mô tả chi tiết về sản phẩm, bao gồm đặc điểm, thành phần, v.v."
                          rows={4}
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Hình ảnh sản phẩm</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
                            <Image className="h-8 w-8 text-muted-foreground mb-1" />
                            <div className="text-xs font-medium">Tải ảnh lên</div>
                            <div className="text-xs text-muted-foreground">
                              PNG, JPG tối đa 5MB
                            </div>
                            <input type="file" className="hidden" />
                          </div>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
                            <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                            <div className="text-xs font-medium">Chụp ảnh</div>
                            <div className="text-xs text-muted-foreground">
                              Sử dụng camera
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {productForm.imageUrl && (
                        <div className="border rounded-lg p-2">
                          <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                            <img 
                              src={productForm.imageUrl} 
                              alt={productForm.name} 
                              className="object-cover w-full h-full" 
                            />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2 h-7 w-7 rounded-full" 
                              onClick={() => setProductForm({...productForm, imageUrl: ''})}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="barcode">Mã vạch sản phẩm</Label>
                        <div className="flex gap-2">
                          <Input
                            id="barcode"
                            placeholder="Nhập hoặc quét mã vạch"
                            value={productForm.barcode}
                            onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                          />
                          <Button variant="outline" size="icon" onClick={toggleBarcodeScanning}>
                            <Barcode className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Trạng thái sản phẩm</Label>
                        <RadioGroup 
                          value={productForm.productStatus || 'active'} 
                          onValueChange={(value) => setProductForm({...productForm, productStatus: value})}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="active" />
                            <Label htmlFor="active" className="font-normal">Đang bán</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hidden" id="hidden" />
                            <Label htmlFor="hidden" className="font-normal">Tạm ẩn</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="promotion" id="promotion" />
                            <Label htmlFor="promotion" className="font-normal">
                              Khuyến mãi đặc biệt
                              <span className="inline-block ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                Giảm thêm 10%
                              </span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Thẻ sản phẩm</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Sắp hết hạn', 'Ngon', 'Rẻ', 'Hữu cơ', 'Chất lượng cao'].map((tag) => (
                            <Badge 
                              key={tag} 
                              variant={productForm.tags?.includes(tag) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => {
                                const currentTags = productForm.tags || [];
                                if (currentTags.includes(tag)) {
                                  setProductForm({...productForm, tags: currentTags.filter(t => t !== tag)});
                                } else {
                                  setProductForm({...productForm, tags: [...currentTags, tag]});
                                }
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-5 border-t">
                <Button variant="outline" onClick={resetForm}>Hủy</Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Lưu nháp
                  </Button>
                  <Button onClick={handleSaveProduct}>
                    <Save className="h-4 w-4 mr-2" />
                    {bulkUploadMode ? "Nhập hàng loạt" : (productForm.id ? "Cập nhật sản phẩm" : "Lưu sản phẩm")}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
                  Sản phẩm gần hết hạn
                </CardTitle>
                <CardDescription>
                  Sản phẩm sẽ hết hạn trong vòng 7 ngày tới. Kiểm tra và quản lý ngay.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products
                    .filter(product => {
                      const expiryDate = new Date(product.expiryDate);
                      const today = new Date();
                      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return daysUntilExpiry <= 7;
                    })
                    .slice(0, 3)
                    .map((product, index) => {
                      const daysUntilExpiry = Math.floor((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <Card key={product.id} className="border-amber-100">
                          <CardHeader className="p-3 pb-0">
                            <CardTitle className="text-sm">{product.name}</CardTitle>
                            <CardDescription className="flex justify-between items-center">
                              <span className="text-red-500">
                                Còn {daysUntilExpiry} ngày
                              </span>
                              <Badge variant="outline" className="text-amber-600 bg-amber-50">
                                {product.quantity} đơn vị
                              </Badge>
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="p-3 pt-0">
                            <Button variant="outline" size="sm" className="text-xs h-8 w-full">
                              <Tag className="h-3.5 w-3.5 mr-1.5" />
                              Đánh dấu khuyến mãi
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-6">
            <div className="bg-white rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Sản phẩm</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Mã vạch</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Danh mục</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Giá</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Tồn kho</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Ngày hết hạn</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Trạng thái</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-muted-foreground">
                          Không tìm thấy sản phẩm nào phù hợp với điều kiện tìm kiếm
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const expiryDate = new Date(product.expiryDate);
                        const today = new Date();
                        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        const isNearExpiry = daysUntilExpiry <= 7;
                        
                        return (
                          <tr key={product.id} className="border-b hover:bg-muted/20">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                  {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                      <Package className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{product.name}</div>
                                  {product.tags && product.tags.length > 0 && (
                                    <div className="flex mt-1 gap-1 flex-wrap">
                                      {product.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs px-1 h-5">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center text-sm">{product.barcode || "-"}</td>
                            <td className="py-3 px-4 text-center text-sm">
                              {categoryLabels[product.category] || product.category}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="text-sm font-medium">{formatPrice(product.salePrice || 0)} đ</div>
                              {product.originalPrice && product.originalPrice !== product.salePrice && (
                                <div className="text-xs text-muted-foreground line-through">
                                  {formatPrice(product.originalPrice)} đ
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant={product.quantity > 10 ? "outline" : "secondary"} className="font-normal">
                                {product.quantity}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className={`text-sm ${isNearExpiry ? 'text-red-500 font-medium' : ''}`}>
                                {formatDate(expiryDate)}
                              </div>
                              {isNearExpiry && (
                                <div className="text-xs text-red-500">
                                  Còn {daysUntilExpiry} ngày
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant={
                                product.productStatus === 'hidden' ? "outline" : 
                                product.productStatus === 'promotion' ? "default" : 
                                "secondary"
                              }>
                                {product.productStatus === 'hidden' ? 'Ẩn' : 
                                 product.productStatus === 'promotion' ? 'Khuyến mãi' : 
                                 'Đang bán'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEditProduct(product)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedProductId(product.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="py-3 px-4 border-t flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {filteredProducts.length} / {products.length} sản phẩm
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {showExpiring && (
              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    Sản phẩm sắp hết hạn
                  </CardTitle>
                  <CardDescription>
                    Các sản phẩm sẽ hết hạn trong vòng 7 ngày tới. Hãy tạo khuyến mãi để bán nhanh.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {products
                      .filter(product => {
                        const expiryDate = new Date(product.expiryDate);
                        const today = new Date();
                        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        return daysUntilExpiry <= 7;
                      })
                      .map((product) => {
                        const daysUntilExpiry = Math.floor((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <Card key={product.id} className="overflow-hidden">
                            <div className="aspect-[4/3] bg-muted relative">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="object-cover w-full h-full" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <Badge variant="destructive" className="text-xs">
                                  Còn {daysUntilExpiry} ngày
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <div className="font-medium truncate">{product.name}</div>
                              <div className="flex justify-between items-center mt-1">
                                <div className="text-sm">{formatPrice(product.salePrice || 0)} đ</div>
                                <Badge variant="outline" className="text-xs">
                                  {product.quantity} hàng
                                </Badge>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="h-8 w-full"
                                  onClick={() => {
                                    setProductForm({
                                      ...product,
                                      originalPrice: product.originalPrice || null,
                                      salePrice: product.salePrice || null,
                                      quantity: product.quantity || null,
                                      expiryDate: formatDateForInput(new Date(product.expiryDate)),
                                      manufacturingDate: product.manufacturingDate ? formatDateForInput(new Date(product.manufacturingDate)) : '',
                                      imageUrl: product.image || '',
                                      tags: product.tags || [],
                                      description: product.description || '',
                                      barcode: product.barcode || '',
                                      productStatus: product.productStatus || 'active'
                                    });
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1" />
                                  Sửa
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-full"
                                  onClick={() => {
                                    const newSalePrice = Math.round((product.originalPrice || 0) * 0.7);
                                    setProductForm({
                                      ...product,
                                      originalPrice: product.originalPrice || null,
                                      salePrice: newSalePrice,
                                      quantity: product.quantity || null,
                                      expiryDate: formatDateForInput(new Date(product.expiryDate)),
                                      manufacturingDate: product.manufacturingDate ? formatDateForInput(new Date(product.manufacturingDate)) : '',
                                      imageUrl: product.image || '',
                                      tags: [...(product.tags || []), 'Sắp hết hạn'],
                                      description: product.description || '',
                                      barcode: product.barcode || '',
                                      productStatus: 'promotion'
                                    });
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Tag className="h-3.5 w-3.5 mr-1" />
                                  Khuyến mãi
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{productForm.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
            <DialogDescription>
              {productForm.id ? "Cập nhật thông tin sản phẩm hiện có" : "Thêm sản phẩm mới vào cửa hàng"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4 md:col-span-1">
              <div className="space-y-2">
                <Label htmlFor="editProductName">Tên sản phẩm</Label>
                <Input
                  id="editProductName"
                  placeholder="Nhập tên sản phẩm"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editOriginalPrice">Giá gốc (VNĐ)</Label>
                  <Input
                    id="editOriginalPrice"
                    type="number"
                    placeholder="100.000"
                    value={productForm.originalPrice || ''}
                    onChange={(e) => setProductForm({...productForm, originalPrice: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSalePrice">Giá ưu đãi (VNĐ)</Label>
                  <Input
                    id="editSalePrice"
                    type="number"
                    placeholder="70.000"
                    value={productForm.salePrice || ''}
                    onChange={(e) => setProductForm({...productForm, salePrice: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDiscount">Phần trăm giảm giá</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="editDiscount"
                    type="number"
                    placeholder="30"
                    min="0"
                    max="100"
                    value={
                      productForm.originalPrice && productForm.salePrice 
                        ? Math.round((1 - productForm.salePrice / productForm.originalPrice) * 100) 
                        : ''
                    }
                    onChange={(e) => {
                      const discount = Number(e.target.value);
                      if (productForm.originalPrice) {
                        setProductForm({
                          ...productForm, 
                          salePrice: Math.round(productForm.originalPrice * (1 - discount / 100))
                        });
                      }
                    }}
                  />
                  <span className="text-sm font-medium">%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editCategory">Danh mục</Label>
                  <Select 
                    value={productForm.category}
                    onValueChange={(value) => setProductForm({...productForm, category: value})}
                  >
                    <SelectTrigger id="editCategory">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editQuantity">Số lượng</Label>
                  <Input
                    id="editQuantity"
                    type="number"
                    min="1"
                    placeholder="10"
                    value={productForm.quantity || ''}
                    onChange={(e) => setProductForm({...productForm, quantity: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editManufacturingDate">Ngày sản xuất</Label>
                  <Input
                    id="editManufacturingDate"
                    type="date"
                    value={productForm.manufacturingDate}
                    onChange={(e) => setProductForm({...productForm, manufacturingDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editExpiryDate">Hạn sử dụng</Label>
                  <Input
                    id="editExpiryDate"
                    type="date"
                    value={productForm.expiryDate}
                    onChange={(e) => setProductForm({...productForm, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDescription">Mô tả sản phẩm</Label>
                <Textarea
                  id="editDescription"
                  placeholder="Mô tả chi tiết về sản phẩm, bao gồm đặc điểm, thành phần, v.v."
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Hình ảnh sản phẩm</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Image className="h-8 w-8 text-muted-foreground mb-1" />
                    <div className="text-xs font-medium">Tải ảnh lên</div>
                    <div className="text-xs text-muted-foreground">
                      PNG, JPG tối đa 5MB
                    </div>
                    <input type="file" className="hidden" />
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                    <div className="text-xs font-medium">Chụp ảnh</div>
                    <div className="text-xs text-muted-foreground">
                      Sử dụng camera
                    </div>
                  </div>
                </div>
              </div>
              
              {productForm.imageUrl && (
                <div className="border rounded-lg p-2">
                  <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                    <img 
                      src={productForm.imageUrl} 
                      alt={productForm.name} 
                      className="object-cover w-full h-full" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7 rounded-full" 
                      onClick={() => setProductForm({...productForm, imageUrl: ''})}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="editBarcode">Mã vạch sản phẩm</Label>
                <div className="flex gap-2">
                  <Input
                    id="editBarcode"
                    placeholder="Nhập hoặc quét mã vạch"
                    value={productForm.barcode}
                    onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                  />
                  <Button variant="outline" size="icon" onClick={toggleBarcodeScanning}>
                    <Barcode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Trạng thái sản phẩm</Label>
                <RadioGroup 
                  value={productForm.productStatus || 'active'} 
                  onValueChange={(value) => setProductForm({...productForm, productStatus: value})}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="editActive" />
                    <Label htmlFor="editActive" className="font-normal">Đang bán</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hidden" id="editHidden" />
                    <Label htmlFor="editHidden" className="font-normal">Tạm ẩn</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="promotion" id="editPromotion" />
                    <Label htmlFor="editPromotion" className="font-normal">
                      Khuyến mãi đặc biệt
                      <span className="inline-block ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                        Giảm thêm 10%
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Thẻ sản phẩm</Label>
                <div className="flex flex-wrap gap-2">
                  {['Sắp hết hạn', 'Ngon', 'Rẻ', 'Hữu cơ', 'Chất lượng cao'].map((tag) => (
                    <Badge 
                      key={tag} 
                      variant={productForm.tags?.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const currentTags = productForm.tags || [];
                        if (currentTags.includes(tag)) {
                          setProductForm({...productForm, tags: currentTags.filter(t => t !== tag)});
                        } else {
                          setProductForm({...productForm, tags: [...currentTags, tag]});
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleEditProductSave}>
              <Save className="h-4 w-4 mr-2" />
              Lưu sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 