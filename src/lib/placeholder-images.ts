export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const BLOB_URL = 'https://zovqflkgqlje1zvz.public.blob.vercel-storage.com/placeholder-images.json';

let cachedImages: ImagePlaceholder[] | null = null;

export async function getPlaceHolderImages(): Promise<ImagePlaceholder[]> {
  // Return cached images if available
  if (cachedImages !== null) {
    return cachedImages;
  }

  try {
    // Fetch from Vercel Blob
    const response = await fetch(BLOB_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json();
    cachedImages = data.placeholderImages || [];
    return cachedImages;
  } catch (error) {
    console.error('Failed to fetch from Vercel Blob:', error);
    return [];
  }
}

// For backward compatibility with synchronous usage
export const PlaceHolderImages: ImagePlaceholder[] = [];
