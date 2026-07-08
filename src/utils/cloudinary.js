/**
 * Injects Cloudinary transformation parameters into a delivery URL.
 *
 * Input:  https://res.cloudinary.com/{cloud}/image/upload/{public_id}
 * Output: https://res.cloudinary.com/{cloud}/image/upload/f_auto,q_auto,w_{w},c_limit/{public_id}
 *
 * Safe to call with any URL — non-Cloudinary URLs are returned unchanged.
 */
export function cloudinaryUrl(url, { width = 800, crop = 'limit' } = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Already has transformations injected — don't double-inject
  if (url.includes('f_auto')) return url;

  // Split on /upload/ and insert transformation string after it
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const base = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);

  // Skip versioned segments like v1234567890/ — keep them after transforms
  return `${base}f_auto,q_auto,w_${width},c_${crop}/${rest}`;
}
