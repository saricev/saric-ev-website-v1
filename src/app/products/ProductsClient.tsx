'use client';

import { useState, useMemo } from 'react';
import ProductFilter from '@/components/products/ProductFilter';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';

export default function ProductsClient({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('');
  const [seats, setSeats] = useState('');

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
          onCategoryChange={setCategory}
          onSeatsChange={setSeats}
        />
      </div>
      <ProductGrid products={filtered} />
    </>
  );
}
