import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

const JWT_SECRET_VALUE = process.env.JWT_SECRET;
if (!JWT_SECRET_VALUE && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE || 'saric-ev-dev-only-secret');

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export interface UserPayload {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}

export interface Role {
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

// User operations
export async function getUsers(): Promise<Omit<User, 'passwordHash'>[]> {
  const db = getDb();
  const rows = db.prepare('SELECT id, username, role, createdAt FROM users ORDER BY createdAt ASC').all() as Record<string, unknown>[];
  return rows.map((row) => ({
    id: row.id as string,
    username: row.username as string,
    role: row.role as string,
    createdAt: row.createdAt as string,
  }));
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    id: row.id as string,
    username: row.username as string,
    passwordHash: row.passwordHash as string,
    role: row.role as string,
    createdAt: row.createdAt as string,
  };
}

export async function createUser(username: string, password: string, role: string = 'viewer'): Promise<Omit<User, 'passwordHash'>> {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) throw new Error('Username already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare('INSERT INTO users (id, username, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)').run(id, username, passwordHash, role, now);

  return { id, username, role, createdAt: now };
}

export async function updateUser(id: string, updates: Partial<{ username: string; password: string; role: string }>): Promise<boolean> {
  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  if (updates.username) {
    sets.push('username = ?');
    values.push(updates.username);
  }
  if (updates.password) {
    const passwordHash = await bcrypt.hash(updates.password, 10);
    sets.push('passwordHash = ?');
    values.push(passwordHash);
  }
  if (updates.role) {
    sets.push('role = ?');
    values.push(updates.role);
  }

  if (sets.length === 0) return false;
  values.push(id);

  const result = db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return result.changes > 0;
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = getDb();

  // Prevent deleting the last super_admin
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(id) as { role: string } | undefined;
  if (user?.role === 'super_admin') {
    const superAdminCount = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'super_admin'").get() as { c: number }).c;
    if (superAdminCount <= 1) {
      throw new Error('Cannot delete the last super admin');
    }
  }

  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
}

export async function verifyUser(username: string, password: string): Promise<User | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as Record<string, unknown> | undefined;
  if (!row) return null;

  const valid = await bcrypt.compare(password, row.passwordHash as string);
  if (!valid) return null;

  return {
    id: row.id as string,
    username: row.username as string,
    passwordHash: row.passwordHash as string,
    role: row.role as string,
    createdAt: row.createdAt as string,
  };
}

// Role operations
export async function getRoles(): Promise<Role[]> {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM roles ORDER BY isSystem DESC, name ASC').all() as Record<string, unknown>[];
  return rows.map((row) => ({
    name: row.name as string,
    description: row.description as string,
    permissions: JSON.parse(row.permissions as string || '[]'),
    isSystem: Boolean(row.isSystem),
  }));
}

export async function getRole(name: string): Promise<Role | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM roles WHERE name = ?').get(name) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    name: row.name as string,
    description: row.description as string,
    permissions: JSON.parse(row.permissions as string || '[]'),
    isSystem: Boolean(row.isSystem),
  };
}

export async function createRole(name: string, description: string, permissions: string[]): Promise<Role> {
  const db = getDb();
  const existing = db.prepare('SELECT name FROM roles WHERE name = ?').get(name);
  if (existing) throw new Error('Role already exists');

  db.prepare('INSERT INTO roles (name, description, permissions, isSystem) VALUES (?, ?, ?, 0)').run(name, description, JSON.stringify(permissions));

  return { name, description, permissions, isSystem: false };
}

export async function updateRole(name: string, updates: Partial<{ description: string; permissions: string[] }>): Promise<boolean> {
  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  if (updates.description !== undefined) {
    sets.push('description = ?');
    values.push(updates.description);
  }
  if (updates.permissions !== undefined) {
    sets.push('permissions = ?');
    values.push(JSON.stringify(updates.permissions));
  }

  if (sets.length === 0) return false;
  values.push(name);

  const result = db.prepare(`UPDATE roles SET ${sets.join(', ')} WHERE name = ?`).run(...values);
  return result.changes > 0;
}

export async function deleteRole(name: string): Promise<boolean> {
  const db = getDb();

  // Prevent deleting system roles
  const role = db.prepare('SELECT isSystem FROM roles WHERE name = ?').get(name) as { isSystem: number } | undefined;
  if (role?.isSystem) {
    throw new Error('Cannot delete system roles');
  }

  // Check if any users are using this role
  const usersWithRole = (db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get(name) as { c: number }).c;
  if (usersWithRole > 0) {
    throw new Error(`Cannot delete role: ${usersWithRole} users are assigned to it`);
  }

  const result = db.prepare('DELETE FROM roles WHERE name = ?').run(name);
  return result.changes > 0;
}

// Permission helpers
export async function getPermissions(roleName: string): Promise<string[]> {
  const db = getDb();
  const row = db.prepare('SELECT permissions FROM roles WHERE name = ?').get(roleName) as { permissions: string } | undefined;
  if (!row) return [];
  return JSON.parse(row.permissions);
}

export async function hasPermission(roleName: string, permission: string): Promise<boolean> {
  const permissions = await getPermissions(roleName);
  return permissions.includes(permission);
}

// Token operations
export async function createToken(user: User): Promise<string> {
  const permissions = await getPermissions(user.role);
  const payload: UserPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
    permissions,
  };

  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

// Default admin initialization
export async function initializeDefaultAdmin(): Promise<void> {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existing) return;

  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
  await createUser('admin', defaultPassword, 'super_admin');
  console.log('Default admin created. Username: admin, Password:', defaultPassword);
}
