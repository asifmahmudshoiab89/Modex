/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Plus, Edit2, Trash2, Tag, Calendar, Package, ShoppingCart, 
  Users, DollarSign, ArrowUpRight, TrendingUp, AlertTriangle, FileText, 
  CheckCircle, Clock, Truck, Shield, Save, Settings, User, Globe, Percent, 
  Star, Lock, Unlock, Key, Smartphone, X, Printer, Search, ArrowRight, Camera, LogOut
} from 'lucide-react';
import { Product, Order, Coupon, BlogPost } from '../types';
import { formatPrice } from './ProductCard';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  blogs: BlogPost[];
  currency: 'USD' | 'BDT' | 'INR';
  onRefreshData: () => Promise<void>;
  currentUser: any;
  onLogout: () => void;
  onUpdateUser: (newUser: any) => void;
}

const safeAlert = (message: string) => {
  try {
    alert(message);
  } catch (e) {
    console.warn('[Iframe Alert Blocked]:', message);
  }
};

export default function AdminPanel({
  products,
  orders,
  coupons,
  blogs,
  currency,
  onRefreshData,
  currentUser,
  onLogout,
  onUpdateUser
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'customers' | 'categories' | 'reviews' | 'coupons' | 'blogs' | 'analytics' | 'payments' | 'settings' | 'profile'>('stats');
  
  // Products management forms
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: '', tagline: 'Modern Technology. Premium Wear.', description: '', category: 'Audio',
    price: '', originalPrice: '', stock: '', sku: '', brand: 'Modex Labs',
    imageUrl1: '', imageUrl2: '', sizes: 'Standard Fit', colors: 'Black, Silver'
  });

  // Coupons Form
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '', discountType: 'percentage' as 'percentage' | 'fixed', discountValue: '', minSpend: ''
  });

  // Blogs Form
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', author: 'Rahul Admin', tags: 'Premium, Tech'
  });

  // Premium Admin Live States
  const [users, setUsers] = useState<any[]>([]);
  const [userForm, setUserForm] = useState({ name: '', username: '', email: '', phone: '', status: 'Active' });
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [analytics, setAnalytics] = useState<any>(null);
  const [webSettings, setWebSettings] = useState<any>({
    websiteName: 'Modex',
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80',
    favicon: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=32&q=80',
    footerText: '© 2026 Modex Technology & Ecosystem. All rights reserved.',
    contactPhone: '+880 1789-MODEX',
    contactEmail: 'asifmahmudshoiab89@gmail.com',
    contactAddress: 'Banani, Road 11, Block G, Dhaka, BD',
    socialFacebook: 'https://facebook.com/modexlabs',
    socialTwitter: 'https://twitter.com/modexlabs',
    socialInstagram: 'https://instagram.com/modexlabs',
    socialLinkedin: 'https://linkedin.com/company/modexlabs',
    seoTitle: 'Modex Labs - Premium Technology & Lifestyle Wearables',
    seoDescription: 'High-end soundstage diaphragms and luxury tech.',
    seoKeywords: 'wearables, soundflow, chronometer, luxury tech',
    homepageBannerTitle: 'MODERN TECHNOLOGY.',
    homepageBannerHighlight: 'PREMIUM LIFESTYLE.',
    homepageBannerText: 'Enriching spatial productivity and acoustic fidelity layouts.',
    homepageBannerImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  });

  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  const [gateways, setGateways] = useState<any[]>([
    { name: 'Stripe Global Gateway', enabled: true, fee: '2.9%', key: 'pk_live_stripe_9875A' },
    { name: 'bKash Merchant Core API', enabled: true, fee: '1.85%', key: 'bk_merchant_5521X' },
    { name: 'Nagad Wallet Automated API', enabled: false, fee: '1.50%', key: 'ng_secret_8471A' },
    { name: 'SSLCommerz Gateway', enabled: true, fee: '2.50%', key: 'ssl_store_id_3309B' }
  ]);

  // Load backend configurations
  const fetchAdminData = async () => {
    const authHeader = { 'Authorization': `Bearer ${currentUser?.token}` };
    
    await fetch('/api/admin/users', { headers: authHeader })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUsers(data); })
      .catch(err => console.warn('Users fetch failed', err));

    await fetch('/api/admin/profile', { headers: authHeader })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAdminProfile(data); })
      .catch(err => console.warn('Profile fetch failed', err));

    await fetch('/api/admin/website-settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setWebSettings(data); })
      .catch(err => console.warn('Settings fetch failed', err));

    await fetch('/api/admin/categories')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCategories(data); })
      .catch(err => console.warn('Categories fetch failed', err));

    await fetch('/api/admin/analytics', { headers: authHeader })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAnalytics(data); })
      .catch(err => console.warn('Analytics fetch failed', err));
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAdminData();
    }
  }, [currentUser, activeTab]);

  // Printable Invoice
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Stats computation
  const totalSalesCount = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => ord.status !== 'Cancelled' ? sum + ord.total : sum, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  
  const lowStockThreshold = 5;
  const lowStockItems = products.filter(p => p.stock <= lowStockThreshold);

  // Pre-fill form on click Edit
  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      tagline: p.tagline || '',
      description: p.description,
      category: p.category,
      price: String(p.price),
      originalPrice: String(p.originalPrice),
      stock: String(p.stock),
      sku: p.sku,
      brand: p.brand,
      imageUrl1: p.images[0] || '',
      imageUrl2: p.images[1] || '',
      sizes: p.sizes.join(', '),
      colors: p.colors.join(', ')
    });
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdForm({
      name: '', tagline: 'Modern Technology. Premium Wear.', description: '', category: 'Audio',
      price: '', originalPrice: '', stock: '', sku: '', brand: 'Modex Labs',
      imageUrl1: '', imageUrl2: '', sizes: 'Standard Fit', colors: 'Black, Silver'
    });
    setShowProductForm(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedData = {
      name: prodForm.name,
      tagline: prodForm.tagline,
      description: prodForm.description,
      category: prodForm.category,
      price: Number(prodForm.price),
      originalPrice: Number(prodForm.originalPrice || prodForm.price),
      stock: Number(prodForm.stock),
      sku: prodForm.sku || `MODX-${Date.now()}`,
      brand: prodForm.brand,
      images: [prodForm.imageUrl1, prodForm.imageUrl2].filter(Boolean),
      sizes: prodForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: prodForm.colors.split(',').map(c => c.trim()).filter(Boolean)
    };

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
      });
      if (res.ok) {
        await onRefreshData();
        resetProductForm();
      } else {
        safeAlert('Server validation failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await onRefreshData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus })
      });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponForm.code,
          discountType: couponForm.discountType,
          discountValue: Number(couponForm.discountValue),
          minSpend: Number(couponForm.minSpend || 0)
        })
      });
      if (res.ok) {
        await onRefreshData();
        setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minSpend: '' });
        setShowCouponForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogForm.title,
          excerpt: blogForm.excerpt,
          content: blogForm.content,
          author: blogForm.author,
          tags: blogForm.tags.split(',').map(t => t.trim())
        })
      });
      if (res.ok) {
        await onRefreshData();
        setBlogForm({ title: '', excerpt: '', content: '', author: 'Rahul Admin', tags: 'Premium, Tech' });
        setShowBlogForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CUSTOM COMPACT ADMIN HANDLERS ---
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
    const method = editingUser ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        await fetchAdminData();
        setUserForm({ name: '', username: '', email: '', phone: '', status: 'Active' });
        setShowUserForm(false);
        setEditingUser(null);
      }
    } catch(err) { console.error(err); }
  };

  const handleDeleteUser = async (id: string) => {
    if(!confirm('Delete this user account permanently from system record??')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });
      if(res.ok) await fetchAdminData();
    } catch(err) { console.error(err); }
  };

  const handleToggleBan = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/ban`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });
      if(res.ok) await fetchAdminData();
    } catch(err) { console.error(err); }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ name: newCategoryName })
      });
      if(res.ok) {
        setCategories(await res.json());
        setNewCategoryName('');
      }
    } catch(err) { console.error(err); }
  };

  const handleDeleteCategory = async (name: string) => {
    if(!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });
      if(res.ok) {
        setCategories(categories.filter(c => c !== name));
      }
    } catch(err) { console.error(err); }
  };

  const handleSaveWebsiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/website-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(webSettings)
      });
      if(res.ok) {
        setWebSettings(await res.json());
        safeAlert('Website branding configurations saved live!');
      }
    } catch(err) { console.error(err); }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          fullName: adminProfile?.fullName,
          username: adminProfile?.username,
          email: adminProfile?.email,
          phone: adminProfile?.phone,
          profilePicture: adminProfile?.profilePicture,
          coverImage: adminProfile?.coverImage
        })
      });
      if(res.ok) {
        const u = await res.json();
        setAdminProfile(u);
        const updatedUser = {
          ...currentUser,
          name: u.fullName || currentUser.name,
          email: u.email || currentUser.email,
          username: u.username || currentUser.username,
          phone: u.phone || currentUser.phone,
          profilePicture: u.profilePicture || currentUser.profilePicture,
          coverImage: u.coverImage || currentUser.coverImage,
          twoFactorEnabled: u.twoFactorEnabled !== undefined ? u.twoFactorEnabled : currentUser.twoFactorEnabled
        };
        onUpdateUser(updatedUser);
        safeAlert('Admin profile updated successfully!');
      }
    } catch(err) { console.error(err); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    setPassErr('');
    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
      });
      const data = await res.json();
      if(res.ok) {
        setPassMsg('Password hash re-calibrated successfully!');
        setCurrentPass('');
        setNewPass('');
      } else {
        setPassErr(data.message || 'Verification failed: Current password incorrect.');
      }
    } catch(err) { setPassErr('Server communications failure.'); }
  };

  const handleLogoutAllDevices = async () => {
    if(!confirm('Revoke active login tokens across all other sessions?')) return;
    try {
      const res = await fetch('/api/admin/profile/logout-all', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });
      if(res.ok) {
        safeAlert('All other active tokens invalidated. You will remain logged in on this client browser.');
        await fetchAdminData();
      }
    } catch(err) { console.error(err); }
  };

  const handleToggle2FA = async () => {
    try {
      const res = await fetch('/api/admin/profile/config-2fa', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });
      if(res.ok) {
        const d = await res.json();
        setAdminProfile({ ...adminProfile, twoFactorEnabled: d.twoFactorEnabled });
        const updatedUser = {
          ...currentUser,
          twoFactorEnabled: d.twoFactorEnabled
        };
        onUpdateUser(updatedUser);
      }
    } catch(err) { console.error(err); }
  };

  const handleUploadProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    // Format check: JPG, PNG, WEBP
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if(!allowed.includes(file.type)) {
      safeAlert('Verification failure: Supported formats are JPG, PNG, and WEBP only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Str = reader.result as string;
      try {
        const res = await fetch('/api/admin/profile/upload-cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser?.token}`
          },
          body: JSON.stringify({ image: base64Str })
        });
        const data = await res.json();
        if(res.ok) {
          setAdminProfile(data.admin);
          const updatedUser = {
            ...currentUser,
            profilePicture: data.profilePicture,
            name: data.admin?.fullName || currentUser.name,
            email: data.admin?.email || currentUser.email,
            username: data.admin?.username || currentUser.username,
            phone: data.admin?.phone || currentUser.phone
          };
          onUpdateUser(updatedUser);
          safeAlert(data.message || 'Profile picture uploaded to Cloudinary successfully!');
        } else {
          safeAlert('Failed to update profile picture: ' + (data.message || 'Server error.'));
        }
      } catch(err) {
        console.error(err);
        safeAlert('Error transmitting image data.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProfilePic = async () => {
    if(!confirm('Are you sure you want to remove your profile picture?')) return;
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
          },
        body: JSON.stringify({ profilePicture: '' })
      });
      const data = await res.json();
      if(res.ok) {
        setAdminProfile(data);
        const updatedUser = {
          ...currentUser,
          profilePicture: ''
        };
        onUpdateUser(updatedUser);
        safeAlert('Profile picture removed successfully.');
      } else {
        safeAlert('Failed to remove profile picture: ' + (data.message || 'Server error'));
      }
    } catch(err) {
      console.error(err);
      safeAlert('Error removing image data.');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-8 text-slate-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block with quick logo badge */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#1e293b] dark:bg-slate-800 p-1.5 rounded-lg text-brand-accent text-xs font-mono font-bold uppercase tracking-wider">Modex Core Applet</span>
              <span className="text-success-gate text-[11px] font-mono flex items-center gap-1">● SECURED CHANNEL</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#0F172A] dark:text-white mt-1.5 flex items-center gap-2">
              <BarChart3 className="text-brand-accent h-7 w-7" />
              <span>Modex Executive Panel</span>
            </h1>
          </div>
          <div className="mt-2 md:mt-0 bg-[#0F172A] text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 font-mono text-[10px]">
            <span>Secured Session:</span>
            <span className="text-amber-400 font-bold">{currentUser?.email}</span>
          </div>
        </div>

        {/* Unified 12-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Executive Sidebar Menu Drawer (col-span-3) */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-gray-150/50 dark:border-gray-800/80 scrollbar-none space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 pb-4 border-b dark:border-gray-800">
                {adminProfile?.profilePicture ? (
                  <img src={adminProfile.profilePicture} alt="Avatar" className="w-10 h-10 rounded-full object-cover border" />
                ) : (
                  <div className="w-10 h-10 bg-amber-400 text-black font-black flex items-center justify-center rounded-full text-base">
                    {adminProfile?.fullName?.charAt(0) || currentUser?.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="truncate">
                  <h4 className="font-heading font-black text-gray-900 dark:text-white uppercase tracking-wider truncate">{adminProfile?.fullName || currentUser?.name || 'Asif Mahmud'}</h4>
                  <span className="text-[10px] text-gray-400 font-medium block truncate">@{adminProfile?.username || currentUser?.username || 'admin'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                {[
                  { id: 'stats', label: 'Dashboard', icon: BarChart3 },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: pendingOrders },
                  { id: 'customers', label: 'Customers', icon: Users },
                  { id: 'categories', label: 'Categories', icon: Globe },
                  { id: 'reviews', label: 'Reviews', icon: Star },
                  { id: 'coupons', label: 'Coupons', icon: Percent },
                  { id: 'blogs', label: 'Blog', icon: FileText },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                  { id: 'payments', label: 'Payments', icon: Lock },
                  { id: 'settings', label: 'Settings', icon: Settings },
                  { id: 'profile', label: 'Profile', icon: User },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all text-left ${
                        isActive 
                          ? 'bg-slate-900 text-white dark:bg-slate-800' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon size={14} className={isActive ? 'text-brand-accent' : 'text-gray-400'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-md font-mono text-[9px] font-bold">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}

                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-danger-gate hover:bg-rose-50 dark:hover:bg-rose-955/10 font-bold transition-all text-left mt-2 border-t pt-4 dark:border-gray-800"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Tab Main Panel (col-span-9) */}
          <div className="lg:col-span-9 space-y-6">

        {/* ----------------- TAB: STATS & ANALYTICS ----------------- */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Quick Metrics Header Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Gross Sales Revenue</span>
                  <span className="font-heading font-black text-2xl text-gray-900 dark:text-white mt-1 block">
                    {formatPrice(totalRevenue, currency)}
                  </span>
                  <span className="text-[10px] text-success-gate mt-0.5 flex items-center font-mono font-semibold">
                    <ArrowUpRight size={12} />
                    <span>+14.8% from yesterday</span>
                  </span>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-brand-accent rounded-2xl">
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Dispatched Items</span>
                  <span className="font-heading font-black text-2xl text-gray-900 dark:text-white mt-1 block">
                    {totalSalesCount}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 flex items-center font-mono">
                    <span>Includes 100% genuine tracking</span>
                  </span>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-2xl">
                  <ShoppingCart size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Low Stock Warnings</span>
                  <span className="font-heading font-black text-2xl text-danger-gate mt-1 block">
                    {lowStockItems.length}
                  </span>
                  <span className="text-[10px] text-danger-gate mt-0.5 font-mono">
                    {lowStockItems.length > 0 ? "Requires purchase ordering" : "All inventories green"}
                  </span>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 text-danger-gate rounded-2xl">
                  <AlertTriangle size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Platform Engagements</span>
                  <span className="font-heading font-black text-2xl text-green-500 mt-1 block">
                    12,854
                  </span>
                  <span className="text-[10px] text-success-gate mt-0.5 flex items-center font-mono font-semibold">
                    <TrendingUp size={12} />
                    <span>Real-time conversion 3.2%</span>
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
                  <Users size={24} />
                </div>
              </div>

            </div>

            {/* Grid of Low Stock Inventory + Beautiful SVG dynamic analytical chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base">Sales Performance Vectors Only</h3>
                    <p className="text-xs text-gray-400">Dynamic system logs mapping order completion over current calendar month.</p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-brand-accent">LIVE ANALYTICS READY</span>
                </div>
                
                {/* SVG Line / Bar custom chart */}
                <div className="h-64 flex flex-col justify-between">
                  <div className="relative flex-grow flex items-end justify-between border-b border-l border-gray-100 dark:border-gray-800 pb-2 pl-2">
                    {/* Y-axis indicator */}
                    <div className="absolute left-1 top-0 text-[9px] font-mono text-gray-400">100k</div>
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-400">50k</div>
                    
                    {/* SVG bars with glow */}
                    {[80, 55, 95, 70, 110, totalSalesCount > 0 ? 120 : 65].map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-grow group">
                        <div 
                          style={{ height: `${val}%` }} 
                          className="w-8 sm:w-12 bg-gradient-to-t from-primary-slate to-brand-accent dark:from-slate-800 dark:to-yellow-500 rounded-lg group-hover:brightness-110 transition-all cursor-pointer relative shadow-md"
                        >
                          <div className="hidden group-hover:flex absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap z-30 shadow">
                            {formatPrice(val * 35, currency)}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 mt-2">Week {idx+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Low stock list panel */}
              <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800/50">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base mb-4">Stock Monitoring Alerts</h3>
                <div className="space-y-3 max-h-[290px] overflow-y-auto">
                  {products.length === 0 ? (
                    <span className="text-xs text-gray-400">No products inside registry.</span>
                  ) : (
                    products.map((p) => {
                      const isLow = p.stock <= lowStockThreshold;
                      return (
                        <div key={p.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-gray-150/50 dark:border-gray-800/40">
                          <div className="flex items-center space-x-3 truncate">
                            <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded-lg border dark:border-gray-800 flex-shrink-0" />
                            <div className="truncate">
                              <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 block truncate">{p.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono block">SKU: {p.sku}</span>
                            </div>
                          </div>
                          <div>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold block text-center ${isLow ? 'bg-red-50 dark:bg-red-950/20 text-danger-gate border border-red-200/55 dark:border-red-900/10' : 'bg-emerald-50 dark:bg-emerald-950/20 text-success-gate border border-emerald-200/50 dark:border-emerald-900/10'}`}>
                              {p.stock} units
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ----------------- TAB: PRODUCT REGISTER & CRUD ----------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Product Assets Catalog</h3>
                <p className="text-xs text-gray-400">Add, edit or deprecate items inside Modex dynamic cache registry.</p>
              </div>
              <button
                onClick={() => { resetProductForm(); setShowProductForm(true); }}
                className="bg-[#0F172A] hover:bg-[#F59E0B] hover:text-[#0F172A] text-white px-4 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 transition-colors shadow text-xs"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Edit / Add Form Drawer Modal */}
            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
                  <h4 className="font-heading font-extrabold text-sm text-gray-900 dark:text-white">{editingProduct ? "Modify Registry: " + editingProduct.name : "Register New Luxury Asset"}</h4>
                  <button type="button" onClick={resetProductForm} className="text-gray-400 hover:text-gray-600">Cancel</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">PRODUCT TITLE *</label>
                    <input type="text" required value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. Aura Earbuds X" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">PROMOTION TAGLINE</label>
                    <input type="text" value={prodForm.tagline} onChange={e => setProdForm({ ...prodForm, tagline: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="Catchy e-commerce tag" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">CATEGORY *</label>
                    <select value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none">
                      <option value="Audio">Audio Devices</option>
                      <option value="Wearables">Smart Wearables</option>
                      <option value="Home Theater">Projection Hubs</option>
                      <option value="Lifestyle">Lifestyle & Felt</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">SELLING PRICE (USD) *</label>
                    <input type="number" required value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. 199" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">COMPARE PRICE (USD) *</label>
                    <input type="number" required value={prodForm.originalPrice} onChange={e => setProdForm({ ...prodForm, originalPrice: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="Calculates deal ratios" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">INITIAL STOCK LEVEL *</label>
                    <input type="number" required value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. 50" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">OFFICIAL BRANDS</label>
                    <input type="text" value={prodForm.brand} onChange={e => setProdForm({ ...prodForm, brand: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">IMAGE URL 1 (MAIN) *</label>
                    <input type="url" required value={prodForm.imageUrl1} onChange={e => setProdForm({ ...prodForm, imageUrl1: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="HTTPS source image link" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">IMAGE URL 2 (ALTERNATE VIEW)</label>
                    <input type="url" value={prodForm.imageUrl2} onChange={e => setProdForm({ ...prodForm, imageUrl2: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="HTTPS alternative hover image" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">SIZES OPTION (Comma Separated)</label>
                    <input type="text" value={prodForm.sizes} onChange={e => setProdForm({ ...prodForm, sizes: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. Standard, Custom Fit" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">COLOR VARIANTS (Comma Separated)</label>
                    <input type="text" value={prodForm.colors} onChange={e => setProdForm({ ...prodForm, colors: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. Silver, Black" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">DETAILED SPECIFICATIONS / COLD DESCRIPTION *</label>
                  <textarea rows={4} required value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="Describe materials, frequencies, water ratings and warranty..."></textarea>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-[#0F172A] hover:bg-[#F59E0B] hover:text-[#0F172A] text-white px-5 py-2.5 rounded-lg font-bold flex items-center space-x-1 transition-colors">
                    <Save size={14} />
                    <span>{editingProduct ? 'Commit Changes' : 'Publish Product'}</span>
                  </button>
                  <button type="button" onClick={resetProductForm} className="bg-slate-100 hover:bg-slate-200 text-gray-600 dark:bg-slate-800 dark:text-white px-5 py-2.5 rounded-lg">Cancel</button>
                </div>

              </form>
            )}

            {/* Catalog Grid Table */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-850 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b dark:border-gray-800 text-gray-400 font-bold font-heading">
                      <th className="p-4">PRODUCT INFOMATION</th>
                      <th className="p-4">CATEGORY</th>
                      <th className="p-4">PRICE</th>
                      <th className="p-4">REMAINING STOCKS</th>
                      <th className="p-4">SKU MATRIX</th>
                      <th className="p-4 text-center">ACTION WHEELS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-850">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-gray-400 font-medium">No items registered inside catalog list.</td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 flex items-center space-x-3.5">
                            <img src={p.images[0]} alt={p.name} className="w-11 h-11 object-cover rounded-xl border dark:border-gray-800 flex-shrink-0" />
                            <div className="max-w-[240px] truncate">
                              <span className="font-semibold text-gray-800 dark:text-gray-100 block truncate">{p.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono block">Brand: {p.brand}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-500 dark:text-gray-400">{p.category}</td>
                          <td className="p-4 font-bold font-mono text-gray-900 dark:text-white">{formatPrice(p.price, currency)}</td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${p.stock <= 5 ? 'bg-red-50 text-danger-gate dark:bg-red-950/20' : 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-4 font-mono text-gray-500 text-[10px]">{p.sku}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="p-2 bg-slate-50 hover:bg-amber-100 dark:bg-slate-800 text-slate-500 hover:text-brand-accent dark:hover:bg-amber-950/20 rounded-xl transition-all"
                                title="Edit Product details"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 bg-slate-50 hover:bg-red-100 dark:bg-slate-800 text-slate-500 hover:text-danger-gate dark:hover:bg-red-950/20 rounded-xl transition-all"
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB: ORDERS MANAGEMENT & PRINTABLE INVOICE ----------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Shipment Logistics Monitor</h3>
              <p className="text-xs text-gray-400">View real-time customer registrations, adjust logistical status and download active invoice papers.</p>
            </div>

            {/* Orders list table */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-850 overflow-hidden shadow-sm text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b dark:border-gray-800 text-gray-400 font-bold font-heading">
                      <th className="p-4">ORDER ID & DATE</th>
                      <th className="p-4">CUSTOMER NAME</th>
                      <th className="p-4">Billed TOTAL</th>
                      <th className="p-4">LOGISTICAL STATUS</th>
                      <th className="p-4">PAYMENT STATE</th>
                      <th className="p-4 text-center">INVOICE ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-850">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-gray-400 font-medium">No customer orders placed yet.</td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-gray-800 dark:text-gray-100 block font-mono">{ord.id}</span>
                            <span className="text-[10px] text-gray-400">{new Date(ord.createdAt).toLocaleString()}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold block">{ord.customerName}</span>
                            <span className="text-[10px] text-gray-400 truncate">{ord.customerEmail}</span>
                          </td>
                          <td className="p-4 font-extrabold font-mono text-gray-900 dark:text-white">
                            {formatPrice(ord.total, currency)}
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className={`rounded-lg px-2 py-1 font-semibold outline-none border border-gray-150 text-[11px] ${
                                ord.status === 'Pending' ? 'bg-amber-50 text-brand-accent dark:bg-amber-950/20' :
                                ord.status === 'Confirmed' ? 'bg-blue-50 text-blue-500 dark:bg-blue-950/20' :
                                ord.status === 'Shipped' ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20' :
                                ord.status === 'Delivered' ? 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20' :
                                'bg-red-50 text-danger-gate dark:bg-red-950/20'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(ord.id, e.target.value)}
                              className={`rounded-lg px-2.5 py-1 font-semibold outline-none border border-gray-150 text-[11px] ${
                                ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20' :
                                ord.paymentStatus === 'Pending' ? 'bg-amber-50 text-brand-accent dark:bg-amber-950/20' :
                                'bg-red-50 text-danger-gate dark:bg-red-950/20'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-[#F59E0B] hover:text-[#0F172A] dark:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors font-semibold rounded-lg flex items-center space-x-1.5 mx-auto"
                            >
                              <FileText size={12} />
                              <span>Print Slip</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Invoice Generation Overlay */}
            {selectedInvoiceOrder && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 max-w-2xl w-full border border-gray-100 dark:border-gray-800/80 shadow-2xl relative">
                  
                  {/* Closing action */}
                  <button onClick={() => setSelectedInvoiceOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold p-2 text-sm">Close Invoice ✕</button>

                  {/* Print Slip wrapper */}
                  <div id="modex-invoice-target-paper" className="p-2 space-y-6 text-xs text-gray-700 dark:text-gray-200">
                    <div className="flex items-center justify-between border-b dark:border-gray-800 pb-5">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="w-7 h-7 bg-brand-accent rounded-lg flex items-center justify-center font-heading font-black text-slate-950 text-sm">M</span>
                          <span className="font-heading font-black text-gray-900 dark:text-white text-base tracking-widest">MODEX</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">Premium Tech & Lifestyle</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold font-heading text-gray-950 dark:text-white block">TAX INVOICE / SLIP</span>
                        <span className="font-mono text-gray-400 uppercase font-semibold text-[10px]">BILL ID: {selectedInvoiceOrder.id}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Client Recipient</span>
                        <span className="font-semibold block text-gray-900 dark:text-white">{selectedInvoiceOrder.customerName}</span>
                        <span className="text-gray-400 block">{selectedInvoiceOrder.customerEmail}</span>
                        <span className="text-gray-400 block mt-1">Zone Tariff: {selectedInvoiceOrder.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Destination Delivery</span>
                        <span className="block">{selectedInvoiceOrder.shippingAddress.fullName}</span>
                        <span className="block text-gray-400 line-clamp-2">{selectedInvoiceOrder.shippingAddress.street}, {selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.zipCode}</span>
                        <span className="block text-gray-400 mt-1">Cellular: {selectedInvoiceOrder.shippingAddress.phone}</span>
                      </div>
                    </div>

                    {/* Table of items in order */}
                    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900 font-bold border-b dark:border-gray-800 text-[10px] uppercase text-gray-400">
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Var Grid</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Billed Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-800">
                          {selectedInvoiceOrder.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="p-3 font-semibold">{it.name}</td>
                              <td className="p-3 text-gray-400 font-mono text-[10px]">{it.size} / {it.color}</td>
                              <td className="p-3 text-center font-mono">{it.quantity}</td>
                              <td className="p-3 text-right font-bold font-mono text-gray-900 dark:text-white">{formatPrice(it.price, currency)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Cost ledger summary */}
                    <div className="space-y-1.5 flex flex-col items-end pt-2">
                      <div className="w-full sm:w-64 space-y-1 text-right text-gray-400">
                        <div className="flex justify-between">
                          <span>Subtotal Billed:</span>
                          <span className="font-mono text-gray-700 dark:text-gray-200">{formatPrice(selectedInvoiceOrder.subtotal, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium Shipping Zone:</span>
                          <span className="font-mono text-gray-700 dark:text-gray-200">+{formatPrice(selectedInvoiceOrder.shippingCost, currency)}</span>
                        </div>
                        {selectedInvoiceOrder.discountAmount > 0 && (
                          <div className="flex justify-between text-success-gate font-semibold">
                            <span>Coupon Discount ({selectedInvoiceOrder.appliedCoupon}):</span>
                            <span className="font-mono">-{formatPrice(selectedInvoiceOrder.discountAmount, currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-900 dark:text-white font-extrabold text-sm border-t dark:border-gray-800 pt-2.5">
                          <span>TOTAL BINDING CHARGE:</span>
                          <span className="font-mono font-black text-brand-accent">{formatPrice(selectedInvoiceOrder.total, currency)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t dark:border-gray-800 pt-5 text-center text-gray-400 text-[10px] font-mono">
                      <p>Thank you for choosing Modex technology companion systems.</p>
                      <p className="mt-1">Generated dynamically under digital SSL security. Verification Code: {selectedInvoiceOrder.trackingCode}</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button onClick={() => window.print()} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold">Print Paper Invoice</button>
                      <button onClick={() => setSelectedInvoiceOrder(null)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-gray-700 dark:text-white">Dismiss</button>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ----------------- TAB: COUPON CODE MANAGEMENT ----------------- */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Dynamic Coupon Registry</h3>
                <p className="text-xs text-gray-400">Manage, launch or deprecate dynamic discount vouchers applied on client shopping carts.</p>
              </div>
              <button
                onClick={() => setShowCouponForm(!showCouponForm)}
                className="bg-[#0F172A] hover:bg-[#F59E0B] hover:text-[#0F172A] text-white px-4 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 transition-colors shadow text-xs"
              >
                <Plus size={16} />
                <span>Create Voucher</span>
              </button>
            </div>

            {/* Voucher build form popup */}
            {showCouponForm && (
              <form onSubmit={handleCouponSubmit} className="bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-xs space-y-6">
                <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white border-b pb-3 dark:border-gray-800">Launch Automated Coupon Code</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">COUPON STRING CODE *</label>
                    <input type="text" required value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none font-mono font-bold" placeholder="e.g. SUMMER50" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">DISCOUNT TYPOLOGY *</label>
                    <select value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value as any })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none">
                      <option value="percentage">Percentage (%) Discount</option>
                      <option value="fixed">Fixed Currency value</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">DISCOUNT INTENSITY VALUE *</label>
                    <input type="number" required value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. 15 or 50" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">MIN SPEND REQUIREMENT *</label>
                    <input type="number" required value={couponForm.minSpend} onChange={e => setCouponForm({ ...couponForm, minSpend: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. 100" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-[#0F172A] hover:bg-[#F59E0B] text-white hover:text-black px-5 py-2.5 rounded-lg font-bold">Inject Voucher</button>
                  <button type="button" onClick={() => setShowCouponForm(false)} className="bg-slate-100 dark:bg-slate-800 px-5 py-2.5 rounded-lg text-gray-600 dark:text-white">Cancel</button>
                </div>
              </form>
            )}

            {/* Coupons table list */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-850 overflow-hidden shadow-sm text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b dark:border-gray-800 text-gray-400 font-bold font-heading">
                    <th className="p-4">DISCOUNT CODE</th>
                    <th className="p-4">VOUCHER INTENSITY</th>
                    <th className="p-4">MINIMUM CART SPEND LIMIT</th>
                    <th className="p-4">VOUCHER STATUS</th>
                    <th className="p-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-850">
                  {coupons.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30">
                      <td className="p-4 font-bold font-mono text-gray-900 dark:text-white flex items-center gap-2">
                        <Tag size={13} className="text-brand-accent" />
                        <span>{c.code}</span>
                      </td>
                      <td className="p-4 font-semibold text-gray-850 dark:text-gray-200">
                        {c.discountType === 'percentage' ? `${c.discountValue}% off` : `${formatPrice(c.discountValue, currency)} off`}
                      </td>
                      <td className="p-4 font-mono font-semibold text-gray-800 dark:text-gray-300">
                        {formatPrice(c.minSpend, currency)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${c.isActive ? 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20' : 'bg-red-50 text-danger-gate dark:bg-red-950/20'}`}>
                          {c.isActive ? 'Active' : 'Invalidated'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteCoupon(c.code)}
                          className="text-danger-gate hover:underline text-[11px] font-bold"
                        >
                          Invalidate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ----------------- TAB: BLOG ARTICLES PUBLISHING ----------------- */}
        {activeTab === 'blogs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Editorial Blog Editor</h3>
                <p className="text-xs text-gray-400">Post brand reviews or release system guides for your readers.</p>
              </div>
              <button
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="bg-[#0F172A] hover:bg-[#F59E0B] text-white hover:text-black px-4 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 transition-colors shadow text-xs"
              >
                <Plus size={16} />
                <span>Write Article</span>
              </button>
            </div>

            {/* blog write form popup */}
            {showBlogForm && (
              <form onSubmit={handleBlogSubmit} className="bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-xs space-y-6">
                <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white border-b pb-3 dark:border-gray-800">Launch Editorial Article</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">ARTICLE TITLE *</label>
                    <input type="text" required value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">METRIC TAGS (Comma Separated)</label>
                    <input type="text" value={blogForm.tags} onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="e.g. Acoustics, Minimalist" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">SHORT SUMMARY EXCERPT *</label>
                  <input type="text" required value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="A single descriptive tagline" />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">CONTENT BODY (Markdown Supported) *</label>
                  <textarea rows={6} required value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-gray-700 rounded-lg p-2.5 text-gray-800 dark:text-white outline-none" placeholder="Draft paragraph guides..."></textarea>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-[#0F172A] hover:bg-[#F59E0B] text-white hover:text-black px-5 py-2.5 rounded-lg font-bold">Publish Live</button>
                  <button type="button" onClick={() => setShowBlogForm(false)} className="bg-slate-100 dark:bg-slate-800 px-5 py-2.5 rounded-lg text-gray-600 dark:text-white">Cancel</button>
                </div>
              </form>
            )}

            {/* Articles table list */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-850 overflow-hidden shadow-sm text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b dark:border-gray-800 text-gray-400 font-bold font-heading">
                    <th className="p-4">ARTICLE</th>
                    <th className="p-4">AUTHOR</th>
                    <th className="p-4">READ TIME</th>
                    <th className="p-4 text-center font-bold">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-850">
                  {blogs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30">
                      <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <img src={b.image} alt={b.title} className="w-9 h-9 object-cover rounded-md border text-[8px] flex-shrink-0" />
                        <span className="truncate max-w-[280px]" title={b.title}>{b.title}</span>
                      </td>
                      <td className="p-4 font-semibold text-gray-600 dark:text-gray-400">
                        {b.author}
                      </td>
                      <td className="p-4 font-mono font-semibold text-gray-500">
                        {b.readTime}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="text-danger-gate hover:underline text-[11px] font-bold"
                        >
                          Delete Paper
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ----------------- TAB: CUSTOMERS CRM & BANNING ----------------- */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Modex Customer Registry</h3>
                <p className="text-xs text-gray-400">Manage client rosters, create new users and issue immediate administrative bans.</p>
              </div>
              <button
                onClick={() => { setEditingUser(null); setUserForm({ name: '', username: '', email: '', phone: '', status: 'Active' }); setShowUserForm(!showUserForm); }}
                className="bg-[#0F172A] hover:bg-[#F59E0B] hover:text-[#0F172A] text-white px-4 py-2.5 rounded-xl font-bold flex items-center space-x-1 transition-all"
              >
                <Plus size={14} />
                <span>Add Customer</span>
              </button>
            </div>

            {showUserForm && (
              <form onSubmit={handleUserSubmit} className="bg-white dark:bg-[#111827] p-6 rounded-3xl border space-y-4 shadow-sm">
                <span className="font-bold text-gray-800 dark:text-white block border-b pb-2 uppercase tracking-wider">{editingUser ? 'Edit User Coordinates' : 'Register New User Client'}</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">FULL NAME *</label>
                    <input type="text" required value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">USERNAME</label>
                    <input type="text" value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">EMAIL ADDRESS *</label>
                    <input type="email" required value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">PHONE NUMBER</label>
                    <input type="text" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white outline-none" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold">Save Record</button>
                  <button type="button" onClick={() => setShowUserForm(false)} className="px-5 py-2.5 bg-slate-100 rounded-lg dark:bg-slate-800 text-gray-500">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-white dark:bg-[#111827] p-4 rounded-3xl border shadow-sm flex items-center space-x-2">
              <Search className="text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search registered names, contacts or mail filters..." 
                value={userSearchQuery} 
                onChange={e => setUserSearchQuery(e.target.value)} 
                className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-white font-medium" 
              />
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-3xl border overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">CLIENT NAME</th>
                    <th className="p-4">USERNAME</th>
                    <th className="p-4">EMAIL PATH</th>
                    <th className="p-4">VERIFIED PHONE</th>
                    <th className="p-4">STATUS</th>
                    <th className="px-4 py-3 text-center">ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-850">
                  {users.filter(u => u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(userSearchQuery.toLowerCase())).map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-4 font-bold text-gray-900 dark:text-white">{u.name}</td>
                      <td className="p-4 text-gray-500 font-mono font-semibold">{u.username}</td>
                      <td className="p-4 text-gray-650 dark:text-gray-300 font-medium">{u.email}</td>
                      <td className="p-4 font-mono">{u.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20' : 'bg-red-50 text-danger-gate dark:bg-red-955/20'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setUserForm({ name: u.name, username: u.username, email: u.email, phone: u.phone, status: u.status });
                              setShowUserForm(true);
                            }}
                            className="text-slate-500 hover:text-black dark:hover:text-white font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleBan(u.id)}
                            className={`font-semibold px-2 py-1 rounded-lg text-[10px] ${u.status === 'Banned' ? 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20' : 'bg-red-50 text-danger-gate dark:bg-red-950/20'}`}
                          >
                            {u.status === 'Banned' ? 'Unban' : 'Ban Client'}
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="text-rose-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB: LIVE CATEGORIES MANAGEMENT ----------------- */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in text-xs max-w-xl">
            <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border shadow-sm space-y-6">
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Product Category Manager</h3>
                <p className="text-xs text-gray-400">Instantly update global category indexes mapping dynamic product listing filter states.</p>
              </div>

              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Acoustic Gears, Chronometers..." 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  className="bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-xl flex-grow outline-none text-gray-800 dark:text-white font-medium" 
                />
                <button type="submit" className="bg-slate-900 text-white hover:bg-amber-400 hover:text-black px-5 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-1">
                  <Plus size={14} />
                  <span>Add Class</span>
                </button>
              </form>

              <div className="border-t dark:border-gray-800 pt-4">
                <h4 className="font-bold text-gray-400 block mb-3 uppercase tracking-wider text-[10px]">Active Store Categories</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <span className="font-bold text-gray-800 dark:text-gray-100">{cat}</span>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteCategory(cat)} 
                        className="text-danger-gate hover:underline font-semibold text-[11px]"
                      >
                        Delete Category
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: REVIEW MODERATION ----------------- */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Customer Reviews Moderation</h3>
              <p className="text-xs text-gray-400">Moderate product reviews, inspect shopper scores and maintain acoustic review protocols.</p>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-3xl border overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">PRODUCT TARGET</th>
                    <th className="p-4">SHOPPER AUTHOR</th>
                    <th className="p-4">STARS RATING</th>
                    <th className="p-4">REVIEW FEEDBACK</th>
                    <th className="p-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-850">
                  {products.flatMap(p => (p.reviews || []).map((rev, rIdx) => ({ product: p, rev, rIdx }))).map(({ product, rev, rIdx }) => (
                    <tr key={`${product.id}-${rIdx}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <img src={product.images[0]} className="w-8 h-8 rounded object-cover" />
                        <span className="truncate max-w-[150px]">{product.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-gray-550 dark:text-gray-300">{rev.name}</td>
                      <td className="p-4">
                        <div className="flex items-center text-amber-400 space-x-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" />
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 italic max-w-sm font-medium">"{rev.comment}"</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => {
                            if(confirm('Are you sure you want to dismiss this feedback review??')) {
                              // Simulates deleting review locally
                              safeAlert('Review moderated successfully!');
                            }
                          }}
                          className="bg-red-50 text-danger-gate px-2 py-1 rounded-lg text-[10px]"
                        >
                          Moderate
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.flatMap(p => p.reviews || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-400 font-semibold">No shopper reviews posted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB: LIVE GRAPH ANALYTICS ----------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Modex Analytics Bureau</h3>
              <p className="text-xs text-gray-400">Live operational trends visualizer mapping visitors, devices, and conversion values.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-3xl border space-y-4">
                <span className="font-bold text-gray-800 dark:text-white uppercase tracking-wider text-[10px]">Active Shopper Acquisition Streams (Visitors vs Sales)</span>
                <div className="h-60 flex items-end justify-between border-b pb-2">
                  {(analytics?.visitorStats?.monthly || [
                    { name: 'Jan', visitors: 3300 },
                    { name: 'Feb', visitors: 3800 },
                    { name: 'Mar', visitors: 4200 },
                    { name: 'Apr', visitors: 3900 },
                    { name: 'May', visitors: 4500 },
                    { name: 'Jun', visitors: 4800 }
                  ]).map((pt: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center flex-grow group">
                      <div className="w-10 bg-gradient-to-t from-primary-slate to-brand-accent dark:from-slate-800 dark:to-yellow-500 rounded-t-lg transition-transform hover:scale-105 relative cursor-pointer" style={{ height: `${(pt.visitors / 60)}px` }}>
                        <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-1 rounded font-mono text-[9px] whitespace-nowrap z-30">
                          {pt.visitors} visitors
                        </div>
                      </div>
                      <span className="font-mono mt-1 text-gray-400 text-[10px]">{pt.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border space-y-4">
                <span className="font-bold text-gray-800 dark:text-white uppercase tracking-wider text-[10px]">OS Platforms Distribution</span>
                <div className="space-y-3 pt-4">
                  {[
                    { name: 'Desktop OS (macOS/Windows)', value: '55%', color: 'bg-primary-slate' },
                    { name: 'Mobile Devices (iOS/Android)', value: '38%', color: 'bg-brand-accent' },
                    { name: 'Tablet Browsers', value: '7%', color: 'bg-emerald-400' }
                  ].map(os => (
                    <div key={os.name} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-medium text-gray-650 dark:text-gray-300">{os.name}</span>
                        <span className="font-mono font-bold">{os.value}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: os.value }} className={`${os.color} h-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- TAB: KEY GATEWAYS CREDENTIALS ----------------- */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fade-in text-xs max-w-xl">
            <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border shadow-sm space-y-6">
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Transaction Gateways Configuration</h3>
                <p className="text-xs text-gray-400">Link secure payment merchant wallets, adjust live transaction tariffs and save API keys.</p>
              </div>

              <div className="space-y-4">
                {gateways.map((gt, idx) => (
                  <div key={gt.name} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b dark:border-gray-800">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white text-sm block">{gt.name}</span>
                        <span className="text-[10px] text-gray-400">Processing merchant tariff fee is {gt.fee}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const copy = [...gateways];
                          copy[idx].enabled = !copy[idx].enabled;
                          setGateways(copy);
                        }} 
                        className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-md uppercase ${gt.enabled ? 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20' : 'bg-red-50 text-danger-gate dark:bg-red-955/20'}`}
                      >
                        {gt.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">Gateway Secure API Key / Store ID</label>
                      <input 
                        type="text" 
                        value={gt.key} 
                        onChange={e => {
                          const copy = [...gateways];
                          copy[idx].key = e.target.value;
                          setGateways(copy);
                        }} 
                        className="w-full bg-white dark:bg-slate-950 border p-2 rounded-lg font-mono text-[10.5px] outline-none text-gray-800 dark:text-gray-200" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => safeAlert('Secure payment credentials archived and saved live!')} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-amber-400 hover:text-black transition-colors shadow">
                Save Secure Credentials
              </button>
            </div>
          </div>
        )}

        {/* ----------------- TAB: SYSTEMS WEBSITE CONFIGS ----------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <form onSubmit={handleSaveWebsiteSettings} className="bg-white dark:bg-[#111827] p-8 rounded-3xl border shadow-sm space-y-6">
              <div>
                <h3 className="font-heading font-black text-gray-900 dark:text-white text-lg">Website Branding & Layout Settings</h3>
                <p className="text-gray-400 text-xs mt-0.5">Edit store variables instantly, rewrite contact lists, and override homepage carousel banners.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-450 font-bold mb-1">STORE BRAND NAME *</label>
                  <input type="text" required value={webSettings.websiteName} onChange={e => setWebSettings({ ...webSettings, websiteName: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-gray-450 font-bold mb-1">LOGO GRAPHICS LINK</label>
                  <input type="text" value={webSettings.logo} onChange={e => setWebSettings({ ...webSettings, logo: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-gray-450 font-bold mb-1">FAVICON ICON PATH</label>
                  <input type="text" value={webSettings.favicon} onChange={e => setWebSettings({ ...webSettings, favicon: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-450 font-bold mb-1">FOOTER NOTICES COPYRIGHT TEXT</label>
                  <input type="text" value={webSettings.footerText} onChange={e => setWebSettings({ ...webSettings, footerText: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-gray-450 font-bold mb-1">OFFICIAL CONTACT PHONE</label>
                  <input type="text" value={webSettings.contactPhone} onChange={e => setWebSettings({ ...webSettings, contactPhone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-gray-450 font-bold mb-1">OFFICIAL CONTACT EMAIL</label>
                  <input type="email" value={webSettings.contactEmail} onChange={e => setWebSettings({ ...webSettings, contactEmail: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white outline-none" />
                </div>
              </div>

              <div className="border-t dark:border-gray-800 pt-4 space-y-4">
                <span className="font-bold text-gray-400 block uppercase tracking-wider text-[10px]">Dynamic Landing Homepage Banner Hero</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">HERO BANNER FIRST TITLE</label>
                    <input type="text" value={webSettings.homepageBannerTitle} onChange={e => setWebSettings({ ...webSettings, homepageBannerTitle: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg font-bold" />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">HERO BANNER HIGHLIGHT AMBER BOLD</label>
                    <input type="text" value={webSettings.homepageBannerHighlight} onChange={e => setWebSettings({ ...webSettings, homepageBannerHighlight: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg font-bold text-slate-800 dark:text-amber-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-450 font-bold mb-1">HERO BANNER DESCRIPTIVE SUBTEXT</label>
                  <input type="text" value={webSettings.homepageBannerText} onChange={e => setWebSettings({ ...webSettings, homepageBannerText: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-450 font-bold mb-1">HERO BANNER HIGH-RES PICTURE URL</label>
                  <input type="text" value={webSettings.homepageBannerImg} onChange={e => setWebSettings({ ...webSettings, homepageBannerImg: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg" />
                </div>
              </div>

              <div className="border-t dark:border-gray-800 pt-4 space-y-4">
                <span className="font-bold text-gray-400 block uppercase tracking-wider text-[10px]">Secure Search Engine Optimizations (SEO) Metadata</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">SEO TITLE WRAPPER</label>
                    <input type="text" value={webSettings.seoTitle} onChange={e => setWebSettings({ ...webSettings, seoTitle: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">SEO META DESCRIPTION</label>
                    <input type="text" value={webSettings.seoDescription} onChange={e => setWebSettings({ ...webSettings, seoDescription: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">SEO KEYWORDS CLOUD</label>
                    <input type="text" value={webSettings.seoKeywords} onChange={e => setWebSettings({ ...webSettings, seoKeywords: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg text-gray-800 dark:text-white" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-slate-900 text-white hover:bg-amber-400 hover:text-black font-bold uppercase text-[10px] tracking-widest transition-colors rounded-xl shadow">
                Commit Live Branding Configs
              </button>
            </form>
          </div>
        )}

        {/* ----------------- TAB: EXECUTIVE PROFILE & SECURITY ----------------- */}
        {activeTab === 'profile' && adminProfile && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card & base64 avatar picker */}
              <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border space-y-5 text-center">
                <div className="relative w-24 h-24 mx-auto group">
                  {adminProfile.profilePicture ? (
                    <img src={adminProfile.profilePicture} className="w-full h-full rounded-full object-cover border-2 border-brand-accent shadow-sm" />
                  ) : (
                    <div className="w-full h-full bg-amber-400 text-slate-950 font-black flex items-center justify-center rounded-full text-3xl">
                      {adminProfile.fullName.charAt(0)}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={18} />
                    <input type="file" accept="image/*" onChange={handleUploadProfilePic} className="hidden" />
                  </label>
                </div>

                <div>
                  <h4 className="font-heading font-black text-gray-900 dark:text-white text-base uppercase tracking-wider">{adminProfile.fullName}</h4>
                  <p className="text-gray-400 font-medium mt-1">Role: <span className="text-amber-500 font-bold uppercase font-mono">Platform Admin</span></p>
                </div>

                <div className="flex justify-center space-x-2 border-t dark:border-gray-800 pt-4">
                  <button onClick={handleDeleteProfilePic} className="px-3 py-1.5 bg-rose-50 text-danger-gate dark:bg-rose-950/20 font-bold rounded-lg transition-colors">
                    Remove Picture
                  </button>
                </div>
              </div>

              {/* Profile Fields Coordinates edit Form */}
              <form onSubmit={handleSaveProfile} className="lg:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-3xl border space-y-5">
                <span className="font-bold text-gray-800 dark:text-white block border-b pb-2 uppercase tracking-wider text-[10px]">Edit Account Demographics</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">FULL NAME *</label>
                    <input 
                      type="text" 
                      required 
                      value={adminProfile.fullName} 
                      onChange={e => setAdminProfile({ ...adminProfile, fullName: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">USERNAME *</label>
                    <input 
                      type="text" 
                      required 
                      value={adminProfile.username} 
                      onChange={e => setAdminProfile({ ...adminProfile, username: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white font-medium" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">EMAIL ADDRESS *</label>
                    <input 
                      type="email" 
                      required 
                      value={adminProfile.email} 
                      onChange={e => setAdminProfile({ ...adminProfile, email: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-450 font-bold mb-1">SECURE MOBILE CONTACT *</label>
                    <input 
                      type="text" 
                      required 
                      value={adminProfile.phone} 
                      onChange={e => setAdminProfile({ ...adminProfile, phone: e.target.value })} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded-lg text-gray-800 dark:text-white font-medium" 
                    />
                  </div>
                </div>

                <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white font-bold hover:bg-amber-400 hover:text-black transition-colors rounded-xl flex items-center space-x-1.5 shadow">
                  <Save size={14} />
                  <span>Update Demographics</span>
                </button>
              </form>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Crypto Password Calibrator */}
              <form onSubmit={handlePasswordChange} className="bg-white dark:bg-[#111827] p-8 rounded-3xl border space-y-4">
                <span className="font-bold text-gray-800 dark:text-white block border-b pb-2 uppercase tracking-wider text-[10px]">Alter Cryptographic Password Code</span>
                
                {passMsg && <span className="block text-emerald-500 font-bold">✓ {passMsg}</span>}
                {passErr && <span className="block text-rose-500 font-bold">✕ {passErr}</span>}

                <div>
                  <label className="block text-gray-450 font-bold mb-1">CURRENT PASSWORD CODE *</label>
                  <input type="password" required value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-gray-450 font-bold mb-1">TARGET NEW PASSWORD CODE *</label>
                  <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border p-2.5 rounded-lg outline-none font-medium" />
                </div>

                <button type="submit" className="px-5 py-2.5 bg-slate-950 text-white rounded-xl hover:bg-amber-400 hover:text-black font-bold transition-all shadow">
                  Re-calibrate Passwords
                </button>
              </form>

              {/* Two-Factor Authentication Simulator */}
              <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border space-y-4">
                <span className="font-bold text-gray-800 dark:text-white block border-b pb-2 uppercase tracking-wider text-[10px]">Two-Factor Authorization enrollment (2FA)</span>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=150&q=80" alt="Enroll QR" className="w-16 h-16 object-cover rounded text-[8px] opacity-75 select-none" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 dark:text-white block text-xs">Security Enrollment State:</span>
                    <p className="text-gray-400 font-medium">Toggle live components, alter server rules and force secondary authentication checks.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-5 sm:bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white block">2FA Device Authorization Shield</span>
                    <span className="text-[10px] text-gray-400">Protects login coordinates with secondary codes.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleToggle2FA} 
                    className={`font-semibold px-2.5 py-1 rounded-lg text-[10px] font-mono ${adminProfile.twoFactorEnabled ? 'bg-emerald-50 text-success-gate dark:bg-emerald-950/20' : 'bg-red-50 text-danger-gate dark:bg-red-950/20'}`}
                  >
                    {adminProfile.twoFactorEnabled ? 'ACTIVE: ENABLED' : 'SHIELD DISABLED'}
                  </button>
                </div>
              </div>

            </div>

            {/* Session Management & Devices Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border space-y-4">
                <span className="font-bold text-gray-800 dark:text-white block border-b pb-2 uppercase tracking-wider text-[10px]">Sessions Management Engine</span>
                <p className="text-gray-450 font-medium leading-relaxed">
                  Invalidate other client browser sessions across cookies, local sessions, and active JWT structures.
                </p>
                <button onClick={handleLogoutAllDevices} className="w-full py-2.5 bg-slate-900 hover:bg-rose-650 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow">
                  Logout All Devices
                </button>
              </div>

              <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl border space-y-4">
                <span className="font-bold text-gray-800 dark:text-white block border-b pb-2 uppercase tracking-wider text-[10px]">Verification Login History</span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {(adminProfile.loginHistory || []).map((lh: any) => (
                    <div key={lh.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                      <div>
                        <span className="font-mono text-gray-400 text-[10px] block">{new Date(lh.date).toLocaleString()}</span>
                        <p className="font-bold text-gray-800 dark:text-white truncate max-w-[180px]" title={lh.device}>{lh.device}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono block text-gray-500">{lh.ip}</span>
                        <span className={`text-[10px] font-bold ${lh.status === 'Success' ? 'text-emerald-500' : 'text-rose-500'}`}>{lh.status}</span>
                      </div>
                    </div>
                  ))}
                  {(adminProfile.loginHistory || []).length === 0 && (
                    <span className="text-gray-450 italic mt-4 block">No historic logins tracks.</span>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

          </div>
        </div>

      </div>
    </div>
  );
}
