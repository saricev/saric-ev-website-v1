import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { getOptimizedUrl } from '@/lib/cloudinary-utils';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={getOptimizedUrl(product.images[0])}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="primary">{product.model}</Badge>
          <Badge>{product.seats} Seats</Badge>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <span>{product.range} km</span>
          <span className="text-gray-300">|</span>
          <span>{product.maxSpeed} km/h</span>
          <span className="text-gray-300">|</span>
          <span>{product.loadCapacity} kg</span>
        </div>
        <div className="mt-4 flex items-center text-primary text-sm font-medium">
          View Details
          <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
