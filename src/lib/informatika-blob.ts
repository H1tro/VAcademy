// Utility for managing informatika files from Vercel Blob
const BLOB_BASE_URL = 'https://zovqflkgqlje1zvz.public.blob.vercel-storage.com/informatika';

export const INFORMATIKA_FILES: string[] = [
  // Добавьте файлы позже
];

export function getInformatikaFileUrl(filename: string): string {
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return '';
  }

  return `${BLOB_BASE_URL}/${encodeURIComponent(filename)}`;
}

export async function getInformatikaFilesList(): Promise<string[]> {
  return INFORMATIKA_FILES;
}

export async function getInformatikaFileBlob(filename: string): Promise<Buffer | null> {
  try {
    // Validate filename
    if (filename.includes('..') || filename.includes('/')) {
      return null;
    }

    const url = getInformatikaFileUrl(filename);
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching informatika file:', error);
    return null;
  }
}
