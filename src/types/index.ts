export type ProductCategory = 'tourism' | 'patrol' | 'logistics' | 'utility';

export interface Product {
  slug: string;
  name: string;
  model: string;
  category: ProductCategory;
  tags: string[];
  seats: number;
  loadCapacity: number;
  range: number;
  maxSpeed: number;
  battery: {
    type: string;
    capacity: string;
    options: string[];
  };
  images: string[];
  specs: Record<string, string>;
  certifications: string[];
  pdfPath: string;
  description: string;
  featured: boolean;
  sortOrder: number;
}

export interface Solution {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  relatedProducts: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  readTime: number;
}

export interface Client {
  name: string;
  logo: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  founded: number;
  employees: string;
  exportCountries: number;
  annualOutput: string;
  factoryArea: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  social: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface ContactInquiry {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  interestedProducts: string[];
  message: string;
}

export interface DealerApplication {
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  existingBusiness: string;
  annualVolume: string;
  message: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
