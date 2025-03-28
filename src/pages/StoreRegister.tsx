import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Upload, Camera, ArrowRight, Loader2, CheckCircle2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LocationState {
  email?: string;
  name?: string;
}

export default function StoreRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAuth();
  const [storeFormStep, setStoreFormStep] = useState(1);
  const [storeFormData, setStoreFormData] = useState({
    taxCode: "",
    address: "",
    district: "",
    city: "",
    phone: "",
    businessType: [] as string[],
    commitmentChecked: false,
    apiKey: "",
    apiEndpoint: ""
  });
  
  // Kiểm tra dữ liệu được chuyển từ trang đăng ký
  useEffect(() => {
    const state = location.state as LocationState;
    
    if (!state || !state.email) {
      toast.error("Thông tin đăng ký không hợp lệ");
      navigate("/signup");
    }
  }, [location.state, navigate]);
  
  const handleBusinessTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setStoreFormData({
        ...storeFormData, 
        businessType: [...storeFormData.businessType, type]
      });
    } else {
      setStoreFormData({
        ...storeFormData, 
        businessType: storeFormData.businessType.filter(t => t !== type)
      });
    }
  };
  
  const validateStep1 = () => {
    if (!storeFormData.taxCode) {
      toast.error("Vui lòng nhập mã số thuế");
      return false;
    }
    if (!storeFormData.address) {
      toast.error("Vui lòng nhập địa chỉ cửa hàng");
      return false;
    }
    if (!storeFormData.district) {
      toast.error("Vui lòng nhập quận/huyện");
      return false;
    }
    if (!storeFormData.city) {
      toast.error("Vui lòng nhập tỉnh/thành phố");
      return false;
    }
    if (!storeFormData.phone) {
      toast.error("Vui lòng nhập số điện thoại liên hệ");
      return false;
    }
    if (storeFormData.businessType.length === 0) {
      toast.error("Vui lòng chọn ít nhất một loại sản phẩm kinh doanh");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    if (!storeFormData.commitmentChecked) {
      toast.error("Vui lòng cam kết đảm bảo chất lượng sản phẩm");
      return;
    }
    
    // Giả lập lưu thông tin
    const locationState = location.state as LocationState;
    
    try {
      // API call để lưu thông tin cửa hàng
      // Đây là giả lập, trong thực tế bạn sẽ gọi API thực
      console.log("Store info submitted:", {
        ...storeFormData,
        name: locationState.name,
        email: locationState.email
      });
      
      toast.success("Đăng ký cửa hàng thành công!", {
        description: "Thông tin cửa hàng của bạn đã được lưu"
      });
      
      // Chuyển đến trang dashboard với thông báo người dùng mới
      navigate("/store/dashboard", {
        state: {
          newRegistration: true
        }
      });
    } catch (error) {
      console.error("Store registration error:", error);
      toast.error("Đăng ký thất bại", {
        description: "Vui lòng kiểm tra thông tin và thử lại"
      });
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <Container className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Đăng ký thông tin cửa hàng</h1>
              <p className="text-muted-foreground">
                Vui lòng cung cấp thông tin chi tiết về cửa hàng của bạn
              </p>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${storeFormStep === 1 ? 'bg-primary text-white' : 'bg-primary/20'}`}>1</div>
                  <div className="h-0.5 w-6 bg-primary/30 self-center"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${storeFormStep === 2 ? 'bg-primary text-white' : 'bg-primary/20'}`}>2</div>
                </div>
                <p className="text-sm text-muted-foreground">Bước {storeFormStep}/2</p>
              </div>
              
              {storeFormStep === 1 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="taxCode">Mã số thuế <span className="text-red-500">*</span></Label>
                        <Input
                          id="taxCode"
                          placeholder="Mã số thuế của cửa hàng"
                          value={storeFormData.taxCode}
                          onChange={(e) => setStoreFormData({...storeFormData, taxCode: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Địa chỉ cửa hàng <span className="text-red-500">*</span></Label>
                        <Input
                          id="address"
                          placeholder="Số nhà, đường"
                          value={storeFormData.address}
                          onChange={(e) => setStoreFormData({...storeFormData, address: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="district">Quận/Huyện <span className="text-red-500">*</span></Label>
                          <Input
                            id="district"
                            placeholder="Quận/Huyện"
                            value={storeFormData.district}
                            onChange={(e) => setStoreFormData({...storeFormData, district: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">Tỉnh/Thành phố <span className="text-red-500">*</span></Label>
                          <Input
                            id="city"
                            placeholder="Tỉnh/Thành phố"
                            value={storeFormData.city}
                            onChange={(e) => setStoreFormData({...storeFormData, city: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Số điện thoại liên hệ <span className="text-red-500">*</span></Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Số điện thoại cửa hàng"
                          value={storeFormData.phone}
                          onChange={(e) => setStoreFormData({...storeFormData, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Loại sản phẩm kinh doanh <span className="text-red-500">*</span></Label>
                        <div className="grid grid-cols-2 gap-2 border rounded-md p-3 h-[220px] overflow-y-auto">
                          {["Thực phẩm", "Đồ uống", "Bánh kẹo", "Rau củ quả", "Trái cây", "Thực phẩm đông lạnh", "Thực phẩm khô", "Gia vị", "Thực phẩm chế biến sẵn", "Sản phẩm từ sữa", "Thực phẩm chay", "Thực phẩm hữu cơ", "Khác"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`type-${type}`} 
                                checked={storeFormData.businessType.includes(type)}
                                onCheckedChange={(checked) => 
                                  handleBusinessTypeChange(type, checked as boolean)
                                }
                              />
                              <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Chọn ít nhất một loại sản phẩm</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      type="button"
                      className="w-[200px]" 
                      onClick={() => {
                        if (validateStep1()) {
                          setStoreFormStep(2);
                        }
                      }}
                    >
                      Tiếp theo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {storeFormStep === 2 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Tải ảnh cửa hàng</h3>
                        <div className="flex items-center justify-center h-40 bg-muted/50 rounded-md border-2 border-dashed border-muted-foreground/50 cursor-pointer hover:bg-muted/70 transition-colors">
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Nhấp để tải ảnh cửa hàng</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG (tối đa 5MB)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 flex items-center justify-center h-40">
                        <div className="text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Button variant="outline" size="sm">
                            Chụp ảnh cửa hàng
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">Sử dụng camera để chụp ảnh thực tế</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-3">Cam kết chất lượng <span className="text-red-500">*</span></h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="quality-commitment" 
                              checked={storeFormData.commitmentChecked}
                              onCheckedChange={(checked) => 
                                setStoreFormData({...storeFormData, commitmentChecked: checked as boolean})
                              }
                              className="mt-1"
                            />
                            <Label htmlFor="quality-commitment" className="text-sm font-normal">
                              Tôi cam kết đảm bảo chất lượng sản phẩm, vệ sinh an toàn thực phẩm và dịch vụ khách hàng tốt nhất từ khâu chế biến đến vận chuyển
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="eco-friendly" 
                              className="mt-1"
                            />
                            <Label htmlFor="eco-friendly" className="text-sm font-normal">
                              Tôi cam kết sử dụng bao bì thân thiện với môi trường và giảm thiểu rác thải nhựa
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox 
                              id="delivery-commitment" 
                              className="mt-1"
                            />
                            <Label htmlFor="delivery-commitment" className="text-sm font-normal">
                              Tôi cam kết giao hàng đúng hẹn và đảm bảo chất lượng sản phẩm khi giao hàng
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Thông tin API tích hợp POS</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cung cấp thông tin API từ phần mềm POS của bạn để đồng bộ dữ liệu sản phẩm và đơn hàng
                        </p>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="apiKey" className="text-sm">API Key</Label>
                            <Input
                              id="apiKey"
                              placeholder="API Key (nếu có)"
                              value={storeFormData.apiKey}
                              onChange={(e) => setStoreFormData({...storeFormData, apiKey: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="apiEndpoint" className="text-sm">API Endpoint</Label>
                            <Input
                              id="apiEndpoint"
                              placeholder="API Endpoint (nếu có)"
                              value={storeFormData.apiEndpoint}
                              onChange={(e) => setStoreFormData({...storeFormData, apiEndpoint: e.target.value})}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Bạn có thể bổ sung thông tin này sau trong mục cài đặt cửa hàng
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setStoreFormStep(1)}
                      className="space-x-2"
                    >
                      <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                      Quay lại
                    </Button>
                    
                    <Button 
                      type="button"
                      className="min-w-[200px]"
                      disabled={!storeFormData.commitmentChecked || isLoading}
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Hoàn tất đăng ký
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </Container>
      </main>
      <Footer />
    </>
  );
} 