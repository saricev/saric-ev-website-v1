import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/auth-edge';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    // Check if user has write permission for any content type
    const hasWriteAccess = user.permissions.some((p) =>
      p.endsWith(':write') && ['products', 'blog', 'solutions', 'company'].includes(p.split(':')[0])
    );
    if (!hasWriteAccess) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'saric';

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 10MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage(buffer, `saric/${folder}`);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (err) {
    logger.error('api/upload', 'Upload failed', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ error: 'No publicId provided.' }, { status: 400 });
    }

    const success = await deleteImage(publicId);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}
