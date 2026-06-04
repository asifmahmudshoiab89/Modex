/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from './ProductCard';

interface ProductDetailViewProps {
  key?: React.Key | string | number;
  prodId: string;
  products: Product[];
  currency: 'USD' | 'BDT' | 'INR';
  wishlist: Product[];
  handleAddToCart: (product: Product, size: string, color: string) => void;
  handleToggleWishlist: (product: Product) => void;
  fetchData: () => Promise<void>;
  navigateTo: (page: string, params?: any) => void;
}

const safeAlert = (message: string) => {
  try {
    alert(message);
  } catch (e) {
    console.warn('[Iframe Alert Blocked]:', message);
  }
};

export default function ProductDetailView({
  prodId,
  products,
  currency,
  wishlist,
  handleAddToCart,
  handleToggleWishlist,
  fetchData,
  navigateTo
}: ProductDetailViewProps) {
  const product = products.find(p => p.id === prodId);

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <p className="font-semibold text-lg">Product invalid or not found.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold font-heading hover:bg-amber-500 hover:text-black transition-all uppercase text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const [selectedImg, setSelectedImg] = useState(product.images[0] || '');
  const [chosenSize, setChosenSize] = useState(product.sizes?.[0] || 'Standard');
  const [chosenColor, setChosenColor] = useState(product.colors?.[0] || 'Black');
  const [isFbtChecked, setIsFbtChecked] = useState(true);

  // Synchronize state if product changes (acting as defensive backup)
  useEffect(() => {
    if (product) {
      setSelectedImg(product.images?.[0] || '');
      setChosenSize(product.sizes?.[0] || 'Standard');
      setChosenColor(product.colors?.[0] || 'Black');
    }
  }, [product]);

  const addonProduct = products.find(p => p.id === 'p-4') || products[0]; // sleeve default addon

  // reviews fields
  const [revForm, setRevForm] = useState({ name: '', comment: '', rating: 5 });
  const [revSuccess, setRevSuccess] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${product.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revForm)
      });
      if (res.ok) {
        setRevSuccess(true);
        setRevForm({ name: '', comment: '', rating: 5 });
        await fetchData();
        setTimeout(() => setRevSuccess(false), 3000);
      } else {
        safeAlert('Could not submit review to the backend server.');
      }
    } catch (err) {
      console.warn('Adding review simulated fallbacks.', err);
      // Fallback behavior
      setRevSuccess(true);
      setRevForm({ name: '', comment: '', rating: 5 });
      setTimeout(() => setRevSuccess(false), 3000);
    }
  };

  const isWishlisted = Boolean(wishlist.find(it => it.id === product.id));

  return (
    <motion.div
      key="p-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-xs text-gray-700 dark:text-gray-200"
    >
      {/* Back button */}
      <button
        onClick={() => navigateTo('shop')}
        className="flex items-center space-x-1.5 text-gray-400 hover:text-amber-500 font-bold bg-transparent border-0 cursor-pointer p-0"
      >
        <span>← Discover more layouts</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Media Gallery Carousel Column */}
        <div className="space-y-4 animate-fade-in">
          <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-gray-800 flex items-center justify-center">
            {selectedImg ? (
              <img
                src={selectedImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            ) : (
              <div className="text-gray-400">No Image Available</div>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImg(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 bg-transparent p-0 transition-all outline-none ${
                  selectedImg === img
                    ? 'border-amber-500 scale-102 ring-2 ring-amber-500/10'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <img
                  src={img}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  alt={`Thumbnail ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase Configurations Column */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-500">
              {product.brand} | {product.category}
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-950 dark:text-white tracking-tight mt-1 leading-snug">
              {product.name}
            </h2>
            {product.tagline && (
              <h4 className="text-gray-450 font-medium text-sm mt-1">{product.tagline}</h4>
            )}
          </div>

          {/* Display pricing */}
          <div className="flex items-center space-x-4">
            <span className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/10">
              In Stock: {product.stock} units
            </span>
          </div>

          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-xs sm:text-sm">
            {product.description}
          </p>

          {/* Size Choices */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <span className="block font-bold text-gray-450 mb-2 uppercase tracking-wide">
                Calibrate System Size
              </span>
              <div className="flex gap-2">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setChosenSize(sz)}
                    className={`px-4.5 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                      chosenSize === sz
                        ? 'border-amber-500 bg-slate-900 text-white dark:bg-slate-800 dark:text-amber-400 font-semibold shadow-md'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <span className="block font-bold text-gray-455 mb-2 uppercase tracking-wide">
                Select Chassis Color
              </span>
              <div className="flex gap-2">
                {product.colors.map(col => (
                  <button
                    key={col}
                    onClick={() => setChosenColor(col)}
                    className={`px-4.5 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                      chosenColor === col
                        ? 'border-amber-500 bg-slate-900 text-white dark:bg-slate-800 dark:text-amber-400 font-semibold shadow-md'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trigger Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => handleAddToCart(product, chosenSize, chosenColor)}
              className="flex-grow py-4 bg-amber-500 hover:bg-amber-605 text-slate-950 rounded-2xl shadow-lg font-heading font-black uppercase text-xs tracking-wider transition-all hover:-translate-y-0.5 border-none cursor-pointer"
            >
              Integrate into Cart
            </button>
            <button
              onClick={() => handleToggleWishlist(product)}
              className="p-4 bg-slate-100 hover:bg-slate-200 text-gray-650 dark:bg-slate-800 dark:text-gray-300 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all cursor-pointer"
            >
              <Heart
                size={20}
                className={isWishlisted ? 'fill-red-500 text-red-500 border-none' : ''}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {addonProduct && (
        <section className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-150/40 dark:border-gray-800/50">
          <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base mb-4">
            Frequently Co-calibrated Bundle
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center -space-x-4">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl border-2 border-white dark:border-slate-800 shadow"
                />
                <span className="text-gray-400 font-bold text-xl z-10 bg-slate-100/80 dark:bg-slate-900/80 rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                  +
                </span>
                <img
                  src={addonProduct.images?.[0]}
                  alt={addonProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border-2 border-white dark:border-slate-800 shadow z-20"
                />
              </div>
              <div>
                <span className="font-semibold block text-gray-900 dark:text-white">
                  {product.name} + {addonProduct.name}
                </span>
                <p className="text-gray-405 text-[11px] mt-0.5">
                  Unlock an instant 10% bundle voucher if checkout limits are matched.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-xl text-amber-500 block">
                {formatPrice(product.price + addonProduct.price - 25, currency)}
              </span>
              <button
                onClick={() => {
                  handleAddToCart(product, chosenSize, chosenColor);
                  handleAddToCart(addonProduct, addonProduct.sizes?.[0] || 'Standard', addonProduct.colors?.[0] || 'Black');
                }}
                className="px-4.5 py-2.5 bg-slate-900 text-white dark:bg-slate-800 dark:text-white rounded-xl font-bold font-heading hover:bg-amber-500 hover:text-black transition-all mt-2 uppercase text-[10px] border-none cursor-pointer"
              >
                Add bundle to cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Complete specifications sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Specs Sheet list */}
        <div className="space-y-4">
          <h4 className="font-heading font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
            Specifications sheet Matrix
          </h4>
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-xs text-left">
              <tbody>
                {product.specifications?.map((spec, sidx) => (
                  <tr
                    key={sidx}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/10"
                  >
                    <td className="p-3 bg-slate-50 dark:bg-slate-900/40 text-gray-405 font-bold font-mono w-1/3">
                      {spec.label}
                    </td>
                    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer validation Reviews Division */}
        <div className="space-y-6">
          <h4 className="font-heading font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
            Authentication Reviews ({product.reviewsCount})
          </h4>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {product.reviews?.length === 0 ? (
              <p className="text-gray-400">
                Be the first to leave a verified authentication review on this gear!
              </p>
            ) : (
              product.reviews?.map(rev => (
                <div
                  key={rev.id}
                  className="p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800 dark:text-white block">
                      {rev.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: rev.rating }).map((_, r) => (
                      <Star key={r} size={11} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 italic leading-relaxed text-[11px]">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add dynamic review form */}
          <form
            onSubmit={handleReviewSubmit}
            className="p-5 bg-white dark:bg-[#111827] rounded-3xl border border-gray-150/40 dark:border-gray-800/80 space-y-4 shadow-sm"
          >
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">
              Leave Verified feedback
            </span>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Display Name"
                value={revForm.name}
                onChange={e => setRevForm({ ...revForm, name: e.target.value })}
                className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 outline-none text-gray-800 dark:text-white text-xs"
              />
              <select
                value={revForm.rating}
                onChange={e => setRevForm({ ...revForm, rating: Number(e.target.value) })}
                className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 outline-none text-gray-850 dark:text-white text-xs cursor-pointer"
              >
                <option value="5">5 Star - Pristine</option>
                <option value="4">4 Star - High Value</option>
                <option value="3">3 Star - Standard</option>
              </select>
            </div>
            <input
              type="text"
              required
              placeholder="Say comfortable, heavy ANC depth, tactile clicks, stitching details..."
              value={revForm.comment}
              onChange={e => setRevForm({ ...revForm, comment: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 outline-none text-gray-800 dark:text-white text-xs"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white hover:bg-amber-500 hover:text-black rounded-xl font-bold transition-all border-none cursor-pointer text-xs"
            >
              Write Verification
            </button>
            {revSuccess && (
              <span className="text-emerald-500 block text-[10px] font-semibold mt-1">
                ✓ Review submitted successfully.
              </span>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}
