/**
 * Cloudinary URL optimization utilities.
 * Pure string manipulation — safe for client components.
 */

export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  if (!url.includes('cloudinary.com')) return url;

  const transformations: string[] = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  transformations.push(`q_${options.quality || 'auto'}`);
  transformations.push('f_auto');
  transformations.push('c_limit');
  transformations.push('dpr_auto');

  const transformStr = transformations.join(',');
  return url.replace('/upload/', `/upload/${transformStr}/`);
}
