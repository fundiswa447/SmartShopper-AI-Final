import { Product, ExpenseItem, UserProfile } from '../types';

// =========================================================
// SMART SHOPPING DEMO DATA
// South African student-focused catalogue
// Prices are DEMO values, not live retailer prices.
// =========================================================

// =========================================================
// CURRENCY
// =========================================================

export const ZAR_TO_USD_RATE = 0.055;

export function formatPrice(
  zarAmount: number,
  currency: 'ZAR' | 'USD'
): string {
  if (currency === 'USD') {
    const usd = zarAmount * ZAR_TO_USD_RATE;
    return `$${usd.toFixed(2)}`;
  }

  return `R${Math.round(zarAmount).toLocaleString()}`;
}

export function formatPriceExact(
  zarAmount: number,
  currency: 'ZAR' | 'USD'
): string {
  if (currency === 'USD') {
    const usd = zarAmount * ZAR_TO_USD_RATE;
    return `$${usd.toFixed(2)}`;
  }

  return `R${zarAmount.toFixed(2)}`;
}

// =========================================================
// DEFAULT USER
// =========================================================

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex M.',
  email: 'alex.student@uct.ac.za',
  university: 'University of Cape Town',
  campus: 'Upper Campus / Rondebosch',
  currency: 'ZAR',
  monthlyBudgetZar: 5000,
  loyaltyCards: {
    checkersXtra: true,
    pnpSmartShopper: true,
    wooliesWRewards: false,
    sparRewards: true,
  },
};

// =========================================================
// PRODUCT CATALOGUE
// DEMO DATA — not live retailer pricing
// =========================================================

export const INITIAL_PRODUCTS: Product[] = [

  // =======================================================
  // SUPERBALIST
  // =======================================================

  {
    id: 'superbalist-nike-air-force',
    title: "Nike Air Force 1 '07 - White",
    brand: 'Nike',
    category: 'Footwear',
    store: 'Superbalist',
    storeCode: 'S',
    priceZar: 1599,
    originalPriceZar: 2199,
    discountPercent: 27,
    inStock: true,
    rating: 4.8,
    studentTag: 'Student Favourite',
    description: 'Classic everyday sneakers suitable for campus and casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  },

  {
    id: 'superbalist-converse-chuck70',
    title: 'Converse Chuck 70 Vintage Canvas High-Top',
    brand: 'Converse',
    category: 'Footwear',
    store: 'Superbalist',
    storeCode: 'S',
    priceZar: 1099,
    originalPriceZar: 1499,
    discountPercent: 26,
    inStock: true,
    rating: 4.7,
    studentTag: 'Campus Style',
    description: 'Versatile canvas sneakers for everyday student outfits.',
    imageUrl: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80',
  },

  {
    id: 'superbalist-north-face',
    title: 'The North Face Insulated Puffer Jacket',
    brand: 'The North Face',
    category: 'Clothing',
    store: 'Superbalist',
    storeCode: 'S',
    priceZar: 749,
    originalPriceZar: 999,
    discountPercent: 25,
    inStock: true,
    rating: 4.7,
    studentTag: 'Winter Essential',
    description: 'Warm insulated jacket for colder campus days.',
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80',
  },

  {
    id: 'superbalist-backpack',
    title: 'Everyday Laptop Backpack',
    brand: 'Superbalist',
    category: 'Essentials',
    store: 'Superbalist',
    storeCode: 'SP',
    priceZar: 449,
    originalPriceZar: 599,
    discountPercent: 25,
    inStock: true,
    rating: 4.5,
    studentTag: 'Campus Essential',
    description: 'Stylish backpack suitable for laptops and university books.',
    
  },

  {
    id: 'superbalist-campus-sneakers',
    title: 'Campus Running Sneakers',
    brand: 'Superbalist',
    category: 'Footwear',
    store: 'Superbalist',
    storeCode: 'SP',
    priceZar: 699,
    originalPriceZar: 899,
    discountPercent: 22,
    inStock: true,
    rating: 4.5,
    studentTag: 'Student Footwear',
    description: 'Comfortable sneakers for walking around campus.',
  },

  // =======================================================
  // TAKEALOT
  // =======================================================

  {
    id: 'takealot-adidas-ultraboost',
    title: 'Adidas Ultraboost Light Core Black',
    brand: 'Adidas',
    category: 'Footwear',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 2299,
    originalPriceZar: 3299,
    discountPercent: 30,
    inStock: true,
    rating: 4.8,
    studentTag: 'Premium Pick',
    description: 'Performance sneakers for students who want comfort and support.',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',
  },

  {
    id: 'takealot-kway-parka',
    title: "K-Way Elements Men's Parka Jacket",
    brand: 'K-Way',
    category: 'Clothing',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 650,
    originalPriceZar: 899,
    discountPercent: 28,
    inStock: true,
    rating: 4.6,
    studentTag: 'Winter Essential',
    description: 'Practical outdoor jacket for cold and rainy conditions.',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=600&q=80',
  },

  {
    id: 'takealot-powerbank',
    title: '20,000mAh Power Bank',
    brand: 'Anker',
    category: 'Tech',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 599,
    originalPriceZar: 799,
    discountPercent: 25,
    inStock: true,
    rating: 4.7,
    studentTag: 'Campus Essential',
    description: 'Portable power bank for long days on campus.',
  },

  {
    id: 'takealot-wireless-mouse',
    title: 'Wireless Computer Mouse',
    brand: 'Logitech',
    category: 'Tech',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.7,
    studentTag: 'Study Essential',
    description: 'Wireless mouse for laptops and university work.',
  },

  {
    id: 'takealot-usb',
    title: '128GB USB Flash Drive',
    brand: 'SanDisk',
    category: 'Tech',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 199,
    originalPriceZar: 299,
    discountPercent: 33,
    inStock: true,
    rating: 4.6,
    studentTag: 'Study Essential',
    description: 'Portable storage for assignments and study files.',
    isGreatValue: true,
  },

  // =======================================================
  // MR PRICE
  // =======================================================

  {
    id: 'mrprice-windbreaker',
    title: 'Urban Tech Lightweight Windbreaker',
    brand: 'Mr Price',
    category: 'Clothing',
    store: 'Mr Price',
    storeCode: 'M',
    priceZar: 499,
    originalPriceZar: 650,
    discountPercent: 23,
    inStock: true,
    rating: 4.6,
    studentTag: 'Student Fashion',
    description: 'Lightweight everyday jacket for campus.',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  },

  {
    id: 'mrprice-jeans',
    title: 'Slim Fit Denim Jeans',
    brand: 'Mr Price',
    category: 'Clothing',
    store: 'Mr Price',
    storeCode: 'MR',
    priceZar: 399,
    originalPriceZar: 499,
    discountPercent: 20,
    inStock: true,
    rating: 4.5,
    studentTag: 'Student Fashion',
    description: 'Affordable everyday jeans for campus outfits.',
  },

  {
    id: 'mrprice-tshirt',
    title: 'Basic Cotton T-Shirt',
    brand: 'Mr Price',
    category: 'Clothing',
    store: 'Mr Price',
    storeCode: 'MR',
    priceZar: 149,
    originalPriceZar: 199,
    discountPercent: 25,
    inStock: true,
    rating: 4.6,
    studentTag: 'Budget Fashion',
    description: 'Affordable everyday T-shirt for campus wear.',
    isGreatValue: true,
  },

  // =======================================================
  // CHECKERS
  // =======================================================

  {
    id: 'checkers-bread',
    title: 'Albany Superior White Bread 700g',
    brand: 'Albany',
    category: 'Groceries',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 20.99,
    originalPriceZar: 25.99,
    discountPercent: 20,
    inStock: true,
    rating: 4.7,
    unit: '700g',
    studentTag: 'Budget Pick',
    description: 'Affordable everyday bread for student meals.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'checkers-rice',
    title: 'Tastic Parboiled Rice 2kg',
    brand: 'Tastic',
    category: 'Groceries',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 36.99,
    originalPriceZar: 43.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.6,
    unit: '2kg',
    studentTag: 'Budget Staple',
    description: 'Affordable rice for student meal preparation.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'checkers-pizza',
    title: 'Dr. Oetker Frozen Pizzas (Any 2)',
    brand: 'Dr. Oetker',
    category: 'Snacks',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 89.99,
    originalPriceZar: 119.99,
    discountPercent: 25,
    inStock: true,
    rating: 4.5,
    unit: '2 pizzas',
    studentTag: 'Student Deal',
    description: 'Quick freezer meal for busy students.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
  },

  {
    id: 'checkers-milk',
    title: 'Clover Full Cream Milk 2L',
    brand: 'Clover',
    category: 'Groceries',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 32.99,
    originalPriceZar: 38.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.7,
    unit: '2L',
    studentTag: 'Student Essential',
    description: 'Everyday milk for breakfast and cooking.',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'checkers-cereal',
    title: "Kellogg's Corn Flakes 750g",
    brand: "Kellogg's",
    category: 'Groceries',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 59.99,
    originalPriceZar: 69.99,
    discountPercent: 14,
    inStock: true,
    rating: 4.5,
    unit: '750g',
    studentTag: 'Breakfast',
    description: 'Easy breakfast cereal for busy students.',
  },

  {
    id: 'checkers-toilet-paper',
    title: 'Albany Toilet Paper 18 Pack',
    brand: 'Albany',
    category: 'Essentials',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 89.99,
    originalPriceZar: 109.99,
    discountPercent: 18,
    inStock: true,
    rating: 4.4,
    unit: '18 rolls',
    studentTag: 'Bulk Saving',
    description: 'Household essential for student residences.',
  },

  {
    id: 'checkers-chicken',
    title: 'Chicken Breasts 2kg',
    brand: 'Checkers',
    category: 'Groceries',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 119.99,
    originalPriceZar: 139.99,
    discountPercent: 14,
    inStock: true,
    rating: 4.6,
    unit: '2kg',
    studentTag: 'Meal Prep',
    description: 'Convenient chicken pack for student meal preparation.',
  },

  // =======================================================
  // PICK N PAY
  // =======================================================

  {
    id: 'pnp-milk',
    title: 'Clover Full Cream Fresh Milk 2L',
    brand: 'Clover',
    category: 'Groceries',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 32.99,
    originalPriceZar: 38.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.6,
    unit: '2L',
    studentTag: 'Student Essential',
    description: 'Everyday full cream milk.',
  },

  {
    id: 'pnp-coffee',
    title: 'Nescafé Classic Instant Coffee 200g',
    brand: 'Nescafé',
    category: 'Groceries',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 89.99,
    originalPriceZar: 114.99,
    discountPercent: 22,
    inStock: true,
    rating: 4.7,
    unit: '200g',
    studentTag: 'Study Essential',
    description: 'Instant coffee for late-night study sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  },

  {
    id: 'pnp-bread',
    title: 'Albany Superior White Bread 700g',
    brand: 'Albany',
    category: 'Groceries',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 19.99,
    originalPriceZar: 24.99,
    discountPercent: 20,
    inStock: true,
    rating: 4.6,
    unit: '700g',
    studentTag: 'Budget Pick',
    description: 'Affordable everyday bread.',
    isGreatValue: true,
  },

  {
    id: 'pnp-pasta',
    title: "Fatti's & Moni's Spaghetti 500g",
    brand: "Fatti's & Moni's",
    category: 'Groceries',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 18.99,
    originalPriceZar: 22.99,
    discountPercent: 17,
    inStock: true,
    rating: 4.5,
    unit: '500g',
    studentTag: 'Budget Meal',
    description: 'Low-cost pasta for quick student dinners.',
    isGreatValue: true,
  },

  {
    id: 'pnp-peanut-butter',
    title: 'Black Cat Peanut Butter 400g',
    brand: 'Black Cat',
    category: 'Groceries',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 49.99,
    originalPriceZar: 59.99,
    discountPercent: 17,
    inStock: true,
    rating: 4.7,
    unit: '400g',
    studentTag: 'Student Essential',
    description: 'Versatile pantry staple for breakfast and snacks.',
  },

  {
    id: 'pnp-laundry',
    title: 'OMO Washing Powder 2kg',
    brand: 'OMO',
    category: 'Essentials',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 69.99,
    originalPriceZar: 84.99,
    discountPercent: 18,
    inStock: true,
    rating: 4.6,
    unit: '2kg',
    studentTag: 'Household',
    description: 'Laundry detergent for student residences.',
  },

  // =======================================================
  // WOOLWORTHS
  // =======================================================

  {
    id: 'woolies-eggs',
    title: 'Free Range Large Eggs (Dozen)',
    brand: 'Woolworths',
    category: 'Groceries',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 42.99,
    originalPriceZar: 48.99,
    discountPercent: 12,
    inStock: true,
    rating: 4.9,
    unit: '12 eggs',
    studentTag: 'Protein',
    description: 'Free range eggs for breakfasts and meals.',
  },

  {
    id: 'woolies-wraps',
    title: 'Wholewheat Wraps 6 Pack',
    brand: 'Woolworths',
    category: 'Groceries',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 39.99,
    originalPriceZar: 44.99,
    discountPercent: 11,
    inStock: true,
    rating: 4.8,
    unit: '6 pack',
    studentTag: 'Quick Meal',
    description: 'Convenient wraps for quick student lunches.',
  },

  {
    id: 'woolies-chicken',
    title: 'Ready-to-Eat Chicken Pieces',
    brand: 'Woolworths',
    category: 'Groceries',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 79.99,
    originalPriceZar: 94.99,
    discountPercent: 16,
    inStock: true,
    rating: 4.8,
    unit: 'portion',
    studentTag: 'Quick Meal',
    description: 'Ready-to-eat option for busy students.',
  },

  {
    id: 'woolies-hoodie',
    title: 'Basic Cotton Hoodie',
    brand: 'Woolworths',
    category: 'Clothing',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 499,
    originalPriceZar: 699,
    discountPercent: 29,
    inStock: true,
    rating: 4.7,
    studentTag: 'Student Fashion',
    description: 'Everyday hoodie suitable for campus wear.',
  },

  // =======================================================
  // SPAR
  // =======================================================

  {
    id: 'spar-noodles',
    title: 'Maggi Instant Noodles 5-Pack (Durban Curry)',
    brand: 'Maggi',
    category: 'Snacks',
    store: 'SPAR',
    storeCode: 'S',
    priceZar: 28.50,
    originalPriceZar: 34.00,
    discountPercent: 16,
    inStock: true,
    rating: 4.4,
    unit: '5 pack',
    studentTag: 'Student Favourite',
    description: 'Quick and affordable meal option.',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'spar-eggs',
    title: 'Large Eggs 18 Pack',
    brand: 'SPAR',
    category: 'Groceries',
    store: 'SPAR',
    storeCode: 'S',
    priceZar: 54.99,
    originalPriceZar: 64.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.6,
    unit: '18 pack',
    studentTag: 'Protein',
    description: 'Versatile protein option for affordable meals.',
  },

  {
    id: 'spar-cereal',
    title: 'Weet-Bix 450g',
    brand: 'Bokomo',
    category: 'Groceries',
    store: 'SPAR',
    storeCode: 'S',
    priceZar: 39.99,
    originalPriceZar: 47.99,
    discountPercent: 17,
    inStock: true,
    rating: 4.7,
    unit: '450g',
    studentTag: 'Breakfast',
    description: 'Popular breakfast option for students.',
  },

  // =======================================================
  // SHOPRITE
  // =======================================================

  {
    id: 'shoprite-rice',
    title: 'Tastic Long Grain Rice 2kg',
    brand: 'Tastic',
    category: 'Groceries',
    store: 'Shoprite',
    storeCode: 'SH',
    priceZar: 34.99,
    originalPriceZar: 42.99,
    discountPercent: 19,
    inStock: true,
    rating: 4.5,
    unit: '2kg',
    studentTag: 'Budget Staple',
    description: 'Affordable rice for bulk student meals.',
    isGreatValue: true,
  },

  {
    id: 'shoprite-beans',
    title: 'Baked Beans 410g',
    brand: 'All Gold',
    category: 'Groceries',
    store: 'Shoprite',
    storeCode: 'SH',
    priceZar: 15.99,
    originalPriceZar: 19.99,
    discountPercent: 20,
    inStock: true,
    rating: 4.4,
    unit: '410g',
    studentTag: 'Budget Meal',
    description: 'Low-cost option for quick student meals.',
    isGreatValue: true,
  },

  {
    id: 'shoprite-oats',
    title: 'Instant Oats 1kg',
    brand: 'Jungle',
    category: 'Groceries',
    store: 'Shoprite',
    storeCode: 'SH',
    priceZar: 39.99,
    originalPriceZar: 49.99,
    discountPercent: 20,
    inStock: true,
    rating: 4.5,
    unit: '1kg',
    studentTag: 'Breakfast',
    description: 'Affordable breakfast option for students.',
    isGreatValue: true,
  },

  // =======================================================
  // BOXER
  // =======================================================

  {
    id: 'boxer-maize-meal',
    title: 'White Maize Meal 5kg',
    brand: 'Iwisa',
    category: 'Groceries',
    store: 'Boxer',
    storeCode: 'B',
    priceZar: 59.99,
    originalPriceZar: 69.99,
    discountPercent: 14,
    inStock: true,
    rating: 4.5,
    unit: '5kg',
    studentTag: 'Bulk Saving',
    description: 'Affordable staple for shared student households.',
    isGreatValue: true,
  },

  {
    id: 'boxer-cooking-oil',
    title: 'Cooking Oil 2L',
    brand: 'Sunfoil',
    category: 'Groceries',
    store: 'Boxer',
    storeCode: 'B',
    priceZar: 54.99,
    originalPriceZar: 64.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.4,
    unit: '2L',
    studentTag: 'Kitchen Essential',
    description: 'Everyday cooking oil for student kitchens.',
  },

  {
    id: 'boxer-sugar',
    title: 'Brown Sugar 2kg',
    brand: 'Selati',
    category: 'Groceries',
    store: 'Boxer',
    storeCode: 'B',
    priceZar: 39.99,
    originalPriceZar: 46.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.4,
    unit: '2kg',
    studentTag: 'Pantry Staple',
    description: 'Affordable pantry staple for tea and coffee.',
  },

  // =======================================================
  // MAKRO
  // =======================================================

  {
    id: 'makro-microwave',
    title: 'Compact Microwave Oven',
    brand: 'Defy',
    category: 'Essentials',
    store: 'Makro',
    storeCode: 'M',
    priceZar: 1199,
    originalPriceZar: 1499,
    discountPercent: 20,
    inStock: true,
    rating: 4.5,
    studentTag: 'Residence Essential',
    description: 'Compact microwave suitable for student accommodation.',
  },

  {
    id: 'makro-headphones',
    title: 'Wireless Bluetooth Headphones',
    brand: 'JBL',
    category: 'Tech',
    store: 'Makro',
    storeCode: 'M',
    priceZar: 699,
    originalPriceZar: 899,
    discountPercent: 22,
    inStock: true,
    rating: 4.7,
    studentTag: 'Study Essential',
    description: 'Wireless headphones for studying and entertainment.',
  },

  {
    id: 'makro-backpack',
    title: 'Laptop Backpack 15.6"',
    brand: 'HP',
    category: 'Essentials',
    store: 'Makro',
    storeCode: 'M',
    priceZar: 499,
    originalPriceZar: 699,
    discountPercent: 29,
    inStock: true,
    rating: 4.6,
    studentTag: 'Campus Essential',
    description: 'Laptop backpack designed for commuting students.',
  },

  // =======================================================
  // GAME
  // =======================================================

  {
    id: 'game-usb-cable',
    title: 'USB-C Fast Charging Cable',
    brand: 'Philips',
    category: 'Tech',
    store: 'Game',
    storeCode: 'G',
    priceZar: 129.99,
    originalPriceZar: 179.99,
    discountPercent: 28,
    inStock: true,
    rating: 4.4,
    studentTag: 'Tech Essential',
    description: 'Charging cable for phones and compatible devices.',
  },

  {
    id: 'game-kettle',
    title: '1.7L Electric Kettle',
    brand: 'Russell Hobbs',
    category: 'Essentials',
    store: 'Game',
    storeCode: 'G',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.6,
    studentTag: 'Residence Essential',
    description: 'Compact kettle for tea, coffee and quick meals.',
  },

  // =======================================================
  // JET
  // =======================================================

  {
    id: 'jet-hoodie',
    title: 'Fleece Pullover Hoodie',
    brand: 'Jet',
    category: 'Clothing',
    store: 'Jet',
    storeCode: 'J',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.4,
    studentTag: 'Winter Essential',
    description: 'Affordable warm hoodie for colder campus days.',
  },

  {
    id: 'jet-sneakers',
    title: 'Everyday Canvas Sneakers',
    brand: 'Jet',
    category: 'Footwear',
    store: 'Jet',
    storeCode: 'J',
    priceZar: 349,
    originalPriceZar: 449,
    discountPercent: 22,
    inStock: true,
    rating: 4.3,
    studentTag: 'Budget Footwear',
    description: 'Affordable everyday sneakers for campus.',
  },

  // =======================================================
  // ACKERMANS
  // =======================================================

  {
    id: 'ackermans-joggers',
    title: 'Cotton Jogger Pants',
    brand: 'Ackermans',
    category: 'Clothing',
    store: 'Ackermans',
    storeCode: 'A',
    priceZar: 249,
    originalPriceZar: 329,
    discountPercent: 24,
    inStock: true,
    rating: 4.5,
    studentTag: 'Student Fashion',
    description: 'Comfortable joggers for classes and residence.',
  },

  {
    id: 'ackermans-sneakers',
    title: 'Casual Lace-Up Sneakers',
    brand: 'Ackermans',
    category: 'Footwear',
    store: 'Ackermans',
    storeCode: 'A',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.4,
    studentTag: 'Budget Footwear',
    description: 'Affordable casual footwear for everyday campus use.',
  },

  // =======================================================
  // PEP
  // =======================================================

  {
    id: 'pep-tshirt',
    title: 'Basic Everyday T-Shirt',
    brand: 'PEP',
    category: 'Clothing',
    store: 'PEP',
    storeCode: 'PE',
    priceZar: 99.99,
    originalPriceZar: 129.99,
    discountPercent: 23,
    inStock: true,
    rating: 4.4,
    studentTag: 'Budget Fashion',
    description: 'Low-cost everyday clothing option for students.',
    isGreatValue: true,
  },

  {
    id: 'pep-slippers',
    title: 'Comfort Slippers',
    brand: 'PEP',
    category: 'Footwear',
    store: 'PEP',
    storeCode: 'PE',
    priceZar: 129.99,
    originalPriceZar: 169.99,
    discountPercent: 24,
    inStock: true,
    rating: 4.3,
    studentTag: 'Residence Essential',
    description: 'Affordable slippers for residence and home use.',
  },

  // =======================================================
  // COTTON ON
  // =======================================================

  {
    id: 'cottonon-hoodie',
    title: 'Classic Campus Hoodie',
    brand: 'Cotton On',
    category: 'Clothing',
    store: 'Cotton On',
    storeCode: 'CO',
    priceZar: 599,
    originalPriceZar: 799,
    discountPercent: 25,
    inStock: true,
    rating: 4.6,
    studentTag: 'Student Fashion',
    description: 'Casual hoodie suitable for everyday campus outfits.',
  },

  {
    id: 'cottonon-tshirt',
    title: 'Classic Graphic T-Shirt',
    brand: 'Cotton On',
    category: 'Clothing',
    store: 'Cotton On',
    storeCode: 'CO',
    priceZar: 249,
    originalPriceZar: 329,
    discountPercent: 24,
    inStock: true,
    rating: 4.5,
    studentTag: 'Student Fashion',
    description: 'Casual graphic T-shirt for everyday student wear.',
  },
];

// =========================================================
// INITIAL EXPENSES
// =========================================================

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'expense-cafeteria',
    title: 'Campus Cafeteria',
    category: 'Groceries',
    amountZar: 120,
    date: '2026-08-16',
    formattedDate: 'Aug 16',
    budgetPeriodId: 'budget-initial',
  },

  {
    id: 'expense-transit',
    title: 'City Transit Pass',
    category: 'Transport',
    amountZar: 450,
    date: '2026-08-15',
    formattedDate: 'Aug 15',
    budgetPeriodId: 'budget-initial',
  },

  {
    id: 'expense-clothing',
    title: 'Urban Outfitters / MRP',
    category: 'Clothing',
    amountZar: 1100,
    date: '2026-08-12',
    formattedDate: 'Aug 12',
    budgetPeriodId: 'budget-initial',
  },

  {
    id: 'expense-bookstore',
    title: 'University Bookstore',
    category: 'Textbooks',
    amountZar: 300,
    date: '2026-08-10',
    formattedDate: 'Aug 10',
    budgetPeriodId: 'budget-initial',
  },

  {
    id: 'expense-checkers',
    title: 'Checkers Sixty60 Groceries',
    category: 'Groceries',
    amountZar: 480,
    date: '2026-08-08',
    formattedDate: 'Aug 8',
    budgetPeriodId: 'budget-initial',
  },

  {
    id: 'expense-takealot',
    title: 'Takealot Tech Cable & Mouse',
    category: 'Tech',
    amountZar: 220,
    date: '2026-08-04',
    formattedDate: 'Aug 4',
    budgetPeriodId: 'budget-initial',
  },
];

// =========================================================
// NEARBY STORES
// =========================================================

export const NEARBY_STORES = [
  {
    id: 'checkers-campus-square',
    name: 'Checkers Campus Square',
    brand: 'Checkers',
    code: 'C',
    distanceKm: 1.2,
    travelTimeMinutes: 4,
    address: 'Campus Square Shopping Centre, Cnr Kingsway & University Rd',
    rating: 4.6,
    openUntil: '8:00 PM',
    delivery: 'Sixty60 Delivery Available (30 mins)',
    dealSummary: '2-for-R90 Pizzas • R20.99 Albany White Bread',
  },

  {
    id: 'spar-student-hub',
    name: 'SPAR Express Student Hub',
    brand: 'SPAR',
    code: 'S',
    distanceKm: 0.8,
    travelTimeMinutes: 2,
    address: 'Main St near Student Residence Gate 3',
    rating: 4.4,
    openUntil: '10:00 PM',
    delivery: 'Walking distance',
    dealSummary: 'R28.50 Maggi 5-Pack Noodles • R12 Coffee Special',
  },

  {
    id: 'pnp-main-road',
    name: 'Pick n Pay Main Rd Plaza',
    brand: 'Pick n Pay',
    code: 'P',
    distanceKm: 2.5,
    travelTimeMinutes: 7,
    address: 'Main Road Centre, Rondebosch / Braamfontein',
    rating: 4.5,
    openUntil: '7:30 PM',
    delivery: 'PnP ASAP! (35 mins)',
    dealSummary: 'R32.99 2L Clover Milk • R89.99 Nescafé 200g',
  },

  {
    id: 'woolworths-klipfontein',
    name: 'Woolworths Food Klipfontein',
    brand: 'Woolworths',
    code: 'W',
    distanceKm: 3.1,
    travelTimeMinutes: 9,
    address: 'Klipfontein Centre, Food Market',
    rating: 4.8,
    openUntil: '8:00 PM',
    delivery: 'Woolies Dash',
    dealSummary: 'R42.99 Free Range Eggs • R149 Rotisserie Chicken',
  },

  {
    id: 'shoprite-student-centre',
    name: 'Shoprite Student Centre',
    brand: 'Shoprite',
    code: 'SH',
    distanceKm: 2.0,
    travelTimeMinutes: 6,
    address: 'Student Centre Shopping Precinct',
    rating: 4.5,
    openUntil: '8:00 PM',
    delivery: 'Local delivery available',
    dealSummary: 'R34.99 Tastic Rice • R15.99 Baked Beans',
  },

  {
    id: 'boxer-campus-market',
    name: 'Boxer Campus Market',
    brand: 'Boxer',
    code: 'B',
    distanceKm: 2.8,
    travelTimeMinutes: 8,
    address: 'Campus Market Shopping Centre',
    rating: 4.4,
    openUntil: '7:00 PM',
    delivery: 'Local delivery available',
    dealSummary: 'R59.99 Maize Meal • R54.99 Cooking Oil',
  },

  {
    id: 'makro-student-shopping',
    name: 'Makro Student Shopping',
    brand: 'Makro',
    code: 'M',
    distanceKm: 6.4,
    travelTimeMinutes: 15,
    address: 'Regional Shopping Centre',
    rating: 4.5,
    openUntil: '7:00 PM',
    delivery: 'Delivery available',
    dealSummary: 'R699 JBL Headphones • R499 Laptop Backpack',
  },

  {
    id: 'game-shopping-centre',
    name: 'Game Shopping Centre',
    brand: 'Game',
    code: 'G',
    distanceKm: 5.7,
    travelTimeMinutes: 14,
    address: 'Regional Shopping Centre',
    rating: 4.4,
    openUntil: '7:00 PM',
    delivery: 'Delivery available',
    dealSummary: 'R129.99 USB-C Cable • R299 Electric Kettle',
  },
];

// =========================================================
// SHOPPING CATEGORIES
// =========================================================

export const SHOPPING_CATEGORIES = [
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    description: 'Food, drinks and everyday supermarket items',
    savings: 'Save up to R220',
  },

  {
    id: 'clothing',
    name: 'Clothing',
    icon: '👕',
    description: 'Affordable student fashion and campus outfits',
    savings: 'Save 15–30%',
  },

  {
    id: 'footwear',
    name: 'Footwear',
    icon: '👟',
    description: 'Sneakers, casual shoes and residence footwear',
    savings: 'Save up to R500',
  },

  {
    id: 'tech',
    name: 'Tech',
    icon: '💻',
    description: 'Study technology, accessories and electronics',
    savings: 'Save up to R300',
  },

  {
    id: 'essentials',
    name: 'Student Essentials',
    icon: '🎒',
    description: 'Residence, campus and household essentials',
    savings: 'Save up to R250',
  },

  {
    id: 'snacks',
    name: 'Snacks',
    icon: '🍫',
    description: 'Quick meals, drinks and student snacks',
    savings: 'Save up to R100',
  },
];

// =========================================================
// STUDENT SALES / HOME PAGE SLIDES
// =========================================================

export const STUDENT_SALES = [
  {
    id: 'sale-groceries',
    title: 'Student Grocery Savings',
    description: 'Save money on everyday groceries and meal essentials.',
    category: 'Groceries',
    offer: 'Save up to 35%',
    stores: 'Checkers • Pick n Pay • Woolworths',
  },

  {
    id: 'sale-clothing',
    title: 'Affordable Student Fashion',
    description: 'Find affordable campus outfits without overspending.',
    category: 'Clothing',
    offer: 'Save up to 30%',
    stores: 'Mr Price • Jet • Cotton On',
  },

  {
    id: 'sale-essentials',
    title: 'Back-to-Campus Deals',
    description: 'Shop backpacks, tech accessories and residence essentials.',
    category: 'Student Essentials',
    offer: 'Save up to 25%',
    stores: 'Game • Makro • Takealot',
  },

  {
    id: 'sale-smart-shopping',
    title: 'Shop Smarter, Not Harder',
    description: 'Compare products and keep your student budget under control.',
    category: 'Smart Shopping',
    offer: 'Budget-friendly picks',
    stores: 'Multiple stores',
  },
];

// =========================================================
// RECOMMENDED STORES
// =========================================================

export const RECOMMENDED_STORES = [
  {
    id: 'recommended-checkers',
    name: 'Checkers',
    distanceKm: 1.4,
    rating: 4.8,
    reason: 'Good for groceries and everyday student essentials.',
  },

  {
    id: 'recommended-mrprice',
    name: 'Mr Price',
    distanceKm: 2.1,
    rating: 4.7,
    reason: 'Affordable clothing and campus fashion.',
  },

  {
    id: 'recommended-game',
    name: 'Game',
    distanceKm: 3.3,
    rating: 4.6,
    reason: 'Useful for electronics and residence essentials.',
  },

  {
    id: 'recommended-woolworths',
    name: 'Woolworths',
    distanceKm: 2.7,
    rating: 4.9,
    reason: 'Food, quality essentials and clothing.',
  },

  {
    id: 'recommended-pnp',
    name: 'Pick n Pay',
    distanceKm: 2.4,
    rating: 4.6,
    reason: 'Everyday groceries and household products.',
  },

  {
    id: 'recommended-jet',
    name: 'Jet',
    distanceKm: 2.8,
    rating: 4.5,
    reason: 'Affordable clothing and footwear.',
  },
];

// =========================================================
// MAP DATA
// Demo coordinates for the student shopping map.
// =========================================================

export const STORE_MAP_LOCATIONS = [
  {
    id: 'map-checkers',
    name: 'Checkers',
    latitude: -29.6000,
    longitude: 30.3800,
    category: 'Groceries',
  },

  {
    id: 'map-mrprice',
    name: 'Mr Price',
    latitude: -29.5950,
    longitude: 30.3900,
    category: 'Clothing',
  },

  {
    id: 'map-game',
    name: 'Game',
    latitude: -29.6100,
    longitude: 30.3950,
    category: 'Tech & Essentials',
  },

  {
    id: 'map-woolworths',
    name: 'Woolworths',
    latitude: -29.5900,
    longitude: 30.3700,
    category: 'Groceries',
  },

  {
    id: 'map-pnp',
    name: 'Pick n Pay',
    latitude: -29.6050,
    longitude: 30.3650,
    category: 'Groceries',
  },
];