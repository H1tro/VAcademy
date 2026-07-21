import fs from 'fs'
import path from 'path'

const LOCAL_DIR = path.join(process.cwd(), 'public', 'matematika')
const BLOB_BASE_URL = 'https://zovqflkgqlje1zvz.public.blob.vercel-storage.com/matematika'

function isEdgeRuntime(): boolean {
  return typeof process === 'undefined' || !process.cwd
}

export const MATEMATIKA_FILES: string[] = [
  // Секция 1 — Комбинаторика
  'section1/А.Ковальджи-Как решают нестандартные задачи.pdf',
  'section1/Ленинградские математические кружки.pdf',
  'section1/kurs_matematika_10.pdf',
  'section1/Techniques in Combinatorics 3.1.1 (1) — копия.pdf',
  'section1/The Very Basic Note in Combinatorics 1.5.1 (1).pdf',
  'section1/The Very Standard Tricks in Combinatorics 1.4.1 (1).pdf',

  // Секция 2 — Теория чисел
  'section2/А.Ковальджи-Как решают нестандартные задачи.pdf',
  'section2/Алфутова-Алгебра и теория чисел.pdf',
  'section2/Делимость и простые числа.pdf',
  'section2/Ленинградские математические кружки.pdf',
  'section2/Alfutova_18-18.pdf',
  'section2/Elementary Number Theory.pdf',
  'section2/kurs_matematika.pdf',
  'section2/Sedrakyan-Inequalities.pdf',
  'section2/The Very Basic Note in Number Theory.pdf',
  'section2/The Very Standard Tricks in Number Theory.pdf',

  // Секция 3 — Алгебра
  'section3/Алфутова-Алгебра и теория чисел.pdf',
  'section3/Делимость и простые числа.pdf',
  'section3/Прасолов-Алгебра.pdf',
  'section3/Прасолов-Планиметрия.pdf',
  'section3/Alfutova_18-18.pdf',
  'section3/Balayan.pdf',
  'section3/Coordinate Geometry.pdf',
  'section3/Definitions and Facts in Plane Geometry 3.2 — копия.pdf',
  'section3/Elementary Number Theory.pdf',
  'section3/euclidean-geometry-in-mathematical-olympiads.pdf',
  'section3/Functions.pdf',
  'section3/Geometry in the Complex Plane.pdf',
  'section3/Inequalities.pdf',
  'section3/Inversion.pdf',
  'section3/Sedrakyan-Inequalities.pdf',
  'section3/Techniques in Combinatorics.pdf',
  'section3/The Very Basic Note in Algebra.pdf',
  'section3/The Very Basic Note in Combinatorics.pdf',
  'section3/The Very Standard Tricks in Algebra.pdf',

  // Секция 4 — Геометрия
  'section4/Alfutova_18-18.pdf',
  'section4/Balayan.pdf',
  'section4/Calculating Geometry.pdf',
  'section4/Coordinate Geometry.pdf',
  'section4/Definitions and Facts in Plane Geometry.pdf',
  'section4/euclidean-geometry-in-mathematical-olympiads.pdf',
  'section4/Geometry in the Complex Plane (1).pdf',
  'section4/Geometry in the Complex Plane.pdf',
  'section4/Inequalities.pdf',
  'section4/Inversion (1).pdf',
  'section4/Inversion.pdf',
  'section4/Projective Geometry.pdf',
  'section4/Pure Geometry with Directed Angles.pdf',
  'section4/The Very Standard Tricks in Geometry.pdf',
  'section4/Прасолов-Планиметрия.pdf',
]

export function getMatematikaFileUrl(filename: string): string {
  if (filename.includes('..') || filename.includes('\\')) {
    return ''
  }
  return `/matematika/${filename}`
}

export async function getMatematikaFilesList(): Promise<string[]> {
  return MATEMATIKA_FILES
}

export async function getMatematikaFileBlob(filename: string): Promise<Buffer | null> {
  try {
    if (filename.includes('..') || filename.includes('\\')) {
      return null
    }

    // Local filesystem (Node.js runtime)
    if (!isEdgeRuntime()) {
      const filePath = path.join(LOCAL_DIR, filename)
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath)
      }
    }

    // Fallback to Vercel Blob
    const blobUrl = `${BLOB_BASE_URL}/${filename.split('/').map(encodeURIComponent).join('/')}`
    const response = await fetch(blobUrl)

    if (!response.ok) {
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('Error reading matematika file:', error)
    return null
  }
}
