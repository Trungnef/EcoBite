import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

export function StoreDashboardSchedule() {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lịch giao hàng & Nhận hàng</h2>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Xem lịch đầy đủ
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Quy định thời gian lấy hàng</h3>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="monday" className="h-4 w-4 text-primary rounded mr-2" defaultChecked />
                  <label htmlFor="monday">Thứ Hai</label>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>8:00</option>
                    <option selected>9:00</option>
                    <option>10:00</option>
                  </select>
                  <span>đến</span>
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>17:00</option>
                    <option selected>18:00</option>
                    <option>19:00</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="tuesday" className="h-4 w-4 text-primary rounded mr-2" defaultChecked />
                  <label htmlFor="tuesday">Thứ Ba</label>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>8:00</option>
                    <option selected>9:00</option>
                    <option>10:00</option>
                  </select>
                  <span>đến</span>
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>17:00</option>
                    <option selected>18:00</option>
                    <option>19:00</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="wednesday" className="h-4 w-4 text-primary rounded mr-2" defaultChecked />
                  <label htmlFor="wednesday">Thứ Tư</label>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>8:00</option>
                    <option selected>9:00</option>
                    <option>10:00</option>
                  </select>
                  <span>đến</span>
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>17:00</option>
                    <option selected>18:00</option>
                    <option>19:00</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="thursday" className="h-4 w-4 text-primary rounded mr-2" defaultChecked />
                  <label htmlFor="thursday">Thứ Năm</label>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>8:00</option>
                    <option selected>9:00</option>
                    <option>10:00</option>
                  </select>
                  <span>đến</span>
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>17:00</option>
                    <option selected>18:00</option>
                    <option>19:00</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="friday" className="h-4 w-4 text-primary rounded mr-2" defaultChecked />
                  <label htmlFor="friday">Thứ Sáu</label>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>8:00</option>
                    <option selected>9:00</option>
                    <option>10:00</option>
                  </select>
                  <span>đến</span>
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>17:00</option>
                    <option selected>18:00</option>
                    <option>19:00</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="saturday" className="h-4 w-4 text-primary rounded mr-2" defaultChecked />
                  <label htmlFor="saturday">Thứ Bảy</label>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>8:00</option>
                    <option>9:00</option>
                    <option selected>10:00</option>
                  </select>
                  <span>đến</span>
                  <select className="h-9 rounded-md border border-input px-3 text-sm">
                    <option>14:00</option>
                    <option selected>15:00</option>
                    <option>16:00</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="sunday" className="h-4 w-4 text-primary rounded mr-2" />
                  <label htmlFor="sunday">Chủ Nhật</label>
                </div>
                <div className="flex items-center gap-2">
                  <select className="h-9 rounded-md border border-input px-3 text-sm" disabled>
                    <option>8:00</option>
                    <option>9:00</option>
                    <option>10:00</option>
                  </select>
                  <span>đến</span>
                  <select className="h-9 rounded-md border border-input px-3 text-sm" disabled>
                    <option>17:00</option>
                    <option>18:00</option>
                    <option>19:00</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Đơn hàng cần chuẩn bị hôm nay</h3>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Đơn hàng #ORD-2023-5677</div>
                  <div className="text-sm text-muted-foreground">Khách lấy: 5:00 PM</div>
                </div>
                <Badge>Đang chuẩn bị</Badge>
              </div>
              <div className="text-sm">2 sản phẩm - 185.000₫</div>
              <div className="flex justify-end">
                <Button size="sm" variant="outline">Xem chi tiết</Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Đơn hàng #ORD-2023-5675</div>
                  <div className="text-sm text-muted-foreground">Giao hàng: 3:30 PM</div>
                </div>
                <Badge className="bg-indigo-500">Sẵn sàng giao</Badge>
              </div>
              <div className="text-sm">5 sản phẩm - 450.000₫</div>
              <div className="flex justify-end">
                <Button size="sm" variant="outline">Xem chi tiết</Button>
              </div>
            </div>
            
            <div className="border border-dashed rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">Thời gian chuẩn bị đơn hàng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Thời gian chuẩn bị tối thiểu</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="30" className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    <span className="ml-2">phút</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Thời gian giao hàng dự kiến</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="45" className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    <span className="ml-2">phút</span>
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