import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest news, guides, and insights about low-speed electric vehicles from Saric.',
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <Container>
        <Breadcrumb items={[{ label: 'Blog' }]} />
        <SectionTitle
          title="Blog & News"
          subtitle="Stay updated with the latest insights on electric vehicles and industry trends."
          centered={false}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
