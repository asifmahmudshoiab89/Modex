/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Heart, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currency: 'USD' | 'BDT' | 'INR';
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export function formatPrice(amount: number, curr: 'USD' | 'BDT' | 'INR'): string {
  switch (curr) {
    case 'BDT':
      return `৳${Math.round(amount * 115).toLocaleString()}`;
    case 'INR':
      return `₹${Math.round(amount * 83).toLocaleString()}`;
    case 'USD':
    default:
      return `$${amount.toLocaleString()}`;
  }
}

export default function ProductCard({
  product,
  currency,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: ProductCardProps) {
  const discountPercent = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-white dark:bg-[#111827] rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(15,23,42,0.07)] dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-100/80 dark:border-gray-800/60 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      
      {/* Image Gallery Wrapper */}
      <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onNavigate('product-detail', { id: product.id })}>
        
        {/* Main Product Image (transitions to second image on group hover if available) */}
        <img 
          src={product.images[0]} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} Alternate View`}
            referrerPolicy="no-referrer"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Wishlist Button Overlay */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className="absolute top-4 right-4 p-2 rounded-full shadow-md bg-white/90 dark:bg-gray-800/95 text-gray-500 dark:text-gray-400 hover:text-danger-gate dark:hover:text-danger-gate transition-colors z-10"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={16} className={isWishlisted ? "fill-danger-gate text-danger-gate" : "transition-transform active:scale-125"} />
        </button>

        {/* Tag badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isFlashSale && (
            <span className="bg-brand-accent text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Percent size={11} />
              <span>Flash Sale</span>
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-slate-900 text-white font-medium text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              Best Seller
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-danger-gate text-white font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md">
              Low Stock: {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-600 text-white font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md">
              Sold Out
            </span>
          )}
        </div>

      </div>

      {/* Content details */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Brand & Stars row */}
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
          <span>{product.brand}</span>
          <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-700 dark:text-gray-200">{product.rating}</span>
            <span className="opacity-60 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="font-heading font-semibold text-gray-950 dark:text-gray-100 text-sm sm:text-base leading-snug cursor-pointer hover:text-brand-accent transition-colors truncate"
          onClick={() => onNavigate('product-detail', { id: product.id })}
          title={product.name}
        >
          {product.name}
        </h3>
        
        {/* Slim tagline */}
        {product.tagline && (
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{product.tagline}</p>
        )}

        {/* Price & Action row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-extrabold text-blue-950 dark:text-blue-50 text-base sm:text-lg">
                {formatPrice(product.price, currency)}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-success-gate font-bold uppercase tracking-wider">
                Hold {discountPercent}% Instant Credit
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product, product.sizes[0], product.colors[0])}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-2xl transition-all ${product.stock === 0 ? 'bg-slate-150 dark:bg-slate-800 text-gray-400 cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#F59E0B] hover:text-[#0F172A] dark:bg-slate-800 dark:hover:bg-[#F59E0B] text-white'}`}
            title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
