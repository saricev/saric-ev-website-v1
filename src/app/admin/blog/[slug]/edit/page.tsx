import { notFound } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';
import { getBlogPostBySlug } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit: {post.title}</h1>
      <BlogForm post={post} mode="edit" />
    </div>
  );
}
