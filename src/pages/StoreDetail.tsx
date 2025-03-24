import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Clock, Phone, Globe, Mail, 
  Star, DollarSign, ThumbsUp, ExternalLink, 
  Share2, Heart, ChevronRight, Tag, 
  ArrowLeft, Info, Calendar, AlertCircle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DealCard } from "@/components/DealCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sample data (Mẫu dữ liệu)
const storeData = {
  id: "1",
  name: "Cửa Hàng Hữu Cơ Xanh",
  logo: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=150",
  coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200",
  description: "Chúng tôi là cửa hàng chuyên cung cấp các sản phẩm hữu cơ, thực phẩm sạch từ các trang trại có chứng nhận tại Việt Nam. Với sứ mệnh mang đến những sản phẩm tốt nhất cho sức khỏe và thân thiện với môi trường, chúng tôi luôn tự hào về chất lượng và nguồn gốc rõ ràng của mỗi sản phẩm.",
  location: "92 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
  locationMap: "https://maps.google.com/maps?q=10.7756587,106.7004238&z=15&output=embed",
  phone: "028 3822 5678",
  email: "info@cuahangxanh.vn",
  website: "www.cuahangxanh.vn",
  openingHours: [
    { day: "Thứ 2 - Thứ 6", hours: "8:00 - 21:00" },
    { day: "Thứ 7", hours: "8:00 - 22:00" },
    { day: "Chủ nhật", hours: "9:00 - 21:00" }
  ],
  socialMedia: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com"
  },
  category: "Cửa hàng thực phẩm hữu cơ",
  tags: ["Hữu cơ", "Đồ tươi", "Rau củ quả", "Thực phẩm sạch"],
  dealCount: 12,
  isVerified: true,
  establishedYear: 2018,
  rating: 4.7,
  reviewCount: 128,
  photos: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600",
    "https://images.unsplash.com/photo-1542838132-8ec9563d3178?q=80&w=600",
    "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600",
  ],
  policies: [
    { title: "Chính sách đổi trả", description: "Đổi trả sản phẩm trong vòng 24 giờ nếu phát hiện lỗi từ nhà sản xuất" },
    { title: "Phương thức vận chuyển", description: "Giao hàng miễn phí trong bán kính 5km với đơn hàng trên 300,000đ" },
    { title: "Phương thức thanh toán", description: "Chấp nhận thanh toán tiền mặt, chuyển khoản và thẻ tín dụng" }
  ]
};

// Mẫu ưu đãi từ cửa hàng này
const storeDeals = [
  {
    id: "1",
    title: "Gói Rau Củ Hữu Cơ Tươi",
    store: storeData.name,
    storeImg: storeData.logo,
    originalPrice: 250000,
    discountPrice: 150000,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800",
    expiresIn: "24 giờ",
    category: "Rau Củ Quả",
  },
  {
    id: "2",
    title: "Bộ Quà Tặng Hữu Cơ Cao Cấp",
    store: storeData.name,
    storeImg: storeData.logo,
    originalPrice: 450000,
    discountPrice: 315000,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1506073881649-4e23be3e9ed0?q=80&w=800",
    expiresIn: "48 giờ",
    category: "Quà Tặng",
  },
  {
    id: "3",
    title: "Combo Trái Cây Nhiệt Đới",
    store: storeData.name,
    storeImg: storeData.logo,
    originalPrice: 180000,
    discountPrice: 126000,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800",
    expiresIn: "12 giờ",
    category: "Trái Cây",
  }
];

// Đánh giá mẫu
const storeReviews = [
  {
    id: "1",
    userName: "Nguyễn Văn A",
    userAvatar: "https://i.pravatar.cc/100?img=1",
    rating: 5,
    date: "15/04/2023",
    content: "Sản phẩm rất tươi và chất lượng tốt. Nhân viên phục vụ nhiệt tình, giao hàng đúng hẹn. Tôi đặc biệt thích dịch vụ khách hàng của họ, luôn sẵn lòng giải đáp mọi thắc mắc.",
    liked: 12
  },
  {
    id: "2",
    userName: "Trần Thị B",
    userAvatar: "https://i.pravatar.cc/100?img=5",
    rating: 4,
    date: "03/05/2023",
    content: "Cửa hàng có nhiều sản phẩm đa dạng, giá cả hợp lý. Tuy nhiên, tôi nghĩ họ có thể cải thiện thêm về bao bì để thân thiện với môi trường hơn.",
    liked: 5
  },
  {
    id: "3",
    userName: "Lê Văn C",
    userAvatar: "https://i.pravatar.cc/100?img=3",
    rating: 5,
    date: "22/06/2023",
    content: "Thực phẩm rất tươi và có nguồn gốc rõ ràng. Tôi thích việc họ đưa ra các gợi ý nấu ăn kèm theo sản phẩm. Sẽ tiếp tục ủng hộ cửa hàng!",
    liked: 8
  }
];

const StoreDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích");
  };

  const shareStore = () => {
    setIsShareModalOpen(true);
    // Trong thực tế, bạn sẽ triển khai chức năng chia sẻ thực sự ở đây
    toast.success("Đã sao chép liên kết vào clipboard");
  };

  // Nếu không tìm thấy cửa hàng bằng ID
  // if (!storeData) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center">
  //       <h1 className="text-2xl font-bold mb-4">Không tìm thấy cửa hàng</h1>
  //       <Button asChild>
  //         <Link to="/stores">Quay lại danh sách cửa hàng</Link>
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Ảnh bìa và thông tin cửa hàng */}
        <div className="relative">
          <div className="h-64 sm:h-80 md:h-96 bg-gray-200 overflow-hidden">
            <img
              src={storeData.coverImage}
              alt={`${storeData.name} - ảnh bìa`}
              className={cn("w-full h-full object-cover transition-opacity duration-700", 
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setIsLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
          </div>
          
          <Container>
            <div className="relative -mt-24 md:-mt-28 pb-5 z-10">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border-4 border-white bg-white shadow-lg">
                  <img
                    src={storeData.logo}
                    alt={`${storeData.name} - logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{storeData.name}</h1>
                    {storeData.isVerified && (
                      <Badge className="bg-primary/90 text-xs">Đã xác minh</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-white/90" />
                      <span className="text-sm text-white/90">{storeData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-white/90" />
                      <span className="text-sm text-white/90">{storeData.category}</span>
                    </div>
                    {storeData.rating && (
                      <div className="flex items-center">
                        <div className="flex items-center text-amber-400">
                          <Star className="h-4 w-4 mr-1 fill-amber-400" />
                          <span>{storeData.rating}</span>
                        </div>
                        <span className="text-sm text-white/90 ml-1">
                          ({storeData.reviewCount} đánh giá)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Button onClick={toggleFavorite} variant={isFavorite ? "default" : "outline"} 
                    className={cn("flex items-center gap-2", isFavorite && "bg-red-600 text-white hover:bg-red-700")}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-white")} />
                    <span>{isFavorite ? "Đã Thích" : "Yêu Thích"}</span>
                  </Button>
                  <Button onClick={shareStore} variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
        
        <Container className="py-6">
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="sticky top-16 pt-4 pb-3 bg-white z-20 border-b">
              <div className="flex items-center justify-between mb-4">
                <Button asChild variant="ghost" className="pl-0 hover:pl-2 transition-all">
                  <Link to="/stores" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại cửa hàng</span>
                  </Link>
                </Button>
                {storeData.dealCount > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 px-2.5 py-1">
                    <DollarSign className="h-3.5 w-3.5 text-primary" />
                    <span>{storeData.dealCount} ưu đãi đang có</span>
                  </Badge>
                )}
              </div>
              
              <TabsList className="w-full justify-start overflow-x-auto border-b pb-px gap-6">
                <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Sản phẩm
                </TabsTrigger>
                <TabsTrigger value="information" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Đánh giá ({storeReviews.length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Tab Tổng quan */}
            <TabsContent value="overview" className="space-y-8 m-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-3">Giới thiệu</h2>
                      <p className="text-muted-foreground">{storeData.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {storeData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-muted/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {storeDeals.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Ưu đãi nổi bật</h2>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="#" className="flex items-center gap-1">
                            <span>Xem tất cả</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {storeDeals.map((deal, index) => (
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
                    </div>
                  )}
                  
                  {storeData.photos.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Hình ảnh cửa hàng</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {storeData.photos.map((photo, index) => (
                          <div 
                            key={index} 
                            className="aspect-square rounded-lg overflow-hidden border"
                          >
                            <img 
                              src={photo} 
                              alt={`${storeData.name} - Ảnh ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6 space-y-5">
                      <div>
                        <h3 className="font-medium flex items-center mb-3">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          Giờ mở cửa
                        </h3>
                        <div className="space-y-2">
                          {storeData.openingHours.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.day}</span>
                              <span className="font-medium">{item.hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium flex items-center mb-3">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          Địa chỉ
                        </h3>
                        <p className="text-sm mb-3">{storeData.location}</p>
                        <div className="aspect-video rounded-md overflow-hidden border">
                          <iframe 
                            src={storeData.locationMap}
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Store location map"
                          ></iframe>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium flex items-center mb-3">
                          <Phone className="h-4 w-4 mr-2 text-primary" />
                          Liên hệ
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <span>{storeData.phone}</span>
                          </div>
                          <div className="flex items-start">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <span>{storeData.email}</span>
                          </div>
                          <div className="flex items-start">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <a 
                              href={`https://${storeData.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {storeData.website}
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium flex items-center mb-3">
                          <Info className="h-4 w-4 mr-2 text-primary" />
                          Thông tin thêm
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <span>Thành lập năm {storeData.establishedYear}</span>
                          </div>
                          <div className="flex items-start">
                            <Tag className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <span>{storeData.category}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-medium flex items-center mb-3">
                        <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                        Chính sách cửa hàng
                      </h3>
                      <div className="space-y-3">
                        {storeData.policies.map((policy, index) => (
                          <div key={index}>
                            <h4 className="text-sm font-medium">{policy.title}</h4>
                            <p className="text-xs text-muted-foreground">{policy.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Tab Sản phẩm */}
            <TabsContent value="products" className="m-0">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Sản phẩm cửa hàng</h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                  Chúng tôi đang cập nhật đầy đủ danh sách sản phẩm của cửa hàng này. Vui lòng quay lại sau.
                </p>
                <Button asChild>
                  <Link to="#overview" onClick={() => setActiveTab("overview")}>
                    Xem các ưu đãi hiện có
                  </Link>
                </Button>
              </div>
            </TabsContent>
            
            {/* Tab thông tin */}
            <TabsContent value="information" className="m-0">
              <div className="max-w-3xl">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Thông tin chi tiết</h2>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Giới thiệu về {storeData.name}</h3>
                    <p className="text-muted-foreground">{storeData.description}</p>
                    <p className="text-muted-foreground">
                      Cửa hàng chúng tôi được thành lập từ năm {storeData.establishedYear}, với sứ mệnh cung cấp thực phẩm sạch, an toàn và giảm thiểu lãng phí thực phẩm. Chúng tôi hợp tác với các nhà sản xuất, nông trại địa phương để mang đến những sản phẩm tươi ngon nhất cho khách hàng.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Cam kết của chúng tôi</h3>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                      <li>Chỉ cung cấp các sản phẩm có chứng nhận hữu cơ và nguồn gốc rõ ràng</li>
                      <li>Minh bạch về thông tin sản phẩm và giá cả</li>
                      <li>Ưu tiên hợp tác với các nhà sản xuất địa phương</li>
                      <li>Giảm thiểu lãng phí thực phẩm thông qua các chương trình ưu đãi</li>
                      <li>Hỗ trợ khách hàng 24/7 với mọi thắc mắc và yêu cầu</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Chính sách cửa hàng</h3>
                    <div className="space-y-3">
                      {storeData.policies.map((policy, index) => (
                        <div key={index} className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium">{policy.title}</h4>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Tab đánh giá */}
            <TabsContent value="reviews" className="m-0">
              <div className="max-w-3xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Đánh giá khách hàng</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-lg font-bold ml-1">{storeData.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({storeData.reviewCount} đánh giá)
                      </span>
                    </div>
                  </div>
                  
                  <Button>Viết đánh giá</Button>
                </div>
                
                <div className="space-y-4">
                  {storeReviews.map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <img 
                            src={review.userAvatar} 
                            alt={review.userName}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{review.userName}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={cn(
                                      "h-4 w-4", 
                                      i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="h-8">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{review.liked}</span>
                        </Button>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-muted-foreground text-sm">{review.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoreDetail; 