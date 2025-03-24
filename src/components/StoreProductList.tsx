import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTitle 
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Search, 
  Plus, 
  AlertCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Mock data for demonstration
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
  },
];

const categoryLabels: Record<string, string> = {
  produce: "Fresh Produce",
  bakery: "Bakery",
  dairy: "Dairy & Eggs",
  meat: "Meat & Seafood",
  pantry: "Pantry & Dry Goods",
  beverages: "Beverages",
  snacks: "Snacks & Sweets",
  prepared: "Prepared Foods",
  frozen: "Frozen Foods",
};

export function StoreProductList() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditProduct = (productId: string) => {
    // In a real app, navigate to edit page with productId
    navigate(`/store/edit-product/${productId}`);
  };
  
  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteProduct = () => {
    if (productToDelete) {
      // In a real app, delete product from API
      setProducts(products.filter(p => p.id !== productToDelete));
      
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully.",
      });
      
      setDeleteDialogOpen(false);
      setProductToDelete(null);
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
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => navigate("/store/add-product")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {searchTerm 
              ? "Try adjusting your search query or browse all products by clearing the search." 
              : "You haven't added any products yet. Get started by clicking 'Add Product'."}
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              View all products
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Original Price</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-14 w-14 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{categoryLabels[product.category] || product.category}</TableCell>
                  <TableCell className="text-right">{formatPrice(product.originalPrice)}</TableCell>
                  <TableCell className="text-right text-Eco-600 font-medium">
                    {formatPrice(product.discountPrice)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getExpiryStatus(product.expiryDate) === "critical" && (
                        <AlertCircle className="h-4 w-4 text-destructive mr-1.5" />
                      )}
                      <Badge 
                        variant={
                          getExpiryStatus(product.expiryDate) === "critical" 
                            ? "destructive" 
                            : getExpiryStatus(product.expiryDate) === "warning" 
                              ? "default" 
                              : "outline"
                        }
                      >
                        {format(product.expiryDate, "MMM d, yyyy")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{product.quantity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => confirmDelete(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 