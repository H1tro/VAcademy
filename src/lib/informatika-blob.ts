import fs from "fs"
import path from "path"

const LOCAL_DIR = path.join(process.cwd(), "public", "informatika")

export const INFORMATIKA_FILES: string[] = [
  'Азы программирования (Начало).pdf',
  'Система и сети (Середина).pdf',
  'Парадигмы(Конец).pdf',
]

export function getInformatikaFileUrl(filename: string): string {
  if (filename.includes('..') || filename.includes('/')) {
    return ''
  }
  return `/informatika/${encodeURIComponent(filename)}`
}

export async function getInformatikaFilesList(): Promise<string[]> {
  return INFORMATIKA_FILES
}

export async function getInformatikaFileBlob(filename: string): Promise<Buffer | null> {
  try {
    if (filename.includes('..') || filename.includes('/')) {
      return null
    }

    const filePath = path.join(LOCAL_DIR, filename)
    if (!fs.existsSync(filePath)) {
      return null
    }

    return fs.readFileSync(filePath)
  } catch (error) {
    console.error('Error reading informatika file:', error)
    return null
  }
}
