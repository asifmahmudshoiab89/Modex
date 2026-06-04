/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, Heart, ArrowRight, Check, Sliders, ChevronDown, 
  MapPin, Clock, Search, HelpCircle, Star, Phone, ShieldCheck, Play, Sparkles, Send, Copy
} from 'lucide-react';
import { Product, CartItem, Order, Coupon, BlogPost, User, FAQ, Vendor } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard, { formatPrice } from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import ProductDetailView from './components/ProductDetailView';
import { POPULAR_BRANDS, SHIPPNG_ZONES, FAQs, VENDORS } from './data';

export const safeAlert = (message: string) => {
  try {
    alert(message);
  } catch (e) {
    console.warn('[Iframe Alert Blocked]:', message);
  }
};

export default function App() {
  // Navigation & Routing States
  const [currentRoute, setCurrentRoute] = useState<{ page: string; params: any }>({ page: 'home', params: {} });
  
  // Theme Global State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Core Database Models from full-stack server endpoints
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart & Wishlist States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState({ success: false, text: '' });

  // Localization States
  const [lang, setLang] = useState<'EN' | 'BN' | 'HI'>('EN');
  const [currency, setCurrency] = useState<'USD' | 'BDT' | 'INR'>('USD');

  // Customer authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', forgotEmail: '' });
  const [authError, setAuthError] = useState('');
  
  // Checkout Processing
  const [billingAddr, setBillingAddr] = useState({
    fullName: '', phone: '', street: '', city: 'Dhaka', state: 'Dhaka', zipCode: '1212', country: 'Bangladesh'
  });
  const [selectedZone, setSelectedZone] = useState(SHIPPNG_ZONES[0]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'billing' | 'authorizing'>('cart');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Search filter options
  const [searchFilter, setSearchFilter] = useState({ category: 'All', brand: 'All', minPrice: 0, maxPrice: 1500, sortBy: 'rating' });

  // AI recommendations states
  const [aiPitch, setAiPitch] = useState('');
  const [aiRecIds, setAiRecIds] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Dynamic Flash Sale Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Active slideshow index
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { title: 'MODERN TECHNOLOGY.', highlight: 'PREMIUM LIFESTYLE.', text: 'Enriching spatial productivity and acoustic fidelity layouts.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', tag: 'NEW SOUNDFLOW SERIES' },
    { title: 'BIOCHEMICAL WEARABLES.', highlight: 'HORIZON CALIBRATIONS.', text: 'Engineered with hand-stitched leather alloys and sapphire panels.', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', tag: 'KRONO BOUTIQUE OUTLET' }
  ];

  // Load API Data upon Mounting
  const fetchData = async () => {
    try {
      const pRes = await fetch('/api/products').catch(err => {
        console.warn("Products fetch failed. Using fallback.", err);
        return null;
      });
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }

      const cRes = await fetch('/api/coupons').catch(err => {
        console.warn("Coupons fetch failed. Using fallback.", err);
        return null;
      });
      if (cRes && cRes.ok) {
        const cData = await cRes.json();
        setCoupons(cData);
      }

      const oRes = await fetch('/api/orders').catch(err => {
        console.warn("Orders fetch failed. Using fallback.", err);
        return null;
      });
      if (oRes && oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData);
      }

      const bRes = await fetch('/api/blogs').catch(err => {
        console.warn("Blogs fetch failed. Using fallback.", err);
        return null;
      });
      if (bRes && bRes.ok) {
        const bData = await bRes.json();
        setBlogs(bData);
      }
    } catch (err) {
      console.warn("Express server not fully booted. Running layout setup...", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Recover cart & wishlist from clients storage
    try {
      const storedCart = localStorage.getItem('modex-cart');
      if (storedCart) setCart(JSON.parse(storedCart));
      
      const storedWish = localStorage.getItem('modex-wishlist');
      if (storedWish) setWishlist(JSON.parse(storedWish));

      const storedUser = localStorage.getItem('modex-user');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

      const storedTheme = localStorage.getItem('modex-theme');
      if (storedTheme === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('modex-cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('modex-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Synchronize Browser Hash Routes
  useEffect(() => {
    const syncRouteWithHash = () => {
      const hash = window.location.hash || '#home';
      const cleanHash = hash.replace('#', '');
      const [page, paramString] = cleanHash.split('?');
      const params: any = {};
      if (paramString) {
        paramString.split('&').forEach(pair => {
          const [k, v] = pair.split('=');
          params[k] = decodeURIComponent(v);
        });
      }
      setCurrentRoute({ page, params });
      
      // Auto-jump to page top on transition
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    
    window.addEventListener('hashchange', syncRouteWithHash);
    syncRouteWithHash(); // initial sync on page load

    return () => window.removeEventListener('hashchange', syncRouteWithHash);
  }, []);

  const navigateTo = (page: string, params: any = {}) => {
    let paramString = '';
    if (Object.keys(params).length) {
      paramString = '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join('&');
    }
    window.location.hash = `${page}${paramString}`;
  };

  // Toggle Theme mode toggler classes on node
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('modex-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      localStorage.setItem('modex-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  // Automated Flash Sale Timer Countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automated Slideshow Carousel cycle
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveSlide(p => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(bannerTimer);
  }, []);

  // Retrieve AI Recommendations from Server API
  const fetchAIRecommendations = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          wishlist: wishlist,
          searchHistory: searchFilter.category
        })
      });
      if (res.ok) {
        const result = await res.json();
        setAiPitch(result.aiPitch);
        setAiRecIds(result.recommendedProductIds || []);
      }
    } catch (err) {
      console.warn("AI recommender unavailable:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch AI pitch when cart or wishlist changes
  useEffect(() => {
    if (cart.length > 0) {
      fetchAIRecommendations();
    }
  }, [cart.length]);

  // Auth Operations
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('modex-user', JSON.stringify(data.user));
        // Fill out billing if details exist
        setBillingAddr(prev => ({
          ...prev,
          fullName: data.user.name
        }));
        if (data.user.role === 'admin') {
          navigateTo('admin');
        } else {
          navigateTo('home');
        }
      } else {
        setAuthError(data.message || 'Invalid identification credentials');
      }
    } catch (err) {
      setAuthError('Connection limits broken on login.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: authForm.name, email: authForm.email, password: authForm.password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('modex-user', JSON.stringify(data.user));
        navigateTo('home');
      } else {
        setAuthError(data.message || 'Registration properties rejected.');
      }
    } catch (err) {
      setAuthError('Server communication timeout.');
    }
  };

  const handleQuickAdminLogin = () => {
    setAuthForm({ name: 'Rahul Admin', email: 'rahuladmin@modex.com', password: '123456', forgotEmail: '' });
    // Execute dynamic administrative sessions immediately
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'RAHULADMIN', password: '123456' })
    }).then(res => {
      if (!res.ok) throw new Error('Network response not ok');
      return res.json();
    }).then(data => {
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('modex-user', JSON.stringify(data.user));
        navigateTo('admin');
      }
    }).catch(err => {
      console.warn('Quick admin login fetch failed. Displaying premium simulation.', err);
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('modex-user');
    setAppliedCoupon(null);
    navigateTo('home');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('modex-user', JSON.stringify(updatedUser));
  };

  // Cart Functions
  const handleAddToCart = (product: Product, size: string, color: string) => {
    if (product.stock === 0) return;
    const cartItemId = `${product.id}-${size}-${color}`;
    
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === cartItemId);
      if (existing) {
        return prevCart.map(item => item.id === cartItemId ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) } : item);
      }
      return [...prevCart, { id: cartItemId, product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    
    // Smooth scroll down to cart trigger feedback
    navigateTo('cart');
  };

  const handleUpdateCartQty = (id: string, dir: 'up' | 'down') => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = dir === 'up' ? item.quantity + 1 : item.quantity - 1;
        if (nextQty > item.product.stock) return item;
        return { ...item, quantity: Math.max(1, nextQty) };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(it => it.id !== id));
  };

  const handleApplyCoupon = () => {
    const code = couponCodeInput.toUpperCase().trim();
    const found = coupons.find(c => c.code === code);
    
    if (!found) {
      setCouponFeedback({ success: false, text: 'Invalid verification token' });
      return;
    }
    if (!found.isActive) {
      setCouponFeedback({ success: false, text: 'This voucher has run obsolete' });
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    if (subtotal < found.minSpend) {
      setCouponFeedback({ success: false, text: `Minimum spend of ${formatPrice(found.minSpend, currency)} is required` });
      return;
    }

    setAppliedCoupon(found);
    setCouponFeedback({ success: true, text: 'Voucher code holds successfully!' });
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const checked = prev.find(p => p.id === product.id);
      if (checked) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  // Calculate prices
  const subtotalCost = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const conversionRate = currency === 'BDT' ? 115 : currency === 'INR' ? 83 : 1;
  const deliveryCharges = selectedZone.rate / conversionRate;

  let voucherDeduction = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      voucherDeduction = (subtotalCost * appliedCoupon.discountValue) / 100;
    } else {
      voucherDeduction = appliedCoupon.discountValue;
    }
  }
  const absoluteTotalBill = Math.max(0, (subtotalCost + deliveryCharges) - voucherDeduction);

  // Submit Order Process
  const handleLaunchCheckoutOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingAddr.fullName || !billingAddr.phone || !billingAddr.street) {
      safeAlert('Missing validation parameters on billing form.');
      return;
    }

    setCheckoutStep('authorizing');

    // Simulate standard verification delay for high design aesthetics
    setTimeout(async () => {
      const payload = {
        customerName: billingAddr.fullName,
        customerEmail: currentUser?.email || 'guest-shopper@modex-premium.com',
        shippingAddress: billingAddr,
        items: cart.map(it => ({
          productId: it.product.id,
          name: it.product.name,
          image: it.product.images[0],
          price: it.product.price,
          quantity: it.quantity,
          size: it.selectedSize,
          color: it.selectedColor
        })),
        subtotal: subtotalCost,
        shippingCost: deliveryCharges,
        discountAmount: voucherDeduction,
        appliedCoupon: appliedCoupon?.code,
        total: absoluteTotalBill,
        paymentMethod
      };

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const respData = await res.json();
          setPlacedOrder(respData.order);
          // clear state
          setCart([]);
          setAppliedCoupon(null);
          setCheckoutStep('cart');
          await fetchData(); // refresh stock counts
          navigateTo('success');
        } else {
          safeAlert('Logistical parsing failed inside full-stack node.');
          setCheckoutStep('billing');
        }
      } catch (err) {
        // Mock success fallback if offline/no backend
        const mockOrder: Order = {
          id: `ORD-MOCK-${Date.now()}`,
          customerId: 'cust-mock',
          customerName: billingAddr.fullName,
          customerEmail: currentUser?.email || 'guest@modex.com',
          shippingAddress: billingAddr,
          items: cart.map(it => ({
            productId: it.product.id,
            name: it.product.name,
            image: it.product.images[0],
            price: it.product.price,
            quantity: it.quantity,
            size: it.selectedSize,
            color: it.selectedColor
          })),
          subtotal: subtotalCost,
          shippingCost: deliveryCharges,
          discountAmount: voucherDeduction,
          total: absoluteTotalBill,
          status: 'Pending',
          paymentMethod,
          paymentStatus: 'Paid',
          createdAt: new Date().toISOString(),
          trackingCode: `TRK-MOCK-${Date.now()}`
        };
        setPlacedOrder(mockOrder);
        setCart([]);
        setAppliedCoupon(null);
        setCheckoutStep('cart');
        navigateTo('success');
      }
    }, 2500);
  };

  // Sort & Filter functions
  const filteredProducts = products.filter(p => {
    if (searchFilter.category !== 'All' && p.category !== searchFilter.category) return false;
    if (searchFilter.brand !== 'All' && p.brand !== searchFilter.brand) return false;
    if (p.price < searchFilter.minPrice || p.price > searchFilter.maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (searchFilter.sortBy === 'rating') return b.rating - a.rating;
    if (searchFilter.sortBy === 'price-low') return a.price - b.price;
    if (searchFilter.sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0b1120] text-gray-200' : 'bg-slate-50 text-gray-800'}`}>
      
      {/* Structural Global Custom Header Navigation */}
      <Header
        cart={cart}
        wishlist={wishlist}
        currentUser={currentUser}
        onNavigate={navigateTo}
        currency={currency}
        setCurrency={setCurrency}
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        onAdminQuickLogin={handleQuickAdminLogin}
        onSearch={(q) => setSearchFilter(prev => ({ ...prev, sortBy: 'rating' }))}
      />

      {/* Main Structural Body */}
      <main className="flex-grow">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <span className="flex h-5 w-5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500"></span>
            </span>
            <p className="font-heading font-black tracking-widest text-[#0F172A] dark:text-white uppercase text-xs">Authenticating Modex Cache Gateway...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* -------------------- 1. HOME SCREEN -------------------- */}
            {currentRoute.page === 'home' && (
              <motion.div key="home-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
                
                {/* Hero Banner Slider */}
                <section className="relative h-[85vh] w-full overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
                  <img 
                    src={slides[activeSlide].img} 
                    alt={slides[activeSlide].title} 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                  />
                  
                  {/* Floating slide controller elements */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2.5 z-20">
                    {slides.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveSlide(idx)}
                        className={`w-3.5 h-3.5 rounded-full transition-all ${idx === activeSlide ? 'bg-brand-accent w-10' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>

                  {/* Overlaid slide content details */}
                  <div className="absolute inset-0 flex items-center z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl space-y-6">
                      <span className="inline-block px-3 py-1 bg-amber-500/20 text-brand-accent rounded-lg text-xs font-mono font-bold uppercase tracking-widest border border-amber-500/30">
                        {slides[activeSlide].tag}
                      </span>
                      <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-tight uppercase">
                        {slides[activeSlide].title} <br/>
                        <span className="text-brand-accent">{slides[activeSlide].highlight}</span>
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed tracking-wide">
                        {slides[activeSlide].text}
                      </p>
                      <div className="flex items-center space-x-4 pt-4">
                        <button 
                          onClick={() => navigateTo('shop')}
                          className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-heading font-black rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center space-x-2 text-xs uppercase tracking-wider"
                        >
                          <span>Calibrate Collections</span>
                          <ArrowRight size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            const firstProd = products[0];
                            if (firstProd) navigateTo('product-detail', { id: firstProd.id });
                          }}
                          className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all text-xs"
                        >
                          Watch Intro video
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Trust Badges Floating Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-sm border border-gray-150/40 dark:border-gray-800/50 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 text-brand-accent rounded-2xl">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white">Authentic Escrow Guard</h4>
                        <p className="text-xs text-gray-400 mt-1">We secure all customer checkouts through locked SSL channels with dynamic refund limits.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 text-brand-accent rounded-2xl">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#0F172A] dark:text-white">Premium Concierge Care</h4>
                        <p className="text-xs text-gray-400 mt-1">Chat natively with hardware designers on WhatsApp or cellular phone numbers.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 text-brand-accent rounded-2xl">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#0F172A] dark:text-white">Personal AI Curated</h4>
                        <p className="text-xs text-gray-400 mt-1">Tap server-based artificial intuition models to configure smart layouts.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Featured Categories Bento Box */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block font-mono">Curated Divisions</span>
                    <h3 className="font-heading font-extrabold text-[#010816] dark:text-white text-xl sm:text-2xl mt-0.5">Explore Specialized Categories</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {[
                      { name: 'Audio', bg: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80', tagline: 'Spatial Resonance.' },
                      { name: 'Wearables', bg: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=300&q=80', tagline: 'Physiological Telemetry.' },
                      { name: 'Home Theater', bg: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=300&q=80', tagline: 'Cinematic Expansion.' },
                      { name: 'Lifestyle', bg: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=300&q=80', tagline: 'Cactus stitching.' }
                    ].map((cat, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => navigateTo('category', { category: cat.name })}
                        className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer shadow-sm border dark:border-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />
                        <img src={cat.bg} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute bottom-5 left-5 z-20 space-y-0.5">
                          <span className="text-[10px] font-mono text-brand-accent tracking-wide block">{cat.tagline}</span>
                          <h4 className="font-heading font-black text-white text-base uppercase tracking-wider">{cat.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Flash Sale Limited divisions */}
                <section className="bg-[#0F172A] text-white py-14 border-y border-slate-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
                      <div>
                        <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest block font-mono">Modex Time Calibration</span>
                        <h3 className="font-heading font-black text-xl sm:text-2xl uppercase mt-0.5">Tactical Flash Sale limits</h3>
                      </div>
                      
                      {/* Timer Widgets */}
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-gray-400 font-semibold text-[10px] uppercase">Expires in:</span>
                        <div className="flex items-center space-x-1 font-mono font-bold text-brand-accent">
                          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-sm">{timeLeft.hours}h</div>
                          <span>:</span>
                          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-sm">{timeLeft.minutes}m</div>
                          <span>:</span>
                          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-sm text-[#EF4444] animate-pulse">{timeLeft.seconds}s</div>
                        </div>
                      </div>
                    </div>

                    {/* Products Grid inside sale */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                      {products.filter(p => p.isFlashSale).slice(0, 4).map(p => (
                        <div key={p.id}>
                          <ProductCard
                            product={p}
                            currency={currency}
                            onNavigate={navigateTo}
                            onAddToCart={handleAddToCart}
                            onToggleWishlist={handleToggleWishlist}
                            isWishlisted={Boolean(wishlist.find(item => item.id === p.id))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Trending & Best Sellers Panel section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block font-mono">Curator Recommendations</span>
                      <h3 className="font-heading font-extrabold text-gray-900 dark:text-white text-xl sm:text-2xl mt-0.5">New Arrivals & Trending Gear</h3>
                    </div>
                    <button onClick={() => navigateTo('shop')} className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-[#0F172A] dark:text-brand-accent hover:underline">
                      <span>View Full Catalog</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {products.slice(0, 4).map(p => (
                      <div key={p.id}>
                        <ProductCard
                          product={p}
                          currency={currency}
                          onNavigate={navigateTo}
                          onAddToCart={handleAddToCart}
                          onToggleWishlist={handleToggleWishlist}
                          isWishlisted={Boolean(wishlist.find(item => item.id === p.id))}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Popular Brands slider row */}
                <section className="bg-slate-100 dark:bg-slate-950/60 py-10 border-y dark:border-gray-900 text-center space-y-6">
                  <span className="text-[9px] font-mono tracking-widest text-gray-405 font-bold uppercase block">Official Ecosystem Collaborators</span>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
                    {POPULAR_BRANDS.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-center">
                        <img src={item.logo} alt={item.name} className="h-8 object-contain filter grayscale dark:invert max-w-[100px]" />
                        <span className="text-[10px] font-bold text-gray-800 dark:text-white mt-2 font-heading tracking-widest uppercase">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mobile app divisions widget banner */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-tr from-[#0F172A] to-slate-800 rounded-3xl p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 border">
                    <div className="space-y-4 max-w-xl">
                      <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest font-mono">Modex Ecosystem Mobile</span>
                      <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight">Unlock biometrically synced purchase shortcuts</h3>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        Secure instant notifications, coupon vouchers, and real-time shipment map arrays directly onto your iOS or Android companion device.
                      </p>
                      <div className="flex gap-2.5 pt-2">
                        <button onClick={() => safeAlert('Download package ready.')} className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl text-xs hover:bg-black transition-all">App Store iOS</button>
                        <button onClick={() => safeAlert('Android apk builds queued.')} className="px-5 py-2.5 bg-[#F59E0B] text-[#0F172A] font-bold rounded-xl text-xs hover:bg-yellow-600 transition-all">Google Play</button>
                      </div>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=260&q=80" 
                      alt="Interface illustration mock" 
                      className="w-48 h-48 object-cover rounded-2xl shadow-xl border border-slate-700/50"
                    />
                  </div>
                </section>

              </motion.div>
            )}

            {/* -------------------- 2. SHOPPING PAGE -------------------- */}
            {currentRoute.page === 'shop' && (
              <motion.div key="shop-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                
                {/* Advanced Filtering options layout */}
                <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-sm border border-gray-150/40 dark:border-gray-800/50 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase font-mono tracking-wider">Search Catalog</label>
                    <input 
                      type="text" 
                      placeholder="Type keyword..." 
                      className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 p-2.5 rounded-xl font-medium outline-none text-gray-800 dark:text-white focus:border-brand-accent text-xs"
                      onChange={(e) => setSearchFilter(prev => ({ ...prev, sortBy: 'rating' }))} 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase font-mono tracking-wider">Division Division</label>
                    <select 
                      value={searchFilter.category}
                      onChange={(e) => setSearchFilter(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 p-2.5 rounded-xl text-xs outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Audio">Audio Devices</option>
                      <option value="Wearables">Smart Wearables</option>
                      <option value="Home Theater">Projection Hubs</option>
                      <option value="Lifestyle">Lifestyle & Felt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase font-mono tracking-wider">Ecosystem Brand</label>
                    <select 
                      value={searchFilter.brand}
                      onChange={(e) => setSearchFilter(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 p-2.5 rounded-xl text-xs outline-none"
                    >
                      <option value="All">All Brands</option>
                      <option value="Onyx">Onyx</option>
                      <option value="Krono">Krono</option>
                      <option value="Spectra">Spectra</option>
                      <option value="Zenith">Zenith</option>
                      <option value="AeroTech">AeroTech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase font-mono tracking-wider">Price Ceiling (USD)</label>
                    <select 
                      value={searchFilter.maxPrice}
                      onChange={(e) => setSearchFilter(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 p-2.5 rounded-xl text-xs outline-none"
                    >
                      <option value="1500">Up to $1,500</option>
                      <option value="800">Up to $800</option>
                      <option value="400">Up to $400</option>
                      <option value="150">Up to $150</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase font-mono tracking-wider">Sort Priority</label>
                    <select 
                      value={searchFilter.sortBy}
                      onChange={(e) => setSearchFilter(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 p-2.5 rounded-xl text-xs outline-none"
                    >
                      <option value="rating">High Customer Ratings</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Catalog Listing */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-4 text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border">
                      <p className="text-gray-450 text-xs font-semibold uppercase tracking-wider">No catalog items matches search criteria.</p>
                    </div>
                  ) : (
                    filteredProducts.map(p => (
                      <div key={p.id}>
                        <ProductCard
                          product={p}
                          currency={currency}
                          onNavigate={navigateTo}
                          onAddToCart={handleAddToCart}
                          onToggleWishlist={handleToggleWishlist}
                          isWishlisted={Boolean(wishlist.find(item => item.id === p.id))}
                        />
                      </div>
                    ))
                  )}
                </div>

              </motion.div>
            )}

            {/* -------------------- 3. PRODUCT DETAILS SCREEN -------------------- */}
            {currentRoute.page === 'product-detail' && (
              <ProductDetailView
                key={currentRoute.params.id}
                prodId={currentRoute.params.id}
                products={products}
                currency={currency}
                wishlist={wishlist}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={handleToggleWishlist}
                fetchData={fetchData}
                navigateTo={navigateTo}
              />
            )}

            {/* -------------------- 4. CATEGORY VIEW SPECIFIC SCREEN -------------------- */}
            {currentRoute.page === 'category' && (
              <motion.div key="category-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <div>
                  <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider block font-mono">Dynamic Category Filtered</span>
                  <h2 className="font-heading font-black text-[#0F172A] dark:text-white text-2xl uppercase mt-0.5">Category: {currentRoute.params.category}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  {products.filter(p => p.category === currentRoute.params.category).map(p => (
                    <div key={p.id}>
                      <ProductCard
                        product={p}
                        currency={currency}
                        onNavigate={navigateTo}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={Boolean(wishlist.find(item => item.id === p.id))}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* -------------------- 5. SEARCH RESULTS VIEW -------------------- */}
            {currentRoute.page === 'search' && (
              <motion.div key="search-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <div>
                  <span className="text-[10px] text-gray-430 font-bold block font-mono">Verification Index</span>
                  <h2 className="font-heading font-black text-2xl uppercase mt-0.5 text-gray-900 dark:text-white">Searched keyword: "{currentRoute.params.query}"</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  {products.filter(p => p.name.toLowerCase().includes((currentRoute.params.query || '').toLowerCase()) || p.description.toLowerCase().includes((currentRoute.params.query || '').toLowerCase())).map(p => (
                    <div key={p.id}>
                      <ProductCard
                        product={p}
                        currency={currency}
                        onNavigate={navigateTo}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={Boolean(wishlist.find(item => item.id === p.id))}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* -------------------- 6. WISHLIST DIRECT VIEW -------------------- */}
            {currentRoute.page === 'wishlist' && (
              <motion.div key="wish-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
                <div>
                  <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider block font-mono">Stored assets division</span>
                  <h2 className="font-heading font-black text-2xl uppercase mt-0.5 text-gray-900 dark:text-white">Your Curated Wishlist ({wishlist.length})</h2>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100">
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Wishlist empty. Browse products to store collections.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {wishlist.map(p => (
                      <div key={p.id}>
                        <ProductCard
                          product={p}
                          currency={currency}
                          onNavigate={navigateTo}
                          onAddToCart={handleAddToCart}
                          onToggleWishlist={handleToggleWishlist}
                          isWishlisted={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* -------------------- 7. CLIENT CART / CHECKOUT SCREEN -------------------- */}
            {currentRoute.page === 'cart' && (
              <motion.div key="cart-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h2 className="font-heading font-black text-[#0F172A] dark:text-white text-2xl uppercase tracking-tight mb-8">Asset Cart Integration</h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border text-xs">
                    <p className="text-gray-400 font-black uppercase tracking-widest block mb-4">Cart registry holds no items.</p>
                    <button onClick={() => navigateTo('shop')} className="px-6 py-3 bg-[#0F172A] text-white rounded-xl font-bold hover:bg-amber-500 hover:text-black transition-all">Explore catalogs</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-xs">
                    
                    {/* Cart Items List Column */}
                    <div className="lg:col-span-2 space-y-4">
                      {checkoutStep === 'cart' ? (
                        <>
                          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm p-6 space-y-4">
                            {cart.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border dark:border-gray-800 rounded-2xl gap-4">
                                <div className="flex items-center space-x-4 truncate">
                                  <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl border flex-shrink-0" />
                                  <div className="truncate">
                                    <span className="font-heading font-bold text-gray-900 dark:text-white text-sm block truncate">{item.product.name}</span>
                                    <span className="text-[10px] text-gray-400 font-mono block">Chassis Color: {item.selectedColor} | Calibrated size: {item.selectedSize}</span>
                                    <span className="text-brand-accent font-extrabold font-mono text-[11px] block mt-1">{formatPrice(item.product.price, currency)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3.5">
                                  <div className="flex items-center space-x-1.5 border dark:border-gray-750 bg-white dark:bg-slate-800 rounded-lg p-1">
                                    <button onClick={() => handleUpdateCartQty(item.id, 'down')} className="p-1 px-2.5 font-bold hover:bg-slate-100 rounded text-center">-</button>
                                    <span className="font-semibold font-mono text-center w-6 block">{item.quantity}</span>
                                    <button onClick={() => handleUpdateCartQty(item.id, 'up')} className="p-1 px-2.5 font-bold hover:bg-slate-100 rounded text-center">+</button>
                                  </div>
                                  <button onClick={() => handleRemoveCartItem(item.id)} className="p-2 text-gray-400 hover:text-danger-gate rounded-lg border hover:bg-red-500/5 dark:border-gray-700">
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Dynamic AI recommendations pitch box */}
                          {aiLoading ? (
                            <div className="p-5 bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl border border-amber-500/10 flex items-center gap-3">
                              <Sparkles className="text-brand-accent h-5 w-5 animate-pulse" />
                              <span className="font-mono text-[10px] tracking-wide">Syncing artificial recommender parameters...</span>
                            </div>
                          ) : (
                            aiPitch && (
                              <section className="bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white p-6 rounded-3xl shadow-lg border border-amber-500/20 space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Sparkles className="text-brand-accent h-5 w-5 animate-bounce" />
                                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-[#F59E0B]">Modex AI Curatorial system</h4>
                                </div>
                                <p className="text-[11px] leading-relaxed text-gray-200 tracking-wide font-medium italic">"{aiPitch}"</p>
                              </section>
                            )
                          )}
                        </>
                      ) : checkoutStep === 'billing' ? (
                        
                        /* Checkout billing address forms */
                        <form onSubmit={handleLaunchCheckoutOrder} className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-xs space-y-5 shadow-sm">
                          <h3 className="font-heading font-extrabold text-[#0F172A] dark:text-white uppercase text-sm border-b pb-3 dark:border-gray-800">Recipent Shipment Form</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 font-bold mb-1">CONCIERGE FULL NAME *</label>
                              <input type="text" required value={billingAddr.fullName} onChange={e => setBillingAddr({ ...billingAddr, fullName: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none" placeholder="e.g. Asif Mahmud" />
                            </div>
                            <div>
                              <label className="block text-gray-400 font-bold mb-1">CELLULAR PHONE NO *</label>
                              <input type="tel" required value={billingAddr.phone} onChange={e => setBillingAddr({ ...billingAddr, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none" placeholder="+880 1789 or +91 98..." />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-400 font-bold mb-1">STREET ADDRESS *</label>
                            <input type="text" required value={billingAddr.street} onChange={e => setBillingAddr({ ...billingAddr, street: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none" placeholder="House 24, Road 11, Banani Sec-1" />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-gray-400 font-bold mb-1">METROPOLIS CITY *</label>
                              <input type="text" required value={billingAddr.city} onChange={e => setBillingAddr({ ...billingAddr, city: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none" />
                            </div>
                            <div>
                              <label className="block text-gray-400 font-bold mb-1">ZIP POSTAL CODE *</label>
                              <input type="text" required value={billingAddr.zipCode} onChange={e => setBillingAddr({ ...billingAddr, zipCode: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none" />
                            </div>
                            <div>
                              <label className="block text-gray-400 font-bold mb-1">COUNTRY ORIGIN *</label>
                              <input type="text" required value={billingAddr.country} onChange={e => setBillingAddr({ ...billingAddr, country: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            
                            {/* Delivery zone rates selection */}
                            <div>
                              <span className="block text-gray-400 font-bold mb-1 uppercase tracking-wider">Calibrate Delivery Zone</span>
                              <select 
                                onChange={(e) => setSelectedZone(SHIPPNG_ZONES[Number(e.target.value)])}
                                className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none"
                              >
                                {SHIPPNG_ZONES.map((zone, idx) => (
                                  <option key={idx} value={idx}>{zone.zone} ({zone.rate} default USD rate)</option>
                                ))}
                              </select>
                            </div>

                            {/* Secure Payment routing gateways list */}
                            <div>
                              <span className="block text-gray-400 font-bold mb-1 uppercase tracking-wider">Selecting secured gateway</span>
                              <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 outline-none"
                              >
                                <option value="bKash">bKash (BD Checkout Pin/Wallet)</option>
                                <option value="Nagad">Nagad (BD digital wallet)</option>
                                <option value="SSLCommerz">SSLCommerz (Visa, Master, Rocket)</option>
                                <option value="Stripe">Stripe International (Mastercard, AMEX)</option>
                                <option value="Razorpay">Razorpay (India UPI, PayTM, Card)</option>
                                <option value="COD">Cash On Delivery (Unsecured / Manual)</option>
                              </select>
                            </div>

                          </div>

                          <div className="flex gap-2 pt-4">
                            <button type="submit" className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-heading font-black uppercase text-[10px] tracking-wider hover:bg-amber-500 hover:text-black transition-all">Submit secure transaction order</button>
                            <button type="button" onClick={() => setCheckoutStep('cart')} className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-white rounded-xl">Back</button>
                          </div>

                        </form>
                      ) : (
                        
                        /* Secured loading screen */
                        <div className="bg-white dark:bg-[#111827] rounded-3xl p-14 border flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                          <span className="flex h-10 w-10 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-gate opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-10 w-10 bg-rose-500"></span>
                          </span>
                          <div className="space-y-1">
                            <h3 className="font-heading font-black uppercase text-[#EF4444] tracking-widest text-sm">Authorizing secure transaction</h3>
                            <p className="text-gray-400 font-medium">Communicating with {paymentMethod} API servers... Do not close portal window.</p>
                          </div>
                        </div>

                      )}
                    </div>

                    {/* Pricing Summary Ledger Column */}
                    <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm h-fit space-y-6">
                      <h4 className="font-heading font-bold text-[#0F172A] dark:text-white uppercase tracking-widest text-xs border-b pb-3 dark:border-gray-800">Payment Breakdown</h4>
                      
                      <div className="space-y-3.5 text-slate-500 dark:text-gray-450 border-b dark:border-gray-800 pb-4">
                        <div className="flex justify-between">
                          <span>Subtotal Items cost:</span>
                          <span className="font-mono font-bold text-gray-700 dark:text-white">{formatPrice(subtotalCost, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping zone tariff:</span>
                          <span className="font-mono text-gray-700 dark:text-white">+{formatPrice(deliveryCharges, currency)}</span>
                        </div>
                        {voucherDeduction > 0 && (
                          <div className="flex justify-between text-success-gate font-bold">
                            <span>Coupon Discount holds:</span>
                            <span className="font-mono">-{formatPrice(voucherDeduction, currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-900 dark:text-white text-sm font-extrabold border-t dark:border-gray-800 pt-3">
                          <span>TOTAL SECURED CHARGE:</span>
                          <span className="font-mono text-amber-500 font-extrabold">{formatPrice(absoluteTotalBill, currency)}</span>
                        </div>
                      </div>

                      {/* Coupon validation widget */}
                      {checkoutStep === 'cart' && (
                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Redeem Private campaign code</span>
                          <div className="flex gap-1.5">
                            <input 
                              type="text" 
                              placeholder="e.g. MODEX10" 
                              value={couponCodeInput}
                              onChange={(e) => setCouponCodeInput(e.target.value)}
                              className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border dark:border-gray-700 flex-grow text-xs uppercase font-mono font-bold ring-none text-gray-800 dark:text-white" 
                            />
                            <button onClick={handleApplyCoupon} className="px-4.5 bg-[#0F172A] hover:bg-amber-500 hover:text-black text-white font-bold rounded-xl transition-colors">Apply</button>
                          </div>
                          {couponFeedback.text && (
                            <span className={`block text-[10px] font-semibold ${couponFeedback.success ? 'text-success-gate bg-emerald-900/10 px-2 py-1 rounded' : 'text-danger-gate bg-red-900/10 px-2 py-1 rounded'}`}>
                              {couponFeedback.text}
                            </span>
                          )}
                        </div>
                      )}

                      {checkoutStep === 'cart' && (
                        <button 
                          onClick={() => setCheckoutStep('billing')}
                          className="w-full py-4 bg-slate-900 hover:bg-[#F59E0B] hover:text-black text-white rounded-2xl shadow-md font-heading font-black uppercase text-[10px] tracking-wider transition-all"
                        >
                          Checkout locked parameters
                        </button>
                      )}

                    </div>

                  </div>
                )}
              </motion.div>
            )}

            {/* -------------------- 8. ORDER SUCCESS PAGE -------------------- */}
            {currentRoute.page === 'success' && placedOrder && (
              <motion.div key="success-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto px-4 py-20 text-center space-y-8">
                <div className="bg-white dark:bg-[#111827] p-8 sm:p-12 rounded-3xl border border-gray-150/40 dark:border-gray-800/50 shadow-sm space-y-6 text-xs text-slate-600 dark:text-gray-300">
                  <div className="w-14 h-14 bg-emerald-500 text-slate-950 font-bold rounded-full flex items-center justify-center text-2xl mx-auto shadow-md">✓</div>
                  
                  <div className="space-y-1">
                    <h2 className="font-heading font-black text-[#10B981] uppercase tracking-widest text-base">Payment approved successfully</h2>
                    <p className="text-gray-400 font-medium text-xs">We have locked your billing transaction inside our full-stack registry.</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4.5 rounded-2xl space-y-2 border border-gray-150/40 dark:border-gray-800/30 text-left font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Escrow ID:</span>
                      <span className="font-bold text-gray-800 dark:text-white uppercase">{placedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recipient Name:</span>
                      <span className="text-gray-800 dark:text-white">{placedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Secure Tracking code:</span>
                      <span className="text-amber-500 font-bold uppercase">{placedOrder.trackingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dispatched Zone rate:</span>
                      <span className="text-gray-800 dark:text-white">{placedOrder.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => navigateTo('track-order', { code: placedOrder.trackingCode })}
                      className="px-5 py-3 bg-[#0F172A] hover:bg-amber-400 hover:text-black font-bold text-white rounded-xl"
                    >
                      Track real-time shipment
                    </button>
                    <button onClick={() => navigateTo('home')} className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white font-semibold rounded-xl">Dismiss</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* -------------------- 9. TRACK ORDER SCREEN -------------------- */}
            {currentRoute.page === 'track-order' && (
              <TrackOrderView
                orders={orders}
                currentRoute={currentRoute}
                navigateTo={navigateTo}
              />
            )}

            {/* -------------------- 10. AUTHENTICATION SCREENS (LOGIN, REGISTER) -------------------- */}
            {(currentRoute.page === 'login' || currentRoute.page === 'register') && (
              <motion.div key="auth-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto px-4 py-16 text-xs text-gray-700 dark:text-gray-200">
                <div className="bg-white dark:bg-[#111827] p-8 sm:p-10 rounded-3xl border shadow-md space-y-6">
                  
                  <div className="text-center space-y-1">
                    <h3 className="font-heading font-black text-xl uppercase tracking-widest text-[#0F172A] dark:text-white">
                      {currentRoute.page === 'login' ? 'Identification entry' : 'Create Premium ID'}
                    </h3>
                    <p className="text-gray-400 font-medium">MODEX Security Lock Calibration</p>
                  </div>

                  {authError && (
                    <span className="block p-3 text-[10px] bg-red-100/40 border border-red-200 text-danger-gate font-semibold rounded-lg">
                      ✕ {authError}
                    </span>
                  )}

                  <form onSubmit={currentRoute.page === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
                    {currentRoute.page === 'register' && (
                      <div>
                        <label className="block text-gray-400 font-bold mb-1 uppercase tracking-wider">FULL NAME *</label>
                        <input type="text" required value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg p-2.5 outline-none font-medium" placeholder="Rahul" />
                      </div>
                    )}
                    <div>
                      <label className="block text-gray-400 font-bold mb-1 uppercase tracking-wider">EMAIL ADDRESS *</label>
                      <input type="email" required value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg p-2.5 outline-none font-medium" placeholder="rahuladmin@modex.com" />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold mb-1 uppercase tracking-wider">PASSWORD PROTECT CODE *</label>
                      <input type="password" required value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg p-2.5 outline-none font-medium" placeholder="123456" />
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-slate-950 text-white rounded-xl hover:bg-amber-400 hover:text-black font-bold uppercase text-[10px] tracking-wider transition-all shadow">
                      {currentRoute.page === 'login' ? 'Authorize entry portal' : 'Commit biometric ID'}
                    </button>
                  </form>

                  {currentRoute.page === 'login' ? (
                    <p className="text-center text-gray-400 pt-2 font-medium">Partner client? <button onClick={() => navigateTo('register')} className="text-brand-accent underline">Create premium ID</button></p>
                  ) : (
                    <p className="text-center text-gray-400 pt-2 font-medium">Licensed customer? <button onClick={() => navigateTo('login')} className="text-brand-accent underline">Sign in</button></p>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-850 pt-4 text-center">
                    <button onClick={handleQuickAdminLogin} className="text-[10px] text-danger-gate font-bold uppercase tracking-widest hover:underline">⚡ Quick Admin switch trigger</button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* -------------------- 11. CUSTOMER DASHBOARD SCREEN -------------------- */}
            {currentRoute.page === 'dashboard' && currentUser && (
              <motion.div key="cust-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-xs">
                <div>
                  <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider font-mono">Verified Client Console</span>
                  <h2 className="font-heading font-black text-[#0F172A] dark:text-white text-2xl uppercase mt-0.5">Welcome Back, {currentUser.name}!</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Ledger summary profile details card */}
                  <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-150/40 dark:border-gray-800 space-y-6 shadow-sm h-fit">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest">Premium Account Profile</span>
                    <div className="space-y-2 font-medium">
                      <div className="flex justify-between border-b dark:border-gray-805 pb-2">
                        <span className="text-gray-400">Identity Name:</span>
                        <span className="font-bold text-[#0F172A] dark:text-white">{currentUser.name}</span>
                      </div>
                      <div className="flex justify-between border-b dark:border-gray-805 pb-2">
                        <span className="text-gray-400">Dynamic email:</span>
                        <span className="text-gray-700 dark:text-gray-200">{currentUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account status:</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-success-gate dark:bg-emerald-950/20 rounded font-bold uppercase text-[9px]">Verified Modex ID</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer transaction active history list */}
                  <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-150/40 dark:border-gray-800 space-y-6 shadow-sm">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest">Logistical Transactions history</span>
                    
                    <div className="space-y-4 max-h-[350px] overflow-y-auto">
                      {orders.filter(item => item.customerEmail === currentUser.email).length === 0 ? (
                        <p className="text-gray-450 italic">No checkout orders registered under your profile email.</p>
                      ) : (
                        orders.filter(item => item.customerEmail === currentUser.email).map((ord) => (
                          <div key={ord.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 border dark:border-gray-800/80 rounded-2xl gap-4">
                            <div>
                              <span className="font-bold text-gray-800 dark:text-white block font-mono">ID CODE: {ord.id}</span>
                              <span className="text-[10px] text-gray-450">{new Date(ord.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold block text-brand-accent">{formatPrice(ord.total, currency)}</span>
                              <span className="px-2 py-0.5 text-[9px] font-mono leading-none font-bold uppercase text-blue-500 rounded border mt-1 block">{ord.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* -------------------- 12. AUXILIARY SYSTEM PAGES (FAQ, CONTACT, ETC.) -------------------- */}
            {currentRoute.page === 'faq' && (
              <motion.div key="faq-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-xs text-gray-700 dark:text-gray-200">
                <div>
                  <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider font-mono">Modex platform FAQs</span>
                  <h2 className="font-heading font-black text-[#0F172A] dark:text-white text-2xl uppercase mt-0.5">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                  {FAQs.map((faq, index) => (
                    <div key={index} className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-150/40 dark:border-gray-800/80 overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex justify-between items-center p-5 text-left font-semibold text-sm text-[#0F172A] dark:text-white hover:text-brand-accent transition-colors outline-none"
                      >
                        <span>{faq.question}</span>
                        <span className="text-xs transition-transform transform duration-200">{expandedFaq === index ? '▲' : '▼'}</span>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-5 pb-5 leading-relaxed text-gray-505 border-t dark:border-gray-800 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentRoute.page === 'contact' && (
              <ContactView />
            )}

            {currentRoute.page === 'about' && (
              <motion.div key="about-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-4 py-16 space-y-12 text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                <div className="text-center">
                  <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest font-mono block">Creative Foundation</span>
                  <h2 className="font-heading font-black text-3xl uppercase mt-1 text-gray-900 dark:text-white">Our Architecture Manifesto</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <p className="font-bold text-gray-900 dark:text-white">Minimalist engineering is not our design restriction—it is our core aesthetic promise.</p>
                    <p className="text-gray-500">
                      Modex was established in Banani, Dhaka, to build an authentic bridge connecting global physical components directly with premium lifestyles. Every soundFlow acoustic diaphragm and Krono structural titanium alloy undergoes deep calibration.
                    </p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" alt="Workspace" className="rounded-3xl border text-[8px] object-cover h-48 w-full shadow" />
                </div>
              </motion.div>
            )}

            {/* Static policies pages */}
            {['terms', 'privacy', 'returns', 'shipping-policy'].includes(currentRoute.page) && (
              <motion.div key="policies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-xs text-gray-750 dark:text-gray-300 leading-relaxed">
                <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider block font-mono">Modex Legal Compliance</span>
                <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-gray-900 dark:text-white">
                  {currentRoute.page === 'terms' ? 'Terms & Conditions of service' :
                   currentRoute.page === 'privacy' ? 'Privacy & Safeguard protocols' :
                   currentRoute.page === 'returns' ? 'Refunds & Returns procedures' :
                   'Shipping zones & logistical rules'}
                </h2>
                
                <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border shadow-sm space-y-4">
                  <p className="font-bold">1. Legal Enforcement limits</p>
                  <p>Every dynamic checkout and payment approval on Modex holds end-to-end user compliance under localized rules in Bangladesh and India, with international billing arbitrations routed safely through Stripe Inc.</p>
                  <p className="font-bold">2. Care Replacement safeguards</p>
                  <p>Our unconditional 7-day return standard guarantees diagnostic checks. Items returned with broken seals are evaluated individually, with refunds disbursed securely into their credit logs.</p>
                </div>
              </motion.div>
            )}

            {/* -------------------- 13. EDITORIAL BLOG PAGES -------------------- */}
            {currentRoute.page === 'blogs' && (
              <motion.div key="blogs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <div>
                  <span className="text-[10px] text-brand-accent font-bold uppercase block font-mono">Premium Editorial essays</span>
                  <h2 className="font-heading font-black text-2xl uppercase text-gray-900 dark:text-white mt-0.5">The Modex Ledger</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
                  {blogs.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-white dark:bg-[#111827] rounded-3xl overflow-hidden border cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigateTo('blog-detail', { id: p.id })}
                    >
                      <img src={p.image} alt={p.title} className="w-full h-48 object-cover border-b" />
                      <div className="p-6 space-y-2">
                        <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider block font-mono">{p.date} • {p.readTime}</span>
                        <h3 className="font-heading font-black text-sm text-gray-950 dark:text-white hover:text-brand-accent transition-colors">{p.title}</h3>
                        <p className="text-gray-400 line-clamp-2 leading-relaxed">{p.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentRoute.page === 'blog-detail' && (() => {
              const b = blogs.find(item => item.id === currentRoute.params.id);
              if (!b) return <div className="text-center py-20">Article not found.</div>;
              return (
                <motion.div key="blog-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-4 py-10 space-y-6 text-xs text-gray-700 dark:text-gray-250 leading-relaxed">
                  <button onClick={() => navigateTo('blogs')} className="text-gray-400 hover:text-brand-accent font-bold">← Return to articles list</button>
                  <img src={b.image} alt={b.title} className="w-full h-64 object-cover rounded-3xl shadow" />
                  <div className="space-y-4">
                    <span className="text-[10px] text-brand-accent font-bold uppercase font-mono block">{b.date} • Created by {b.author}</span>
                    <h2 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-gray-950 dark:text-white">{b.title}</h2>
                    <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border whitespace-pre-wrap space-y-4 leading-loose text-sm text-gray-800 dark:text-gray-200 shadow-sm">
                      {b.content}
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* -------------------- 14. ADMIN WORKSPACE ROUTING -------------------- */}
            {currentRoute.page === 'admin' && (
              currentUser?.role === 'admin' ? (
                <AdminPanel
                  products={products}
                  orders={orders}
                  coupons={coupons}
                  blogs={blogs}
                  currency={currency}
                  onRefreshData={fetchData}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onUpdateUser={handleUpdateUser}
                />
              ) : (
                <div className="max-w-md mx-auto text-center py-32 space-y-4">
                  <p className="text-danger-gate font-bold uppercase tracking-wider">Access to Admin portal restricted.</p>
                  <button onClick={() => navigateTo('login')} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl">Please Login as admin</button>
                </div>
              )
            )}

          </AnimatePresence>
        )}

      </main>

      {/* Structural Global Custom Footer Sitemap */}
      <Footer onNavigate={navigateTo} />

    </div>
  );
}

interface TrackOrderViewProps {
  orders: Order[];
  currentRoute: any;
  navigateTo: (page: string, params?: any) => void;
}

function TrackOrderView({ orders, currentRoute, navigateTo }: TrackOrderViewProps) {
  const [trackInput, setTrackInput] = useState(currentRoute.params.code || '');
  const [trackedOrderResult, setTrackedOrderResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (currentRoute.params.code) {
      const ord = orders.find(o => o.trackingCode === currentRoute.params.code || o.id === currentRoute.params.code);
      if (ord) setTrackedOrderResult(ord);
    }
  }, [currentRoute.params.code, orders]);

  const handleSearchTrackInput = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const ord = orders.find(o => o.trackingCode === trackInput || o.id === trackInput);
    setTrackedOrderResult(ord || null);
  };

  return (
    <motion.div key="tracking-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto px-4 py-16 space-y-8 text-xs text-gray-700 dark:text-gray-200">
      <div>
        <span className="text-[10px] text-brand-accent font-mono block font-bold uppercase tracking-wider">Dynamic shipment tracking</span>
        <h2 className="font-heading font-black text-[#0F172A] dark:text-white text-2xl uppercase mt-0.5">Track Order status</h2>
      </div>

      <form onSubmit={handleSearchTrackInput} className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-gray-150/40 dark:border-gray-800 flex gap-2 shadow-sm">
        <input 
          type="text" 
          placeholder="Enter verification billing ID or Tracking Code (e.g. TRK-MOCK-342)" 
          value={trackInput}
          onChange={e => setTrackInput(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 outline-none flex-grow font-mono font-bold text-gray-800 dark:text-white" 
        />
        <button type="submit" className="px-6 bg-[#0F172A] hover:bg-amber-500 hover:text-black font-bold uppercase text-[10px] text-white rounded-xl tracking-wider transition-colors">Search</button>
      </form>

      {searched && !trackedOrderResult && (
        <div className="text-center p-10 bg-white dark:bg-[#111827] rounded-3xl border">
          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">No orders matches verification variables inside cloud registry.</p>
        </div>
      )}

      {trackedOrderResult && (
        <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-150/30 dark:border-gray-800 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b dark:border-gray-850 pb-4">
            <div>
              <span className="text-gray-400 font-bold font-mono">BILLING ID: {trackedOrderResult.id}</span>
              <span className="block text-[10px] text-gray-400 mt-0.5">Tracking Link: {trackedOrderResult.trackingCode}</span>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-brand-accent dark:bg-amber-950/25 font-bold rounded-lg text-xs tracking-wider uppercase font-mono">{trackedOrderResult.status}</span>
          </div>

          {/* Status timeline visual details with bullet checkpoints */}
          <div className="relative pl-8 space-y-8 border-l border-gray-150 dark:border-gray-800 ml-4">
            {[
              { title: 'Pending Authentication checks', desc: 'Secure payment is validated across systems.', status: ['Pending', 'Confirmed', 'Shipped', 'Delivered'] },
              { title: 'Confirmed logistical booking', desc: 'Packaging is boxed with genuine warranty cards.', status: ['Confirmed', 'Shipped', 'Delivered'] },
              { title: 'Courier Shipment Dispatched', desc: 'Active location monitoring link holds.', status: ['Shipped', 'Delivered'] },
              { title: 'Package Delivered successfully', desc: 'Escrow release is acknowledged.', status: ['Delivered'] }
            ].map((node, index) => {
              const isActive = node.status.includes(trackedOrderResult.status);
              return (
                <div key={index} className="relative">
                  <div className={`absolute -left-12 top-0.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${isActive ? 'bg-[#0F172A] border-brand-accent text-brand-accent dark:bg-[#F59E0B] dark:border-black dark:text-black' : 'bg-white border-gray-200 text-gray-300 dark:bg-slate-900 dark:border-gray-700'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${isActive ? 'text-gray-950 dark:text-white font-black' : 'text-gray-400'}`}>{node.title}</h4>
                    <p className="text-gray-450 mt-0.5">{node.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </motion.div>
  );
}

function ContactView() {
  const [contactSubmit, setContactSubmit] = useState(false);
  return (
    <motion.div key="contact-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-xs text-gray-700 dark:text-gray-200">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider block font-mono">Banani Banani banani</span>
          <h2 className="font-heading font-black text-2xl uppercase mt-0.5 text-gray-900 dark:text-white">Modex Concierge Contact</h2>
        </div>
        <p className="text-gray-450 leading-relaxed">
          Reach our custom support engineers. Whether integrating a dynamic soundstage or configuring Krono wearables, our team holds direct technical warrants to assist.
        </p>
        <div className="space-y-3 font-medium">
          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-brand-accent" />
            <span>Sales Hotlines: +880 1789-MODEX</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin size={16} className="text-brand-accent" />
            <span>Banani, Road 11, Block G, Dhaka, BD</span>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setContactSubmit(true); }} className="bg-white dark:bg-[#111827] p-8 rounded-3xl border space-y-4 shadow-sm">
        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Concierge inquiry form</span>
        <input type="text" required placeholder="User Title" className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 outline-none" />
        <input type="email" required placeholder="Authorized Email Address" className="w-full bg-slate-550 dark:bg-slate-900 border rounded-xl p-3 outline-none" />
        <textarea required placeholder="Outline layouts, details or warranty problems..." rows={4} className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 outline-none"></textarea>
        <button type="submit" className="px-6 py-3 bg-[#0F172A] text-white rounded-xl font-bold font-heading hover:bg-amber-500 hover:text-black uppercase text-[10px]">Send email inquiry</button>
        {contactSubmit && <span className="text-success-gate block font-semibold mt-2">✓ Message sent safely. Tech responder will contact you within 60 minutes.</span>}
      </form>
    </motion.div>
  );
}
