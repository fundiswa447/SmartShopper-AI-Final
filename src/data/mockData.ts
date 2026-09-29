import { Product, ExpenseItem, UserProfile } from '../types';

// =========================================================
// SMARTSHOPPER DEMO DATA
// South African student-focused shopping catalogue
//
// IMPORTANT:
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
  const safeAmount = Number(zarAmount) || 0;

  if (currency === 'USD') {
    const usd = safeAmount * ZAR_TO_USD_RATE;
    return `$${usd.toFixed(2)}`;
  }

  return `R${Math.round(safeAmount).toLocaleString()}`;
}

export function formatPriceExact(
  zarAmount: number,
  currency: 'ZAR' | 'USD'
): string {
  const safeAmount = Number(zarAmount) || 0;

  if (currency === 'USD') {
    const usd = safeAmount * ZAR_TO_USD_RATE;
    return `$${usd.toFixed(2)}`;
  }

  return `R${safeAmount.toFixed(2)}`;
}

// =========================================================
// DEFAULT USER
// =========================================================

export const INITIAL_USER_PROFILE: UserProfile = {
  name: '',
  email: '',
  university: '',
  campus: '',
  currency: 'ZAR',
  monthlyBudgetZar: 0,
  loyaltyCards: {
    checkersXtra: false,
    pnpSmartShopper: false,
    wooliesWRewards: false,
    sparRewards: false,
  },
};

// =========================================================
// STORE DEFINITIONS
// =========================================================

type StoreInfo = {
  name: Product['store'];
  code: Product['storeCode'];
};

const GROCERY_STORES: StoreInfo[] = [
  { name: 'Checkers', code: 'C' },
  { name: 'Pick n Pay', code: 'P' },
  { name: 'Woolworths', code: 'W' },
  { name: 'SPAR', code: 'S' },
  { name: 'Shoprite', code: 'SH' },
  { name: 'Boxer', code: 'B' },
  { name: 'Food Lover\'s Market', code: 'FLM' },
  { name: 'Makro', code: 'M' },
];

const CLOTHING_STORES: StoreInfo[] = [
  { name: 'Woolworths', code: 'W' },
  { name: 'Takealot', code: 'T' },
  { name: 'Mr Price', code: 'MR' },
  { name: 'Jet', code: 'J' },
  { name: 'Ackermans', code: 'A' },
  { name: 'PEP', code: 'PE' },
  { name: 'Cotton On', code: 'CO' },
  { name: 'Superbalist', code: 'SB' },
];

const FOOTWEAR_STORES: StoreInfo[] = [
  { name: 'Woolworths', code: 'W' },
  { name: 'Takealot', code: 'T' },
  { name: 'Mr Price', code: 'MR' },
  { name: 'Jet', code: 'J' },
  { name: 'Ackermans', code: 'A' },
  { name: 'PEP', code: 'PE' },
  { name: 'Cotton On', code: 'CO' },
  { name: 'Superbalist', code: 'SB' },
];

const COSMETICS_STORES: StoreInfo[] = [
  { name: 'Checkers', code: 'C' },
  { name: 'Shoprite', code: 'SH' },
  { name: 'Pick n Pay', code: 'P' },
  { name: 'Woolworths', code: 'W' },
  { name: 'Takealot', code: 'T' },
];

const ELECTRONICS_STORES: StoreInfo[] = [
  { name: 'Takealot', code: 'T' },
  { name: 'Game', code: 'G' },
  { name: 'Makro', code: 'M' },
  { name: 'Superbalist', code: 'SB' },
];

const ESSENTIAL_STORES: StoreInfo[] = [
  { name: 'Checkers', code: 'C' },
  { name: 'Pick n Pay', code: 'P' },
  { name: 'Shoprite', code: 'SH' },
  { name: 'Game', code: 'G' },
  { name: 'Makro', code: 'M' },
  { name: 'Takealot', code: 'T' },
];

// =========================================================
// BRANDS
// =========================================================

const GROCERY_BRANDS = [
  'Clover',
  'Parmalat',
  'Fair Cape',
  'Woolworths',
  'Lancewood',
  'Nola',
  'Dairymaid',
  'Tastic',
  'Fatti’s & Moni’s',
  'Iwisa',
  'Ace',
  'Pioneer',
  'Albany',
  'Blue Ribbon',
  'Kellogg’s',
  'Bokomo',
  'Sunfoil',
  'B-well',
  'Rama',
  'Flora',
  'Huletts',
  'Selati',
  'Robertsons',
  'Pakco',
  'Nando’s',
  'Koo',
  'All Gold',
  'Rhodes',
  'Lucky Star',
  'Sea Harvest',
  'I&J',
  'Saldanha',
  'Eskort',
  'Rainbow',
  'Enterprise',
  'McCain',
  'Dr. Oetker',
  'Nestlé',
  'Nescafé',
  'Jacobs',
  'Five Roses',
  'Ricoffy',
  'Coca-Cola',
  'Pepsi',
  'Ceres',
  'Liqui-Fruit',
];

const CLOTHING_BRANDS = [
  'Mr Price',
  'Jet',
  'Ackermans',
  'PEP',
  'Cotton On',
  'Superbalist',
];

const FOOTWEAR_BRANDS = [
  'Nike',
  'Adidas',
  'Converse',
  'Puma',
  'Mr Price',
  'Jet',
  'Ackermans',
  'PEP',
  'Cotton On',
  'Superbalist',
];

const COSMETICS_BRANDS = [
  'Nivea',
  'Garnier',
  'L’Oréal',
  'Neutrogena',
  'Simple',
  'Pond’s',
  'Eucerin',
  'Maybelline',
  'Revlon',
  'Essence',
  'Catrice',
  'Wet n Wild',
  'NYX',
  'Tresemmé',
  'Dove',
  'Sunsilk',
  'Pantene',
  'Dark & Lovely',
  'Aunt Jackie’s',
  'Cantu',
  'Vaseline',
  'Palmolive',
  'Gillette',
  'Old Spice',
  'Always',
  'Kotex',
  'Carefree',
  'Colgate',
  'Aquafresh',
  'Sensodyne',
  'Oral-B',
  'Listerine',
];

const ELECTRONICS_BRANDS = [
  'Samsung',
  'Xiaomi',
  'Huawei',
  'Nokia',
  'Honor',
  'Motorola',
  'Oppo',
  'Tecno',
  'Hisense',
  'HP',
  'Lenovo',
  'Dell',
  'Acer',
  'ASUS',
  'Apple',
  'JBL',
  'Sony',
  'Anker',
  'Skullcandy',
  'Philips',
  'Logitech',
  'Belkin',
  'Baseus',
  'Canon',
  'Nikon',
  'GoPro',
  'TCL',
  'LG',
  'JVC',
  'Sinotec',
];

const ESSENTIAL_BRANDS = [
  'BIC',
  'Staedtler',
  'Pilot',
  'Faber-Castell',
  'Pentel',
  'Oxford',
  'Maped',
  'OMO',
  'Ariel',
  'Sunlight',
  'Handy Andy',
  'Domestos',
  'Jik',
  'Mr Muscle',
  'Skip',
  'Woolworths',
  'Mr Price',
  'Game',
  'Makro',
  'PEP',
  'Superbalist',
  'Takealot',
  'HP',
  'Lenovo',
];

// =========================================================
// PRODUCT TEMPLATE
// =========================================================

type CatalogueTemplate = {
  category: Product['category'];
  subcategory: string;
  products: string[];
  brands: string[];
  stores: StoreInfo[];
  minPrice: number;
  maxPrice: number;
  units: string[];
  description: string;
};

// =========================================================
// PRODUCT GENERATOR
// =========================================================

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function makeProductImageUrl(
  category: string,
  index: number
): string {
  const imageSets: Record<string, string[]> = {
    Groceries: [
      'photo-1542838132-92c53300491e',
      'photo-1547592180-85f173990554',
      'photo-1540189549336-e6e99c3679fe',
    ],
    Footwear: [
      'photo-1542291026-7eec264c27ff',
      'photo-1549298916-b41d501d3772',
      'photo-1495555961986-6d4c1ecb7be3',
    ],
    Clothing: [
      'photo-1483985988355-763728e1935b',
      'photo-1434389677669-e08b4cac3105',
      'photo-1490481651871-ab68de25d43d',
    ],
    Tech: [
      'photo-1517336714731-489689fd1ca8',
      'photo-1519389950473-47ba0277781c',
      'photo-1496181133206-80ce9b88a853',
    ],
    Electronics: [
      'photo-1498049794561-7780e7231661',
      'photo-1511707171634-5f897ff02aa9',
      'photo-1503602642458-232111445657',
    ],
    Essentials: [
      'photo-1602143407151-7111542de6e8',
      'photo-1608248543803-ba4f8c70ae0b',
      'photo-1608571423902-eed4a5ad8108',
    ],
    Snacks: [
      'photo-1621939514649-280e2aa02771',
      'photo-1566478989037-eec170784d0b',
      'photo-1599490659213-e2b9527bd087',
    ],
    Cosmetics: [
      'photo-1596462502278-27bfdc403348',
      'photo-1601049541289-9b1b7bbbfe19',
      'photo-1611930022073-b7a4ba5fcccd',
    ],
  };
  const images = imageSets[category] || imageSets.Essentials;
  const imageId = images[index % images.length];

  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=600&h=600&q=80`;
}

function makePrice(
  minPrice: number,
  maxPrice: number,
  index: number
): number {
  const range = maxPrice - minPrice;

  const variation = ((index * 37) % 101) / 100;

  const raw = minPrice + range * variation;

  return Math.round(raw * 100) / 100;
}

function generateCatalogueProducts(
  template: CatalogueTemplate,
  count = 100
): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const productName =
      template.products[i % template.products.length];

    const brand =
      template.brands[i % template.brands.length];

    const store =
      template.stores[i % template.stores.length];

    const unit =
      template.units[i % template.units.length];

    const price = makePrice(
      template.minPrice,
      template.maxPrice,
      i
    );

    const hasDiscount = i % 7 === 0;

    const discountPercent = hasDiscount
      ? [5, 10, 15, 20, 25][i % 5]
      : undefined;

    const originalPrice = hasDiscount
      ? Math.round(
          (price / (1 - (discountPercent || 0) / 100)) * 100
        ) / 100
      : undefined;

    const rating =
      Math.round(
        (4.1 + ((i * 13) % 9) / 10) * 10
      ) / 10;

    const inStock = i % 17 !== 0;

    const studentTag =
      i % 5 === 0
        ? 'Student Deal'
        : i % 9 === 0
        ? 'Budget Pick'
        : i % 3 === 0
        ? 'Student Essential'
        : undefined;

    const id =
      `${slugify(template.category)}-` +
      `${slugify(template.subcategory)}-` +
      `${slugify(productName)}-` +
      `${slugify(brand)}-` +
      `${i + 1}`;

    products.push({
      id,

      title: `${brand} ${productName} ${unit}`,

      brand,

      category: template.category,

      subcategory: template.subcategory,

      store: store.name,

      storeCode: store.code,

      priceZar: price,

      ...(originalPrice !== undefined
        ? { originalPriceZar: originalPrice }
        : {}),

      ...(discountPercent !== undefined
        ? { discountPercent }
        : {}),

      inStock,

      rating,

      unit,

      studentTag,

      description:
        `${template.description} ` +
        `Student-friendly ${template.subcategory.toLowerCase()} ` +
        `available from ${store.name}.`,

      // Product image — generated from the actual product name so every
      // generated catalogue item has its own relevant image URL.
      imageUrl: makeProductImageUrl(
        template.category,
        i
      ),

      isGreatValue:
        i % 11 === 0 || i % 13 === 0,

      tracked: false,
    });
  }

  return products;
}

// =========================================================
// GROCERY CATALOGUE
// 100 PRODUCTS IN EACH SUBCATEGORY
// =========================================================

const GROCERY_TEMPLATES: CatalogueTemplate[] = [

  // -------------------------------------------------------
  // DAIRY FOODS
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Dairy Foods',

    products: [
      'Full Cream Milk',
      'Low Fat Milk',
      'Fat Free Milk',
      'Fresh Milk',
      'Long Life Milk',
      'Chocolate Milk',
      'Strawberry Milk',
      'Amasi',
      'Plain Yoghurt',
      'Greek Yoghurt',
      'Fruit Yoghurt',
      'Vanilla Yoghurt',
      'Strawberry Yoghurt',
      'Blueberry Yoghurt',
      'Drinking Yoghurt',
      'Natural Yoghurt',
      'Double Cream Yoghurt',
      'Cottage Cheese',
      'Cream Cheese',
      'Cheddar Cheese',
      'Gouda Cheese',
      'Mozzarella Cheese',
      'Processed Cheese',
      'Cheese Slices',
      'Cheese Spread',
    ],

    brands: [
      'Clover',
      'Parmalat',
      'Fair Cape',
      'Woolworths',
      'Lancewood',
      'Dairymaid',
      'Amasi',
      'Nulaid',
    ],

    stores: GROCERY_STORES,

    minPrice: 12,
    maxPrice: 95,

    units: [
      '250ml',
      '500ml',
      '750ml',
      '1L',
      '1.5L',
      '2L',
      '6 Pack',
    ],

    description:
      'Affordable dairy products suitable for student breakfasts, cooking and everyday meals.',
  },

  // -------------------------------------------------------
  // CARBOHYDRATES
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Carbohydrates',

    products: [
      'Long Grain Rice',
      'Parboiled Rice',
      'Basmati Rice',
      'Brown Rice',
      'Jasmine Rice',
      'White Maize Meal',
      'Super Maize Meal',
      'Samp',
      'Pasta',
      'Spaghetti',
      'Macaroni',
      'Penne Pasta',
      'Fusilli Pasta',
      'Instant Noodles',
      'Egg Noodles',
      'Oats',
      'Instant Oats',
      'Corn Flakes',
      'Bran Flakes',
      'Weet-Bix',
      'Muesli',
      'Granola',
      'Potatoes',
      'Sweet Potatoes',
      'Bread Rolls',
      'Brown Bread',
      'White Bread',
      'Wholewheat Bread',
      'Wraps',
      'Tortillas',
    ],

    brands: [
      'Tastic',
      'Fatti’s & Moni’s',
      'Iwisa',
      'Ace',
      'Pioneer',
      'Albany',
      'Blue Ribbon',
      'Kellogg’s',
      'Bokomo',
      'Jungle',
    ],

    stores: GROCERY_STORES,

    minPrice: 10,
    maxPrice: 140,

    units: [
      '500g',
      '750g',
      '1kg',
      '2kg',
      '2.5kg',
      '5kg',
      '800g',
    ],

    description:
      'Affordable carbohydrate staples for filling student meals and meal preparation.',
  },

  // -------------------------------------------------------
  // FATS & OILS
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Fats and Oils',

    products: [
      'Sunflower Cooking Oil',
      'Canola Oil',
      'Vegetable Oil',
      'Olive Oil',
      'Extra Virgin Olive Oil',
      'Avocado Oil',
      'Coconut Oil',
      'Peanut Oil',
      'Cooking Spray',
      'Butter',
      'Salted Butter',
      'Unsalted Butter',
      'Margarine',
      'Light Margarine',
      'Spreadable Margarine',
      'Ghee',
      'Baking Margarine',
      'Garlic Butter',
      'Herb Butter',
      'Flavoured Oil',
    ],

    brands: [
      'Sunfoil',
      'B-well',
      'Rama',
      'Flora',
      'Canola',
      'Nola',
      'Pakco',
      'Woolworths',
    ],

    stores: GROCERY_STORES,

    minPrice: 18,
    maxPrice: 180,

    units: [
      '250ml',
      '500ml',
      '750ml',
      '1L',
      '1.5L',
      '2L',
      '3L',
      '5L',
    ],

    description:
      'Cooking oils, butter and spreads for affordable student kitchens.',
  },

  // -------------------------------------------------------
  // SWEETS & SNACKS
  // -------------------------------------------------------

  {
    category: 'Snacks',
    subcategory: 'Sweets and Snacks',

    products: [
      'Milk Chocolate',
      'Dark Chocolate',
      'White Chocolate',
      'Chocolate Bar',
      'Caramel Chocolate',
      'Peanut Chocolate',
      'Chocolate Biscuits',
      'Cream Biscuits',
      'Digestive Biscuits',
      'Shortbread Biscuits',
      'Salted Chips',
      'Cheese Chips',
      'Chilli Chips',
      'Potato Chips',
      'Corn Snacks',
      'Popcorn',
      'Sweet Popcorn',
      'Salted Popcorn',
      'Jelly Sweets',
      'Wine Gums',
      'Fruit Chews',
      'Lollipops',
      'Toffee',
      'Caramel Sweets',
      'Peanut Bars',
      'Energy Bars',
      'Granola Bars',
      'Trail Mix',
      'Mixed Nuts',
      'Roasted Peanuts',
    ],

    brands: [
      'Cadbury',
      'Nestlé',
      'Beacon',
      'Maynards',
      'Simba',
      'Lay’s',
      'Bakers',
      'Manhattan',
      'Wilson',
      'Pakco',
    ],

    stores: GROCERY_STORES,

    minPrice: 8,
    maxPrice: 80,

    units: [
      '40g',
      '50g',
      '75g',
      '100g',
      '150g',
      '200g',
      '250g',
      '500g',
    ],

    description:
      'Affordable sweets and snacks for study breaks, movie nights and quick student treats.',
  },

  // -------------------------------------------------------
  // FRUITS
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Fruits',

    products: [
      'Red Apples',
      'Green Apples',
      'Golden Apples',
      'Bananas',
      'Oranges',
      'Naartjies',
      'Pears',
      'Peaches',
      'Nectarines',
      'Plums',
      'Grapes',
      'Red Grapes',
      'Green Grapes',
      'Strawberries',
      'Blueberries',
      'Raspberries',
      'Watermelon',
      'Pineapple',
      'Mango',
      'Papaya',
      'Avocado',
      'Kiwi Fruit',
      'Lemons',
      'Limes',
      'Guava',
      'Granadilla',
      'Cantaloupe',
      'Fruit Salad',
      'Mixed Berries',
      'Dried Fruit',
    ],

    brands: [
      'Fresh Produce',
      'Woolworths',
      'Checkers Fresh',
      'PnP Fresh',
      'SPAR Fresh',
    ],

    stores: GROCERY_STORES,

    minPrice: 10,
    maxPrice: 120,

    units: [
      '250g',
      '500g',
      '750g',
      '1kg',
      '2kg',
      'Each',
      'Punnet',
    ],

    description:
      'Fresh fruit options for affordable student breakfasts, snacks and healthy meals.',
  },

  // -------------------------------------------------------
  // VEGETABLES
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Vegetables',

    products: [
      'Potatoes',
      'Sweet Potatoes',
      'Carrots',
      'Brown Onions',
      'Red Onions',
      'Tomatoes',
      'Baby Tomatoes',
      'Spinach',
      'Cabbage',
      'Broccoli',
      'Cauliflower',
      'Green Beans',
      'Green Peas',
      'Sweetcorn',
      'Baby Marrow',
      'Butternut',
      'Pumpkin',
      'Mushrooms',
      'Green Peppers',
      'Red Peppers',
      'Yellow Peppers',
      'Lettuce',
      'Cucumber',
      'Celery',
      'Beetroot',
      'Mixed Vegetables',
      'Baby Spinach',
      'Spring Onions',
      'Garlic',
      'Ginger',
    ],

    brands: [
      'Fresh Produce',
      'Woolworths',
      'Checkers Fresh',
      'PnP Fresh',
      'SPAR Fresh',
    ],

    stores: GROCERY_STORES,

    minPrice: 8,
    maxPrice: 100,

    units: [
      '250g',
      '500g',
      '750g',
      '1kg',
      '2kg',
      'Each',
      'Pack',
    ],

    description:
      'Fresh vegetables for affordable student meal preparation and healthy cooking.',
  },

  // -------------------------------------------------------
  // MEAT
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Meat',

    products: [
      'Chicken Breasts',
      'Chicken Thighs',
      'Chicken Drumsticks',
      'Whole Chicken',
      'Chicken Wings',
      'Chicken Fillets',
      'Chicken Livers',
      'Chicken Strips',
      'Beef Mince',
      'Beef Steak',
      'Rump Steak',
      'Sirloin Steak',
      'Beef Sausages',
      'Boerewors',
      'Burger Patties',
      'Beef Cubes',
      'Pork Chops',
      'Pork Sausages',
      'Pork Ribs',
      'Lamb Chops',
      'Lamb Stew',
      'Chicken Nuggets',
      'Chicken Burgers',
      'Viennas',
      'Polony',
      'Ham',
      'Bacon',
      'Meatballs',
      'Sausage Rolls',
      'Mixed Meat Pack',
    ],

    brands: [
      'Eskort',
      'Rainbow',
      'Farmer’s Choice',
      'Country Choice',
      'Enterprise',
      'Woolworths',
      'Checkers',
      'PnP',
    ],

    stores: GROCERY_STORES,

    minPrice: 25,
    maxPrice: 300,

    units: [
      '250g',
      '500g',
      '750g',
      '1kg',
      '1.5kg',
      '2kg',
      'Pack',
    ],

    description:
      'Meat and protein options suitable for affordable student meal preparation.',
  },

  // -------------------------------------------------------
  // FISH & SEAFOOD
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Fish and Seafood',

    products: [
      'Hake Fillets',
      'Hake Portions',
      'Fish Fingers',
      'Pilchards',
      'Tuna',
      'Tuna Chunks',
      'Tuna Flakes',
      'Sardines',
      'Salmon',
      'Smoked Salmon',
      'Haddock',
      'Calamari',
      'Prawns',
      'Mackerel',
      'Frozen Fish',
      'Smoked Fish',
      'Seafood Mix',
      'Anchovies',
      'Fish Cakes',
      'Breaded Fish',
    ],

    brands: [
      'Lucky Star',
      'Sea Harvest',
      'I&J',
      'Saldanha',
      'John West',
      'Woolworths',
      'Checkers',
    ],

    stores: GROCERY_STORES,

    minPrice: 15,
    maxPrice: 250,

    units: [
      '85g',
      '170g',
      '200g',
      '400g',
      '500g',
      '750g',
      '1kg',
    ],

    description:
      'Affordable fish and seafood options for student lunches and dinners.',
  },

  // -------------------------------------------------------
  // BAKERY
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Bakery',

    products: [
      'White Bread',
      'Brown Bread',
      'Wholewheat Bread',
      'Seeded Bread',
      'Multigrain Bread',
      'Bread Rolls',
      'Hamburger Rolls',
      'Hot Dog Rolls',
      'French Loaf',
      'Ciabatta',
      'Garlic Bread',
      'Croissants',
      'Chocolate Croissants',
      'Muffins',
      'Blueberry Muffins',
      'Chocolate Muffins',
      'Pancakes',
      'Crumpets',
      'Pita Bread',
      'Naan Bread',
      'Wraps',
      'Tortillas',
      'Flatbread',
      'Bagels',
      'Dinner Rolls',
    ],

    brands: [
      'Albany',
      'Blue Ribbon',
      'Sasko',
      'Pioneer',
      'Woolworths',
      'PnP',
      'Checkers',
      'SPAR',
    ],

    stores: GROCERY_STORES,

    minPrice: 12,
    maxPrice: 100,

    units: [
      '4 Pack',
      '6 Pack',
      '8 Pack',
      '500g',
      '700g',
      '800g',
      '1kg',
    ],

    description:
      'Bread and bakery products for quick breakfasts, lunches and student meals.',
  },

  // -------------------------------------------------------
  // BEVERAGES
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Beverages',

    products: [
      'Still Water',
      'Sparkling Water',
      'Mineral Water',
      'Orange Juice',
      'Apple Juice',
      'Mango Juice',
      'Fruit Juice',
      'Iced Tea',
      'Cola',
      'Diet Cola',
      'Lemonade',
      'Ginger Ale',
      'Energy Drink',
      'Sports Drink',
      'Instant Coffee',
      'Ground Coffee',
      'Black Tea',
      'Green Tea',
      'Rooibos Tea',
      'Hot Chocolate',
      'Milkshake',
      'Chocolate Drink',
      'Fruit Squash',
      'Flavoured Water',
      'Energy Water',
    ],

    brands: [
      'Coca-Cola',
      'Pepsi',
      'Liqui-Fruit',
      'Ceres',
      'Oros',
      'Nescafé',
      'Jacobs',
      'Five Roses',
      'Ricoffy',
      'Red Bull',
    ],

    stores: GROCERY_STORES,

    minPrice: 7,
    maxPrice: 120,

    units: [
      '330ml',
      '500ml',
      '750ml',
      '1L',
      '1.5L',
      '2L',
      '6 Pack',
    ],

    description:
      'Drinks and beverages suitable for studying, meals and student social activities.',
  },

  // -------------------------------------------------------
  // BREAKFAST FOODS
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Breakfast Foods',

    products: [
      'Corn Flakes',
      'Rice Krispies',
      'Bran Flakes',
      'Weet-Bix',
      'Muesli',
      'Granola',
      'Instant Oats',
      'Rolled Oats',
      'Chocolate Cereal',
      'Honey Cereal',
      'Fruit Cereal',
      'Porridge',
      'Maize Porridge',
      'Breakfast Bars',
      'Fruit Bars',
      'Protein Bars',
      'Cereal Bars',
      'Bran Cereal',
      'Crunchy Cereal',
      'Multigrain Cereal',
    ],

    brands: [
      'Kellogg’s',
      'Bokomo',
      'Bakers',
      'Jungle',
      'Nestlé',
      'Nutrific',
      'Weet-Bix',
    ],

    stores: GROCERY_STORES,

    minPrice: 18,
    maxPrice: 110,

    units: [
      '250g',
      '375g',
      '450g',
      '500g',
      '750g',
      '1kg',
    ],

    description:
      'Affordable breakfast foods for busy students and early campus mornings.',
  },

  // -------------------------------------------------------
  // FROZEN FOODS
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Frozen Foods',

    products: [
      'Mixed Vegetables',
      'Frozen Peas',
      'Frozen Sweetcorn',
      'Frozen Spinach',
      'Frozen Chips',
      'Potato Wedges',
      'Chicken Nuggets',
      'Chicken Strips',
      'Fish Fingers',
      'Frozen Pizza',
      'Burger Patties',
      'Meatballs',
      'Frozen Berries',
      'Frozen Fruit Mix',
      'Dumplings',
      'Frozen Chicken',
      'Frozen Hake',
      'Frozen Vegetables',
      'Frozen Chips Family Pack',
      'Frozen Meal',
    ],

    brands: [
      'McCain',
      'I&J',
      'Sea Harvest',
      'Rainbow',
      'Dr. Oetker',
      'Woolworths',
      'Checkers',
    ],

    stores: GROCERY_STORES,

    minPrice: 25,
    maxPrice: 180,

    units: [
      '400g',
      '500g',
      '750g',
      '1kg',
      '1.5kg',
      '2kg',
    ],

    description:
      'Frozen foods for convenient student meals and easy residence cooking.',
  },

  // -------------------------------------------------------
  // CANNED FOODS
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Canned Foods',

    products: [
      'Baked Beans',
      'Chakalaka',
      'Canned Tomatoes',
      'Tomato and Onion',
      'Sweetcorn',
      'Canned Peas',
      'Mixed Vegetables',
      'Butter Beans',
      'Kidney Beans',
      'Chickpeas',
      'Lentils',
      'Tuna',
      'Pilchards',
      'Sardines',
      'Canned Peaches',
      'Canned Pears',
      'Canned Pineapple',
      'Fruit Cocktail',
      'Canned Soup',
      'Canned Beans',
    ],

    brands: [
      'Koo',
      'All Gold',
      'Lucky Star',
      'Pakco',
      'Woolworths',
      'Checkers',
      'Rhodes',
    ],

    stores: GROCERY_STORES,

    minPrice: 10,
    maxPrice: 75,

    units: [
      '200g',
      '400g',
      '410g',
      '420g',
      '800g',
      '1kg',
    ],

    description:
      'Long-life canned foods that are useful for affordable student pantry meals.',
  },

  // -------------------------------------------------------
  // SPICES & SAUCES
  // -------------------------------------------------------

  {
    category: 'Groceries',
    subcategory: 'Spices and Sauces',

    products: [
      'Tomato Sauce',
      'Mayonnaise',
      'Mustard',
      'Chilli Sauce',
      'BBQ Sauce',
      'Peri-Peri Sauce',
      'Sweet Chilli Sauce',
      'Soy Sauce',
      'Pasta Sauce',
      'Tomato Paste',
      'Curry Powder',
      'Paprika',
      'Black Pepper',
      'White Pepper',
      'Mixed Herbs',
      'Italian Herbs',
      'Garlic Spice',
      'Chicken Spice',
      'BBQ Spice',
      'Steak Spice',
      'Salt',
      'Cinnamon',
      'Turmeric',
      'Ground Ginger',
      'Mixed Spice',
    ],

    brands: [
      'All Gold',
      'Rajah',
      'Robertsons',
      'Pakco',
      'Nando’s',
      'Hellmann’s',
      'Koo',
      'Woolworths',
    ],

    stores: GROCERY_STORES,

    minPrice: 8,
    maxPrice: 70,

    units: [
      '50g',
      '100g',
      '200ml',
      '250ml',
      '375ml',
      '500ml',
      '750ml',
    ],

    description:
      'Spices, sauces and cooking ingredients for affordable student meals.',
  },
];

// =========================================================
// CLOTHING CATALOGUE
// 100 PRODUCTS PER SUBCATEGORY
// =========================================================

const CLOTHING_TEMPLATES: CatalogueTemplate[] = [

  {
    category: 'Clothing',
    subcategory: 'T-Shirts',

    products: [
      'Basic Cotton T-Shirt',
      'Oversized T-Shirt',
      'Slim Fit T-Shirt',
      'Graphic T-Shirt',
      'Crew Neck T-Shirt',
      'V-Neck T-Shirt',
      'Long Sleeve T-Shirt',
      'Sports T-Shirt',
      'Campus T-Shirt',
      'Student T-Shirt',
      'Premium Cotton T-Shirt',
      'Relaxed Fit T-Shirt',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 70,
    maxPrice: 350,

    units: [
      'XS',
      'S',
      'M',
      'L',
      'XL',
      'XXL',
    ],

    description:
      'Affordable student T-shirts for everyday campus wear.',
  },

  {
    category: 'Clothing',
    subcategory: 'Shirts',

    products: [
      'Oxford Shirt',
      'Formal Shirt',
      'Casual Shirt',
      'Denim Shirt',
      'Flannel Shirt',
      'Linen Shirt',
      'Short Sleeve Shirt',
      'Long Sleeve Shirt',
      'Checked Shirt',
      'Striped Shirt',
      'Button-Up Shirt',
      'Campus Shirt',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 120,
    maxPrice: 500,

    units: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    description:
      'Casual and smart shirts suitable for classes, presentations and campus events.',
  },

  {
    category: 'Clothing',
    subcategory: 'Jeans',

    products: [
      'Slim Fit Jeans',
      'Straight Leg Jeans',
      'Skinny Jeans',
      'Mom Jeans',
      'Relaxed Jeans',
      'Wide Leg Jeans',
      'Bootcut Jeans',
      'High Rise Jeans',
      'Low Rise Jeans',
      'Distressed Jeans',
      'Dark Wash Jeans',
      'Light Wash Jeans',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 220,
    maxPrice: 850,

    units: [
      '28',
      '30',
      '32',
      '34',
      '36',
      '38',
      '40',
    ],

    description:
      'Affordable jeans for everyday student outfits.',
  },

  {
    category: 'Clothing',
    subcategory: 'Trousers',

    products: [
      'Chino Trousers',
      'Formal Trousers',
      'Cargo Trousers',
      'Track Pants',
      'Jogger Pants',
      'Wide Leg Trousers',
      'Slim Trousers',
      'Straight Trousers',
      'Work Trousers',
      'Casual Trousers',
      'Cotton Trousers',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 180,
    maxPrice: 650,

    units: ['28', '30', '32', '34', '36', '38', '40'],

    description:
      'Comfortable and affordable trousers for campus and everyday use.',
  },

  {
    category: 'Clothing',
    subcategory: 'Dresses',

    products: [
      'Casual Day Dress',
      'Summer Dress',
      'Maxi Dress',
      'Mini Dress',
      'Midi Dress',
      'Bodycon Dress',
      'Shirt Dress',
      'Wrap Dress',
      'Floral Dress',
      'Denim Dress',
      'Knit Dress',
      'Party Dress',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 180,
    maxPrice: 700,

    units: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    description:
      'Affordable dresses for campus, weekends and student social events.',
  },

  {
    category: 'Clothing',
    subcategory: 'Skirts',

    products: [
      'Denim Skirt',
      'Mini Skirt',
      'Midi Skirt',
      'Maxi Skirt',
      'Pleated Skirt',
      'Pencil Skirt',
      'A-Line Skirt',
      'Wrap Skirt',
      'Cargo Skirt',
      'Sports Skirt',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 120,
    maxPrice: 500,

    units: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    description:
      'Affordable skirts for everyday campus outfits.',
  },

  {
    category: 'Clothing',
    subcategory: 'Jackets',

    products: [
      'Denim Jacket',
      'Bomber Jacket',
      'Windbreaker',
      'Puffer Jacket',
      'Rain Jacket',
      'Varsity Jacket',
      'Leather Look Jacket',
      'Utility Jacket',
      'Fleece Jacket',
      'Lightweight Jacket',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 250,
    maxPrice: 1000,

    units: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    description:
      'Affordable jackets for cold and rainy campus days.',
  },

  {
    category: 'Clothing',
    subcategory: 'Hoodies',

    products: [
      'Basic Hoodie',
      'Campus Hoodie',
      'Graphic Hoodie',
      'Oversized Hoodie',
      'Zip-Up Hoodie',
      'Pullover Hoodie',
      'Fleece Hoodie',
      'Sports Hoodie',
      'Student Hoodie',
      'Premium Hoodie',
    ],

    brands: CLOTHING_BRANDS,
    stores: CLOTHING_STORES,

    minPrice: 180,
    maxPrice: 750,

    units: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    description:
      'Comfortable hoodies for studying, residence and everyday campus wear.',
  },

  {
    category: 'Clothing',
    subcategory: 'Sportswear',

    products: [
      'Running Shorts',
      'Gym Shorts',
      'Training Shorts',
      'Sports Leggings',
      'Training Pants',
      'Sports Bra',
      'Training T-Shirt',
      'Running T-Shirt',
      'Track Jacket',
      'Training Hoodie',
      'Football Shorts',
      'Basketball Shorts',
    ],

    brands: [
      'Mr Price',
      'Cotton On',
      'Superbalist',
      'PEP',
      'Ackermans',
    ],

    stores: CLOTHING_STORES,

    minPrice: 100,
    maxPrice: 800,

    units: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    description:
      'Affordable sportswear for gym, running and student activities.',
  },

  {
    category: 'Clothing',
    subcategory: 'Underwear',

    products: [
      'Cotton Underwear',
      'Boxer Shorts',
      'Briefs',
      'Sports Underwear',
      'Everyday Bra',
      'Sports Bra',
      'Comfort Bra',
      'Ankle Socks',
      'Crew Socks',
      'Thermal Socks',
    ],

    brands: CLOTHING_BRANDS,

    stores: CLOTHING_STORES,

    minPrice: 30,
    maxPrice: 300,

    units: [
      'S',
      'M',
      'L',
      'XL',
      '2 Pack',
      '3 Pack',
      '5 Pack',
    ],

    description:
      'Affordable everyday clothing basics and underwear for students.',
  },

  {
    category: 'Clothing',
    subcategory: 'Accessories',

    products: [
      'Baseball Cap',
      'Beanie',
      'Bucket Hat',
      'Scarf',
      'Leather Look Belt',
      'Canvas Belt',
      'Sunglasses',
      'Crossbody Bag',
      'Backpack',
      'Wallet',
      'Card Holder',
      'Tote Bag',
    ],

    brands: CLOTHING_BRANDS,

    stores: CLOTHING_STORES,

    minPrice: 40,
    maxPrice: 450,

    units: ['One Size', 'Small', 'Medium', 'Large'],

    description:
      'Affordable fashion accessories for everyday student use.',
  },
];

// =========================================================
// FOOTWEAR CATALOGUE
// =========================================================

const FOOTWEAR_TEMPLATES: CatalogueTemplate[] = [

  {
    category: 'Footwear',
    subcategory: 'Sneakers',

    products: [
      'Everyday Sneakers',
      'Campus Sneakers',
      'Running Sneakers',
      'Walking Sneakers',
      'Canvas Sneakers',
      'High Top Sneakers',
      'Low Top Sneakers',
      'Chunky Sneakers',
      'Classic Sneakers',
      'Sports Sneakers',
      'Training Sneakers',
      'Casual Sneakers',
    ],

    brands: FOOTWEAR_BRANDS,
    stores: FOOTWEAR_STORES,

    minPrice: 180,
    maxPrice: 1500,

    units: [
      'Size 3',
      'Size 4',
      'Size 5',
      'Size 6',
      'Size 7',
      'Size 8',
      'Size 9',
      'Size 10',
      'Size 11',
    ],

    description:
      'Affordable sneakers suitable for walking between lectures and everyday campus life.',
  },

  {
    category: 'Footwear',
    subcategory: 'Sandals',

    products: [
      'Casual Sandals',
      'Flat Sandals',
      'Strappy Sandals',
      'Sports Sandals',
      'Leather Look Sandals',
      'Beach Sandals',
      'Slide Sandals',
      'Comfort Sandals',
      'Platform Sandals',
      'Summer Sandals',
    ],

    brands: FOOTWEAR_BRANDS,
    stores: FOOTWEAR_STORES,

    minPrice: 100,
    maxPrice: 600,

    units: [
      'Size 3',
      'Size 4',
      'Size 5',
      'Size 6',
      'Size 7',
      'Size 8',
      'Size 9',
      'Size 10',
    ],

    description:
      'Affordable sandals for summer, residence and casual campus use.',
  },

  {
    category: 'Footwear',
    subcategory: 'Boots',

    products: [
      'Chelsea Boots',
      'Ankle Boots',
      'Combat Boots',
      'Hiking Boots',
      'Winter Boots',
      'Casual Boots',
      'Work Boots',
      'Lace-Up Boots',
      'Fashion Boots',
      'Rain Boots',
    ],

    brands: FOOTWEAR_BRANDS,
    stores: FOOTWEAR_STORES,

    minPrice: 250,
    maxPrice: 1200,

    units: [
      'Size 3',
      'Size 4',
      'Size 5',
      'Size 6',
      'Size 7',
      'Size 8',
      'Size 9',
      'Size 10',
    ],

    description:
      'Affordable boots for winter and everyday student outfits.',
  },

  {
    category: 'Footwear',
    subcategory: 'Formal Shoes',

    products: [
      'Oxford Shoes',
      'Loafers',
      'Formal Lace-Up Shoes',
      'Slip-On Shoes',
      'Court Shoes',
      'Block Heel Shoes',
      'Flat Formal Shoes',
      'Office Shoes',
      'School Shoes',
      'Smart Casual Shoes',
    ],

    brands: FOOTWEAR_BRANDS,
    stores: FOOTWEAR_STORES,

    minPrice: 200,
    maxPrice: 1000,

    units: [
      'Size 3',
      'Size 4',
      'Size 5',
      'Size 6',
      'Size 7',
      'Size 8',
      'Size 9',
      'Size 10',
    ],

    description:
      'Affordable formal and smart shoes for presentations and student events.',
  },

  {
    category: 'Footwear',
    subcategory: 'Slippers',

    products: [
      'Comfort Slippers',
      'Fleece Slippers',
      'Bedroom Slippers',
      'Open Toe Slippers',
      'Memory Foam Slippers',
      'Plush Slippers',
      'Indoor Slippers',
      'Student Slippers',
      'Residence Slippers',
      'House Slippers',
    ],

    brands: FOOTWEAR_BRANDS,
    stores: FOOTWEAR_STORES,

    minPrice: 80,
    maxPrice: 350,

    units: [
      'Size 3',
      'Size 4',
      'Size 5',
      'Size 6',
      'Size 7',
      'Size 8',
      'Size 9',
      'Size 10',
    ],

    description:
      'Affordable slippers for residence and home use.',
  },
];

// =========================================================
// COSMETICS CATALOGUE
// =========================================================

const COSMETICS_TEMPLATES: CatalogueTemplate[] = [

  {
    category: 'Cosmetics',
    subcategory: 'Face Care',

    products: [
      'Moisturising Cream',
      'Face Wash',
      'Facial Cleanser',
      'Face Scrub',
      'Face Mask',
      'Facial Toner',
      'Face Serum',
      'Day Cream',
      'Night Cream',
      'Eye Cream',
      'Face Sunscreen',
      'Micellar Water',
      'Cleansing Gel',
      'Daily Moisturiser',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 35,
    maxPrice: 350,

    units: [
      '30ml',
      '50ml',
      '75ml',
      '100ml',
      '150ml',
      '200ml',
      '250ml',
    ],

    description:
      'Affordable face-care products for student skincare routines.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Makeup',

    products: [
      'Foundation',
      'Concealer',
      'Face Powder',
      'Mascara',
      'Eyeliner',
      'Eyeshadow',
      'Blush',
      'Bronzer',
      'Highlighter',
      'Lipstick',
      'Lip Gloss',
      'Lip Liner',
      'Lip Balm',
      'Primer',
      'Setting Spray',
      'Makeup Remover',
      'BB Cream',
      'CC Cream',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 30,
    maxPrice: 450,

    units: [
      '5ml',
      '10ml',
      '15ml',
      '20ml',
      '30ml',
      '50ml',
    ],

    description:
      'Affordable makeup products suitable for student budgets.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Hair Care',

    products: [
      'Shampoo',
      'Conditioner',
      '2-in-1 Shampoo',
      'Hair Mask',
      'Hair Oil',
      'Hair Serum',
      'Leave-In Conditioner',
      'Hair Gel',
      'Hair Mousse',
      'Hair Spray',
      'Curl Cream',
      'Edge Control',
      'Hair Food',
      'Anti-Dandruff Shampoo',
      'Dry Shampoo',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 35,
    maxPrice: 280,

    units: [
      '100ml',
      '200ml',
      '250ml',
      '400ml',
      '500ml',
      '750ml',
    ],

    description:
      'Affordable hair-care products for everyday student grooming.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Body Care',

    products: [
      'Body Lotion',
      'Body Cream',
      'Body Butter',
      'Body Scrub',
      'Body Oil',
      'Hand Cream',
      'Foot Cream',
      'Deodorant',
      'Roll-On',
      'Body Spray',
      'Antiperspirant',
      'Moisturising Lotion',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 25,
    maxPrice: 250,

    units: [
      '50ml',
      '100ml',
      '150ml',
      '200ml',
      '250ml',
      '400ml',
      '500ml',
    ],

    description:
      'Affordable body-care products for everyday student routines.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Fragrances',

    products: [
      'Eau de Toilette',
      'Eau de Parfum',
      'Body Mist',
      'Perfume Spray',
      'Cologne',
      'Fragrance Gift Set',
      'Body Fragrance',
      'Fragrance Roll-On',
      'Mini Perfume',
      'Student Fragrance',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 70,
    maxPrice: 900,

    units: [
      '30ml',
      '50ml',
      '75ml',
      '100ml',
      '150ml',
      'Gift Set',
    ],

    description:
      'Affordable fragrances suitable for students and everyday wear.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Oral Care',

    products: [
      'Toothpaste',
      'Whitening Toothpaste',
      'Sensitive Toothpaste',
      'Toothbrush',
      'Electric Toothbrush',
      'Mouthwash',
      'Dental Floss',
      'Interdental Brush',
      'Travel Toothbrush',
      'Toothbrush Twin Pack',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 15,
    maxPrice: 350,

    units: [
      '50ml',
      '75ml',
      '100ml',
      '200ml',
      '500ml',
      'Twin Pack',
    ],

    description:
      'Affordable oral-care products for student bathrooms and residences.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Bath and Shower',

    products: [
      'Bath Soap',
      'Shower Gel',
      'Body Wash',
      'Bubble Bath',
      'Bath Salts',
      'Shower Cream',
      'Hand Wash',
      'Liquid Soap',
      'Bath Sponge',
      'Loofah',
      'Body Scrub',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 15,
    maxPrice: 180,

    units: [
      '50ml',
      '100ml',
      '200ml',
      '250ml',
      '400ml',
      '500ml',
    ],

    description:
      'Affordable bath and shower products for student residences.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Men’s Grooming',

    products: [
      'Shaving Foam',
      'Shaving Gel',
      'Disposable Razors',
      'Razor Blades',
      'Aftershave',
      'Beard Oil',
      'Beard Balm',
      'Beard Wash',
      'Hair Gel',
      'Men’s Face Wash',
      'Men’s Moisturiser',
      'Men’s Deodorant',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 25,
    maxPrice: 500,

    units: [
      '50ml',
      '100ml',
      '150ml',
      '200ml',
      '250ml',
      'Pack',
    ],

    description:
      'Affordable grooming products for students.',
  },

  {
    category: 'Cosmetics',
    subcategory: 'Feminine Care',

    products: [
      'Sanitary Pads',
      'Ultra Thin Pads',
      'Night Pads',
      'Pantyliners',
      'Tampons',
      'Menstrual Cup',
      'Feminine Wash',
      'Period Panties',
      'Feminine Wipes',
      'Heat Patch',
    ],

    brands: COSMETICS_BRANDS,
    stores: COSMETICS_STORES,

    minPrice: 25,
    maxPrice: 250,

    units: [
      '10 Pack',
      '12 Pack',
      '14 Pack',
      '16 Pack',
      '20 Pack',
      '24 Pack',
    ],

    description:
      'Affordable feminine-care products for student budgets.',
  },
];

// =========================================================
// ELECTRONICS / TECH CATALOGUE
// =========================================================

const ELECTRONICS_TEMPLATES: CatalogueTemplate[] = [

  {
    category: 'Electronics',
    subcategory: 'Phones',

    products: [
      'Android Smartphone',
      'Budget Smartphone',
      'Student Smartphone',
      '5G Smartphone',
      'Dual SIM Smartphone',
      'Entry Level Smartphone',
      'Mid Range Smartphone',
      'Compact Smartphone',
      'Large Screen Smartphone',
      'Camera Smartphone',
    ],

    brands: ELECTRONICS_BRANDS,
    stores: ELECTRONICS_STORES,

    minPrice: 1200,
    maxPrice: 12000,

    units: [
      '32GB',
      '64GB',
      '128GB',
      '256GB',
      '512GB',
    ],

    description:
      'Smartphones suitable for communication, studying and student life.',
  },

  {
    category: 'Electronics',
    subcategory: 'Laptops',

    products: [
      'Student Laptop',
      'Budget Laptop',
      'Core Laptop',
      'Business Laptop',
      'Study Laptop',
      'Ultrabook',
      'Gaming Laptop',
      'Chromebook',
      'Convertible Laptop',
      'Laptop Computer',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 5000,
    maxPrice: 30000,

    units: [
      '4GB RAM',
      '8GB RAM',
      '16GB RAM',
      '256GB SSD',
      '512GB SSD',
    ],

    description:
      'Laptops for university assignments, research, coding and studying.',
  },

  {
    category: 'Electronics',
    subcategory: 'Tablets',

    products: [
      'Student Tablet',
      'Android Tablet',
      'Study Tablet',
      'Budget Tablet',
      'Kids Tablet',
      'Drawing Tablet',
      'Large Tablet',
      'Compact Tablet',
      'Wi-Fi Tablet',
      'Tablet Computer',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 1500,
    maxPrice: 18000,

    units: [
      '32GB',
      '64GB',
      '128GB',
      '256GB',
      'Wi-Fi',
    ],

    description:
      'Affordable tablets for notes, reading, studying and entertainment.',
  },

  {
    category: 'Electronics',
    subcategory: 'Headphones',

    products: [
      'Wireless Headphones',
      'Bluetooth Headphones',
      'Noise Cancelling Headphones',
      'Over Ear Headphones',
      'On Ear Headphones',
      'Gaming Headphones',
      'Student Headphones',
      'Wired Headphones',
      'Studio Headphones',
      'Foldable Headphones',
      'Sports Headphones',
      'USB Headphones',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 150,
    maxPrice: 4500,

    units: [
      'Wired',
      'Bluetooth',
      'USB',
      'Wireless',
    ],

    description:
      'Headphones for studying, lectures, music and gaming.',
  },

  {
    category: 'Electronics',
    subcategory: 'Speakers',

    products: [
      'Bluetooth Speaker',
      'Portable Speaker',
      'Mini Speaker',
      'Party Speaker',
      'Waterproof Speaker',
      'Wireless Speaker',
      'Desktop Speaker',
      'Computer Speaker',
      'Outdoor Speaker',
      'Smart Speaker',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 250,
    maxPrice: 6000,

    units: [
      'Mini',
      'Small',
      'Medium',
      'Large',
      'Portable',
    ],

    description:
      'Portable and home speakers for student entertainment.',
  },

  {
    category: 'Electronics',
    subcategory: 'Chargers',

    products: [
      'USB-C Charger',
      'Fast Charger',
      'Phone Charger',
      'Laptop Charger',
      'Wireless Charger',
      'Dual USB Charger',
      'Travel Charger',
      'Wall Charger',
      'Car Charger',
      'Multi-Port Charger',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 100,
    maxPrice: 1500,

    units: [
      '18W',
      '20W',
      '25W',
      '30W',
      '45W',
      '65W',
      '100W',
    ],

    description:
      'Chargers and power accessories for student devices.',
  },

  {
    category: 'Electronics',
    subcategory: 'Power Banks',

    products: [
      'Portable Power Bank',
      'Fast Charging Power Bank',
      'Slim Power Bank',
      'Compact Power Bank',
      'Student Power Bank',
      'Wireless Power Bank',
      'High Capacity Power Bank',
      'USB-C Power Bank',
      'Travel Power Bank',
      'Mini Power Bank',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 250,
    maxPrice: 2500,

    units: [
      '5000mAh',
      '10000mAh',
      '15000mAh',
      '20000mAh',
      '30000mAh',
    ],

    description:
      'Portable power banks for long university days.',
  },

  {
    category: 'Tech',
    subcategory: 'Computer Accessories',

    products: [
      'Wireless Mouse',
      'Wired Mouse',
      'Gaming Mouse',
      'Wireless Keyboard',
      'Wired Keyboard',
      'Keyboard and Mouse Set',
      'Laptop Stand',
      'USB Hub',
      'Webcam',
      'Cooling Pad',
      'Mouse Pad',
      'USB Adapter',
      'HDMI Cable',
      'Ethernet Cable',
      'USB Cable',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 80,
    maxPrice: 2500,

    units: [
      'USB',
      'Wireless',
      'Bluetooth',
      'Standard',
      'Pro',
    ],

    description:
      'Computer accessories for studying, assignments, coding and gaming.',
  },

  {
    category: 'Electronics',
    subcategory: 'Gaming',

    products: [
      'Gaming Mouse',
      'Gaming Keyboard',
      'Gaming Headset',
      'Gaming Controller',
      'Gamepad',
      'Gaming Chair',
      'Gaming Mouse Pad',
      'Gaming Webcam',
      'Gaming Speakers',
      'Console Controller',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 200,
    maxPrice: 7000,

    units: [
      'Standard',
      'Wireless',
      'RGB',
      'USB',
      'Bluetooth',
    ],

    description:
      'Gaming accessories and equipment for student gamers.',
  },

  {
    category: 'Electronics',
    subcategory: 'Cameras',

    products: [
      'Digital Camera',
      'Compact Camera',
      'Action Camera',
      'Webcam',
      'Student Camera',
      'Vlogging Camera',
      'Instant Camera',
      'Security Camera',
      'Travel Camera',
      'Content Camera',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 500,
    maxPrice: 15000,

    units: [
      '12MP',
      '16MP',
      '20MP',
      '24MP',
      '4K',
      'Full HD',
    ],

    description:
      'Cameras for student projects, content creation and everyday use.',
  },

  {
    category: 'Electronics',
    subcategory: 'TVs',

    products: [
      'Smart TV',
      'LED TV',
      'Android TV',
      'Google TV',
      'Full HD TV',
      '4K TV',
      'Compact TV',
      'Bedroom TV',
      'Student TV',
      'Streaming TV',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 2500,
    maxPrice: 20000,

    units: [
      '32 Inch',
      '40 Inch',
      '43 Inch',
      '50 Inch',
      '55 Inch',
      '65 Inch',
    ],

    description:
      'Affordable TVs for student accommodation and entertainment.',
  },

  {
    category: 'Electronics',
    subcategory: 'Smart Devices',

    products: [
      'Smart Watch',
      'Fitness Tracker',
      'Smart Band',
      'Smart Bulb',
      'Smart Plug',
      'Smart Doorbell',
      'Smart Camera',
      'Streaming Stick',
      'Streaming Box',
      'Smart Speaker',
    ],

    brands: ELECTRONICS_BRANDS,

    stores: ELECTRONICS_STORES,

    minPrice: 250,
    maxPrice: 8000,

    units: [
      'Standard',
      'Bluetooth',
      'Wi-Fi',
      '4G',
      '5G',
    ],

    description:
      'Smart devices and connected technology for student lifestyles.',
  },
];

// =========================================================
// STUDENT ESSENTIALS
// =========================================================

const ESSENTIAL_TEMPLATES: CatalogueTemplate[] = [

  {
    category: 'Essentials',
    subcategory: 'Stationery',

    products: [
      'Notebook',
      'Exercise Book',
      'Ballpoint Pen',
      'Gel Pen',
      'Highlighter',
      'Marker',
      'Pencil',
      'Eraser',
      'Ruler',
      'Scissors',
      'Glue Stick',
      'Correction Pen',
      'Sticky Notes',
      'Index Cards',
      'Folder',
      'Binder',
      'Calculator',
    ],

    brands: ESSENTIAL_BRANDS,

    stores: ESSENTIAL_STORES,

    minPrice: 5,
    maxPrice: 350,

    units: [
      'Single',
      '2 Pack',
      '5 Pack',
      '10 Pack',
      '20 Pack',
      'A4',
      'A5',
    ],

    description:
      'Affordable stationery for university classes and assignments.',
  },

  {
    category: 'Essentials',
    subcategory: 'Cleaning',

    products: [
      'Washing Powder',
      'Liquid Detergent',
      'Dishwashing Liquid',
      'Dishwasher Tablets',
      'Multi-Purpose Cleaner',
      'Bathroom Cleaner',
      'Toilet Cleaner',
      'Floor Cleaner',
      'Glass Cleaner',
      'Bleach',
      'Disinfectant',
      'Fabric Softener',
      'Cleaning Sponge',
      'Cleaning Cloth',
      'Garbage Bags',
      'Paper Towels',
    ],

    brands: ESSENTIAL_BRANDS,

    stores: ESSENTIAL_STORES,

    minPrice: 10,
    maxPrice: 180,

    units: [
      '250ml',
      '500ml',
      '750ml',
      '1L',
      '1.5L',
      '2kg',
      '3kg',
    ],

    description:
      'Affordable cleaning products for student residences and homes.',
  },

  {
    category: 'Essentials',
    subcategory: 'Home and Living',

    products: [
      'Bath Towel',
      'Hand Towel',
      'Pillow',
      'Pillowcase',
      'Blanket',
      'Duvet',
      'Duvet Cover',
      'Bedsheet',
      'Mattress Protector',
      'Laundry Basket',
      'Storage Box',
      'Clothes Hangers',
      'Desk Lamp',
      'Extension Cord',
      'Drying Rack',
    ],

    brands: ESSENTIAL_BRANDS,

    stores: ESSENTIAL_STORES,

    minPrice: 30,
    maxPrice: 900,

    units: [
      'Single',
      'Double',
      'Queen',
      'Standard',
      'Large',
    ],

    description:
      'Affordable home and residence products for students.',
  },

  {
    category: 'Essentials',
    subcategory: 'Backpacks and Bags',

    products: [
      'Laptop Backpack',
      'Student Backpack',
      'Campus Backpack',
      'School Backpack',
      'Travel Backpack',
      'Laptop Bag',
      'Messenger Bag',
      'Crossbody Bag',
      'Tote Bag',
      'Gym Bag',
      'Duffel Bag',
      'Book Bag',
    ],

    brands: [
      'Superbalist',
      'Takealot',
      'HP',
      'Lenovo',
      'Mr Price',
      'Cotton On',
    ],

    stores: ESSENTIAL_STORES,

    minPrice: 120,
    maxPrice: 1200,

    units: [
      '10L',
      '15L',
      '20L',
      '25L',
      '30L',
      '35L',
    ],

    description:
      'Affordable bags and backpacks for students, laptops and books.',
  },
];

// =========================================================
// GENERATE EXPANDED CATALOGUE
// =========================================================

const ALL_TEMPLATES: CatalogueTemplate[] = [
  ...GROCERY_TEMPLATES,
  ...CLOTHING_TEMPLATES,
  ...FOOTWEAR_TEMPLATES,
  ...COSMETICS_TEMPLATES,
  ...ELECTRONICS_TEMPLATES,
  ...ESSENTIAL_TEMPLATES,
];

const EXPANDED_CATALOGUE: Product[] = ALL_TEMPLATES.flatMap(
  (template) => generateCatalogueProducts(template, 100)
);

// =========================================================
// ORIGINAL / FEATURED PRODUCTS
// =========================================================

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'superbalist-nike-air-force',
    title: "Nike Air Force 1 '07 - White",
    brand: 'Nike',
    category: 'Footwear',
    subcategory: 'Sneakers',
    store: 'Superbalist',
    storeCode: 'SB',
    priceZar: 1599,
    originalPriceZar: 2199,
    discountPercent: 27,
    inStock: true,
    rating: 4.8,
    studentTag: 'Student Favourite',
    description:
      'Classic everyday sneakers suitable for campus and casual wear.',
    imageUrl:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  },

  {
    id: 'superbalist-converse-chuck70',
    title: 'Converse Chuck 70 Vintage Canvas High-Top',
    brand: 'Converse',
    category: 'Footwear',
    subcategory: 'Sneakers',
    store: 'Superbalist',
    storeCode: 'SB',
    priceZar: 1099,
    originalPriceZar: 1499,
    discountPercent: 26,
    inStock: true,
    rating: 4.7,
    studentTag: 'Campus Style',
    description:
      'Versatile canvas sneakers for everyday student outfits.',
    imageUrl:
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80',
  },

  {
    id: 'superbalist-north-face',
    title: 'The North Face Insulated Puffer Jacket',
    brand: 'The North Face',
    category: 'Clothing',
    subcategory: 'Jackets',
    store: 'Superbalist',
    storeCode: 'SB',
    priceZar: 749,
    originalPriceZar: 999,
    discountPercent: 25,
    inStock: true,
    rating: 4.7,
    studentTag: 'Winter Essential',
    description:
      'Warm insulated jacket for colder campus days.',
    imageUrl:
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80',
  },

  {
    id: 'superbalist-backpack',
    title: 'Everyday Laptop Backpack',
    brand: 'Superbalist',
    category: 'Essentials',
    subcategory: 'Backpacks and Bags',
    store: 'Superbalist',
    storeCode: 'SB',
    priceZar: 449,
    originalPriceZar: 599,
    discountPercent: 25,
    inStock: true,
    rating: 4.5,
    studentTag: 'Campus Essential',
    description:
      'Stylish backpack suitable for laptops and university books.',
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  },

  {
    id: 'takealot-adidas-ultraboost',
    title: 'Adidas Ultraboost Light Core Black',
    brand: 'Adidas',
    category: 'Footwear',
    subcategory: 'Sneakers',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 2299,
    originalPriceZar: 3299,
    discountPercent: 30,
    inStock: true,
    rating: 4.8,
    studentTag: 'Premium Pick',
    description:
      'Performance sneakers for students who want comfort and support.',
    imageUrl:
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',
  },

  {
    id: 'takealot-kway-parka',
    title: "K-Way Elements Men's Parka Jacket",
    brand: 'K-Way',
    category: 'Clothing',
    subcategory: 'Jackets',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 650,
    originalPriceZar: 899,
    discountPercent: 28,
    inStock: true,
    rating: 4.6,
    studentTag: 'Winter Essential',
    description:
      'Practical outdoor jacket for cold and rainy conditions.',
    imageUrl:
      'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=600&q=80',
  },

  {
    id: 'takealot-powerbank',
    title: 'Anker 20,000mAh Power Bank',
    brand: 'Anker',
    category: 'Electronics',
    subcategory: 'Power Banks',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 599,
    originalPriceZar: 799,
    discountPercent: 25,
    inStock: true,
    rating: 4.7,
    studentTag: 'Campus Essential',
    description:
      'Portable power bank for long days on campus.',
    imageUrl:
      'https://images.unsplash.com/photo-1609592424940-1f7e6b3b4a4c?w=600&q=80',
  },

  {
    id: 'takealot-wireless-mouse',
    title: 'Logitech Wireless Computer Mouse',
    brand: 'Logitech',
    category: 'Tech',
    subcategory: 'Computer Accessories',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.7,
    studentTag: 'Study Essential',
    description:
      'Wireless mouse for laptops and university work.',
    imageUrl:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
  },

  {
    id: 'takealot-usb',
    title: 'SanDisk 128GB USB Flash Drive',
    brand: 'SanDisk',
    category: 'Tech',
    subcategory: 'Computer Accessories',
    store: 'Takealot',
    storeCode: 'T',
    priceZar: 199,
    originalPriceZar: 299,
    discountPercent: 33,
    inStock: true,
    rating: 4.6,
    studentTag: 'Study Essential',
    description:
      'Portable storage for assignments and study files.',
    imageUrl:
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'mrprice-windbreaker',
    title: 'Mr Price Urban Tech Lightweight Windbreaker',
    brand: 'Mr Price',
    category: 'Clothing',
    subcategory: 'Jackets',
    store: 'Mr Price',
    storeCode: 'MR',
    priceZar: 499,
    originalPriceZar: 650,
    discountPercent: 23,
    inStock: true,
    rating: 4.6,
    studentTag: 'Student Fashion',
    description:
      'Lightweight everyday jacket for campus.',
    imageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  },

  {
    id: 'mrprice-jeans',
    title: 'Mr Price Slim Fit Denim Jeans',
    brand: 'Mr Price',
    category: 'Clothing',
    subcategory: 'Jeans',
    store: 'Mr Price',
    storeCode: 'MR',
    priceZar: 399,
    originalPriceZar: 499,
    discountPercent: 20,
    inStock: true,
    rating: 4.5,
    studentTag: 'Student Fashion',
    description:
      'Affordable everyday jeans for campus outfits.',
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
  },

  {
    id: 'mrprice-tshirt',
    title: 'Mr Price Basic Cotton T-Shirt',
    brand: 'Mr Price',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    store: 'Mr Price',
    storeCode: 'MR',
    priceZar: 149,
    originalPriceZar: 199,
    discountPercent: 25,
    inStock: true,
    rating: 4.6,
    studentTag: 'Budget Fashion',
    description:
      'Affordable everyday T-shirt for campus wear.',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'checkers-bread',
    title: 'Albany Superior White Bread 700g',
    brand: 'Albany',
    category: 'Groceries',
    subcategory: 'Bakery',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 20.99,
    originalPriceZar: 25.99,
    discountPercent: 20,
    inStock: true,
    rating: 4.7,
    unit: '700g',
    studentTag: 'Budget Pick',
    description:
      'Affordable everyday bread for student meals.',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'checkers-rice',
    title: 'Tastic Parboiled Rice 2kg',
    brand: 'Tastic',
    category: 'Groceries',
    subcategory: 'Carbohydrates',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 36.99,
    originalPriceZar: 43.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.6,
    unit: '2kg',
    studentTag: 'Budget Staple',
    description:
      'Affordable rice for student meal preparation.',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'checkers-milk',
    title: 'Clover Full Cream Milk 2L',
    brand: 'Clover',
    category: 'Groceries',
    subcategory: 'Dairy Foods',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 32.99,
    originalPriceZar: 38.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.7,
    unit: '2L',
    studentTag: 'Student Essential',
    description:
      'Everyday milk for breakfast and cooking.',
    imageUrl:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'checkers-chicken',
    title: 'Checkers Chicken Breasts 2kg',
    brand: 'Checkers',
    category: 'Groceries',
    subcategory: 'Meat',
    store: 'Checkers',
    storeCode: 'C',
    priceZar: 119.99,
    originalPriceZar: 139.99,
    discountPercent: 14,
    inStock: true,
    rating: 4.6,
    unit: '2kg',
    studentTag: 'Meal Prep',
    description:
      'Convenient chicken pack for student meal preparation.',
  },

  {
    id: 'pnp-coffee',
    title: 'Nescafé Classic Instant Coffee 200g',
    brand: 'Nescafé',
    category: 'Groceries',
    subcategory: 'Beverages',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 89.99,
    originalPriceZar: 114.99,
    discountPercent: 22,
    inStock: true,
    rating: 4.7,
    unit: '200g',
    studentTag: 'Study Essential',
    description:
      'Instant coffee for late-night study sessions.',
    imageUrl:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  },

  {
    id: 'pnp-pasta',
    title: "Fatti's & Moni's Spaghetti 500g",
    brand: "Fatti's & Moni's",
    category: 'Groceries',
    subcategory: 'Carbohydrates',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 18.99,
    originalPriceZar: 22.99,
    discountPercent: 17,
    inStock: true,
    rating: 4.5,
    unit: '500g',
    studentTag: 'Budget Meal',
    description:
      'Low-cost pasta for quick student dinners.',
    isGreatValue: true,
  },

  {
    id: 'pnp-peanut-butter',
    title: 'Black Cat Peanut Butter 400g',
    brand: 'Black Cat',
    category: 'Groceries',
    subcategory: 'Fats and Oils',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 49.99,
    originalPriceZar: 59.99,
    discountPercent: 17,
    inStock: true,
    rating: 4.7,
    unit: '400g',
    studentTag: 'Student Essential',
    description:
      'Versatile pantry staple for breakfast and snacks.',
    imageUrl:
      'https://images.unsplash.com/photo-1612187385831-d8a9c4d7c1b7?w=600&q=80',
  },

  {
    id: 'pnp-laundry',
    title: 'OMO Washing Powder 2kg',
    brand: 'OMO',
    category: 'Essentials',
    subcategory: 'Cleaning',
    store: 'Pick n Pay',
    storeCode: 'P',
    priceZar: 69.99,
    originalPriceZar: 84.99,
    discountPercent: 18,
    inStock: true,
    rating: 4.6,
    unit: '2kg',
    studentTag: 'Household',
    description:
      'Laundry detergent for student residences.',
  },

  {
    id: 'woolies-eggs',
    title: 'Woolworths Free Range Large Eggs',
    brand: 'Woolworths',
    category: 'Groceries',
    subcategory: 'Dairy Foods',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 42.99,
    originalPriceZar: 48.99,
    discountPercent: 12,
    inStock: true,
    rating: 4.9,
    unit: '12 eggs',
    studentTag: 'Protein',
    description:
      'Free range eggs for breakfasts and meals.',
  },

  {
    id: 'woolies-wraps',
    title: 'Woolworths Wholewheat Wraps 6 Pack',
    brand: 'Woolworths',
    category: 'Groceries',
    subcategory: 'Bakery',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 39.99,
    originalPriceZar: 44.99,
    discountPercent: 11,
    inStock: true,
    rating: 4.8,
    unit: '6 pack',
    studentTag: 'Quick Meal',
    description:
      'Convenient wraps for quick student lunches.',
  },

  {
    id: 'woolies-chicken',
    title: 'Woolworths Ready-to-Eat Chicken Pieces',
    brand: 'Woolworths',
    category: 'Groceries',
    subcategory: 'Meat',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 79.99,
    originalPriceZar: 94.99,
    discountPercent: 16,
    inStock: true,
    rating: 4.8,
    unit: 'portion',
    studentTag: 'Quick Meal',
    description:
      'Ready-to-eat option for busy students.',
  },

  {
    id: 'woolies-hoodie',
    title: 'Woolworths Basic Cotton Hoodie',
    brand: 'Woolworths',
    category: 'Clothing',
    subcategory: 'Hoodies',
    store: 'Woolworths',
    storeCode: 'W',
    priceZar: 499,
    originalPriceZar: 699,
    discountPercent: 29,
    inStock: true,
    rating: 4.7,
    studentTag: 'Student Fashion',
    description:
      'Everyday hoodie suitable for campus wear.',
  },

  {
    id: 'spar-noodles',
    title: 'Maggi Instant Noodles 5-Pack',
    brand: 'Maggi',
    category: 'Snacks',
    subcategory: 'Sweets and Snacks',
    store: 'SPAR',
    storeCode: 'S',
    priceZar: 28.5,
    originalPriceZar: 34,
    discountPercent: 16,
    inStock: true,
    rating: 4.4,
    unit: '5 pack',
    studentTag: 'Student Favourite',
    description:
      'Quick and affordable meal option.',
    isGreatValue: true,
  },

  {
    id: 'spar-eggs',
    title: 'SPAR Large Eggs 18 Pack',
    brand: 'SPAR',
    category: 'Groceries',
    subcategory: 'Dairy Foods',
    store: 'SPAR',
    storeCode: 'S',
    priceZar: 54.99,
    originalPriceZar: 64.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.6,
    unit: '18 pack',
    studentTag: 'Protein',
    description:
      'Versatile protein option for affordable meals.',
  },

  {
    id: 'spar-cereal',
    title: 'Bokomo Weet-Bix 450g',
    brand: 'Bokomo',
    category: 'Groceries',
    subcategory: 'Breakfast Foods',
    store: 'SPAR',
    storeCode: 'S',
    priceZar: 39.99,
    originalPriceZar: 47.99,
    discountPercent: 17,
    inStock: true,
    rating: 4.7,
    unit: '450g',
    studentTag: 'Breakfast',
    description:
      'Popular breakfast option for students.',
  },

  {
    id: 'shoprite-rice',
    title: 'Tastic Long Grain Rice 2kg',
    brand: 'Tastic',
    category: 'Groceries',
    subcategory: 'Carbohydrates',
    store: 'Shoprite',
    storeCode: 'SH',
    priceZar: 34.99,
    originalPriceZar: 42.99,
    discountPercent: 19,
    inStock: true,
    rating: 4.5,
    unit: '2kg',
    studentTag: 'Budget Staple',
    description:
      'Affordable rice for bulk student meals.',
    isGreatValue: true,
  },

  {
    id: 'shoprite-beans',
    title: 'All Gold Baked Beans 410g',
    brand: 'All Gold',
    category: 'Groceries',
    subcategory: 'Canned Foods',
    store: 'Shoprite',
    storeCode: 'SH',
    priceZar: 15.99,
    originalPriceZar: 19.99,
    discountPercent: 20,
    inStock: true,
    rating: 4.4,
    unit: '410g',
    studentTag: 'Budget Meal',
    description:
      'Low-cost option for quick student meals.',
    isGreatValue: true,
  },

  {
    id: 'shoprite-oats',
    title: 'Jungle Instant Oats 1kg',
    brand: 'Jungle',
    category: 'Groceries',
    subcategory: 'Breakfast Foods',
    store: 'Shoprite',
    storeCode: 'SH',
    priceZar: 39.99,
    originalPriceZar: 49.99,
    discountPercent: 20,
    inStock: true,
    rating: 4.5,
    unit: '1kg',
    studentTag: 'Breakfast',
    description:
      'Affordable breakfast option for students.',
    isGreatValue: true,
  },

  {
    id: 'boxer-maize-meal',
    title: 'Iwisa White Maize Meal 5kg',
    brand: 'Iwisa',
    category: 'Groceries',
    subcategory: 'Carbohydrates',
    store: 'Boxer',
    storeCode: 'B',
    priceZar: 59.99,
    originalPriceZar: 69.99,
    discountPercent: 14,
    inStock: true,
    rating: 4.5,
    unit: '5kg',
    studentTag: 'Bulk Saving',
    description:
      'Affordable staple for shared student households.',
    imageUrl:
      'https://images.unsplash.com/photo-1603046891744-76e6300f0c8d?w=600&q=80',
    isGreatValue: true,
  },

  {
    id: 'boxer-cooking-oil',
    title: 'Sunfoil Cooking Oil 2L',
    brand: 'Sunfoil',
    category: 'Groceries',
    subcategory: 'Fats and Oils',
    store: 'Boxer',
    storeCode: 'B',
    priceZar: 54.99,
    originalPriceZar: 64.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.4,
    unit: '2L',
    studentTag: 'Kitchen Essential',
    description:
      'Everyday cooking oil for student kitchens.',
  },

  {
    id: 'boxer-sugar',
    title: 'Selati Brown Sugar 2kg',
    brand: 'Selati',
    category: 'Groceries',
    subcategory: 'Carbohydrates',
    store: 'Boxer',
    storeCode: 'B',
    priceZar: 39.99,
    originalPriceZar: 46.99,
    discountPercent: 15,
    inStock: true,
    rating: 4.4,
    unit: '2kg',
    studentTag: 'Pantry Staple',
    description:
      'Affordable pantry staple for tea and coffee.',
  },

  {
    id: 'makro-microwave',
    title: 'Defy Compact Microwave Oven',
    brand: 'Defy',
    category: 'Essentials',
    subcategory: 'Home and Living',
    store: 'Makro',
    storeCode: 'M',
    priceZar: 1199,
    originalPriceZar: 1499,
    discountPercent: 20,
    inStock: true,
    rating: 4.5,
    studentTag: 'Residence Essential',
    description:
      'Compact microwave suitable for student accommodation.',
  },

  {
    id: 'makro-headphones',
    title: 'JBL Wireless Bluetooth Headphones',
    brand: 'JBL',
    category: 'Electronics',
    subcategory: 'Headphones',
    store: 'Makro',
    storeCode: 'M',
    priceZar: 699,
    originalPriceZar: 899,
    discountPercent: 22,
    inStock: true,
    rating: 4.7,
    studentTag: 'Study Essential',
    description:
      'Wireless headphones for studying and entertainment.',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },

  {
    id: 'makro-backpack',
    title: 'HP Laptop Backpack 15.6"',
    brand: 'HP',
    category: 'Essentials',
    subcategory: 'Backpacks and Bags',
    store: 'Makro',
    storeCode: 'M',
    priceZar: 499,
    originalPriceZar: 699,
    discountPercent: 29,
    inStock: true,
    rating: 4.6,
    studentTag: 'Campus Essential',
    description:
      'Laptop backpack designed for commuting students.',
  },

  {
    id: 'game-usb-cable',
    title: 'Philips USB-C Fast Charging Cable',
    brand: 'Philips',
    category: 'Tech',
    subcategory: 'Computer Accessories',
    store: 'Game',
    storeCode: 'G',
    priceZar: 129.99,
    originalPriceZar: 179.99,
    discountPercent: 28,
    inStock: true,
    rating: 4.4,
    studentTag: 'Tech Essential',
    description:
      'Charging cable for phones and compatible devices.',
  },

  {
    id: 'game-kettle',
    title: 'Russell Hobbs 1.7L Electric Kettle',
    brand: 'Russell Hobbs',
    category: 'Essentials',
    subcategory: 'Home and Living',
    store: 'Game',
    storeCode: 'G',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.6,
    studentTag: 'Residence Essential',
    description:
      'Compact kettle for tea, coffee and quick meals.',
  },

  {
    id: 'jet-hoodie',
    title: 'Jet Fleece Pullover Hoodie',
    brand: 'Jet',
    category: 'Clothing',
    subcategory: 'Hoodies',
    store: 'Jet',
    storeCode: 'J',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.4,
    studentTag: 'Winter Essential',
    description:
      'Affordable warm hoodie for colder campus days.',
  },

  {
    id: 'jet-sneakers',
    title: 'Jet Everyday Canvas Sneakers',
    brand: 'Jet',
    category: 'Footwear',
    subcategory: 'Sneakers',
    store: 'Jet',
    storeCode: 'J',
    priceZar: 349,
    originalPriceZar: 449,
    discountPercent: 22,
    inStock: true,
    rating: 4.3,
    studentTag: 'Budget Footwear',
    description:
      'Affordable everyday sneakers for campus.',
  },

  {
    id: 'ackermans-joggers',
    title: 'Ackermans Cotton Jogger Pants',
    brand: 'Ackermans',
    category: 'Clothing',
    subcategory: 'Trousers',
    store: 'Ackermans',
    storeCode: 'A',
    priceZar: 249,
    originalPriceZar: 329,
    discountPercent: 24,
    inStock: true,
    rating: 4.5,
    studentTag: 'Student Fashion',
    description:
      'Comfortable joggers for classes and residence.',
  },

  {
    id: 'ackermans-sneakers',
    title: 'Ackermans Casual Lace-Up Sneakers',
    brand: 'Ackermans',
    category: 'Footwear',
    subcategory: 'Sneakers',
    store: 'Ackermans',
    storeCode: 'A',
    priceZar: 299,
    originalPriceZar: 399,
    discountPercent: 25,
    inStock: true,
    rating: 4.4,
    studentTag: 'Budget Footwear',
    description:
      'Affordable casual footwear for everyday campus use.',
  },

  {
    id: 'pep-tshirt',
    title: 'PEP Basic Everyday T-Shirt',
    brand: 'PEP',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    store: 'PEP',
    storeCode: 'PE',
    priceZar: 99.99,
    originalPriceZar: 129.99,
    discountPercent: 23,
    inStock: true,
    rating: 4.4,
    studentTag: 'Budget Fashion',
    description:
      'Low-cost everyday clothing option for students.',
    isGreatValue: true,
  },

  {
    id: 'pep-slippers',
    title: 'PEP Comfort Slippers',
    brand: 'PEP',
    category: 'Footwear',
    subcategory: 'Slippers',
    store: 'PEP',
    storeCode: 'PE',
    priceZar: 129.99,
    originalPriceZar: 169.99,
    discountPercent: 24,
    inStock: true,
    rating: 4.3,
    studentTag: 'Residence Essential',
    description:
      'Affordable slippers for residence and home use.',
  },

  {
    id: 'cottonon-hoodie',
    title: 'Cotton On Classic Campus Hoodie',
    brand: 'Cotton On',
    category: 'Clothing',
    subcategory: 'Hoodies',
    store: 'Cotton On',
    storeCode: 'CO',
    priceZar: 599,
    originalPriceZar: 799,
    discountPercent: 25,
    inStock: true,
    rating: 4.6,
    studentTag: 'Student Fashion',
    description:
      'Casual hoodie suitable for everyday campus outfits.',
  },

  {
    id: 'cottonon-tshirt',
    title: 'Cotton On Classic Graphic T-Shirt',
    brand: 'Cotton On',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    store: 'Cotton On',
    storeCode: 'CO',
    priceZar: 249,
    originalPriceZar: 329,
    discountPercent: 24,
    inStock: true,
    rating: 4.5,
    studentTag: 'Student Fashion',
    description:
      'Casual graphic T-shirt for everyday student wear.',
  },
];

// =========================================================
const FOOD_LOVERS_FRESH_PRODUCTS: Product[] = [
  {
    id: 'food-lovers-bananas',
    title: 'Fresh Produce Bananas 1kg',
    brand: 'Food Lover\'s Market',
    category: 'Groceries',
    subcategory: 'Fruits',
    store: 'Food Lover\'s Market',
    storeCode: 'FLM',
    priceZar: 24.99,
    inStock: true,
    unit: '1kg',
    studentTag: 'Fresh produce',
    description: 'Fresh bananas from Food Lover\'s Market produce section.',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80',
  },
  {
    id: 'food-lovers-tomatoes',
    title: 'Fresh Produce Tomatoes 1kg',
    brand: 'Food Lover\'s Market',
    category: 'Groceries',
    subcategory: 'Vegetables',
    store: 'Food Lover\'s Market',
    storeCode: 'FLM',
    priceZar: 29.99,
    inStock: true,
    unit: '1kg',
    studentTag: 'Fresh produce',
    description: 'Fresh tomatoes from Food Lover\'s Market produce section.',
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80',
  },
  {
    id: 'food-lovers-spinach',
    title: 'Fresh Baby Spinach 200g',
    brand: 'Food Lover\'s Market',
    category: 'Groceries',
    subcategory: 'Vegetables',
    store: 'Food Lover\'s Market',
    storeCode: 'FLM',
    priceZar: 19.99,
    inStock: true,
    unit: '200g',
    studentTag: 'Fresh produce',
    description: 'Fresh baby spinach from Food Lover\'s Market produce section.',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
  },
  {
    id: 'food-lovers-eggs',
    title: 'Free Range Eggs 6 Pack',
    brand: 'Food Lover\'s Market',
    category: 'Groceries',
    subcategory: 'Dairy Foods',
    store: 'Food Lover\'s Market',
    storeCode: 'FLM',
    priceZar: 28.99,
    inStock: true,
    unit: '6 pack',
    studentTag: 'Fresh groceries',
    description: 'Free range eggs stocked by Food Lover\'s Market.',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80',
  },
];

// FINAL PRODUCT LIST
// =========================================================
//
// FEATURED_PRODUCTS are kept first.
// EXPANDED_CATALOGUE then adds 100 products per
// subcategory.
//
// This gives the application a very large catalogue
// without manually writing thousands of objects.
// =========================================================

export const INITIAL_PRODUCTS: Product[] = [
  ...FEATURED_PRODUCTS,
  ...FOOD_LOVERS_FRESH_PRODUCTS,
  ...EXPANDED_CATALOGUE,
].map(applyRetailerGroceryBranding);

// =========================================================
// CATALOGUE SUBCATEGORIES
// =========================================================

export const CATALOGUE_SUBCATEGORIES = ALL_TEMPLATES.map(
  (template) => ({
    category: template.category,
    subcategory: template.subcategory,
  })
);

// =========================================================
// CATALOGUE COUNT
// =========================================================

export const EXPANDED_CATALOGUE_COUNT =
  EXPANDED_CATALOGUE.length;

export const TOTAL_CATALOGUE_COUNT =
  INITIAL_PRODUCTS.length;

export function applyRetailerGroceryBranding(product: Product): Product {
  if (
    product.category !== 'Groceries' ||
    !['Woolworths', 'Food Lover\'s Market'].includes(product.store)
  ) {
    return product;
  }

  const escapedBrand = product.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const titleWithoutBrand = product.title
    .replace(new RegExp(`^${escapedBrand}\\s+`, 'i'), '')
    .trim();
  const title = titleWithoutBrand.toLowerCase().startsWith(product.store.toLowerCase())
    ? titleWithoutBrand
    : `${product.store} ${titleWithoutBrand}`;

  return {
    ...product,
    brand: product.store,
    title,
  };
}

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
    address:
      'Campus Square Shopping Centre, Cnr Kingsway & University Rd',
    rating: 4.6,
    openUntil: '8:00 PM',
    delivery: 'Sixty60 Delivery Available (30 mins)',
    dealSummary:
      '2-for-R90 Pizzas • R20.99 Albany White Bread',
  },

  {
    id: 'spar-student-hub',
    name: 'SPAR Express Student Hub',
    brand: 'SPAR',
    code: 'S',
    distanceKm: 0.8,
    travelTimeMinutes: 2,
    address:
      'Main St near Student Residence Gate 3',
    rating: 4.4,
    openUntil: '10:00 PM',
    delivery: 'Walking distance',
    dealSummary:
      'R28.50 Maggi 5-Pack Noodles • R12 Coffee Special',
  },

  {
    id: 'pnp-main-road',
    name: 'Pick n Pay Main Rd Plaza',
    brand: 'Pick n Pay',
    code: 'P',
    distanceKm: 2.5,
    travelTimeMinutes: 7,
    address:
      'Main Road Centre, Rondebosch / Braamfontein',
    rating: 4.5,
    openUntil: '7:30 PM',
    delivery: 'PnP ASAP! (35 mins)',
    dealSummary:
      'R32.99 2L Clover Milk • R89.99 Nescafé 200g',
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
    dealSummary:
      'R42.99 Free Range Eggs • R149 Rotisserie Chicken',
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
    dealSummary:
      'R34.99 Tastic Rice • R15.99 Baked Beans',
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
    dealSummary:
      'R59.99 Maize Meal • R54.99 Cooking Oil',
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
    dealSummary:
      'R699 JBL Headphones • R499 Laptop Backpack',
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
    dealSummary:
      'R129.99 USB-C Cable • R299 Electric Kettle',
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
    description:
      'Food, drinks and everyday supermarket items',
    savings: 'Save up to R220',
  },

  {
    id: 'clothing',
    name: 'Clothing',
    icon: '👕',
    description:
      'Affordable student fashion and campus outfits',
    savings: 'Save 15–30%',
  },

  {
    id: 'footwear',
    name: 'Footwear',
    icon: '👟',
    description:
      'Sneakers, casual shoes and residence footwear',
    savings: 'Save up to R500',
  },

  {
    id: 'cosmetics',
    name: 'Cosmetics',
    icon: '💄',
    description:
      'Skincare, makeup, grooming and personal care',
    savings: 'Save up to R250',
  },

  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    description:
      'Phones, laptops, tablets and smart devices',
    savings: 'Save up to R1000',
  },

  {
    id: 'tech',
    name: 'Tech',
    icon: '💻',
    description:
      'Study technology and computer accessories',
    savings: 'Save up to R300',
  },

  {
    id: 'essentials',
    name: 'Student Essentials',
    icon: '🎒',
    description:
      'Residence, campus and household essentials',
    savings: 'Save up to R250',
  },

  {
    id: 'snacks',
    name: 'Snacks',
    icon: '🍫',
    description:
      'Quick meals, drinks and student snacks',
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
    description:
      'Save money on everyday groceries and meal essentials.',
    category: 'Groceries',
    offer: 'Save up to 35%',
    stores:
      'Checkers • Pick n Pay • Woolworths',
  },

  {
    id: 'sale-clothing',
    title: 'Affordable Student Fashion',
    description:
      'Find affordable campus outfits without overspending.',
    category: 'Clothing',
    offer: 'Save up to 30%',
    stores:
      'Mr Price • Jet • Cotton On',
  },

  {
    id: 'sale-essentials',
    title: 'Back-to-Campus Deals',
    description:
      'Shop backpacks, tech accessories and residence essentials.',
    category: 'Student Essentials',
    offer: 'Save up to 25%',
    stores:
      'Game • Makro • Takealot',
  },

  {
    id: 'sale-cosmetics',
    title: 'Student Beauty Essentials',
    description:
      'Find affordable skincare, haircare and grooming products.',
    category: 'Cosmetics',
    offer: 'Budget-friendly beauty',
    stores:
      'Checkers • Shoprite • Takealot',
  },

  {
    id: 'sale-electronics',
    title: 'Student Tech Deals',
    description:
      'Find phones, laptops, headphones and study technology.',
    category: 'Electronics',
    offer: 'Student-friendly prices',
    stores:
      'Takealot • Game • Makro',
  },

  {
    id: 'sale-smart-shopping',
    title: 'Shop Smarter, Not Harder',
    description:
      'Compare products and keep your student budget under control.',
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
    reason:
      'Good for groceries and everyday student essentials.',
  },

  {
    id: 'recommended-mrprice',
    name: 'Mr Price',
    distanceKm: 2.1,
    rating: 4.7,
    reason:
      'Affordable clothing and campus fashion.',
  },

  {
    id: 'recommended-game',
    name: 'Game',
    distanceKm: 3.3,
    rating: 4.6,
    reason:
      'Useful for electronics and residence essentials.',
  },

  {
    id: 'recommended-woolworths',
    name: 'Woolworths',
    distanceKm: 2.7,
    rating: 4.9,
    reason:
      'Food, quality essentials and clothing.',
  },

  {
    id: 'recommended-pnp',
    name: 'Pick n Pay',
    distanceKm: 2.4,
    rating: 4.6,
    reason:
      'Everyday groceries and household products.',
  },

  {
    id: 'recommended-jet',
    name: 'Jet',
    distanceKm: 2.8,
    rating: 4.5,
    reason:
      'Affordable clothing and footwear.',
  },
];

// =========================================================
// MAP DATA
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

// =========================================================
// PRODUCT IMAGES
// =========================================================

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'superbalist-nike-air-force':
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',

  'superbalist-converse-chuck70':
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80',

  'superbalist-north-face':
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80',

  'superbalist-backpack':
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',

  'takealot-adidas-ultraboost':
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',

  'takealot-kway-parka':
    'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=600&q=80',

  'takealot-powerbank':
    'https://images.unsplash.com/photo-1609592424940-1f7e6b3b4a4c?w=600&q=80',

  'takealot-wireless-mouse':
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',

  'takealot-usb':
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80',

  'mrprice-windbreaker':
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',

  'mrprice-jeans':
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',

  'mrprice-tshirt':
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',

  'checkers-bread':
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',

  'checkers-rice':
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',

  'checkers-milk':
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',

  'checkers-chicken':
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80',

  'pnp-coffee':
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',

  'pnp-peanut-butter':
    'https://images.unsplash.com/photo-1612187385831-d8a9c4d7c1b7?w=600&q=80',

  'woolies-eggs':
    'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80',

  'woolies-wraps':
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80',

  'woolies-chicken':
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',

  'spar-noodles':
    'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&q=80',

  'shoprite-rice':
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',

  'shoprite-beans':
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80',

  'boxer-maize-meal':
    'https://images.unsplash.com/photo-1603046891744-76e6300f0c8d?w=600&q=80',

  'boxer-cooking-oil':
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',

  'makro-headphones':
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',

  'jet-sneakers':
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',

  'pep-tshirt':
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
};

// =========================================================
// APPLY FEATURED IMAGES
// =========================================================

INITIAL_PRODUCTS.forEach((product) => {
  if (!product.imageUrl && PRODUCT_IMAGE_MAP[product.id]) {
    product.imageUrl = PRODUCT_IMAGE_MAP[product.id];
  }
});

// =========================================================
// HELPER: SEARCHABLE PRODUCT TEXT
// =========================================================
//
// This is useful if your search component imports this helper.
// It makes category + subcategory + brand + store searchable.
// =========================================================

export function getProductSearchText(
  product: Product
): string {
  return [
    product.title,
    product.brand,
    product.category,
    product.subcategory,
    product.store,
    product.storeCode,
    product.studentTag,
    product.description,
    product.unit,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

const SEARCH_TERM_ALIASES: Record<string, string[]> = {
  pnp: ['pick', 'pay'],
  woolies: ['woolworths'],
  mrp: ['mr', 'price'],
  sneaker: ['shoe', 'shoes', 'footwear'],
  sneakers: ['shoe', 'shoes', 'footwear'],
  shoe: ['shoes', 'sneaker', 'sneakers', 'footwear'],
  shoes: ['shoe', 'sneaker', 'sneakers', 'footwear'],
  footwear: ['shoe', 'shoes', 'sneaker', 'sneakers'],
  grocery: ['groceries', 'food'],
  groceries: ['grocery', 'food'],
  beauty: ['cosmetics'],
  cosmetics: ['beauty'],
  tech: ['electronics'],
  electronics: ['tech'],
  clothes: ['clothing'],
};

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getSearchTermGroups(query: string): string[][] {
  const normalizedQuery = normalizeSearchText(query)
    .replace(/\bp\s*(?:and\s*|&\s*)?n\s*p\b/g, 'pick n pay')
    .replace(/\bmrp\b/g, 'mr price');
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const searchTerms = terms.length > 1
    ? terms.filter((term) => !['logo', 'logos', 'shop', 'store', 'product', 'products', 'item', 'items'].includes(term))
    : terms;

  return searchTerms
    .filter((term) => term.length > 1 || /^\d+$/.test(term))
    .map((term) => [term, ...(SEARCH_TERM_ALIASES[term] || [])]);
}

// =========================================================
// HELPER: SEARCH PRODUCTS
// =========================================================

export function searchProducts(
  query: string,
  products: Product[] = INITIAL_PRODUCTS
): Product[] {
  const termGroups = getSearchTermGroups(query);

  if (termGroups.length === 0) {
    return products;
  }

  return products.filter((product) => {
    const searchableText = normalizeSearchText(
      getProductSearchText(product)
    );

    return termGroups.every((alternatives) =>
      alternatives.some((term) =>
        searchableText.includes(term)
      )
    );
  });
}