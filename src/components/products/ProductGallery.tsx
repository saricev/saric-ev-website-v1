'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getOptimizedUrl } from '@/lib/cloudinary-utils';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={getOptimizedUrl(images[selected])}
          alt={`${name} - Image ${selected + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                selected === index ? 'border-primary' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={getOptimizedUrl(img)}
                alt={`${name} - Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
