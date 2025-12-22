/**
 * Enhances avatar URLs to request higher resolution images where possible.
 * Particularly useful for social auth providers like Google that default to small sizes (e.g., 96px).
 * 
 * @param url The original avatar URL
 * @param size The desired size in pixels (default: 1024)
 * @returns The high-resolution URL
 */
export const getHighResAvatarUrl = (url: string | undefined | null, size: number = 1024): string => {
    if (!url) return "";

    try {
        // Handle Google User Content URLs (lh3.googleusercontent.com, etc.)
        // Common formats: 
        // .../photo.jpg?sz=50
        // .../s96-c/photo.jpg
        // ...=s96-c
        if (url.includes('googleusercontent.com')) {
            // If it has a query parameter sz=... replace it
            if (url.includes('?sz=') || url.includes('&sz=')) {
                return url.replace(/sz=\d+/, `sz=${size}`);
            }

            // If it ends with =s... parameters
            if (url.match(/=s\d+(-c)?$/)) {
                return url.replace(/=s\d+(-c)?$/, `=s${size}-c`);
            }

            // If it has /s.../ path segment
            if (url.match(/\/s\d+(-c)?\//)) {
                return url.replace(/\/s\d+(-c)?\//, `/s${size}-c/`);
            }

            // If no size param found but it's a google url, try appending it? 
            // Often google urls without params default to original size, but sometimes small.
            // Safer to rely on standard patterns.
            return url;
        }

        return url;
    } catch (error) {
        console.error("Error processing avatar URL:", error);
        return url;
    }
};
