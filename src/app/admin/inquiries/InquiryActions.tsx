'use client';

import { Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InquiryActions({ id }: { id: string }) {
  const router = useRouter();

  const markRead = async () => {
    await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    router.refresh();
  };

  const deleteInquiry = async () => {
    if (!confirm('Delete this inquiry?')) return;
    const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button onClick={markRead} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Mark as read">
        <Eye className="w-4 h-4" />
      </button>
      <button onClick={deleteInquiry} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
