// Utility for managing biology files from Vercel Blob
const BLOB_BASE_URL = 'https://zovqflkgqlje1zvz.public.blob.vercel-storage.com/biology';

export const BIOLOGY_FILES = [
  'Animal anatomy physiology intermediate.pdf',
  'Basic Cell Biology.pdf',
  'Basic Vacademi Biology, Biochem.pdf',
  'Biochemistry intermediate.pdf',
  'Biochemistry Vacademi Advanced.pdf',
  'Biodiversity Advanced.pdf',
  'cell biology intermediate new.pdf',
  'Cell biology Intermediate.pdf',
  'Ecology&Ethology Intermediate.pdf',
  'Evolution Basic.pdf',
  'Genetics basic.pdf',
  'Genetics intermediate too.pdf',
  'Genetics intermediate.pdf',
  'INtermediate biochem Vacademi.pdf',
  'Plant anatomy, physiology intermediate.pdf',
];

export function getBiologyFileUrl(filename: string): string {
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return '';
  }
  
  return `${BLOB_BASE_URL}/${encodeURIComponent(filename)}`;
}

export async function getBiologyFilesList(): Promise<string[]> {
  return BIOLOGY_FILES;
}

export async function getBiologyFileBlob(filename: string): Promise<Buffer | null> {
  try {
    // Validate filename
    if (filename.includes('..') || filename.includes('/')) {
      return null;
    }

    const url = getBiologyFileUrl(filename);
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching biology file:', error);
    return null;
  }
}
