export type PromotionType = 'percentage' | 'fixed' | 'shipping' | 'combo';

export interface IPromotion {
  code: string;
  type: PromotionType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  description: string;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  currentUsage?: number;
  applicableProducts?: string[];
  excludedProducts?: string[];
  conditions?: {
    minItems?: number;
    specificCategories?: string[];
    paymentMethods?: string[];
    newCustomerOnly?: boolean;
  };
  stackable: boolean;
}

export const promotions: IPromotion[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderValue: 200000,
    maxDiscount: 100000,
    description: "Giảm 10% cho đơn hàng từ 200K (tối đa 100K)",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
    conditions: {
      newCustomerOnly: true
    },
    stackable: false
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 100,
    minOrderValue: 300000,
    description: "Miễn phí giao hàng cho đơn từ 300K",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
    stackable: true
  },
  {
    code: "FLASH50",
    type: "fixed",
    value: 50000,
    minOrderValue: 500000,
    description: "Giảm 50K cho đơn từ 500K",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2025-12-31"),
    usageLimit: 1000,
    stackable: false
  },
  {
    code: "COMBO20",
    type: "combo",
    value: 20,
    minOrderValue: 400000,
    description: "Giảm 20% khi mua 2 sản phẩm trở lên",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
    conditions: {
      minItems: 2
    },
    maxDiscount: 200000,
    stackable: false
  },
  {
    code: "ECO15",
    type: "percentage",
    value: 15,
    description: "Giảm 15% cho phương thức giao hàng eco",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
    conditions: {
      paymentMethods: ["eco"]
    },
    maxDiscount: 50000,
    stackable: true
  },
  {
    code: "PAYDAY30",
    type: "percentage",
    value: 30,
    minOrderValue: 1000000,
    description: "Giảm 30% cho đơn từ 1 triệu (cuối tháng)",
    startDate: new Date("2024-03-25"),
    endDate: new Date("2025-12-31"),
    maxDiscount: 300000,
    stackable: false
  }
]; 