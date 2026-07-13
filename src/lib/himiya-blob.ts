// Utility for managing himiya files from Vercel Blob
const BLOB_BASE_URL = 'https://zovqflkgqlje1zvz.public.blob.vercel-storage.com/himiya';

export const HIMIYA_FILES: string[] = [
  // Добавьте файлы позже
];

export function getHimiyaFileUrl(filename: string): string {
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return '';
  }

  return `${BLOB_BASE_URL}/${encodeURIComponent(filename)}`;
}

export async function getHimiyaFilesList(): Promise<string[]> {
  return HIMIYA_FILES;
}

export async function getHimiyaFileBlob(filename: string): Promise<Buffer | null> {
  try {
    // Validate filename
    if (filename.includes('..') || filename.includes('/')) {
      return null;
    }

    const url = getHimiyaFileUrl(filename);
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching himiya file:', error);
    return null;
  }
}
