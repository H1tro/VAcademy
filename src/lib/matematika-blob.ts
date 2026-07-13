// Utility for managing matematika files from Vercel Blob
const BLOB_BASE_URL = 'https://zovqflkgqlje1zvz.public.blob.vercel-storage.com/matematika';

export const MATEMATIKA_FILES: string[] = [
  // Добавьте файлы позже
];

export function getMatematikaFileUrl(filename: string): string {
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return '';
  }

  return `${BLOB_BASE_URL}/${encodeURIComponent(filename)}`;
}

export async function getMatematikaFilesList(): Promise<string[]> {
  return MATEMATIKA_FILES;
}

export async function getMatematikaFileBlob(filename: string): Promise<Buffer | null> {
  try {
    // Validate filename
    if (filename.includes('..') || filename.includes('/')) {
      return null;
    }

    const url = getMatematikaFileUrl(filename);
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching matematika file:', error);
    return null;
  }
}
