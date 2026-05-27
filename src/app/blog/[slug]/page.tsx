import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Container from '@/components/layout/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import BlogContent from '@/components/blog/BlogContent';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <Container>
        <Breadcrumb
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

        <article className="max-w-3xl mx-auto">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{post.title}</h1>
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </span>
            <span>{post.date}</span>
          </div>

          <div className="mt-10">
            <BlogContent content={post.content} />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </article>
      </Container>
    </section>
  );
}
