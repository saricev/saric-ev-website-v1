import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { getOptimizedUrl } from '@/lib/cloudinary-utils';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="relative aspect-[16/9] bg-gray-100">
        <Image
          src={getOptimizedUrl(post.image)}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} min read
          </div>
          <span className="text-xs text-gray-400">{post.date}</span>
        </div>
        <div className="mt-3 flex items-center text-primary text-sm font-medium">
          Read More
          <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
