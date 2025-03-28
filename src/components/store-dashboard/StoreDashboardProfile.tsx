import { Button } from "@/components/ui/button";
import { Upload, Save, Camera, Eye } from "lucide-react";

export function StoreDashboardProfile() {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Thông tin cửa hàng</h2>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Lưu thay đổi
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                <img src="/store-logo.jpg" alt="Store logo" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100')} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">Ảnh đại diện cửa hàng</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Tải ảnh lên
                  </Button>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Chụp ảnh
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tên cửa hàng</label>
                <input type="text" defaultValue="Fresh Market" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Mã số thuế</label>
                <input type="text" defaultValue="0123456789" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Địa chỉ</label>
                <input type="text" defaultValue="123 Nguyễn Văn Linh, Quận 7" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Quận/Huyện</label>
                  <input type="text" defaultValue="Quận 7" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tỉnh/Thành phố</label>
                  <input type="text" defaultValue="TP. Hồ Chí Minh" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Số điện thoại</label>
                  <input type="tel" defaultValue="0987654321" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" defaultValue="contact@freshmarket.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Loại sản phẩm kinh doanh</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Thực phẩm", "Đồ uống", "Bánh kẹo", "Rau củ quả", "Trái cây", "Thực phẩm đông lạnh", "Khác"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`store-type-${type}`} 
                      className="h-4 w-4 text-primary rounded"
                      defaultChecked={["Thực phẩm", "Rau củ quả", "Trái cây"].includes(type)}
                    />
                    <label htmlFor={`store-type-${type}`} className="text-sm">{type}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Cam kết chất lượng</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="quality-commitment" 
                    className="h-4 w-4 text-primary rounded mt-1"
                    defaultChecked={true}
                  />
                  <label htmlFor="quality-commitment" className="text-sm">
                    Cam kết đảm bảo chất lượng sản phẩm, vệ sinh an toàn thực phẩm và dịch vụ khách hàng tốt nhất từ khâu chế biến đến vận chuyển
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="eco-friendly" 
                    className="h-4 w-4 text-primary rounded mt-1"
                    defaultChecked={true}
                  />
                  <label htmlFor="eco-friendly" className="text-sm">
                    Cam kết sử dụng bao bì thân thiện với môi trường và giảm thiểu rác thải nhựa
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="delivery-commitment" 
                    className="h-4 w-4 text-primary rounded mt-1"
                    defaultChecked={true}
                  />
                  <label htmlFor="delivery-commitment" className="text-sm">
                    Cam kết giao hàng đúng hẹn và đảm bảo chất lượng sản phẩm khi giao hàng
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Thông tin API tích hợp POS</h3>
                <Button variant="outline" size="sm">
                  Kiểm tra kết nối
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">API Key</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value="••••••••••••••••" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      readOnly
                    />
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">API Endpoint</label>
                  <input 
                    type="text" 
                    defaultValue="https://api.freshmarket.pos/v1/inventory" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Tần suất đồng bộ</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>Theo thời gian thực</option>
                    <option selected>Mỗi 30 phút</option>
                    <option>Mỗi giờ</option>
                    <option>Mỗi 2 giờ</option>
                    <option>Mỗi ngày</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Đã kết nối - Lần đồng bộ cuối: 10:30 AM, 18/05/2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 