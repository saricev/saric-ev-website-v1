'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlogDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this blog post?')) return;
    const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  return (
    <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
