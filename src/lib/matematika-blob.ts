export const MATEMATIKA_DRIVE_URL =
  "https://drive.google.com/drive/folders/1hipS28w24XxdWFihQnRbOmn5RiUC-UYy?usp=sharing"

export async function getMatematikaDriveUrl(): Promise<string> {
  return MATEMATIKA_DRIVE_URL
}

export const MATEMATIKA_FILES: string[] = []

export async function getMatematikaFilesList(): Promise<string[]> {
  return []
}

export async function getMatematikaFileBlob(): Promise<null> {
  return null
}