export const slugify = (value = '') => {
  // turn non‑string values into an empty string
  const str = String(value || '');

  return encodeURIComponent(
    str
      .toLowerCase()            // 1. lowercase everything
      .trim()                   // 2. remove leading / trailing spaces
      .replace(/[^\w\s-]/g, '') // 3. drop non‑word / non‑space / non‑hyphen chars
      .replace(/\s+/g, '-')     // 4. spaces → hyphens
  );
};
