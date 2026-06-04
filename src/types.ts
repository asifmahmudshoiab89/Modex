/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  category: string;
  price: number; // Current selling price
  originalPrice: number; // For strikethrough logic (flash sale)
  images: string[];
  brand: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  videoUrl?: string;
  sku: string;
  stock: number;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  vendorId?: string;
}

export interface CartItem {
  id: string; // ID + "-" + size + "-" + color to make it unique in cart
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  rating: number;
  followers: number;
  description: string;
  verified: boolean;
}

export interface ShippingRate {
  zone: string;
  rate: number;
  estDays: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  appliedCoupon?: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentDetails?: any;
  createdAt: string;
  trackingCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
  role: 'admin' | 'customer';
  addresses?: Array<{
    id: string;
    label: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}
