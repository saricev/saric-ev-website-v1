'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductFilter from '@/components/products/ProductFilter';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';

export default function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [seats, setSeats] = useState(searchParams.get('seats') ?? '');

  // Sync state to URL on filter change
  const updateURL = useCallback((cat: string, s: string) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (s) params.set('seats', s);
    const qs = params.toString();
    const url = qs ? `/products?${qs}` : '/products';
    window.history.replaceState(null, '', url);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    updateURL(value, seats);
  }, [seats, updateURL]);

  const handleSeatsChange = useCallback((value: string) => {
    setSeats(value);
    updateURL(category, value);
  }, [category, updateURL]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (seats && p.seats !== parseInt(seats)) return false;
      return true;
    });
  }, [category, seats, products]);

  return (
    <>
      <div className="mb-8">
        <ProductFilter
          selectedCategory={category}
          selectedSeats={seats}
          onCategoryChange={handleCategoryChange}
          onSeatsChange={handleSeatsChange}
        />
      </div>
      {filtered.length > 0 ? (
        <ProductGrid products={filtered} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No products match your filters.</p>
          <button
            onClick={() => { setCategory(''); setSeats(''); updateURL('', ''); }}
            className="text-primary hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
