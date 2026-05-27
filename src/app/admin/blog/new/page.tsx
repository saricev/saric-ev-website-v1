import BlogForm from '@/components/admin/BlogForm';

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Blog Post</h1>
      <BlogForm mode="create" />
    </div>
  );
}
