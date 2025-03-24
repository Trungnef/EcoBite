import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/contexts/CartContext";
import { 
  Truck, MapPin, CreditCard, Landmark, Banknote, 
  ArrowLeft, CheckCircle, AlertCircle, Clock, CalendarClock,
  Store, Bike, Package, ShieldCheck, Wallet, Building2,
  Timer, Leaf, BadgePercent, MapPinned, Info, Shield,
  CreditCard as CreditCardIcon, Smartphone, QrCode,
  LockKeyhole, ShieldCheck as ShieldCheckIcon, X,
  Ticket, AlertTriangle, BadgeCheck, Tag
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { promotions } from "@/constants/promotions";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define interfaces
interface IPromotion {
  code: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  description: string;
  maxDiscount: number;
  minOrder: number;
  expiryDate: string;
  conditions?: {
    newCustomerOnly?: boolean;
    hidden?: boolean; // Thêm thuộc tính để đánh dấu mã ẩn
  };
}

// Schema cho form thanh toán
const checkoutSchema = z.object({
  fullName: z.string().min(3, { message: "Vui lòng nhập đầy đủ họ tên" }),
  phone: z.string()
    .min(10, { message: "Số điện thoại không hợp lệ" })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số" }),
  email: z.string()
    .email({ message: "Email không hợp lệ" })
    .optional()
    .or(z.literal('')),
  address: z.string().min(5, { message: "Vui lòng nhập địa chỉ đầy đủ" }),
  district: z.string().min(1, { message: "Vui lòng chọn quận/huyện" }),
  city: z.string().min(1, { message: "Vui lòng chọn tỉnh/thành phố" }),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "banking", "credit", "momo", "zalopay", "vnpay", "shopeepay", "grabpay", "smartpay"], {
    required_error: "Vui lòng chọn phương thức thanh toán"
  }),
  deliveryMethod: z.enum(["standard", "express", "sameday", "pickup", "eco", "scheduled", "locker"], {
    required_error: "Vui lòng chọn phương thức giao hàng"
  }),
  pickupStore: z.string().optional(),
  desiredDeliveryTime: z.string().optional(),
  desiredDeliveryDate: z.string().optional(),
  lockerLocation: z.string().optional(),
  saveAddress: z.boolean().default(false),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// Danh sách tỉnh/thành phố và quận/huyện
const cities = [
  "Hà Nội", 
  "TP. Hồ Chí Minh", 
  "Đà Nẵng", 
  "Hải Phòng", 
  "Cần Thơ", 
  "Nha Trang", 
  "Huế"
];

const districts = {
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", "Cầu Giấy", "Đống Đa", "Hai Bà Trưng"],
  "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 7", "Quận 10", "Bình Thạnh", "Thủ Đức"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Liên Chiểu", "Ngũ Hành Sơn", "Sơn Trà"],
  "Hải Phòng": ["Hồng Bàng", "Ngô Quyền", "Lê Chân", "Hải An", "Kiến An"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt"],
  "Nha Trang": ["Vĩnh Hải", "Vĩnh Phước", "Vĩnh Thọ", "Phương Sài", "Xương Huân"],
  "Huế": ["Phú Nhuận", "Phú Hậu", "Vĩnh Ninh", "Phường Đúc", "Trường An"]
};

// Thêm danh sách cửa hàng
const stores = {
  "Hà Nội": [
    { id: "hn1", name: "EcoBite - Cầu Giấy", address: "123 Cầu Giấy, Hà Nội" },
    { id: "hn2", name: "EcoBite - Đống Đa", address: "45 Đống Đa, Hà Nội" },
  ],
  "TP. Hồ Chí Minh": [
    { id: "hcm1", name: "EcoBite - Quận 1", address: "67 Lê Lợi, Quận 1, TP.HCM" },
    { id: "hcm2", name: "EcoBite - Thủ Đức", address: "89 Võ Văn Ngân, Thủ Đức, TP.HCM" },
  ],
  // Thêm các thành phố khác...
};

const lockerLocations = {
  "Hà Nội": [
    { id: "hn_locker1", name: "Locker Cầu Giấy", address: "TTTM The Garden, 123 Cầu Giấy" },
    { id: "hn_locker2", name: "Locker Times City", address: "TTTM Times City, 458 Minh Khai" },
  ],
  "TP. Hồ Chí Minh": [
    { id: "hcm_locker1", name: "Locker Landmark 81", address: "TTTM Landmark 81, Quận Bình Thạnh" },
    { id: "hcm_locker2", name: "Locker Crescent Mall", address: "TTTM Crescent Mall, Quận 7" },
  ]
};

// Cập nhật logic tính phí giao hàng
const calculateShippingFee = (
  method: string, 
  subtotal: number, 
  baseShippingFee: number, 
  city: string,
  selectedDeliveryDate?: string
) => {
  // Nếu mua đủ tiền (500,000đ) thì miễn phí vận chuyển tiêu chuẩn
  const standardFeeWithDiscount = subtotal >= 500000 ? 0 : baseShippingFee;
  
  // Với các phương thức khác, vẫn tính phụ phí thêm vào
  switch (method) {
    case "standard":
      return standardFeeWithDiscount;
    case "express":
      return standardFeeWithDiscount + 50000; // Phụ phí giao nhanh
    case "sameday":
      // Nếu giao trong thành phố lớn
      if (["Hà Nội", "TP. Hồ Chí Minh"].includes(city)) {
        return standardFeeWithDiscount + 100000;
      }
      // Nếu giao tỉnh khác
      return standardFeeWithDiscount + 150000;
    case "scheduled":
      // Mặc định phụ phí 30,000đ
      let additionalFee = 30000;
      
      // Nếu đặt trước 3 ngày, phụ phí giảm còn 20,000đ
      if (selectedDeliveryDate) {
        const parts = selectedDeliveryDate.split('/');
        if (parts.length === 3) {
          const deliveryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          const today = new Date();
          const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          if (diffDays >= 3) additionalFee = 20000;
        }
      }
      return standardFeeWithDiscount + additionalFee;
    case "eco":
      // Giao eco-friendly giảm 20,000đ so với chuẩn
      return Math.max(0, standardFeeWithDiscount - 20000);
    case "locker":
      // Giao đến locker giảm 30,000đ so với chuẩn
      return Math.max(0, standardFeeWithDiscount - 30000);
    case "pickup":
      // Nhận tại cửa hàng miễn phí
      return 0;
    default:
      return standardFeeWithDiscount;
  }
};

const suggestedDiscountCodes: IPromotion[] = [
  {
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    description: "Giảm 20% cho đơn hàng đầu tiên",
    maxDiscount: 100000,
    minOrder: 200000,
    expiryDate: "2025-12-31",
    conditions: {
      newCustomerOnly: true
    }
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 100,
    description: "Miễn phí vận chuyển cho đơn từ 300K",
    maxDiscount: 40000,
    minOrder: 300000,
    expiryDate: "2025-12-31"
  },
  {
    code: "FLASH50",
    type: "fixed",
    value: 50000,
    description: "Giảm 50K cho đơn từ 500K",
    maxDiscount: 50000,
    minOrder: 500000,
    expiryDate: "2025-12-31"
  },
  {
    code: "SUMMER30",
    type: "percentage",
    value: 30,
    description: "Giảm 30% cho đơn hàng mùa hè",
    maxDiscount: 150000,
    minOrder: 300000,
    expiryDate: "2025-12-31"
  },
  {
    code: "THANKYOU",
    type: "fixed",
    value: 100000,
    description: "Giảm 100K cho khách hàng thân thiết",
    maxDiscount: 100000,
    minOrder: 1000000,
    expiryDate: "2025-12-31"
  },
  {
    code: "ECO25",
    type: "percentage",
    value: 25,
    description: "Giảm 25% cho sản phẩm thân thiện môi trường",
    maxDiscount: 150000,
    minOrder: 400000,
    expiryDate: "2025-12-31"
  },
  {
    code: "FREESHIP2",
    type: "shipping",
    value: 100,
    description: "Miễn phí vận chuyển không điều kiện",
    maxDiscount: 30000,
    minOrder: 0,
    expiryDate: "2025-12-31"
  },
  // Thêm mới các mã giảm giá
  {
    code: "NEWCUSTOMER",
    type: "percentage",
    value: 15,
    description: "Giảm 15% cho khách hàng mới",
    maxDiscount: 50000,
    minOrder: 100000,
    expiryDate: "2025-12-31",
    conditions: {
      newCustomerOnly: true
    }
  },
  {
    code: "WEEKEND10",
    type: "percentage",
    value: 10,
    description: "Giảm 10% cho đơn hàng cuối tuần",
    maxDiscount: 30000,
    minOrder: 200000,
    expiryDate: "2025-12-31"
  },
  {
    code: "HOLIDAY100",
    type: "fixed",
    value: 100000,
    description: "Giảm 100K cho đơn hàng lễ tết",
    maxDiscount: 100000,
    minOrder: 800000,
    expiryDate: "2025-12-31"
  },
  {
    code: "ECO10",
    type: "percentage",
    value: 10,
    description: "Giảm 10% không giới hạn đơn hàng",
    maxDiscount: 100000,
    minOrder: 0,
    expiryDate: "2025-12-31"
  },
  {
    code: "FREESHIP3",
    type: "shipping",
    value: 100,
    description: "Miễn phí vận chuyển cho đơn từ 200K",
    maxDiscount: 30000,
    minOrder: 200000,
    expiryDate: "2025-12-31"
  },
  {
    code: "SPECIAL20",
    type: "percentage",
    value: 20,
    description: "Giảm 20% cho sản phẩm đặc biệt",
    maxDiscount: 200000,
    minOrder: 300000,
    expiryDate: "2025-12-31"
  },
  {
    code: "BIRTHDAY50",
    type: "fixed",
    value: 50000,
    description: "Quà sinh nhật - Giảm 50K",
    maxDiscount: 50000,
    minOrder: 300000,
    expiryDate: "2025-12-31"
  },
  {
    code: "NEWYEAR",
    type: "percentage",
    value: 25,
    description: "Chúc mừng năm mới - Giảm 25%",
    maxDiscount: 200000,
    minOrder: 500000,
    expiryDate: "2025-12-31"
  },
  {
    code: "TRUNGNEF",
    type: "percentage",
    value: 100,
    description: "Giảm 100% giá trị sản phẩm",
    maxDiscount: 10000000,
    minOrder: 0,
    expiryDate: "2025-12-31"
  },
  {
    code: "TRUNGHANDSOMEBOY",
    type: "fixed",
    value: 100000000000, // 100 tỷ
    description: "Mã ẩn siêu đặc biệt",
    maxDiscount: 100000000000,
    minOrder: 0,
    expiryDate: "2025-12-31",
    conditions: {
      hidden: true // Đánh dấu là mã ẩn
    }
  }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    items, subtotal, discount, shippingFee: baseShippingFee, total, 
    clearCart, appliedPromoCode, shippingAddress, saveShippingAddress 
  } = useCart();
  const [selectedCity, setSelectedCity] = useState(shippingAddress?.city || "");
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState("");
  const [calculatedShippingFee, setCalculatedShippingFee] = useState(baseShippingFee);
  const [calculatedTotal, setCalculatedTotal] = useState(total);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [availableStores, setAvailableStores] = useState<Array<{ id: string; name: string; address: string }>>([]);
  const [showDeliveryTimeSlots, setShowDeliveryTimeSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedLockerLocation, setSelectedLockerLocation] = useState("");
  const [availableLockers, setAvailableLockers] = useState<Array<{ id: string; name: string; address: string }>>([]);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const location = useLocation();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromotions, setAppliedPromotions] = useState<IPromotion[]>([]);
  const [promoError, setPromoError] = useState("");
  const [isNewCustomer] = useState(true); // This should be determined based on user data
  const [showDiscountCodes, setShowDiscountCodes] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<IPromotion | null>(null);
  const [appliedShippingCode, setAppliedShippingCode] = useState<IPromotion | null>(null);

  // Thêm time slots cho các phương thức giao hàng
  const deliveryTimeSlots = {
    standard: [
      { time: "08:00 - 12:00", status: "available" },
      { time: "13:00 - 17:00", status: "available" },
      { time: "18:00 - 21:00", status: "limited" }
    ],
    express: [
      { time: "Trong vòng 4 giờ", status: "available" },
      { time: "14:00 - 16:00", status: "busy" },
      { time: "19:00 - 21:00", status: "available" }
    ],
    sameday: [
      { time: "Trong vòng 2 giờ", status: "available" },
      { time: "Giao ngay", status: "limited" },
      { time: "Theo yêu cầu", status: "available" }
    ],
    scheduled: [
      { time: "Sáng (08:00 - 12:00)", status: "available" },
      { time: "Chiều (13:00 - 17:00)", status: "available" },
      { time: "Tối (18:00 - 21:00)", status: "limited" }
    ]
  };

  // Khởi tạo form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: shippingAddress?.fullName || "",
      phone: shippingAddress?.phone || "",
      email: shippingAddress?.email || "",
      address: shippingAddress?.address || "",
      city: shippingAddress?.city || "",
      district: shippingAddress?.district || "",
      note: "",
      paymentMethod: "cod",
      deliveryMethod: "standard",
      saveAddress: false,
    },
    mode: "onChange", // Add this line to validate on field change
  });

  // Thêm useEffect cho animation khi mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Thêm useEffect cho animation loading
  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(timer);
    }
  }, [isProcessing]);

  // Cập nhật quận/huyện khi thay đổi tỉnh/thành phố
  const handleCityChange = (city: string) => {
    form.setValue("city", city);
    form.setValue("district", "");
    setSelectedCity(city);
    setAvailableDistricts(districts[city as keyof typeof districts] || []);
  };

  // Load available districts when component mounts if city is already selected
  useEffect(() => {
    if (selectedCity && !availableDistricts.length) {
      setAvailableDistricts(districts[selectedCity as keyof typeof districts] || []);
    }
  }, [selectedCity, availableDistricts.length]);

  // Cập nhật useEffect cho phí giao hàng
  useEffect(() => {
    const deliveryMethod = form.watch("deliveryMethod");
    const fee = calculateShippingFee(
      deliveryMethod, 
      subtotal, 
      baseShippingFee, 
      selectedCity,
      selectedDeliveryDate
    );
    setCalculatedShippingFee(fee);
    
    // Tính tổng tiền sau khi áp dụng giảm giá và phí giao hàng
    const total = subtotal - discount + fee;
    setCalculatedTotal(total);
  }, [form.watch("deliveryMethod"), baseShippingFee, subtotal, discount, selectedCity, selectedDeliveryDate]);

  // Cập nhật cửa hàng khi thay đổi thành phố
  useEffect(() => {
    if (selectedCity) {
      setAvailableStores(stores[selectedCity as keyof typeof stores] || []);
    }
  }, [selectedCity]);

  // Cập nhật useEffect cho lockers
  useEffect(() => {
    if (selectedCity) {
      setAvailableLockers(lockerLocations[selectedCity as keyof typeof lockerLocations] || []);
    }
  }, [selectedCity]);

  // Xử lý khi chọn phương thức giao hàng
  const handleDeliveryMethodChange = (value: string) => {
    form.setValue("deliveryMethod", value as any);
    setShowDeliveryTimeSlots(["standard", "express", "sameday", "scheduled"].includes(value));
    setSelectedTimeSlot("");
    setSelectedDeliveryDate("");
    
    const fee = calculateShippingFee(
      value, 
      subtotal, 
      baseShippingFee, 
      selectedCity,
      selectedDeliveryDate
    );
    setCalculatedShippingFee(fee);
    setCalculatedTotal(subtotal - discount + fee);
  };

  // Hiển thị thông tin thanh toán
  const showPaymentInfo = (method: string) => {
    switch (method) {
      case "banking":
        setPaymentInfo(`Ngân hàng: Vietcombank
Chủ tài khoản: CÔNG TY TNHH EcoBite
Số tài khoản: 1234567890
Chi nhánh: Hà Nội
Nội dung: EGN + Số điện thoại

Vui lòng chuyển khoản trong vòng 24h để đơn hàng được xử lý nhanh chóng.`);
        break;
      case "momo":
        setPaymentInfo(`Quét mã QR hoặc chuyển khoản đến số điện thoại: 0901234567
Tên tài khoản: EcoBite
Nội dung: EGN + Số điện thoại

Đơn hàng sẽ được xử lý ngay sau khi nhận được thanh toán.`);
        break;
      case "credit":
        setPaymentInfo("Bạn sẽ được chuyển đến cổng thanh toán an toàn sau khi xác nhận đơn hàng.");
        break;
      case "zalopay":
      case "vnpay":
      case "shopeepay":
      case "grabpay":
      case "smartpay":
        setPaymentInfo("Bạn sẽ được chuyển đến ứng dụng thanh toán sau khi xác nhận đơn hàng.");
        break;
      default:
        setPaymentInfo("");
    }
  };

  // Xử lý khi chọn phương thức thanh toán
  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value);
    form.setValue("paymentMethod", value as any);
    
    // Xóa showPaymentDetails vì không cần nữa
    if (value === "credit") {
      setPaymentInfo("Bạn sẽ được chuyển đến cổng thanh toán 3D Secure sau khi xác nhận đơn hàng.");
    } else {
      showPaymentInfo(value);
    }
  };

  // Tính toán các giảm giá
  const calculateDiscount = () => {
    let productDiscount = 0;
    let shippingDiscount = 0;
    
    // Tính giảm giá từ mã giảm giá sản phẩm
    if (appliedDiscountCode) {
      if (appliedDiscountCode.type === "percentage") {
        productDiscount = Math.min(
          (subtotal * appliedDiscountCode.value) / 100,
          appliedDiscountCode.maxDiscount
        );
      } else if (appliedDiscountCode.type === "fixed") {
        productDiscount = Math.min(
          appliedDiscountCode.value,
          appliedDiscountCode.maxDiscount
        );
      }
    }
    
    // Tính giảm giá vận chuyển
    if (appliedShippingCode) {
      // Nếu đã miễn phí vận chuyển từ đơn hàng, không áp dụng thêm mã
      if (subtotal >= 500000) {
        shippingDiscount = 0;
      } else {
        // Miễn phí toàn bộ phí vận chuyển hoặc theo giá trị mã
        shippingDiscount = Math.min(
          calculatedShippingFee,
          appliedShippingCode.maxDiscount
        );
      }
    }
    
    return { discount: productDiscount, shipping: shippingDiscount };
  };

  const handleValidatePromotion = (promotion: IPromotion): boolean => {
    // Kiểm tra ngày hết hạn
    if (new Date(promotion.expiryDate) < new Date()) {
      toast.error("Mã giảm giá đã hết hạn");
      return false;
    }

    // Kiểm tra giá trị đơn tối thiểu
    if (subtotal < promotion.minOrder) {
      toast.error(`Đơn hàng tối thiểu ${promotion.minOrder.toLocaleString()}₫ để sử dụng mã này`);
      return false;
    }

    // Kiểm tra điều kiện khách hàng mới
    if (promotion.conditions?.newCustomerOnly && !isNewCustomer) {
      toast.error("Mã giảm giá chỉ áp dụng cho khách hàng mới");
      return false;
    }

    return true;
  };

  const handleApplyPromoCode = async (promotion: IPromotion) => {
    if (!handleValidatePromotion(promotion)) {
      return;
    }

    if (appliedPromotions.some(p => p.code === promotion.code)) {
      toast.error("Mã giảm giá đã được áp dụng");
      return;
    }

    setAppliedPromotions(prev => [...prev, promotion]);
    toast.success("Áp dụng mã giảm giá thành công!");
  };

  // Xóa mã giảm giá
  const handleRemovePromotion = (code: string) => {
    setAppliedPromotions(prev => prev.filter(p => p.code !== code));
    toast.success("Đã xóa mã giảm giá");
  };

  // Hàm mô phỏng xử lý thanh toán
  const simulateProcessPayment = async (orderData: any, paymentMethod: string) => {
    // Bắt đầu animation xử lý
    const loadingInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 800);
    
    // Mô phỏng thời gian xử lý API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(loadingInterval);
    
    // Mô phỏng thanh toán thành công
    if (paymentMethod === 'cod' || paymentMethod === 'banking') {
      toast.success("Đặt hàng thành công!", {
        description: "Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm liên hệ với bạn.",
      });
      return true;
    } else {
      // Các phương thức thanh toán khác có thể xử lý riêng
      return true;
    }
  };
  
  // Tạo mã đơn hàng
  const generateOrderNumber = () => {
    return `ECO${Date.now().toString().slice(-8)}`;
  };

  // Submit form
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setPromoError("");
    
    try {
      // Kiểm tra các điều kiện
      if (data.deliveryMethod === "pickup" && !selectedStore) {
        toast.error("Vui lòng chọn cửa hàng nhận hàng");
        setIsSubmitting(false);
        return;
      }
      
      if (data.deliveryMethod === "scheduled" && !selectedDeliveryDate) {
        toast.error("Vui lòng chọn thời gian giao hàng");
        setIsSubmitting(false);
        return;
      }
      
      if (data.deliveryMethod === "locker" && !selectedLockerLocation) {
        toast.error("Vui lòng chọn điểm nhận hàng tự động");
        setIsSubmitting(false);
        return;
      }
      
      // Mô phỏng thanh toán và tạo đơn hàng
      setIsProcessing(true);
      
      // Thêm mã giảm giá vào đơn hàng
      const discountInfo = {
        productDiscount: appliedDiscountCode ? {
          code: appliedDiscountCode.code,
          value: appliedDiscountCode.type === "percentage" ? 
            Math.min((subtotal * appliedDiscountCode.value) / 100, appliedDiscountCode.maxDiscount) : 
            Math.min(appliedDiscountCode.value, appliedDiscountCode.maxDiscount)
        } : null,
        shippingDiscount: appliedShippingCode ? {
          code: appliedShippingCode.code,
          value: Math.min(calculatedShippingFee, appliedShippingCode.maxDiscount)
        } : null
      };

      // Tính tổng tiền cuối cùng
      const { discount, shipping } = calculateDiscount();
      const finalAmount = subtotal + calculatedShippingFee - discount - shipping;
      
      // Tạo mã đơn hàng
      const orderNumber = generateOrderNumber();
      
      const orderData = {
        orderNumber,
        orderDate: new Date(),
        orderItems: items,
        customerInfo: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          district: data.district,
          city: data.city,
          note: data.note
        },
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || '',
          address: data.address,
          district: data.district,
          city: data.city
        },
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        shipping: {
          method: data.deliveryMethod,
          fee: calculatedShippingFee,
          discount: shipping,
          address: `${data.address}, ${data.district}, ${data.city}`,
          store: selectedStore || undefined,
          lockerLocation: selectedLockerLocation || undefined,
          scheduledTime: selectedDeliveryDate || undefined,
          timeSlot: selectedTimeSlot || undefined
        },
        payment: {
          method: data.paymentMethod,
          subtotal,
          discount,
          shippingFee: calculatedShippingFee - shipping,
          total: finalAmount
        },
        orderSummary: {
          subtotal,
          discount,
          shippingFee: calculatedShippingFee - shipping,
          total: finalAmount
        },
        discounts: discountInfo,
        note: data.note
      };
      
      // Lưu địa chỉ nếu người dùng chọn lưu
      if (data.saveAddress) {
        saveShippingAddress({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || '',
          address: data.address,
          district: data.district,
          city: data.city,
          isDefault: true
        });
      }
      
      // Lưu thông tin đơn hàng tạm thời vào localStorage để các trang thanh toán có thể truy cập
      localStorage.setItem('pending_order', JSON.stringify(orderData));
      
      // Chuyển hướng người dùng dựa trên phương thức thanh toán
      switch (data.paymentMethod) {
        case 'cod':
        case 'banking':
          // Đối với COD và chuyển khoản ngân hàng, xử lý ngay
          await simulateProcessPayment(orderData, data.paymentMethod);
          clearCart();
          navigate("/order-confirmation", { state: orderData });
          break;
          
        case 'credit':
          // Chuyển đến trang thanh toán thẻ tín dụng với 3D Secure
          navigate("/payment/3dsecure", { 
            state: { 
              amount: finalAmount,
              orderNumber: orderNumber,
              returnUrl: "/order-confirmation"
            } 
          });
          break;
          
        case 'momo':
          // Chuyển đến trang thanh toán MoMo
          navigate("/payment/momo", { 
            state: { 
              amount: finalAmount,
              orderNumber: orderNumber,
              returnUrl: "/order-confirmation"
            } 
          });
          break;
          
        case 'vnpay':
          // Chuyển đến trang thanh toán VNPay
          navigate("/payment/vnpay", { 
            state: { 
              amount: finalAmount,
              orderNumber: orderNumber,
              returnUrl: "/order-confirmation"
            } 
          });
          break;
          
        case 'zalopay':
          // Chuyển đến trang thanh toán ZaloPay
          navigate("/payment/zalopay", { 
            state: { 
              amount: finalAmount,
              orderNumber: orderNumber,
              returnUrl: "/order-confirmation"
            } 
          });
          break;
          
        default:
          // Phương thức thanh toán không được hỗ trợ
          toast.error("Phương thức thanh toán không được hỗ trợ");
          setIsProcessing(false);
          setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.");
      setIsProcessing(false);
      setIsSubmitting(false);
    }
  };

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
          <Container>
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Giỏ hàng của bạn đang trống</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
                </p>
              </div>
              <Button asChild size="lg" className="px-8">
                <Link to="/deals">
                  Khám phá sản phẩm
                </Link>
                </Button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // Thêm component loading
  const ProcessingOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-muted animate-spin border-t-primary" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Đang xử lý đơn hàng</h3>
            <p className="text-sm text-muted-foreground">
              {loadingStep === 0 && "Đang kiểm tra thông tin..."}
              {loadingStep === 1 && "Đang xác nhận đơn hàng..."}
              {loadingStep === 2 && "Đang khởi tạo thanh toán..."}
              {loadingStep === 3 && "Sắp hoàn tất..."}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${loadingStep >= 1 ? 'text-primary' : 'text-muted'}`} />
              <span className={loadingStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}>
                Xác thực thông tin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${loadingStep >= 2 ? 'text-primary' : 'text-muted'}`} />
              <span className={loadingStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}>
                Khởi tạo đơn hàng
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${loadingStep >= 3 ? 'text-primary' : 'text-muted'}`} />
              <span className={loadingStep >= 3 ? 'text-foreground' : 'text-muted-foreground'}>
                Chuẩn bị thanh toán
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Tính phụ phí hoặc giảm giá so với phí chuẩn
  const getFeeChangeText = (method: string, city: string, deliveryDate?: string) => {
    if (method === "standard" || subtotal >= 500000) return null;
    
    if (method === "express") return "+50.000₫";
    if (method === "sameday") {
      if (["Hà Nội", "TP. Hồ Chí Minh"].includes(city)) {
        return "+100.000₫";
      } else {
        return "+150.000₫";
      }
    }
    if (method === "scheduled") {
      let fee = "+30.000₫";
      if (deliveryDate) {
        const parts = deliveryDate.split('/');
        if (parts.length === 3) {
          const deliveryDateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          const today = new Date();
          const diffDays = Math.ceil((deliveryDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));
          if (diffDays >= 3) fee = "+20.000₫";
        }
      }
      return fee;
    }
    if (method === "eco") return "-20.000₫";
    if (method === "locker") return "-30.000₫";
    if (method === "pickup") return "Miễn phí";
    
    return null;
  };

  // Cập nhật bảng tóm tắt
  const OrderSummary = () => {
    // Lấy thông tin về giảm giá và phương thức giao hàng
    const { discount: codeDiscount, shipping: shippingDiscount } = calculateDiscount();
    const deliveryMethod = form.watch("deliveryMethod");
    
    // Giá trị giảm giá trực tiếp sản phẩm (ví dụ: sale off)
    const productDiscount = subtotal >= 500000 ? 50000 : 0;
    
    // Phí vận chuyển tiêu chuẩn (có thể miễn phí nếu mua đủ)
    const standardShippingFee = subtotal >= 500000 ? 0 : baseShippingFee;
    
    // Tính phí vận chuyển gốc dựa trên phương thức
    const baseDeliveryFee = calculateShippingFee(
      deliveryMethod,
      subtotal,
      baseShippingFee,
      selectedCity,
      selectedDeliveryDate
    );
    
    // Tính phí vận chuyển sau khi áp dụng voucher freeship
    const finalShippingFee = Math.max(0, baseDeliveryFee - shippingDiscount);
    
    // Tính tổng giá trị sản phẩm sau khuyến mãi
    const productTotalAfterDiscount = Math.max(0, subtotal - productDiscount - codeDiscount);
    
    // Tính tổng tiền cuối cùng = (giá trị sản phẩm - giảm giá sản phẩm - giảm giá từ mã) + (phí vận chuyển - voucher freeship)
    const finalTotal = productTotalAfterDiscount + finalShippingFee;
    
    // Tính giá trị phụ phí của phương thức vận chuyển so với tiêu chuẩn
    const getExtraFee = (method: string) => {
      switch (method) {
        case "standard": return 0;
        case "express": return 50000;
        case "sameday": 
          return ["Hà Nội", "TP. Hồ Chí Minh"].includes(selectedCity) ? 100000 : 150000;
        case "scheduled": 
          if (selectedDeliveryDate) {
            const parts = selectedDeliveryDate.split('/');
            if (parts.length === 3) {
              const deliveryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
              const today = new Date();
              const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
              return diffDays >= 3 ? 20000 : 30000;
            }
          }
          return 30000;
        case "eco": return -20000;
        case "locker": return -30000;
        case "pickup": return -baseShippingFee; // Bằng phí gốc nhưng âm (để hiển thị miễn phí)
        default: return 0;
      }
    };
    
    // Phụ phí của phương thức vận chuyển được chọn
    const extraFee = getExtraFee(deliveryMethod);
    
    // Tên hiển thị của phương thức giao hàng
    const getDeliveryMethodName = (method: string) => {
      const extra = getExtraFee(method);
      switch (method) {
        case "standard": return "Tiêu chuẩn";
        case "express": return `Giao nhanh (+${extra.toLocaleString()}₫)`;
        case "sameday": return `Giao trong ngày (+${extra.toLocaleString()}₫)`;
        case "scheduled": return `Theo lịch hẹn (+${extra.toLocaleString()}₫)`;
        case "eco": return "Eco-friendly (-20.000₫)";
        case "locker": return "Nhận tại locker (-30.000₫)";
        case "pickup": return "Nhận tại cửa hàng (Miễn phí)";
        default: return "Tiêu chuẩn";
      }
    };
    
    // Tính số tiền tiết kiệm
    const savedAmount = productDiscount + codeDiscount + (baseShippingFee - finalShippingFee);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-muted-foreground">Tạm tính ({items.length} sản phẩm)</span>
          <span>{subtotal.toLocaleString()}₫</span>
        </div>

        {productDiscount > 0 && (
          <div className="flex justify-between items-start text-Eco-600">
            <span className="flex items-center gap-1">
              <BadgePercent className="h-4 w-4" />
              Giảm giá sản phẩm
            </span>
            <span>-{productDiscount.toLocaleString()}₫</span>
          </div>
        )}

        {codeDiscount > 0 && (
          <div className="flex justify-between items-start text-amber-600">
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Mã giảm giá
            </span>
            <span>-{codeDiscount.toLocaleString()}₫</span>
          </div>
        )}

        <div className="flex justify-between items-start">
          <span className="text-muted-foreground flex items-center gap-1">
            Phí vận chuyển
            {subtotal >= 500000 && deliveryMethod === "standard" && (
              <Badge variant="outline" className="ml-1 text-xs font-normal text-Eco-600">
                Miễn phí
              </Badge>
            )}
            {extraFee !== 0 && (
              <Badge variant="outline" className={`ml-1 text-xs font-normal ${extraFee > 0 ? 'text-amber-600' : 'text-Eco-600'}`}>
                {extraFee > 0 ? `+${extraFee.toLocaleString()}₫` : extraFee < 0 ? 'Giảm giá' : ''}
              </Badge>
            )}
          </span>
          <div className="text-right">
            {finalShippingFee === 0 ? (
              <span className="font-medium text-Eco-600">Miễn phí</span>
            ) : (
              <span>{finalShippingFee.toLocaleString()}₫</span>
            )}
            {baseDeliveryFee > finalShippingFee && baseDeliveryFee > 0 && (
              <div className="text-xs text-muted-foreground line-through">
                {baseDeliveryFee.toLocaleString()}₫
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-start text-sm">
          <span className="text-muted-foreground">Phương thức giao hàng</span>
          <span className="text-right font-medium">
            {getDeliveryMethodName(deliveryMethod)}
          </span>
        </div>

        <div className="flex justify-between items-start text-sm">
          <span className="text-muted-foreground">Phương thức thanh toán</span>
          <span className="text-right font-medium">
            {selectedPaymentMethod === "cod" && "Tiền mặt khi nhận hàng"}
            {selectedPaymentMethod === "banking" && "Chuyển khoản ngân hàng"}
            {selectedPaymentMethod === "credit" && "Thẻ tín dụng"}
            {selectedPaymentMethod === "momo" && "Ví MoMo"}
            {selectedPaymentMethod === "zalopay" && "ZaloPay"}
            {selectedPaymentMethod === "vnpay" && "VNPay"}
            {selectedPaymentMethod === "shopeepay" && "ShopeePay"}
            {selectedPaymentMethod === "grabpay" && "GrabPay"}
            {selectedPaymentMethod === "smartpay" && "SmartPay"}
          </span>
        </div>

        <Separator className="my-2" />

        <div className="space-y-4 rounded-lg p-4 border border-dashed border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              Mã giảm giá
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="text-primary"
                >
                  Xem mã giảm giá
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary"/>
                  Mã giảm giá có sẵn
                </DialogTitle>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-600">Mã miễn phí vận chuyển</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {suggestedDiscountCodes
                        .filter(discount => discount.type === "shipping" && !discount.conditions?.hidden)
                        .map((discount) => {
                          const isDisabled = subtotal < discount.minOrder || 
                            appliedShippingCode !== null;
                          const isApplied = appliedShippingCode?.code === discount.code;
                          
                          return (
                            <div
                              key={discount.code}
                              className={`flex items-start justify-between p-3 border rounded-lg transition-colors ${
                                isApplied ? 'border-primary bg-primary/5' :
                                isDisabled ? 'opacity-60' : 'hover:border-primary cursor-pointer'
                              }`}
                              onClick={() => !isDisabled && !isApplied && handleUseDiscountCode(discount.code)}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-blue-600">{discount.code}</span>
                                  {isApplied && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                                      Đang áp dụng
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{discount.description}</p>
                                {discount.minOrder > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    Đơn tối thiểu {discount.minOrder.toLocaleString()}₫
                                  </p>
                                )}
                              </div>
                              <Badge 
                                variant={isDisabled && !isApplied ? "outline" : "secondary"}
                                className={`shrink-0 ${
                                  isApplied ? 'bg-primary text-white' :
                                  isDisabled ? '' : 'bg-blue-100 text-blue-600'
                                }`}
                              >
                                {isApplied ? "Đã áp dụng" : 
                                 isDisabled ? "Không thể dùng" : "Sử dụng"}
                              </Badge>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <BadgePercent className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-600">Mã giảm giá sản phẩm</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {suggestedDiscountCodes
                        .filter(discount => discount.type !== "shipping" && !discount.conditions?.hidden)
                        .map((discount) => {
                          const isDisabled = subtotal < discount.minOrder || 
                            (discount.conditions?.newCustomerOnly && !isNewCustomer) ||
                            appliedDiscountCode !== null;
                          const isApplied = appliedDiscountCode?.code === discount.code;
                          
                          return (
                            <div
                              key={discount.code}
                              className={`flex items-start justify-between p-3 border rounded-lg transition-colors ${
                                isApplied ? 'border-primary bg-primary/5' :
                                isDisabled ? 'opacity-60' : 'hover:border-primary cursor-pointer'
                              }`}
                              onClick={() => !isDisabled && !isApplied && handleUseDiscountCode(discount.code)}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-amber-600">{discount.code}</span>
                                  {isApplied && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                                      Đang áp dụng
                                    </Badge>
                                  )}
                                  {discount.conditions?.newCustomerOnly && (
                                    <Badge variant="outline" className="text-xs">Khách mới</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{discount.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Đơn tối thiểu {discount.minOrder.toLocaleString()}₫
                                </p>
                              </div>
                              <Badge 
                                variant={isDisabled && !isApplied ? "outline" : "secondary"}
                                className={`shrink-0 ${
                                  isApplied ? 'bg-primary text-white' :
                                  isDisabled ? '' : 'bg-amber-100 text-amber-600'
                                }`}
                              >
                                {isApplied ? "Đã áp dụng" : 
                                 isDisabled ? "Không thể dùng" : "Sử dụng"}
                              </Badge>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã giảm giá"
              value={discountCode}
              onChange={handleDiscountCodeChange}
              className="uppercase"
              autoComplete="off"
            />
            <Button 
              type="button"
              variant="outline"
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount}
            >
              {isApplyingDiscount ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              ) : "Áp dụng"}
            </Button>
          </div>

          {(appliedDiscountCode || appliedShippingCode) && (
            <div className="space-y-2 pt-2">
              {appliedDiscountCode && (
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    <div>
                      <span className="font-medium">{appliedDiscountCode.code}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {appliedDiscountCode.type === "percentage" 
                          ? `Giảm ${appliedDiscountCode.value}% tối đa ${appliedDiscountCode.maxDiscount.toLocaleString()}₫` 
                          : `Giảm ${appliedDiscountCode.value.toLocaleString()}₫`}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveDiscount("product")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {appliedShippingCode && (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="font-medium">{appliedShippingCode.code}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Miễn phí vận chuyển {appliedShippingCode.maxDiscount > 0 ? `tối đa ${appliedShippingCode.maxDiscount.toLocaleString()}₫` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveDiscount("shipping")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
                        
        <Separator className="my-4" />

        <div className="flex justify-between font-medium text-lg">
          <span>Tổng cộng</span>
          <div className="text-right">
            <span className="text-xl font-semibold text-primary">{finalTotal.toLocaleString()}₫</span>
            {savedAmount > 0 && (
              <div className="text-xs text-muted-foreground line-through">
                {(subtotal + baseShippingFee).toLocaleString()}₫
              </div>
            )}
          </div>
        </div>

        {savedAmount > 0 && (
          <div className="text-sm text-Eco-600 text-right">
            Tiết kiệm: {savedAmount.toLocaleString()}₫
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
          <p className="flex items-center gap-1 text-sm text-blue-700">
            <Truck className="h-4 w-4 flex-shrink-0" />
            <span>Thời gian giao hàng dự kiến: {getEstimatedDeliveryTime(deliveryMethod)}</span>
          </p>
          {subtotal < 500000 && (
            <p className="flex items-center gap-1 text-sm text-Eco-600">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span>Mua thêm {(500000 - subtotal).toLocaleString()}₫ để được miễn phí giao hàng tiêu chuẩn</span>
            </p>
          )}
        </div>
      </div>
    );
  };

  // Sửa lại hàm handleApplyDiscount để sửa lỗi
  const handleApplyDiscount = async (directCodeOrEvent?: string | React.MouseEvent<HTMLButtonElement>) => {
    // Nếu là sự kiện click từ button, không có direct code
    const isDirectCode = typeof directCodeOrEvent === 'string';
    const codeToApply = isDirectCode ? directCodeOrEvent : discountCode;
    
    if (!codeToApply.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    
    setIsApplyingDiscount(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the promotion by code
      const promotion = suggestedDiscountCodes.find(
        discount => discount.code.toLowerCase() === codeToApply.toLowerCase()
      );
      
      if (!promotion) {
        toast.error("Mã giảm giá không hợp lệ");
        setIsApplyingDiscount(false);
        return;
      }
      
      // Validate promotion
      if (!handleValidatePromotion(promotion)) {
        setIsApplyingDiscount(false);
        return;
      }
      
      // Apply promotion based on type
      if (promotion.type === "shipping") {
        if (appliedShippingCode) {
          toast.error("Bạn đã áp dụng mã miễn phí vận chuyển rồi");
          setIsApplyingDiscount(false);
          return;
        }
        setAppliedShippingCode(promotion);
        toast.success(`Đã áp dụng mã ${promotion.code}`);
      } else {
        if (appliedDiscountCode) {
          toast.error("Bạn đã áp dụng mã giảm giá sản phẩm rồi");
          setIsApplyingDiscount(false);
          return;
        }
        setAppliedDiscountCode(promotion);
        toast.success(`Đã áp dụng mã ${promotion.code}`);
      }
      
      setDiscountCode(""); // Clear input
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // Hàm handleUseDiscountCode để áp dụng ngay mã giảm giá khi người dùng click vào
  const handleUseDiscountCode = (code: string) => {
    setDiscountCode(code);
    handleApplyDiscount(code);
  };

  // Hàm handleRemoveDiscount để xóa mã giảm giá
  const handleRemoveDiscount = (type: "product" | "shipping") => {
    if (type === "product") {
      setAppliedDiscountCode(null);
      toast.success("Đã xóa mã giảm giá sản phẩm");
    } else {
      setAppliedShippingCode(null);
      toast.success("Đã xóa mã miễn phí vận chuyển");
    }
  };

  // Cập nhật xử lý onChange cho input mã giảm giá
  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiscountCode(value.toUpperCase());
  };

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen pt-24 pb-16 bg-background"
      >
        <Container>
          <div className="mb-4 animate-fade-in">
            <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-2 transition-all group">
              <Link to="/cart" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Quay lại giỏ hàng</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Thanh toán</h1>
            <p className="text-muted-foreground">Hoàn tất thông tin đơn hàng</p>
          </div>
          
          {/* Thêm overlay khi đang xử lý */}
          {isProcessing && <ProcessingOverlay />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <Card className="animate-slide-up delay-200">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5" />
                      Thông tin giao hàng
                    </h2>

                  <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và tên <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Nguyễn Văn A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số điện thoại <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="0901234567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                    
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="example@email.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tỉnh/Thành phố <span className="text-destructive">*</span></FormLabel>
                              <Select
                                onValueChange={(value) => handleCityChange(value)}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {cities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quận/Huyện <span className="text-destructive">*</span></FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedCity}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn quận/huyện" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableDistricts.map((district) => (
                                    <SelectItem key={district} value={district}>
                                      {district}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Số nhà, đường, phường/xã..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian nhận hàng, chỉ dẫn địa điểm..." 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="saveAddress"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Lưu thông tin cho lần sau</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Thông tin giao hàng sẽ được lưu để tiện sử dụng cho đơn hàng tiếp theo
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up delay-300">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                      <Truck className="h-5 w-5" />
                      Phương thức giao hàng
                    </h2>

                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormControl>
                            <RadioGroup
                              onValueChange={handleDeliveryMethodChange}
                              value={field.value}
                              className="space-y-4"
                            >
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="standard" id="standard" />
                                <Label htmlFor="standard" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Truck className="h-5 w-5 text-blue-500" />
                                  <div>
                                    <div className="font-medium">Giao hàng tiêu chuẩn</div>
                                    <div className="text-sm text-muted-foreground">2-3 ngày (miễn phí cho đơn ≥ 500.000₫)</div>
                    </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto animate-fade-in">Phổ biến</Badge>
                  </div>
                  
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="express" id="express" />
                                <Label htmlFor="express" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Timer className="h-5 w-5 text-orange-500" />
                                  <div>
                                    <div className="font-medium">Giao hàng nhanh</div>
                                    <div className="text-sm text-muted-foreground">1-2 ngày (phụ phí 50.000₫)</div>
                      </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-orange-50 text-orange-600">Express</Badge>
                    </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="sameday" id="sameday" />
                                <Label htmlFor="sameday" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Bike className="h-5 w-5 text-green-500" />
                                  <div>
                                    <div className="font-medium">Giao hàng trong ngày</div>
                                    <div className="text-sm text-muted-foreground">2-4 giờ (phụ phí 100.000₫)</div>
                                  </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-600">Siêu tốc</Badge>
                  </div>
                  
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="scheduled" id="scheduled" />
                                <Label htmlFor="scheduled" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <CalendarClock className="h-5 w-5 text-purple-500" />
                                  <div>
                                    <div className="font-medium">Giao hàng theo lịch hẹn</div>
                                    <div className="text-sm text-muted-foreground">Chọn ngày và khung giờ (phụ phí 30.000₫)</div>
                            </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-600">Mới</Badge>
                              </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="eco" id="eco" />
                                <Label htmlFor="eco" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Leaf className="h-5 w-5 text-green-600" />
                                  <div>
                                    <div className="font-medium">Giao hàng eco</div>
                                    <div className="text-sm text-muted-foreground">3-5 ngày (giảm 20.000₫)</div>
                            </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-600">Eco</Badge>
                              </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="locker" id="locker" />
                                <Label htmlFor="locker" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Package className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <div className="font-medium">Giao đến tủ locker</div>
                                    <div className="text-sm text-muted-foreground">Nhận hàng 24/7 (giảm 30.000₫)</div>
                            </div>
                          </Label>
                                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-600">24/7</Badge>
                        </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="pickup" id="pickup" />
                                <Label htmlFor="pickup" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Store className="h-5 w-5 text-purple-500" />
                                  <div>
                                    <div className="font-medium">Lấy tại cửa hàng</div>
                                    <div className="text-sm text-muted-foreground">Tiết kiệm phí giao hàng</div>
                            </div>
                          </Label>
                                <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-600">Miễn phí</Badge>
                        </div>
                    </RadioGroup>
                          </FormControl>

                          {showDeliveryTimeSlots && (
                            <div className="pt-4 space-y-4 animate-fade-in">
                              {field.value === "scheduled" && (
                                <div className="mb-4">
                                  <h3 className="font-medium flex items-center gap-2 mb-3">
                                    <CalendarClock className="h-4 w-4" />
                                    Chọn ngày giao hàng
                                  </h3>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[...Array(7)].map((_, index) => {
                                      const date = new Date();
                                      date.setDate(date.getDate() + index + 1);
                                      const dateStr = format(date, "dd/MM/yyyy", { locale: vi });
                                      const dayStr = format(date, "EEEE", { locale: vi });
                                      return (
                                        <button
                                          key={dateStr}
                                          type="button"
                                          className={`p-3 text-sm border rounded-md transition-all ${
                                            selectedDeliveryDate === dateStr
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'hover:border-primary hover:bg-primary/5'
                                          }`}
                                          onClick={() => setSelectedDeliveryDate(dateStr)}
                                        >
                                          <div className="font-medium">{dateStr}</div>
                                          <div className="text-xs text-muted-foreground capitalize">{dayStr}</div>
                                        </button>
                                      );
                                    })}
                          </div>
                                </div>
                              )}

                              <div>
                                <h3 className="font-medium flex items-center gap-2 mb-3">
                                  <Clock className="h-4 w-4" />
                                  {field.value === "scheduled" ? "Chọn khung giờ giao hàng" : "Thời gian giao hàng mong muốn"}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {deliveryTimeSlots[field.value as keyof typeof deliveryTimeSlots]?.map((slot) => (
                                    <button
                                      key={slot.time}
                                      type="button"
                                      disabled={slot.status === "busy"}
                                      className={`p-3 text-sm border rounded-md transition-all relative ${
                                        selectedTimeSlot === slot.time
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : slot.status === "busy"
                                        ? 'opacity-50 cursor-not-allowed bg-muted'
                                        : 'hover:border-primary hover:bg-primary/5'
                                      }`}
                                      onClick={() => setSelectedTimeSlot(slot.time)}
                                    >
                                      <div className="font-medium">{slot.time}</div>
                                      {slot.status === "limited" && (
                                        <Badge variant="outline" className="absolute top-1 right-1 text-xs">
                                          Sắp hết
                                        </Badge>
                                      )}
                                    </button>
                                  ))}
                          </div>
                        </div>
                      </div>
                    )}

                          {field.value === "locker" && (
                            <div className="pt-4 space-y-4 animate-fade-in">
                              <h3 className="font-medium flex items-center gap-2">
                                <MapPinned className="h-4 w-4" />
                                Chọn điểm lấy hàng
                              </h3>
                              <div className="space-y-3">
                                {availableLockers.map((locker) => (
                                  <button
                                    key={locker.id}
                                    type="button"
                                    className={`w-full p-4 text-left border rounded-md transition-all ${
                                      selectedLockerLocation === locker.id
                                      ? 'border-primary bg-primary/5'
                                      : 'hover:border-primary hover:bg-primary/5'
                                    }`}
                                    onClick={() => setSelectedLockerLocation(locker.id)}
                                  >
                                    <div className="font-medium">{locker.name}</div>
                                    <div className="text-sm text-muted-foreground">{locker.address}</div>
                                  </button>
                                ))}
                  </div>
                            </div>
                          )}

                          {field.value === "pickup" && (
                            <div className="pt-4 space-y-4 animate-fade-in">
                              <h3 className="font-medium flex items-center gap-2">
                                <Store className="h-4 w-4" />
                                Chọn cửa hàng
                              </h3>
                              <div className="space-y-3">
                                {availableStores.map((store) => (
                                  <button
                                    key={store.id}
                                    type="button"
                                    className={`w-full p-4 text-left border rounded-md transition-all ${
                                      selectedStore === store.id
                                      ? 'border-primary bg-primary/5'
                                      : 'hover:border-primary hover:bg-primary/5'
                                    }`}
                                    onClick={() => setSelectedStore(store.id)}
                                  >
                                    <div className="font-medium">{store.name}</div>
                                    <div className="text-sm text-muted-foreground">{store.address}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up delay-400">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5" />
                      Phương thức thanh toán
                    </h2>

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormControl>
                    <RadioGroup 
                              onValueChange={handlePaymentMethodChange}
                              value={field.value}
                              className="space-y-4"
                            >
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Banknote className="h-5 w-5 text-orange-500" />
                                  <div>
                                    <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                                    <div className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</div>
                                  </div>
                          </Label>
                                <Badge variant="outline" className="ml-auto">Phổ biến</Badge>
                        </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="banking" id="banking" />
                                <Label htmlFor="banking" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Building2 className="h-5 w-5 text-blue-500" />
                                  <div>
                                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                                    <div className="text-sm text-muted-foreground">Hỗ trợ nhiều ngân hàng</div>
                        </div>
                                </Label>
                        </div>
                        
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="credit" id="credit" />
                                <Label htmlFor="credit" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                                  <div>
                                    <div className="font-medium">Thanh toán qua thẻ tín dụng</div>
                                    <div className="text-sm text-muted-foreground">Chuyển đến cổng thanh toán 3D Secure</div>
                                  </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-600">An toàn</Badge>
                          </div>
                          
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="momo" id="momo" />
                                <Label htmlFor="momo" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Smartphone className="h-5 w-5 text-pink-500" />
                                  <div>
                                    <div className="font-medium">Ví MoMo</div>
                                    <div className="text-sm text-muted-foreground">Quét mã QR hoặc đăng nhập MoMo</div>
                          </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-pink-50 text-pink-600">QR Pay</Badge>
                        </div>
                          
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="zalopay" id="zalopay" />
                                <Label htmlFor="zalopay" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <QrCode className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <div className="font-medium">ZaloPay</div>
                                    <div className="text-sm text-muted-foreground">Thanh toán qua ví ZaloPay</div>
                      </div>
                                </Label>
                        </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="vnpay" id="vnpay" />
                                <Label htmlFor="vnpay" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Shield className="h-5 w-5 text-red-500" />
                                  <div>
                                    <div className="font-medium">VNPay</div>
                                    <div className="text-sm text-muted-foreground">Thanh toán qua cổng VNPAY-QR</div>
                      </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-red-50 text-red-600">Ưu đãi</Badge>
                              </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="shopeepay" id="shopeepay" />
                                <Label htmlFor="shopeepay" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Wallet className="h-5 w-5 text-orange-600" />
                                  <div>
                                    <div className="font-medium">ShopeePay</div>
                                    <div className="text-sm text-muted-foreground">Thanh toán qua ví ShopeePay</div>
                      </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-orange-50 text-orange-600">Hoàn tiền 10%</Badge>
                  </div>
                  
                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="grabpay" id="grabpay" />
                                <Label htmlFor="grabpay" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Wallet className="h-5 w-5 text-green-600" />
                                  <div>
                                    <div className="font-medium">GrabPay</div>
                                    <div className="text-sm text-muted-foreground">Thanh toán qua ví GrabPay</div>
                  </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-600">Mới</Badge>
              </div>

                              <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:border-primary transition-colors radio-card">
                                <RadioGroupItem value="smartpay" id="smartpay" />
                                <Label htmlFor="smartpay" className="flex-1 flex items-center gap-2 cursor-pointer">
                                  <Smartphone className="h-5 w-5 text-purple-600" />
              <div>
                                    <div className="font-medium">SmartPay</div>
                                    <div className="text-sm text-muted-foreground">Thanh toán qua ví SmartPay</div>
                                  </div>
                                </Label>
                                <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-600">Giảm 50K</Badge>
                              </div>
                            </RadioGroup>
                          </FormControl>

                          {field.value === "credit" && (
                            <div className="pt-4 space-y-4 animate-fade-in">
                              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                                <ShieldCheck className="h-5 w-5 text-blue-500" />
                                <div className="text-sm">
                                  <p className="font-medium text-blue-700">Thanh toán an toàn qua cổng 3D Secure</p>
                                  <p className="text-blue-600">Bạn sẽ được chuyển đến cổng thanh toán an toàn sau khi xác nhận đơn hàng</p>
                        </div>
                        </div>
                      </div>
                          )}

                          {paymentInfo && field.value !== "credit" && (
                            <div className="mt-4 p-4 bg-muted rounded-md text-sm whitespace-pre-line animate-fade-in">
                              {paymentInfo}
                  </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="animate-slide-up delay-500">
                <div className="sticky top-24">
                  <Card className="animate-scale-fade">
                    <CardContent className="p-6">
                      <h2 className="font-semibold text-lg mb-4">Đơn hàng của bạn</h2>
                      
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                        {items.map((item) => {
                          // Tính ngày hết hạn
                          let expiryDateText = "";
                          if (item.expiryDate) {
                            const expiryDate = new Date(item.expiryDate);
                            expiryDateText = format(expiryDate, "dd/MM/yyyy", { locale: vi });
                          }
                          
                          return (
                    <div key={item.id} className="flex gap-3">
                              <div className="h-16 w-16 rounded-md border overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                      <div className="flex-1">
                    <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-medium line-clamp-1 text-sm">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                                    {expiryDateText && (
                                      <div className="flex items-center text-xs text-amber-600 mt-1">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>HSD: {expiryDateText}</span>
                    </div>
                                    )}
                    </div>
                                  <div className="text-right">
                                    <p className="font-medium">{(item.price * item.quantity).toLocaleString()}₫</p>
                                    {item.originalPrice && (
                                      <p className="text-xs text-muted-foreground line-through">
                                        {(item.originalPrice * item.quantity).toLocaleString()}₫
                                      </p>
                                    )}
                    </div>
                  </div>
                </div>
              </div>
                          );
                        })}
            </div>
                  
                        <Separator className="my-4" />
                  
                        <OrderSummary />
                        
                        <Button 
                          type="submit"
                          className="w-full mt-6 h-12 text-base relative overflow-hidden group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                              <span>Đang xử lý...</span>
          </div>
                          ) : (
                            <>
                              <span className="inline-block group-hover:-translate-y-full transition-transform duration-200">
                                Đặt hàng
                              </span>
                              <span className="absolute top-full left-0 w-full text-center group-hover:-translate-y-full transition-transform duration-200">
                                Xác nhận
                              </span>
                            </>
                          )}
                        </Button>
                        
                        <p className="text-center text-xs text-muted-foreground mt-4">
                          Bằng cách đặt hàng, bạn đồng ý với <Link to="/terms" className="underline hover:text-primary">Điều khoản dịch vụ</Link> của chúng tôi
                        </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-4 animate-scale-fade delay-100">
                    <CardContent className="p-4 text-sm space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-Eco-500 mt-1 flex-shrink-0" />
                        <p>Cam kết đảm bảo chất lượng sản phẩm</p>
          </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-Eco-500 mt-1 flex-shrink-0" />
                        <p>Giao hàng đúng thời gian dự kiến</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-Eco-500 mt-1 flex-shrink-0" />
                        <p>Miễn phí giao hàng cho đơn từ 500.000₫</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CalendarClock className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                        <p>Hỗ trợ đổi trả trong vòng 24h nếu sản phẩm không đúng chất lượng</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        </Container>
      </motion.main>
      <Footer />

      <style 
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes scaleFade {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            .animate-slide-up {
              opacity: 0;
              animation: slideUp 0.5s ease-out forwards;
            }
            
            .animate-scale-fade {
              opacity: 0;
              animation: scaleFade 0.5s ease-out forwards;
            }
            
            .animate-fade-in {
              opacity: 0;
              animation: fadeIn 0.3s ease-out forwards;
            }
            
            .animate-pulse {
              animation: pulse 2s infinite;
            }
            
            .delay-100 { animation-delay: 100ms; }
            .delay-200 { animation-delay: 200ms; }
            .delay-300 { animation-delay: 300ms; }
            .delay-400 { animation-delay: 400ms; }
            .delay-500 { animation-delay: 500ms; }
            
            /* Hover effect for payment and delivery method options */
            .radio-card {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .radio-card:hover {
              transform: translateY(-2px) scale(1.01);
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            }
            
            /* Button hover animation */
            .button-hover-effect {
              position: relative;
              overflow: hidden;
            }
            
            .button-hover-effect::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 300%;
              height: 300%;
              background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
              transition: transform 0.5s, opacity 0.3s;
            }
            
            .button-hover-effect:hover::after {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }

            /* Animation cho form fields */
            .form-field-animation {
              transform-origin: top;
              animation: formFieldEnter 0.4s ease-out forwards;
            }

            @keyframes formFieldEnter {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            /* Hiệu ứng cho payment badges */
            .payment-badge {
              transition: all 0.3s ease;
            }

            .payment-badge:hover {
              transform: scale(1.05);
              filter: brightness(1.1);
            }
          `
        }}
      />
    </>
  );
};

// Helper function để tính thời gian giao hàng
const getEstimatedDeliveryTime = (method: string) => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  };

  switch (method) {
    case "express": {
      const date = new Date(today);
      date.setDate(date.getDate() + 2);
      return `1-2 ngày (dự kiến ${date.toLocaleDateString('vi-VN', options)})`;
    }
    case "sameday":
      return "Trong ngày hôm nay";
    case "scheduled":
      return "Theo lịch hẹn đã chọn";
    case "eco": {
      const date = new Date(today);
      date.setDate(date.getDate() + 5);
      return `3-5 ngày (dự kiến ${date.toLocaleDateString('vi-VN', options)})`;
    }
    case "locker": {
      const date = new Date(today);
      date.setDate(date.getDate() + 3);
      return `1-3 ngày (dự kiến ${date.toLocaleDateString('vi-VN', options)})`;
    }
    case "pickup":
      return "Có thể lấy ngay sau khi đơn hàng được xác nhận";
    case "standard":
    default: {
      const date = new Date(today);
      date.setDate(date.getDate() + 3);
      return `2-3 ngày (dự kiến ${date.toLocaleDateString('vi-VN', options)})`;
    }
  }
};

export default Checkout;

