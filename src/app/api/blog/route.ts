import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'blog:write');
    if ('error' in auth) return auth.error;

    const data = await request.json();
    const posts = await getBlogPosts();
    if (posts.find((p) => p.slug === data.slug)) {
      return NextResponse.json({ error: 'Slug already exists.' }, { status: 400 });
    }
    posts.push(data);
    await saveBlogPosts(posts);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
