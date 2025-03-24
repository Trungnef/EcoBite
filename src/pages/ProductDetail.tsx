import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Clock, 
  Info, 
  Shield, 
  Truck, 
  Phone, 
  MapPin,
  Calendar,
  Store as StoreIcon,
  Shield as ShieldCheck
} from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { RelatedProducts } from "@/components/RelatedProducts";
import { useCart } from "@/contexts/CartContext";
import { QualityBadge } from "@/components/QualityBadge";
import { StoreContact } from "@/components/StoreContact";

// Sample product data - in a real app this would come from an API
const getProductById = (id: string) => {
  const allProducts = [
    {
      id: "1",
      title: "Bộ trái cây hữu cơ tươi",
      description: "Bộ sưu tập trái cây hữu cơ cao cấp bao gồm táo, cam và chuối. Được cung cấp từ các trang trại địa phương với phương pháp canh tác bền vững.",
      storeId: "store1",
      storeName: "Cửa hàng Organic",
      storeImg: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=150",
      storeAddress: "123 Green St, Quận 1, TP. Hồ Chí Minh",
      storePhone: "+84 123 456 789",
      storeHours: "8:00 - 22:00",
      originalPrice: 250000,
      discountPrice: 150000,
      discountPercent: 40,
      images: [
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800",
        "https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=800",
        "https://images.unsplash.com/photo-1610397962076-02407a169302?q=80&w=800"
      ],
      expiresIn: "48 giờ",
      expiryDate: "02/06/2023",
      category: "Rau củ quả",
      featured: true,
      stock: 25,
      specifications: {
        "cân nặng": "2kg",
        "hữu cơ": "Có",
        "nguồn gốc": "Nông trại địa phương",
        "đóng gói": "Thân thiện môi trường"
      },
      reviews: 4.7,
      reviewCount: 128,
      qualityVerified: true,
      safetyInspected: true
    },
    {
      id: "2",
      title: "Bộ bánh mì thủ công",
      description: "Bánh mì và bánh ngọt mới nướng từ tiệm bánh thủ công địa phương của chúng tôi. Bao gồm bánh mì chua, croissant và bánh nướng xốp.",
      storeId: "store2",
      storeName: "Tiệm bánh Breadly",
      storeImg: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=150",
      storeAddress: "45 Phố Bánh, Quận Ba Đình, Hà Nội",
      storePhone: "+84 987 654 321",
      storeHours: "7:00 - 20:00",
      originalPrice: 180000,
      discountPrice: 99000,
      discountPercent: 45,
      images: [
        "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800",
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=800"
      ],
      expiresIn: "24 giờ",
      expiryDate: "01/06/2023",
      category: "Bánh",
      featured: true,
      stock: 15,
      specifications: {
        "cân nặng": "1.5kg",
        "hữu cơ": "Một phần",
        "nguồn gốc": "Tiệm bánh địa phương",
        "đóng gói": "Túi giấy"
      },
      reviews: 4.5,
      reviewCount: 86,
      qualityVerified: true,
      safetyInspected: true
    }
  ];
  
  return allProducts.find(product => product.id === id);
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const [quantity, setQuantity] = useState(1);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Handle case where product is not found
  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-[70vh]">
          <Container>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
              <p className="text-muted-foreground mb-6">
                Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
              <Button asChild>
                <Link to="/deals">Xem các ưu đãi</Link>
              </Button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container>
          {/* Back navigation */}
          <Button 
            variant="ghost" 
            className="mb-6 pl-0"
            asChild
          >
            <Link to="/deals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách ưu đãi
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <ProductImageGallery images={product.images} title={product.title} />
            
            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <Badge className="bg-primary text-primary-foreground mr-2">
                    Giảm {product.discountPercent}%
                  </Badge>
                  <Badge variant="outline" className="mr-2">
                    {product.category}
                  </Badge>
                  <div className="flex items-center text-amber-500 text-sm ml-auto">
                    {'★'.repeat(Math.floor(product.reviews))}
                    {'☆'.repeat(5 - Math.floor(product.reviews))}
                    <span className="text-muted-foreground ml-2">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold">{product.title}</h1>
                
                <div className="flex items-center mt-2 mb-3">
                  <Link 
                    to={`/stores/${product.storeId}`}
                    className="flex items-center text-sm hover:text-primary"
                  >
                    <img 
                      src={product.storeImg} 
                      alt={product.storeName} 
                      className="h-6 w-6 rounded-full mr-2"
                    />
                    <span className="font-medium">{product.storeName}</span>
                  </Link>
                </div>
                
                {/* Quality verification badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.qualityVerified && (
                    <QualityBadge type="verified" />
                  )}
                  {product.safetyInspected && (
                    <QualityBadge type="safety" />
                  )}
                </div>
              </div>
              
              {/* Expiration info - highlighted for better visibility */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-amber-800">Hết hạn trong {product.expiresIn}</div>
                  <div className="text-sm text-amber-700">
                    Sử dụng tốt nhất trước: {product.expiryDate}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-3xl font-bold">
                  {product.discountPrice.toLocaleString('vi-VN')}₫
                </div>
                <div className="ml-2 text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString('vi-VN')}₫
                </div>
              </div>
              
              <p className="text-muted-foreground">
                {product.description}
              </p>

              {/* Store quickinfo */}
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium flex items-center">
                    <StoreIcon className="h-4 w-4 mr-2 text-muted-foreground" /> 
                    Thông tin cửa hàng
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsContactModalOpen(true)}
                    className="text-xs h-7"
                  >
                    Liên hệ cửa hàng
                  </Button>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{product.storeAddress}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Mở cửa: {product.storeHours}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-9 w-9"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="h-9 w-9"
                  >
                    +
                  </Button>
                </div>
                
                {/* Stock indicator */}
                <span className={`text-sm ${product.stock <= 5 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                  {product.stock > 10 
                    ? "Còn hàng" 
                    : product.stock > 0 
                      ? `Chỉ còn ${product.stock} sản phẩm!` 
                      : "Hết hàng"}
                </span>
                
                {/* Add to cart button */}
                <AddToCartButton 
                  id={product.id}
                  title={product.title}
                  price={product.discountPrice}
                  image={product.images[0]}
                  storeId={product.storeId}
                  storeName={product.storeName}
                  className="flex-1"
                  quantity={quantity}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center p-2 rounded-lg border">
                  <Truck className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">Giao hàng nhanh</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg border">
                  <Shield className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">Đảm bảo chất lượng</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg border">
                  <Info className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product details tabs */}
          <Tabs defaultValue="details" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Chi tiết sản phẩm</TabsTrigger>
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="shipping">Vận chuyển & Đổi trả</TabsTrigger>
              <TabsTrigger value="quality">Kiểm soát chất lượng</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="p-4">
              <h3 className="font-medium mb-2">Về sản phẩm này</h3>
              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>
              <p className="text-muted-foreground">
                Sản phẩm này được cung cấp từ {product.storeName}, một đối tác tin cậy trong mạng lưới của chúng tôi.
                Bằng cách mua sản phẩm này, bạn đang giúp giảm lãng phí thực phẩm và hỗ trợ các doanh nghiệp địa phương.
              </p>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="font-medium capitalize">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="p-4">
              <h3 className="font-medium mb-2">Thông tin vận chuyển</h3>
              <p className="text-muted-foreground mb-4">
                Chúng tôi cung cấp nhiều tùy chọn vận chuyển để đáp ứng nhu cầu của bạn. Giao hàng tiêu chuẩn thường mất 1-3 ngày làm việc.
                Giao hàng nhanh có sẵn để giao hàng trong ngày hoặc ngày hôm sau.
              </p>
              
              <h3 className="font-medium mb-2 mt-4">Chính sách đổi trả</h3>
              <p className="text-muted-foreground">
                Do bản chất dễ hỏng của các mặt hàng thực phẩm, việc đổi trả chỉ được chấp nhận nếu sản phẩm bị hư hỏng
                hoặc không khớp với mô tả. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi trong vòng 24 giờ kể từ khi giao hàng
                nếu bạn gặp bất kỳ vấn đề nào.
              </p>
            </TabsContent>
            
            <TabsContent value="quality" className="p-4">
              <h3 className="font-medium mb-3">Biện pháp kiểm soát chất lượng</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 bg-green-100 p-1.5 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Hướng dẫn an toàn thực phẩm</h4>
                    <p className="text-sm text-muted-foreground">
                      Tất cả các đối tác của chúng tôi đều tuân theo các hướng dẫn nghiêm ngặt về an toàn thực phẩm để đảm bảo tất cả các sản phẩm
                      đáp ứng các tiêu chuẩn an toàn, ngay cả khi sắp hết hạn sử dụng.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 bg-green-100 p-1.5 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Đảm bảo chất lượng</h4>
                    <p className="text-sm text-muted-foreground">
                      Đội ngũ đảm bảo chất lượng của chúng tôi thường xuyên kiểm tra các cửa hàng đối tác và sản phẩm
                      để duy trì tiêu chuẩn cao trong toàn bộ mạng lưới của chúng tôi.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 bg-green-100 p-1.5 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Tuân thủ sức khỏe và an toàn</h4>
                    <p className="text-sm text-muted-foreground">
                      Tất cả các sản phẩm được liệt kê trên nền tảng của chúng tôi đều tuân thủ các quy định về sức khỏe và an toàn của Việt Nam
                      và được xử lý theo các quy trình an toàn thực phẩm phù hợp.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Related products */}
          <RelatedProducts currentProductId={product.id} category={product.category} />
        </Container>
      </main>
      
      {/* Store contact modal */}
      {isContactModalOpen && (
        <StoreContact 
          store={{
            name: product.storeName,
            address: product.storeAddress,
            phone: product.storePhone,
            hours: product.storeHours,
            image: product.storeImg
          }}
          product={product.title}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
      
      <Footer />
    </>
  );
}
