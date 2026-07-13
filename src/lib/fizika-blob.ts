// Utility for managing fizika files from Vercel Blob
const BLOB_BASE_URL = 'https://zovqflkgqlje1zvz.public.blob.vercel-storage.com/fizika';

export const FIZIKA_FILES: string[] = [
  // Добавьте файлы позже
];

export function getFizikaFileUrl(filename: string): string {
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return '';
  }

  return `${BLOB_BASE_URL}/${encodeURIComponent(filename)}`;
}

export async function getFizikaFilesList(): Promise<string[]> {
  return FIZIKA_FILES;
}

export async function getFizikaFileBlob(filename: string): Promise<Buffer | null> {
  try {
    // Validate filename
    if (filename.includes('..') || filename.includes('/')) {
      return null;
    }

    const url = getFizikaFileUrl(filename);
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching fizika file:', error);
    return null;
  }
}
