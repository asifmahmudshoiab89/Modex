/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Sun, Moon, Globe, Terminal, LogOut, Check, Sliders, Mic, MicOff } from 'lucide-react';
import { CartItem, Product, User as UserType } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlist: Product[];
  currentUser: UserType | null;
  onNavigate: (page: string, params?: any) => void;
  currency: 'USD' | 'BDT' | 'INR';
  setCurrency: (curr: 'USD' | 'BDT' | 'INR') => void;
  lang: 'EN' | 'BN' | 'HI';
  setLang: (lang: 'EN' | 'BN' | 'HI') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
  onAdminQuickLogin: () => void;
  onSearch: (query: string) => void;
}

export default function Header({
  cart,
  wishlist,
  currentUser,
  onNavigate,
  currency,
  setCurrency,
  lang,
  setLang,
  theme,
  toggleTheme,
  onLogout,
  onAdminQuickLogin,
  onSearch
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Voice Search Simulation State
  const [isListening, setIsListening] = useState(false);
  const [listeningStatus, setListeningStatus] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onNavigate('search', { query: searchQuery });
    }
  };

  const triggerVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setListeningStatus('Listening for audio parameters...');
    
    // Simulate hearing voice keywords after 2 seconds
    const phrases = ['SoundFlow ANC', 'Titanium watches', 'Lumina 4K', 'Leather sleeves', 'MagSafe Desk Pad'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    setTimeout(() => {
      setListeningStatus(`Recognized: "${randomPhrase}"`);
      setTimeout(() => {
        setSearchQuery(randomPhrase);
        setIsListening(false);
        onSearch(randomPhrase);
        onNavigate('search', { query: randomPhrase });
      }, 1000);
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 glassmorphism dark:glassmorphism-dark border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-primary-slate to-brand-accent rounded-xl text-white font-bold text-xl font-heading shadow-md transition-transform group-hover:scale-105">
              M
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-gate rounded-full border-2 border-white dark:border-gray-900" />
            </div>
            <div>
              <span className="font-heading font-black tracking-widest text-2xl bg-gradient-to-r from-primary-slate via-slate-800 to-brand-accent dark:from-white dark:via-gray-100 dark:to-brand-accent bg-clip-text text-transparent">
                MODEX
              </span>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-gray-500 font-sans font-medium">PREMIUM LIFESTYLE</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent tracking-wide transition-colors"
              onClick={() => onNavigate('home')}
            >
              Home
            </button>
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent tracking-wide transition-colors"
              onClick={() => onNavigate('shop')}
            >
              Shop All
            </button>
            <div className="relative group py-2">
              <button className="text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent tracking-wide transition-colors flex items-center space-x-1">
                <span>Categories</span>
                <span className="text-[10px] opacity-70">▼</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-dark-gate rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {['Audio', 'Wearables', 'Home Theater', 'Lifestyle'].map((cat) => (
                  <button
                    key={cat}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-accent transition-colors"
                    onClick={() => onNavigate('category', { category: cat })}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent tracking-wide transition-colors"
              onClick={() => onNavigate('blogs')}
            >
              Editorial Blog
            </button>
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-brand-accent dark:hover:text-brand-accent tracking-wide transition-colors"
              onClick={() => onNavigate('faq')}
            >
              FAQs
            </button>
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-4">
            
            {/* Search Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-accent transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Search"
              >
                <Search size={20} />
              </button>
              {showSearch && (
                <form 
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 mt-3 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-4 flex flex-col space-y-3 z-50 animate-fade-in"
                >
                  <div className="relative flex items-center">
                    <input 
                      type="text"
                      placeholder="Search tech & lifestyle..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-accent text-gray-800 dark:text-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={triggerVoiceSearch}
                      className={`absolute right-3 p-1.5 rounded-lg transition-colors ${isListening ? 'bg-danger-gate text-white animate-pulse' : 'text-gray-400 hover:text-brand-accent hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Voice Search"
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  </div>

                  {/* Voice state animation */}
                  {isListening && (
                    <div className="flex items-center space-x-2 py-1 text-xs text-danger-gate bg-red-50 dark:bg-red-950/30 px-3 rounded-lg">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="font-mono text-[10px] font-semibold">{listeningStatus}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Try: "SoundFlow" or "Sleeve"</span>
                    <button type="submit" className="text-brand-accent hover:underline font-semibold">Search ↵</button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Multi-Language & Multi-Currency Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-accent transition-colors flex items-center space-x-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <Globe size={18} />
                <span className="text-xs uppercase font-mono">{lang} | {currency}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-4 z-50 text-xs">
                  <div className="mb-3">
                    <span className="text-gray-400 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Select Currency</span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['USD', 'BDT', 'INR'] as const).map((curr) => (
                        <button
                          key={curr}
                          onClick={() => { setCurrency(curr); setShowLangMenu(false); }}
                          className={`py-1 rounded text-center font-mono font-bold transition-colors ${currency === curr ? 'bg-brand-accent text-white' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'}`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Select Language</span>
                    <div className="space-y-1">
                      {[
                        { code: 'EN', name: 'English' },
                        { code: 'BN', name: 'বাংলা (BN)' },
                        { code: 'HI', name: 'हिन्दी (HI)' }
                      ].map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code as any); setShowLangMenu(false); }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${lang === l.code ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-brand-accent' : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300'}`}
                        >
                          <span>{l.name}</span>
                          {lang === l.code && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-accent transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist Icon */}
            <button 
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-accent transition-colors relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open Wishlist"
            >
              <Heart size={20} className={wishlist.length ? 'fill-danger-gate text-danger-gate' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-gate text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button 
              onClick={() => onNavigate('cart')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-accent transition-colors relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Auth Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1 border ${currentUser ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-600 dark:text-gray-300'}`}
                aria-label="User Account Menu"
              >
                <User size={20} />
                {currentUser && <span className="hidden sm:inline-block text-xs font-semibold font-mono pl-1">{currentUser.role === 'admin' ? 'Rahul (Admin)' : 'Account'}</span>}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl py-3 z-50 text-xs">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                        <span className="block font-bold text-gray-800 dark:text-white truncate">{currentUser.name}</span>
                        <span className="block text-[10px] text-gray-400 truncate">{currentUser.email}</span>
                      </div>
                      
                      {currentUser.role === 'admin' ? (
                        <button
                          onClick={() => { setShowUserMenu(false); onNavigate('admin'); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-accent font-bold flex items-center space-x-2"
                        >
                          <Terminal size={14} />
                          <span>Admin Console</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => { setShowUserMenu(false); onNavigate('dashboard'); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                        >
                          Customer Dashboard
                        </button>
                      )}
                      
                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('dashboard', { tab: 'history' }); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                      >
                        Order History
                      </button>

                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('track-order'); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                      >
                        Track Shipment
                      </button>

                      <button
                        onClick={() => { setShowUserMenu(false); onLogout(); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-danger-gate font-semibold flex items-center space-x-2 border-t border-gray-50 dark:border-gray-800 mt-2 pt-2"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('login'); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold"
                      >
                        Login to Account
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('register'); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                      >
                        Create Premium ID
                      </button>
                      
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 px-3">
                        <button
                          onClick={() => { setShowUserMenu(false); onAdminQuickLogin(); }}
                          className="w-full py-2 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow"
                        >
                          <Terminal size={12} className="text-brand-accent animate-pulse" />
                          <span>Admin Login (RAHUL)</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
