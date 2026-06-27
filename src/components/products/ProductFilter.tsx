'use client';

import { categories } from '@/data/products';

interface ProductFilterProps {
  selectedCategory: string;
  selectedSeats: string;
  onCategoryChange: (value: string) => void;
  onSeatsChange: (value: string) => void;
}

const seatOptions = [
  { value: '', label: 'All Seats' },
  { value: '2', label: '2 Seats' },
  { value: '4', label: '4 Seats' },
  { value: '8', label: '8 Seats' },
  { value: '11', label: '11 Seats' },
];

export default function ProductFilter({
  selectedCategory,
  selectedSeats,
  onCategoryChange,
  onSeatsChange,
}: ProductFilterProps) {
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Product filters">
      {/* Category filters */}
      <button
        onClick={() => onCategoryChange('')}
        aria-pressed={selectedCategory === ''}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedCategory === ''
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          aria-pressed={selectedCategory === cat.id}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === cat.id
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}

      {/* Divider */}
      <div className="w-px bg-gray-300 mx-1 hidden sm:block" aria-hidden="true" />

      {/* Seat filters */}
      {seatOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSeatsChange(opt.value)}
          aria-pressed={selectedSeats === opt.value}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedSeats === opt.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
