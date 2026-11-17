export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(price, currency = 'USD') {
  const amount = Number(price || 0);
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export const RESOURCE_TYPES = ['ebook', 'video', 'article', 'course', 'guide'];
export const PRODUCT_CATEGORIES = ['power-bi', 'excel', 'tableau', 'ebook', 'other'];

export function prettify(value) {
  return String(value || '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
