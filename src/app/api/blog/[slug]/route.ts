import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts, deleteBlogPost } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'blog:write');
    if ('error' in auth) return auth.error;

    const { slug } = await params;
    const data = await request.json();
    const posts = await getBlogPosts();
    const index = posts.findIndex((p) => p.slug === slug);
    if (index === -1) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    posts[index] = { ...posts[index], ...data };
    await saveBlogPosts(posts);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'blog:delete');
    if ('error' in auth) return auth.error;

    const { slug } = await params;
    const success = await deleteBlogPost(slug);
    if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
