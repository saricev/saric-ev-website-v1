import { getDb } from './db';
import crypto from 'crypto';

const ALLOWED_TABLES = new Set([
  'products', 'solutions', 'faq', 'blog_posts', 'clients', 'company',
  'inquiries', 'dealer_applications', 'roles', 'users',
]);

function validateTable(table: string): void {
  if (!ALLOWED_TABLES.has(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
}

const COLUMN_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function validateColumn(name: string): void {
  if (!COLUMN_PATTERN.test(name)) {
    throw new Error(`Invalid column name: ${name}`);
  }
}

// Generic CRUD operations backed by SQLite

export async function readFromJson<T>(table: string): Promise<T[]> {
  validateTable(table);
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM ${table}`).all() as Record<string, unknown>[];
  return rows.map((row) => {
    // Parse JSON string fields
    const parsed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          parsed[key] = JSON.parse(value);
        } catch {
          parsed[key] = value;
        }
      } else {
        parsed[key] = value;
      }
    }
    return parsed as unknown as T;
  });
}

export async function writeToJson<T>(table: string, data: T[]): Promise<void> {
  validateTable(table);
  const db = getDb();
  // This is a full replace - used rarely
  db.prepare(`DELETE FROM ${table}`).run();
  if (data.length === 0) return;

  const firstItem = data[0] as Record<string, unknown>;
  const columns = Object.keys(firstItem);
  columns.forEach(validateColumn);
  const placeholders = columns.map(() => '?').join(', ');
  const insert = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);

  for (const item of data) {
    const values = columns.map((col) => {
      const val = (item as Record<string, unknown>)[col];
      if (typeof val === 'object' && val !== null) return JSON.stringify(val);
      return val;
    });
    insert.run(...values);
  }
}

export async function saveToJson<T extends Record<string, unknown>>(table: string, data: T): Promise<string> {
  validateTable(table);
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const itemWithMeta = { ...data, id, timestamp: now, read: 0, note: '' };
  const columns = Object.keys(itemWithMeta);
  columns.forEach(validateColumn);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map((col) => {
    const val = itemWithMeta[col];
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return val;
  });

  db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`).run(...values);
  return id;
}

export async function updateInJson<T extends { id: string }>(table: string, id: string, updates: Partial<T>): Promise<boolean> {
  validateTable(table);
  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(updates)) {
    if (key === 'id') continue;
    validateColumn(key);
    sets.push(`${key} = ?`);
    values.push(typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
  }

  if (sets.length === 0) return false;
  values.push(id);

  const result = db.prepare(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return result.changes > 0;
}

export async function deleteFromJson<T extends { id: string }>(table: string, id: string): Promise<boolean> {
  validateTable(table);
  const db = getDb();
  const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return result.changes > 0;
}

export async function exportToCsv<T extends Record<string, unknown>>(table: string): Promise<string> {
  validateTable(table);
  const items = await readFromJson<T>(table);
  if (items.length === 0) return '';

  const headers = Object.keys(items[0]);
  const rows = items.map((item) =>
    headers.map((h) => {
      const val = item[h];
      const str = Array.isArray(val) ? val.join('; ') : String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
