import { getItem, setItem, removeItem } from './storage';
import type { Product, Category, Gender, VariantStock } from '../types/product';
import type { Customer, Segment } from '../types/customer';
import type { Order, OrderStatus, FunnelDay, OrderItem } from '../types/order';

// ---------- seeded RNG (deterministic across reloads until reset) ----------
let seed = 42;
function rand(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function randDateWithinDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - randInt(0, days));
  return d.toISOString();
}

// Curated real Unsplash photography, grouped by category so product images
// actually match what's being sold. Query params keep a consistent crop/size.
const UNSPLASH_Q = 'auto=format&fit=crop&w=800&h=1000&q=80';
const IMAGE_BANK: Record<Category, string[]> = {
  'T-Shirt': [
    'photo-1521572163474-6864f9cf17ab', 'photo-1576566588028-4147f3842f27',
    'photo-1503341504253-dff4815485f1', 'photo-1622445275576-721325763afe',
    'photo-1542291026-7eec264c27ff', 'photo-1529139574466-a303027c1d8b',
    'photo-1596755094514-f87e34085b2c', 'photo-1618354691373-d851c5c3a990',
  ],
  Pant: [
    'photo-1541099649105-f69ad21f3246', 'photo-1473966968600-fa801b869a1a',
    'photo-1594633312681-425c7b97ccd1', 'photo-1584865288642-42078afe6942',
    'photo-1624378439575-d8705ad7ae80', 'photo-1602293589930-45821bd6fea3',
  ],
  Dress: [
    'photo-1595777457583-95e059d581b8', 'photo-1515372039744-b8f02a3ae446',
    'photo-1496747611176-843222e1e57c', 'photo-1566174053879-31528523f8ae',
    'photo-1585487000160-6ebcfceb0d03', 'photo-1550639525-c97d455acf70',
    'photo-1490481651871-ab68de25d43d', 'photo-1554568218-0f1715e72254',
  ],
  Jacket: [
    'photo-1551028719-00167b16eac5', 'photo-1520975916090-3105956dac38',
    'photo-1544022613-e87ca75a784a', 'photo-1544966503-7ad532c48479',
    'photo-1591047139829-d91aecb6caea', 'photo-1445205170230-053b83016050',
    'photo-1591195853828-11db59a44f6b', 'photo-1578681994506-b8f463449011',
  ],
  Shoes: [
    'photo-1595950653106-6c9ebd614d3a', 'photo-1560769629-975ec94e6a86',
    'photo-1542291026-7eec264c27ff', 'photo-1600185365483-26d7f2e1a7d0',
    'photo-1549298916-b41d501d3772', 'photo-1595341888016-a392ef81b7de',
    'photo-1543163521-1bf539c55dd2', 'photo-1560343090-f0409e92791a',
  ],
  Bag: [
    'photo-1553062407-98eeb64c6a62', 'photo-1584917865442-de89df76afd3',
    'photo-1590874103328-eac38a683ce7', 'photo-1548036328-c9fa89d128fa',
    'photo-1524532787116-e70228437bbe', 'photo-1601924994987-69e26d50dc26',
    'photo-1515347619252-60a4bf4fff4f', 'photo-1566150905458-1bf1fc113f0d',
  ],
};
function imagesFor(category: Category, i: number): string[] {
  const bank = IMAGE_BANK[category];
  const a = bank[i % bank.length];
  const b = bank[(i + 1) % bank.length];
  const c = bank[(i + 3) % bank.length];
  return [a, b, c].map((id) => `https://images.unsplash.com/${id}?${UNSPLASH_Q}`);
}

const CATEGORIES: Category[] = ['T-Shirt', 'Pant', 'Dress', 'Jacket', 'Shoes', 'Bag'];
const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];
const BRANDS = ['Élan Studio', 'Nordwood', 'Marlowe & Co', 'Terra Atelier', 'Linden Row', 'Vale Supply'];
const SIZE_SETS: Record<Category, string[]> = {
  'T-Shirt': ['S', 'M', 'L', 'XL', 'XXL'],
  Pant: ['28', '30', '32', '34', '36'],
  Dress: ['XS', 'S', 'M', 'L', 'XL'],
  Jacket: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  Shoes: ['6', '7', '8', '9', '10', '11'],
  Bag: ['One Size'],
};
const COLORS = ['Sand', 'Charcoal', 'Olive', 'Tan', 'Black', 'Cream', 'Rust', 'Navy'];
const NAME_PARTS: Record<Category, string[]> = {
  'T-Shirt': ['Cotton Tee', 'Linen Shirt', 'Ribbed Top', 'Oxford Shirt', 'Henley'],
  Pant: ['Tailored Pants', 'Wide Leg Trouser', 'Chino', 'Denim', 'Cargo Pant'],
  Dress: ['Silk Dress', 'Wrap Dress', 'Midi Dress', 'Slip Dress', 'Shirt Dress'],
  Jacket: ['Wool Coat', 'Light Jacket', 'Blazer', 'Trench Coat', 'Bomber'],
  Shoes: ['Leather Loafer', 'Canvas Sneaker', 'Ankle Boot', 'Suede Mule'],
  Bag: ['Leather Bag', 'Tote', 'Crossbody', 'Clutch'],
};

function seedProducts(): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= 250; i++) {
    const category = pick(CATEGORIES);
    const color = pick(COLORS);
    const base = pick(NAME_PARTS[category]);
    const name = `${base} - ${color}`;
    const price = randInt(29, 220);
    const hasDiscount = rand() > 0.6;
    const compareAtPrice = hasDiscount ? Math.round(price * (1 + randInt(10, 40) / 100)) : null;
    const sizes = SIZE_SETS[category];
    const colors = pickN(COLORS, randInt(2, 4));
    const variantStock: VariantStock[] = [];
    let totalStock = 0;
    sizes.forEach((s) => {
      colors.forEach((c) => {
        const stock = randInt(0, 40);
        totalStock += stock;
        variantStock.push({ size: s, color: c, stock });
      });
    });
    const createdAt = randDateWithinDays(365);
    const priceHistory = Array.from({ length: 6 }).map((_, idx) => ({
      date: new Date(Date.now() - (5 - idx) * 30 * 86400000).toISOString(),
      price: Math.max(15, price + randInt(-15, 15)),
    }));
    products.push({
      id: `p${i}`,
      name,
      brand: pick(BRANDS),
      category,
      gender: pick(GENDERS),
      price,
      compareAtPrice,
      sizes,
      colors,
      images: imagesFor(category, i),
      variantStock,
      totalStock,
      rating: Math.round((3 + rand() * 2) * 10) / 10,
      reviewCount: randInt(3, 480),
      description:
        `100% ${pick(['linen', 'cotton', 'wool', 'silk', 'leather'])} ${category.toLowerCase()} with relaxed fit and natural texture. ` +
        `Designed for everyday wear, thoughtfully finished with reinforced seams and a soft interior lining that moves with you all day long.`,
      createdAt,
      priceHistory,
      competitorPrice: Math.max(15, price + randInt(-20, 25)),
    });
  }
  return products;
}

const FIRST_NAMES = ['Sophia', 'James', 'Olivia', 'Ethan', 'Mia', 'Noah', 'Ava', 'Liam', 'Isabella', 'Lucas', 'Emma', 'Mason', 'Charlotte', 'Elijah', 'Amelia', 'Benjamin'];
const LAST_NAMES = ['Lee', 'Carter', 'Brown', 'Nguyen', 'Garcia', 'Smith', 'Patel', 'Kim', 'Johnson', 'Rossi', 'Martin', 'Clark'];

function seedCustomers(): Customer[] {
  const customers: Customer[] = [];
  const segments: Segment[] = ['VIP', 'Repeat', 'One-time', 'At-risk'];
  const weights = [0.18, 0.36, 0.34, 0.12];
  for (let i = 1; i <= 500; i++) {
    const r = rand();
    let acc = 0;
    let segment: Segment = 'One-time';
    for (let j = 0; j < segments.length; j++) {
      acc += weights[j];
      if (r <= acc) {
        segment = segments[j];
        break;
      }
    }
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const orderCount = segment === 'VIP' ? randInt(8, 30) : segment === 'Repeat' ? randInt(3, 9) : segment === 'At-risk' ? randInt(1, 3) : 1;
    const totalSpent = orderCount * randInt(60, 240);
    customers.push({
      id: `c${i}`,
      name: `${first} ${last}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@mail.com`,
      segment,
      totalSpent,
      orderCount,
      lastOrderDate: randDateWithinDays(segment === 'At-risk' ? 200 : 60),
      ltv: Math.round(totalSpent * (1 + rand())),
    });
  }
  return customers;
}

function seasonalWeight(date: Date, category: Category): number {
  const month = date.getMonth();
  if (category === 'Jacket') return [1.8, 1.6, 1.2, 0.8, 0.5, 0.4, 0.4, 0.5, 0.9, 1.3, 1.9, 2.0][month];
  if (category === 'Dress') return [0.6, 0.6, 0.9, 1.6, 1.9, 1.8, 1.4, 1.1, 0.8, 0.6, 0.5, 0.6][month];
  return 1;
}

function seedOrders(products: Product[], customers: Customer[]): Order[] {
  const orders: Order[] = [];
  const statuses: OrderStatus[] = ['Delivered', 'Shipped', 'Processing', 'Cancelled'];
  const statusWeights = [0.7, 0.14, 0.1, 0.06];
  for (let i = 1; i <= 2000; i++) {
    const customer = pick(customers);
    const itemCount = randInt(1, 4);
    const items: OrderItem[] = [];
    let total = 0;
    for (let j = 0; j < itemCount; j++) {
      const product = pick(products);
      const qty = randInt(1, 2);
      items.push({
        productId: product.id,
        name: product.name,
        qty,
        price: product.price,
        size: pick(product.sizes),
        color: pick(product.colors),
        image: product.images[0],
      });
      total += product.price * qty;
    }
    const r = rand();
    let acc = 0;
    let status: OrderStatus = 'Delivered';
    for (let j = 0; j < statuses.length; j++) {
      acc += statusWeights[j];
      if (r <= acc) {
        status = statuses[j];
        break;
      }
    }
    const daysAgo = randInt(0, 364);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    orders.push({
      id: `o${i}`,
      customerId: customer.id,
      items,
      total: Math.round(total * 100) / 100,
      status,
      funnelStage: 'purchase',
      date: date.toISOString(),
    });
  }
  return orders;
}

function seedFunnel(): FunnelDay[] {
  const days: FunnelDay[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const visitors = randInt(400, 900);
    const views = Math.round(visitors * (0.55 + rand() * 0.15));
    const addToCart = Math.round(views * (0.25 + rand() * 0.15));
    const checkout = Math.round(addToCart * (0.4 + rand() * 0.2));
    const purchase = Math.round(checkout * (0.55 + rand() * 0.2));
    days.push({
      date: d.toISOString().slice(0, 10),
      visitors,
      views,
      addToCart,
      checkout,
      purchase,
    });
  }
  return days;
}

export function seedIfNeeded(): void {
  if (getItem('cl_seeded', false)) return;
  seed = 42;
  const products = seedProducts();
  const customers = seedCustomers();
  const orders = seedOrders(products, customers);
  const funnel = seedFunnel();
  setItem('cl_products', products);
  setItem('cl_customers', customers);
  setItem('cl_orders', orders);
  setItem('cl_funnel', funnel);
  setItem('cl_users', []);
  setItem('cl_seeded', true);
}

export function resetDemoData(): void {
  removeItem('cl_seeded');
  removeItem('cl_products');
  removeItem('cl_customers');
  removeItem('cl_orders');
  removeItem('cl_funnel');
  seedIfNeeded();
}

export function getProducts(): Product[] {
  return getItem<Product[]>('cl_products', []);
}
export function getCustomers(): Customer[] {
  return getItem<Customer[]>('cl_customers', []);
}
export function getOrders(): Order[] {
  return getItem<Order[]>('cl_orders', []);
}
export function getFunnel(): FunnelDay[] {
  return getItem<FunnelDay[]>('cl_funnel', []);
}

export function addProduct(input: {
  name: string;
  category: Category;
  price: number;
  stock: number;
  image: string | null;
}): Product {
  const products = getProducts();
  const sizes = SIZE_SETS[input.category];
  const colors = ['Sand', 'Charcoal'];
  const variantStock: VariantStock[] = [];
  const perVariant = Math.max(1, Math.round(input.stock / (sizes.length * colors.length)));
  sizes.forEach((s) => colors.forEach((c) => variantStock.push({ size: s, color: c, stock: perVariant })));
  const fallback = imagesFor(input.category, products.length + 1);
  const product: Product = {
    id: `p_new_${Date.now()}`,
    name: input.name,
    brand: 'Élan Studio',
    category: input.category,
    gender: 'Unisex',
    price: input.price,
    compareAtPrice: null,
    sizes,
    colors,
    images: input.image ? [input.image, ...fallback.slice(1)] : fallback,
    variantStock,
    totalStock: input.stock,
    rating: 5,
    reviewCount: 0,
    description: `Freshly added ${input.category.toLowerCase()} — details coming soon.`,
    createdAt: new Date().toISOString(),
    priceHistory: Array.from({ length: 6 }).map((_, idx) => ({
      date: new Date(Date.now() - (5 - idx) * 30 * 86400000).toISOString(),
      price: input.price,
    })),
    competitorPrice: input.price,
  };
  setItem('cl_products', [product, ...products]);
  return product;
}
