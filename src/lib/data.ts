import { getDb } from './db';
import { ensureDatabase } from './db-init';
import { Product, Solution, FAQ, BlogPost, Client, CompanyInfo, ContactInquiry, DealerApplication } from '@/types';

// Ensure DB is initialized on first access (concurrent-safe)
let initPromise: Promise<void> | null = null;
async function ensureInit() {
  if (!initPromise) {
    initPromise = ensureDatabase();
  }
  await initPromise;
}

// Helper to parse JSON fields from DB row
function parseProduct(row: Record<string, unknown>): Product {
  return {
    slug: row.slug as string,
    name: row.name as string,
    model: row.model as string,
    category: row.category as Product['category'],
    tags: JSON.parse(row.tags as string || '[]'),
    seats: row.seats as number,
    loadCapacity: row.loadCapacity as number,
    range: row.range as number,
    maxSpeed: row.maxSpeed as number,
    battery: {
      type: row.batteryType as string,
      capacity: row.batteryCapacity as string,
      options: JSON.parse(row.batteryOptions as string || '[]'),
    },
    images: JSON.parse(row.images as string || '[]'),
    specs: JSON.parse(row.specs as string || '{}'),
    certifications: JSON.parse(row.certifications as string || '[]'),
    pdfPath: row.pdfPath as string,
    description: row.description as string,
    featured: Boolean(row.featured),
    sortOrder: row.sortOrder as number,
  };
}

function parseSolution(row: Record<string, unknown>): Solution {
  return {
    slug: row.slug as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    description: row.description as string,
    image: row.image as string,
    icon: row.icon as string,
    features: JSON.parse(row.features as string || '[]'),
    relatedProducts: JSON.parse(row.relatedProducts as string || '[]'),
  };
}

function parseFaq(row: Record<string, unknown>): FAQ {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as string,
  };
}

function parseBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    image: row.image as string,
    author: row.author as string,
    date: row.date as string,
    tags: JSON.parse(row.tags as string || '[]'),
    readTime: row.readTime as number,
  };
}

function parseClient(row: Record<string, unknown>): Client {
  return {
    name: row.name as string,
    logo: row.logo as string,
  };
}

function parseCompany(row: Record<string, unknown>): CompanyInfo {
  return {
    name: row.name as string,
    tagline: row.tagline as string,
    description: row.description as string,
    founded: row.founded as number,
    employees: row.employees as string,
    exportCountries: row.exportCountries as number,
    annualOutput: row.annualOutput as string,
    factoryArea: row.factoryArea as string,
    address: row.address as string,
    phone: row.phone as string,
    email: row.email as string,
    whatsapp: row.whatsapp as string,
    social: {
      facebook: (row.socialFacebook as string) || undefined,
      linkedin: (row.socialLinkedin as string) || undefined,
      youtube: (row.socialYoutube as string) || undefined,
      instagram: (row.socialInstagram as string) || undefined,
    },
  };
}

// Products
export async function getProducts(): Promise<Product[]> {
  await ensureInit();
  const db = getDb();
  const rows = db.prepare('SELECT * FROM products ORDER BY sortOrder ASC').all() as Record<string, unknown>[];
  return rows.map(parseProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await ensureInit();
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as Record<string, unknown> | undefined;
  return row ? parseProduct(row) : undefined;
}

export async function saveProducts(products: Product[]): Promise<void> {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO products (slug, name, model, category, tags, seats, loadCapacity, range, maxSpeed,
      batteryType, batteryCapacity, batteryOptions, images, specs, certifications, pdfPath, description, featured, sortOrder, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(slug) DO UPDATE SET
      name=excluded.name, model=excluded.model, category=excluded.category, tags=excluded.tags,
      seats=excluded.seats, loadCapacity=excluded.loadCapacity, range=excluded.range, maxSpeed=excluded.maxSpeed,
      batteryType=excluded.batteryType, batteryCapacity=excluded.batteryCapacity, batteryOptions=excluded.batteryOptions,
      images=excluded.images, specs=excluded.specs, certifications=excluded.certifications, pdfPath=excluded.pdfPath,
      description=excluded.description, featured=excluded.featured, sortOrder=excluded.sortOrder, updatedAt=datetime('now')
  `);

  const insertMany = db.transaction((prods: Product[]) => {
    for (const p of prods) {
      upsert.run(
        p.slug, p.name, p.model, p.category, JSON.stringify(p.tags),
        p.seats, p.loadCapacity, p.range, p.maxSpeed,
        p.battery.type, p.battery.capacity, JSON.stringify(p.battery.options),
        JSON.stringify(p.images), JSON.stringify(p.specs), JSON.stringify(p.certifications),
        p.pdfPath, p.description, p.featured ? 1 : 0, p.sortOrder
      );
    }
  });

  insertMany(products);
}

export async function deleteProduct(slug: string): Promise<boolean> {
  const db = getDb();
  const result = db.prepare('DELETE FROM products WHERE slug = ?').run(slug);
  return result.changes > 0;
}

// Solutions
export async function getSolutions(): Promise<Solution[]> {
  await ensureInit();
  const db = getDb();
  const rows = db.prepare('SELECT * FROM solutions').all() as Record<string, unknown>[];
  return rows.map(parseSolution);
}

export async function saveSolutions(solutions: Solution[]): Promise<void> {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO solutions (slug, title, subtitle, description, image, icon, features, relatedProducts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title, subtitle=excluded.subtitle, description=excluded.description,
      image=excluded.image, icon=excluded.icon, features=excluded.features, relatedProducts=excluded.relatedProducts
  `);

  const insertMany = db.transaction((items: Solution[]) => {
    for (const s of items) {
      upsert.run(s.slug, s.title, s.subtitle, s.description, s.image, s.icon,
        JSON.stringify(s.features), JSON.stringify(s.relatedProducts));
    }
  });

  insertMany(solutions);
}

// FAQ
export async function getFaqs(): Promise<FAQ[]> {
  await ensureInit();
  const db = getDb();
  const rows = db.prepare('SELECT * FROM faq').all() as Record<string, unknown>[];
  return rows.map(parseFaq);
}

export async function saveFaqs(faqs: FAQ[]): Promise<void> {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO faq (id, question, answer, category) VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET question=excluded.question, answer=excluded.answer, category=excluded.category
  `);

  const insertMany = db.transaction((items: FAQ[]) => {
    for (const f of items) {
      upsert.run(f.id, f.question, f.answer, f.category);
    }
  });

  insertMany(faqs);
}

export async function deleteFaq(id: string): Promise<boolean> {
  const db = getDb();
  const result = db.prepare('DELETE FROM faq WHERE id = ?').run(id);
  return result.changes > 0;
}

// Blog
export async function getBlogPosts(): Promise<BlogPost[]> {
  await ensureInit();
  const db = getDb();
  const rows = db.prepare('SELECT * FROM blog_posts ORDER BY date DESC').all() as Record<string, unknown>[];
  return rows.map(parseBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await ensureInit();
  const db = getDb();
  const row = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug) as Record<string, unknown> | undefined;
  return row ? parseBlogPost(row) : undefined;
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, content, image, author, date, tags, readTime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title, excerpt=excluded.excerpt, content=excluded.content, image=excluded.image,
      author=excluded.author, date=excluded.date, tags=excluded.tags, readTime=excluded.readTime
  `);

  const insertMany = db.transaction((items: BlogPost[]) => {
    for (const p of items) {
      upsert.run(p.slug, p.title, p.excerpt, p.content, p.image, p.author, p.date,
        JSON.stringify(p.tags), p.readTime);
    }
  });

  insertMany(posts);
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const db = getDb();
  const result = db.prepare('DELETE FROM blog_posts WHERE slug = ?').run(slug);
  return result.changes > 0;
}

// Clients
export async function getClients(): Promise<Client[]> {
  await ensureInit();
  const db = getDb();
  const rows = db.prepare('SELECT * FROM clients').all() as Record<string, unknown>[];
  return rows.map(parseClient);
}

export async function saveClients(clients: Client[]): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM clients').run();
  const insert = db.prepare('INSERT INTO clients (name, logo) VALUES (?, ?)');
  for (const c of clients) {
    insert.run(c.name, c.logo);
  }
}

// Company
export async function getCompany(): Promise<CompanyInfo> {
  await ensureInit();
  const db = getDb();
  const row = db.prepare('SELECT * FROM company WHERE id = 1').get() as Record<string, unknown> | undefined;
  if (!row) {
    return {
      name: 'Saric EV',
      tagline: 'Professional Electric Vehicle Manufacturer',
      description: '',
      founded: 2020,
      employees: '100+',
      exportCountries: 30,
      annualOutput: '10,000+ units',
      factoryArea: '50,000 sqm',
      address: '',
      phone: '',
      email: '',
      whatsapp: '',
      social: {},
    };
  }
  return parseCompany(row);
}

export async function saveCompany(company: CompanyInfo): Promise<void> {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO company (id, name, tagline, description, founded, employees, exportCountries,
      annualOutput, factoryArea, address, phone, email, whatsapp, socialFacebook, socialLinkedin, socialYoutube, socialInstagram)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    company.name, company.tagline, company.description, company.founded,
    company.employees, company.exportCountries, company.annualOutput,
    company.factoryArea, company.address, company.phone, company.email,
    company.whatsapp, company.social.facebook || '', company.social.linkedin || '',
    company.social.youtube || '', company.social.instagram || ''
  );
}

// Inquiries
export async function getInquiries(): Promise<(ContactInquiry & { id: string; timestamp: string; read: boolean; note: string })[]> {
  await ensureInit();
  const db = getDb();
  const rows = db.prepare('SELECT * FROM inquiries ORDER BY timestamp DESC').all() as Record<string, unknown>[];
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    company: row.company as string,
    email: row.email as string,
    phone: row.phone as string,
    country: row.country as string,
    interestedProducts: JSON.parse(row.interestedProducts as string || '[]'),
    message: row.message as string,
    timestamp: row.timestamp as string,
    read: Boolean(row.read),
    note: row.note as string,
  }));
}

export async function updateInquiry(id: string, updates: Partial<{ read: boolean; note: string }>): Promise<boolean> {
  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  if (updates.read !== undefined) {
    sets.push('read = ?');
    values.push(updates.read ? 1 : 0);
  }
  if (updates.note !== undefined) {
    sets.push('note = ?');
    values.push(updates.note);
  }

  if (sets.length === 0) return false;
  values.push(id);

  const result = db.prepare(`UPDATE inquiries SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return result.changes > 0;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const db = getDb();
  const result = db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
  return result.changes > 0;
}

// Dealer Applications
export async function getDealerApplications(): Promise<(DealerApplication & { id: string; timestamp: string; read: boolean; note: string })[]> {
  await ensureInit();
  const db = getDb();
  const rows = db.prepare('SELECT * FROM dealer_applications ORDER BY timestamp DESC').all() as Record<string, unknown>[];
  return rows.map((row) => ({
    id: row.id as string,
    company: row.company as string,
    contactPerson: row.contactPerson as string,
    email: row.email as string,
    phone: row.phone as string,
    country: row.country as string,
    existingBusiness: row.existingBusiness as string,
    annualVolume: row.annualVolume as string,
    message: row.message as string,
    timestamp: row.timestamp as string,
    read: Boolean(row.read),
    note: row.note as string,
  }));
}

export async function updateDealerApplication(id: string, updates: Partial<{ read: boolean; note: string }>): Promise<boolean> {
  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  if (updates.read !== undefined) {
    sets.push('read = ?');
    values.push(updates.read ? 1 : 0);
  }
  if (updates.note !== undefined) {
    sets.push('note = ?');
    values.push(updates.note);
  }

  if (sets.length === 0) return false;
  values.push(id);

  const result = db.prepare(`UPDATE dealer_applications SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return result.changes > 0;
}

export async function deleteDealerApplication(id: string): Promise<boolean> {
  const db = getDb();
  const result = db.prepare('DELETE FROM dealer_applications WHERE id = ?').run(id);
  return result.changes > 0;
}

// Categories (constant, not from file)
export const categories = [
  { id: 'tourism', label: 'Tourism & Sightseeing', icon: 'map' },
  { id: 'patrol', label: 'Security & Patrol', icon: 'shield' },
  { id: 'logistics', label: 'Logistics & Cargo', icon: 'truck' },
  { id: 'utility', label: 'Utility & Maintenance', icon: 'wrench' },
] as const;
