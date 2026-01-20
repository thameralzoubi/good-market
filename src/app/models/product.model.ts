// مودل المنتج الأساسي + توسعة لدعم صفحة التفاصيل
export interface ProductM {
  // ====== الخصائص الأساسية (موجودة سابقًا) ======
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  images: string[];
  rating: number;
  description: string;

  // ====== خصائص إضافية لتحسين صفحة التفاصيل ======

  // اسم العلامة التجارية (Brand)
  brand?: string;

  // نسبة الخصم إن وجدت
  discountPercentage?: number;

  // كمية المنتج المتوفرة
  stock: number;

  // رقم المنتج الداخلي
  sku?: string;

  // أبعاد المنتج (للعرض التقني)
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };

  // وزن المنتج
  weight?: number;

  // تقييمات المستخدمين
  reviews?: {
    rating: number;
    comment: string;
    reviewerName: string;
    date: string;
  }[];
}
