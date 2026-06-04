/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, BlogPost, FAQ, Vendor, Coupon } from './types';

export const POPULAR_BRANDS = [
  { name: 'AeroTech', logo: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=120&q=80&blend=111827&sat=-100' },
  { name: 'Onyx', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80&blend=111827&sat=-100' },
  { name: 'Spectra', logo: 'https://images.unsplash.com/photo-1527067829737-40299308852b?auto=format&fit=crop&w=120&q=80&blend=111827&sat=-100' },
  { name: 'Zenith', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80&blend=111827&sat=-100' },
  { name: 'Krono', logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80&blend=111827&sat=-100' },
];

export const SHIPPNG_ZONES = [
  { zone: 'Inside Dhaka / Local (Bangladesh)', rate: 60, estDays: '1-2 Days' },
  { zone: 'Outside Dhaka (Bangladesh)', rate: 120, estDays: '2-4 Days' },
  { zone: 'Metro Delhi & Mumbai (India)', rate: 150, estDays: '2-3 Days' },
  { zone: 'Other Cities (India)', rate: 250, estDays: '3-5 Days' },
  { zone: 'International Standard Shipping', rate: 1200, estDays: '5-9 Days' },
  { zone: 'Express Courier Service', rate: 2500, estDays: '2-4 Days' },
];

export const VENDORS: Vendor[] = [
  {
    id: 'v-onyx-official',
    name: 'Onyx Digital Store',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    followers: 12400,
    description: 'Direct manufacturer outlet for Onyx Premium audio gear and lifestyle peripherals.',
    verified: true,
  },
  {
    id: 'v-krono-boutique',
    name: 'Krono Wearables Ltd.',
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&h=100&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    followers: 8650,
    description: 'Expertly engineered smart wearables, custom luxury chronographs, and visual companion displays.',
    verified: true,
  }
];

export const FAQs: FAQ[] = [
  {
    question: 'How do you guarantee the authenticity of Modex products?',
    answer: 'At Modex, every single item is sourced directly from manufacturers or authorized international distributors. We offer a 100% Authenticity Guarantee, backed by serial key verification included on your smart invoice.',
    category: 'Product'
  },
  {
    question: 'What is the standard shipping timeline?',
    answer: 'Depending on your location, local deliveries (within Dhaka or Metro cities in India) take 1-3 business days. International standard shipments take 5-9 business days. Tracking details are emailed immediately on dispatch.',
    category: 'Shipping'
  },
  {
    question: 'What is the return policy for technological wearables?',
    answer: 'We provide an unconditional 7-day hassle-free return window for all items returned in original unopened packaging. For defective equipment, we offer quick replacement or full refund under our Modex Care Warranty.',
    category: 'Returns'
  },
  {
    question: 'How can I redeem my referral or cashback credits?',
    answer: 'Credits are loaded securely into your User Account Dashboard. During checkout, you can select "Redeem Cashback Wallet" to deduct up to 50% of your total order value instantly.',
    category: 'Payment'
  },
];

export const BLOGS: BlogPost[] = [
  {
    id: 'b-1',
    title: 'The Evolution of Minimalist Workspace Architecture',
    excerpt: 'Explore how workspace configurations affect creative focus, from noise isolation to calibrated high-temperature setups.',
    content: `In the modern era of hybrid productivity, the boundary between creative engineering and domestic relaxation has dissolved. Creating a physical workspace that fosters absolute focus demands more than a premium custom-built keyboard or visual OLED screens; it requires calibrated environmental styling.

### Noise Isolation & Architectural Aura
Studies prove that ambient noise above 45 decibels triggers subtle release of stress hormones, which reduces strategic thinking stamina. Modex sound designers recommend building audio-sheltering grids. Integrating continuous-frequency acoustic baffles or utilizing precision active noise-canceling gear, such as the Modex SoundFlow X, creates an island of hyper-focus.

### Calibrated Spatial Illumination
Traditional fluorescent bulbs flick at sub-visible high frequencies, inducing optic nerve fatigue during extended sessions. Premium layouts rely on dual-point dynamic backlighting. Place a warm natural diffuser behind your workspace monitor (calibrated to 2700K) and an organic ceiling spotlight (at 5000K) to optimize ergonomic focus.`,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    author: 'Sarah Bennett, Industrial Psychologist',
    date: 'May 28, 2026',
    readTime: '6 Min Read',
    tags: ['Workspace', 'Lifestyle', 'Productivity']
  },
  {
    id: 'b-2',
    title: 'Precision Horology: Why Analog Details Matter in Smart Systems',
    excerpt: 'Combining centuries-old watch aesthetics with futuristic tactile feedback engines creates the perfect modern luxury watch.',
    content: `Historically, watchmakers designed for pure mechanical persistence. Today, smartwatches design for continuous data delivery. When these paradigms collide, we witness the birth of high-precision wearable micro-computers.

### The Philosophy of Tactile Clicks
When rotating a bezel or checking notification alerts, humans respond instantly to subtle click feedbacks. By tuning state oscillators to emulate Swiss high-jeweled movements, the Krono Horizon series blends digital notifications with the weight of pristine luxury heritage.`,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    author: 'Marcus Drake, Core Hardware Designer',
    date: 'Apr 15, 2026',
    readTime: '4 Min Read',
    tags: ['Wearables', 'Engineering', 'Aesthetics']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'SoundFlow X Pro ANC Headphones',
    tagline: 'Quietly Crafted. Audiophile Tuned.',
    description: 'Engage absolute architectural silence. SoundFlow X utilizes a custom quad-core hybrid ANC engine paired with massive 40mm physical bio-cellulose diaphragms to deliver breathtaking Spatial Audio with flawless clarity.',
    category: 'Audio',
    price: 299,
    originalPrice: 399,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    ],
    brand: 'Onyx',
    rating: 4.9,
    reviewsCount: 148,
    reviews: [
      { id: 'rev-1', name: 'Kabir Chowdhury', rating: 5, date: '2026-05-12', comment: 'Absolutely blows other ANC headphones out of the water. Incredible spatial depth, pristine packaging, and very comfortable.' },
      { id: 'rev-2', name: 'Nikhil Sharma', rating: 5, date: '2026-04-30', comment: 'The premium materials feel amazing to hold. Battery easily lasts 45+ hours on a single fast charge.' }
    ],
    sizes: ['Standard Fit'],
    colors: ['Midnight Black', 'Platinum Silver', 'Aura Bronze'],
    variants: [
      { sku: 'MODEX-AUD-SFX-BLK', size: 'Standard Fit', color: 'Midnight Black', stock: 25 },
      { sku: 'MODEX-AUD-SFX-SIL', size: 'Standard Fit', color: 'Platinum Silver', stock: 12 },
      { sku: 'MODEX-AUD-SFX-BRZ', size: 'Standard Fit', color: 'Aura Bronze', stock: 3 }
    ],
    specifications: [
      { label: 'Acoustic Driver', value: '45mm Bio-Cellulose Custom Diaphragm' },
      { label: 'Active Noise Cancellation', value: 'Hybrid 4-Mic Array, up to 48dB dampening' },
      { label: 'Codec Compatibility', value: 'AAC, LDAC, aptX Adaptive, SBC' },
      { label: 'Battery Capacity', value: '1100mAh (Up to 50 hrs playback with active ANC)' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 Multi-Point Synchronous Link' }
    ],
    sku: 'MODEX-AUD-SFX',
    stock: 40,
    isFlashSale: true,
    flashSalePrice: 299,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    vendorId: 'v-onyx-official'
  },
  {
    id: 'p-2',
    name: 'Krono Horizon smart Chrono 3',
    tagline: 'Centuries of design. Milliseconds of precision.',
    description: 'Elevate your aesthetic. Krono Horizon pairs hand-assembled stainless steel alloy structures with orthorhombic OLED micro-panels and comprehensive biomechanical tracking telemetry.',
    category: 'Wearables',
    price: 450,
    originalPrice: 550,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80'
    ],
    brand: 'Krono',
    rating: 4.8,
    reviewsCount: 92,
    reviews: [
      { id: 'rev-3', name: 'Zeeshan Ahmed', rating: 5, date: '2026-05-20', comment: 'An elegant statement piece that acts like a robust wellness assistant. Fits bKash payment shortcuts beautifully.' }
    ],
    sizes: ['41mm', '45mm'],
    colors: ['Brushed Titan', 'Gold Obsidian', 'Liquid Chromium'],
    variants: [
      { sku: 'MODEX-WEAR-KH3-45T', size: '45mm', color: 'Brushed Titan', stock: 15 },
      { sku: 'MODEX-WEAR-KH3-45G', size: '45mm', color: 'Gold Obsidian', stock: 8 },
      { sku: 'MODEX-WEAR-KH3-41C', size: '41mm', color: 'Liquid Chromium', stock: 2 },
    ],
    specifications: [
      { label: 'Bezel Material', value: 'Aerospace Grade Titanium / Surgical Steel 316L' },
      { label: 'Screen Tech', value: '1.43" LTPS OLED Screen, Sapphire Crystal Cover' },
      { label: 'Sensors Array', value: 'Photoplethysmography (PPG), ECG, SPO2, Six-Axis Acceleration' },
      { label: 'Water Protection', value: 'IP68 Certified + 5ATM Swim-proof structure' }
    ],
    sku: 'MODEX-WEAR-KH3',
    stock: 25,
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    vendorId: 'v-krono-boutique'
  },
  {
    id: 'p-3',
    name: 'Lumina 4K Ultra-Portable Projector',
    tagline: 'Cinematic Brilliance, Pocket Size.',
    description: 'Transform any matte surface into an immersive 150-inch 4K HDR home theater. Featuring integrated SoundFlow audio acoustics, 2400 ANSI Lumens, and voice-assisted digital calibration.',
    category: 'Home Theater',
    price: 699,
    originalPrice: 850,
    images: [
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
    ],
    brand: 'Spectra',
    rating: 4.7,
    reviewsCount: 38,
    reviews: [],
    sizes: ['Standard Suite'],
    colors: ['Stellar Silver', 'Chamber Black'],
    variants: [
      { sku: 'MODEX-HT-LUM-SIL', size: 'Standard Suite', color: 'Stellar Silver', stock: 5 },
      { sku: 'MODEX-HT-LUM-BLK', size: 'Standard Suite', color: 'Chamber Black', stock: 4 }
    ],
    specifications: [
      { label: 'Projector Tech', value: '0.47" DMD DLP Engine, 4K UHD Native Frame' },
      { label: 'Brightness Index', value: '2400 ANSI Lumens Optical Output' },
      { label: 'Keystone System', value: 'Omnidirectional Automatic Focus & Image Grid Alignment' },
      { label: 'OS Ecosystem', value: 'AeroLink Integrated Play OS with Google Workspace projection mapping' }
    ],
    sku: 'MODEX-HT-LUM',
    stock: 9,
    isFlashSale: true,
    flashSalePrice: 699,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 'p-4',
    name: 'Carbon-Minimalist Leather Sleeve',
    tagline: 'Sculpted Silhouette. Eternal Protection.',
    description: 'Engineered with certified ultra-sustainable vegan cactus leather and custom thermal carbon fibers, providing ultra-slim, weather-proof housing for your high-performance laptop.',
    category: 'Lifestyle',
    price: 89,
    originalPrice: 120,
    images: [
      'https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
    ],
    brand: 'Zenith',
    rating: 4.9,
    reviewsCount: 220,
    reviews: [
      { id: 'rev-4', name: 'Tabassum Khan', rating: 5, date: '2026-05-25', comment: 'Stitching is phenomenally solid. Perfect sleeve that looks professional in meetings.' }
    ],
    sizes: ['MacBook 14"', 'MacBook 16"'],
    colors: ['British Tan', 'Obsidian Gray', 'Aesthetic Olive'],
    variants: [
      { sku: 'MODEX-LIS-CL-14T', size: 'MacBook 14"', color: 'British Tan', stock: 40 },
      { sku: 'MODEX-LIS-CL-16T', size: 'MacBook 16"', color: 'British Tan', stock: 25 },
      { sku: 'MODEX-LIS-CL-14G', size: 'MacBook 14"', color: 'Obsidian Gray', stock: 15 },
      { sku: 'MODEX-LIS-CL-16G', size: 'MacBook 16"', color: 'Obsidian Gray', stock: 0 } // Low stock alert!
    ],
    specifications: [
      { label: 'Exterior Shell', value: 'Premium Cactus Vegan Leather, Triple Waterproofed' },
      { label: 'Internal Cushioning', value: 'Impact-absorbing 3D micro-rib structural grid' },
      { label: 'Sizing Spec', value: 'Fits exact dimensions of laptops with widths up to 14.1" and 16.2"' }
    ],
    sku: 'MODEX-LIS-CL',
    stock: 80,
    isTrending: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: 'p-5',
    name: 'NeoGlow MagSafe Desk Pad',
    tagline: 'Ambient Calibration. Fluid Movement.',
    description: 'An elegant workspace anchor. Combining water-resistant premium merino felt with full-perimeter synchronized NeoGlow LEDs, dual 15W wireless MagSafe charging points, and structured pen trays.',
    category: 'Lifestyle',
    price: 120,
    originalPrice: 160,
    images: [
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=600&q=80'
    ],
    brand: 'AeroTech',
    rating: 4.6,
    reviewsCount: 54,
    reviews: [],
    sizes: ['Medium (800x300mm)', 'Large (1000x400mm)'],
    colors: ['Slate Grey', 'Nordic Cream'],
    variants: [
      { sku: 'MODEX-LIS-NG-M_GL', size: 'Medium (800x300mm)', color: 'Slate Grey', stock: 18 },
      { sku: 'MODEX-LIS-NG-L_GL', size: 'Large (1000x400mm)', color: 'Slate Grey', stock: 26 },
      { sku: 'MODEX-LIS-NG-M_CR', size: 'Medium (800x300mm)', color: 'Nordic Cream', stock: 5 }
    ],
    specifications: [
      { label: 'Active Textile Surface', value: '80% Natural Merino Wool Felt + 20% Non-fraying synthetic blend' },
      { label: 'MagSafe Capacity', value: 'Dual independent inductive coils, QI 2.0 fully compatible, 15W + 15W peak' },
      { label: 'Visual Glow', value: 'Modular LED strip embedded in perimeter border, controlled via tactile side slider' }
    ],
    sku: 'MODEX-LIS-NG',
    stock: 49,
    isNewArrival: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'MODEX10', discountType: 'percentage', discountValue: 10, minSpend: 100, isActive: true },
  { code: 'VIPPREMIUM', discountType: 'fixed', discountValue: 50, minSpend: 300, isActive: true },
  { code: 'EIDSALE', discountType: 'percentage', discountValue: 20, minSpend: 150, isActive: true },
  { code: 'WELCOMEBACK', discountType: 'percentage', discountValue: 15, minSpend: 50, isActive: true },
];
