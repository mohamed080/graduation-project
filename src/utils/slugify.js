export const slugify = (str) =>
    encodeURIComponent(
        str
            .toLowerCase()            // 1. lowercase everything
            .trim()                   // 2. remove leading / trailing spaces
            .replace(/[^\w\s-]/g, '') // 3. drop characters that aren't
            .replace(/\s+/g, '-')
    );
