import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getBlogPosts } from '@/lib/data';
import BlogDeleteButton from './BlogDeleteButton';
import PermissionGate from '@/components/admin/PermissionGate';

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <PermissionGate permission="blog:write">
          <Link href="/admin/blog/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            <Plus className="w-4 h-4" />
            Add Post
          </Link>
        </PermissionGate>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <PermissionGate permission="blog:write">
                      <Link href={`/admin/blog/${post.slug}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </PermissionGate>
                    <PermissionGate permission="blog:delete">
                      <BlogDeleteButton slug={post.slug} />
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
