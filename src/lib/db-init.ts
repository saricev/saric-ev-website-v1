import { getDb } from './db';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');

export function initDatabase(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      model TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      seats INTEGER NOT NULL DEFAULT 0,
      loadCapacity INTEGER NOT NULL DEFAULT 0,
      range INTEGER NOT NULL DEFAULT 0,
      maxSpeed INTEGER NOT NULL DEFAULT 0,
      batteryType TEXT NOT NULL DEFAULT '',
      batteryCapacity TEXT NOT NULL DEFAULT '',
      batteryOptions TEXT NOT NULL DEFAULT '[]',
      images TEXT NOT NULL DEFAULT '[]',
      specs TEXT NOT NULL DEFAULT '{}',
      certifications TEXT NOT NULL DEFAULT '[]',
      pdfPath TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS solutions (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      features TEXT NOT NULL DEFAULT '[]',
      relatedProducts TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS faq (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      readTime INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS company (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL DEFAULT 'Saric',
      tagline TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      founded INTEGER NOT NULL DEFAULT 2020,
      employees TEXT NOT NULL DEFAULT '',
      exportCountries INTEGER NOT NULL DEFAULT 0,
      annualOutput TEXT NOT NULL DEFAULT '',
      factoryArea TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      whatsapp TEXT NOT NULL DEFAULT '',
      socialFacebook TEXT NOT NULL DEFAULT '',
      socialLinkedin TEXT NOT NULL DEFAULT '',
      socialYoutube TEXT NOT NULL DEFAULT '',
      socialInstagram TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      interestedProducts TEXT NOT NULL DEFAULT '[]',
      message TEXT NOT NULL DEFAULT '',
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      read INTEGER NOT NULL DEFAULT 0,
      note TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS dealer_applications (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      contactPerson TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      existingBusiness TEXT NOT NULL DEFAULT '',
      annualVolume TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      read INTEGER NOT NULL DEFAULT 0,
      note TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS roles (
      name TEXT PRIMARY KEY,
      description TEXT NOT NULL DEFAULT '',
      permissions TEXT NOT NULL DEFAULT '[]',
      isSystem INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'viewer',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (role) REFERENCES roles(name)
    );
  `);
}

const ALL_PERMISSIONS = [
  'products:read', 'products:write', 'products:delete',
  'solutions:read', 'solutions:write', 'solutions:delete',
  'blog:read', 'blog:write', 'blog:delete',
  'faq:read', 'faq:write', 'faq:delete',
  'inquiries:read', 'inquiries:write', 'inquiries:delete',
  'dealers:read', 'dealers:write', 'dealers:delete',
  'company:read', 'company:write',
  'users:read', 'users:write', 'users:delete',
  'settings:read', 'settings:write',
];

const DEFAULT_ROLES = [
  {
    name: 'super_admin',
    description: 'Full access to everything',
    permissions: ALL_PERMISSIONS,
    isSystem: 1,
  },
  {
    name: 'admin',
    description: 'All access except user management',
    permissions: ALL_PERMISSIONS.filter((p) => !p.startsWith('users:')),
    isSystem: 1,
  },
  {
    name: 'editor',
    description: 'Can manage content and view inquiries',
    permissions: [
      'products:read', 'products:write',
      'solutions:read', 'solutions:write',
      'blog:read', 'blog:write',
      'faq:read', 'faq:write',
      'inquiries:read',
      'dealers:read',
      'company:read',
      'settings:read',
    ],
    isSystem: 1,
  },
  {
    name: 'viewer',
    description: 'Read-only access to all content',
    permissions: ALL_PERMISSIONS.filter((p) => p.endsWith(':read')),
    isSystem: 1,
  },
];

function seedRoles(): void {
  const db = getDb();
  const insert = db.prepare(
    'INSERT OR IGNORE INTO roles (name, description, permissions, isSystem) VALUES (?, ?, ?, ?)'
  );

  for (const role of DEFAULT_ROLES) {
    insert.run(role.name, role.description, JSON.stringify(role.permissions), role.isSystem);
  }
}

function seedDefaultAdmin(): void {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existing) return;

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  db.prepare(
    'INSERT INTO users (id, username, passwordHash, role) VALUES (?, ?, ?, ?)'
  ).run(crypto.randomUUID(), 'admin', passwordHash, 'super_admin');

  console.log('Default admin created: admin /', adminPassword);
}

async function readJsonSafe<T>(filename: string): Promise<T[]> {
  try {
    const content = await fs.readFile(path.join(DATA_DIR, filename), 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function readSingleJsonSafe<T>(filename: string): Promise<T | null> {
  try {
    const content = await fs.readFile(path.join(DATA_DIR, filename), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function migrateJsonData(): Promise<void> {
  const db = getDb();

  // Check if data already exists
  const productCount = (db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number }).c;
  if (productCount > 0) return;

  console.log('Migrating JSON data to SQLite...');

  // Migrate products
  const products = await readJsonSafe<{
    slug: string; name: string; model: string; category: string;
    tags: string[]; seats: number; loadCapacity: number; range: number;
    maxSpeed: number; battery: { type: string; capacity: string; options: string[] };
    images: string[]; specs: Record<string, string>; certifications: string[];
    pdfPath: string; description: string; featured: boolean; sortOrder: number;
  }>('products.json');

  if (products.length > 0) {
    const insert = db.prepare(`
      INSERT INTO products (slug, name, model, category, tags, seats, loadCapacity, range, maxSpeed,
        batteryType, batteryCapacity, batteryOptions, images, specs, certifications, pdfPath, description, featured, sortOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of products) {
      insert.run(
        p.slug, p.name, p.model, p.category,
        JSON.stringify(p.tags), p.seats, p.loadCapacity, p.range, p.maxSpeed,
        p.battery.type, p.battery.capacity, JSON.stringify(p.battery.options),
        JSON.stringify(p.images), JSON.stringify(p.specs), JSON.stringify(p.certifications),
        p.pdfPath, p.description, p.featured ? 1 : 0, p.sortOrder
      );
    }
    console.log(`  Migrated ${products.length} products`);
  }

  // Migrate solutions
  const solutions = await readJsonSafe<{
    slug: string; title: string; subtitle: string; description: string;
    image: string; icon: string; features: string[]; relatedProducts: string[];
  }>('solutions.json');

  if (solutions.length > 0) {
    const insert = db.prepare(`
      INSERT INTO solutions (slug, title, subtitle, description, image, icon, features, relatedProducts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of solutions) {
      insert.run(s.slug, s.title, s.subtitle, s.description, s.image, s.icon,
        JSON.stringify(s.features), JSON.stringify(s.relatedProducts));
    }
    console.log(`  Migrated ${solutions.length} solutions`);
  }

  // Migrate FAQ
  const faqs = await readJsonSafe<{ id: string; question: string; answer: string; category: string }>('faq.json');
  if (faqs.length > 0) {
    const insert = db.prepare('INSERT INTO faq (id, question, answer, category) VALUES (?, ?, ?, ?)');
    for (const f of faqs) {
      insert.run(f.id, f.question, f.answer, f.category);
    }
    console.log(`  Migrated ${faqs.length} FAQs`);
  }

  // Migrate blog posts
  const posts = await readJsonSafe<{
    slug: string; title: string; excerpt: string; content: string;
    image: string; author: string; date: string; tags: string[]; readTime: number;
  }>('blog.json');

  if (posts.length > 0) {
    const insert = db.prepare(`
      INSERT INTO blog_posts (slug, title, excerpt, content, image, author, date, tags, readTime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of posts) {
      insert.run(p.slug, p.title, p.excerpt, p.content, p.image, p.author, p.date,
        JSON.stringify(p.tags), p.readTime);
    }
    console.log(`  Migrated ${posts.length} blog posts`);
  }

  // Migrate clients
  const clients = await readJsonSafe<{ name: string; logo: string }>('clients.json');
  if (clients.length > 0) {
    const insert = db.prepare('INSERT INTO clients (name, logo) VALUES (?, ?)');
    for (const c of clients) {
      insert.run(c.name, c.logo);
    }
    console.log(`  Migrated ${clients.length} clients`);
  }

  // Migrate company
  const company = await readSingleJsonSafe<{
    name: string; tagline: string; description: string; founded: number;
    employees: string; exportCountries: number; annualOutput: string;
    factoryArea: string; address: string; phone: string; email: string;
    whatsapp: string; social: { facebook?: string; linkedin?: string; youtube?: string; instagram?: string };
  }>('company.json');

  if (company) {
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
    console.log('  Migrated company info');
  }

  // Migrate inquiries
  const inquiries = await readJsonSafe<{
    id: string; name: string; company: string; email: string; phone: string;
    country: string; interestedProducts: string[]; message: string;
    timestamp: string; read: boolean; note: string;
  }>('inquiries.json');

  if (inquiries.length > 0) {
    const insert = db.prepare(`
      INSERT INTO inquiries (id, name, company, email, phone, country, interestedProducts, message, timestamp, read, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const i of inquiries) {
      insert.run(i.id, i.name, i.company, i.email, i.phone, i.country,
        JSON.stringify(i.interestedProducts), i.message, i.timestamp, i.read ? 1 : 0, i.note || '');
    }
    console.log(`  Migrated ${inquiries.length} inquiries`);
  }

  // Migrate dealer applications
  const dealers = await readJsonSafe<{
    id: string; company: string; contactPerson: string; email: string; phone: string;
    country: string; existingBusiness: string; annualVolume: string; message: string;
    timestamp: string; read: boolean; note: string;
  }>('dealer-applications.json');

  if (dealers.length > 0) {
    const insert = db.prepare(`
      INSERT INTO dealer_applications (id, company, contactPerson, email, phone, country, existingBusiness, annualVolume, message, timestamp, read, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const d of dealers) {
      insert.run(d.id, d.company, d.contactPerson, d.email, d.phone, d.country,
        d.existingBusiness, d.annualVolume, d.message, d.timestamp, d.read ? 1 : 0, d.note || '');
    }
    console.log(`  Migrated ${dealers.length} dealer applications`);
  }

  // Migrate users
  const users = await readJsonSafe<{
    id: string; username: string; passwordHash: string; role: string; createdAt: string;
  }>('users.json');

  if (users.length > 0) {
    const insert = db.prepare(
      'INSERT OR IGNORE INTO users (id, username, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)'
    );
    for (const u of users) {
      insert.run(u.id, u.username, u.passwordHash, u.role || 'super_admin', u.createdAt);
    }
    console.log(`  Migrated ${users.length} users`);
  }

  console.log('Migration complete!');
}

export async function ensureDatabase(): Promise<void> {
  initDatabase();
  seedRoles();
  await migrateJsonData();
  seedDefaultAdmin();
}
