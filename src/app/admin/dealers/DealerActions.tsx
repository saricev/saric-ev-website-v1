'use client';

import { Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DealerActions({ id }: { id: string }) {
  const router = useRouter();

  const markRead = async () => {
    await fetch(`/api/dealers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    router.refresh();
  };

  const deleteDealer = async () => {
    if (!confirm('Delete this application?')) return;
    const res = await fetch(`/api/dealers/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button onClick={markRead} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Mark as read">
        <Eye className="w-4 h-4" />
      </button>
      <button onClick={deleteDealer} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
