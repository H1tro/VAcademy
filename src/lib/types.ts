export type SubjectKey =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "informatics"
  | "biology"

export type SubjectProgress = Record<SubjectKey, number>

export interface UserProfile {
  uid?: string
  displayName?: string
  email?: string
  photoURL?: string
  goal?: string
  school?: string
  grade?: string
  about?: string
  streakDays?: number
  maxStreakDays?: number
  tasksSolved?: number
  studyTimeMinutes?: number
  totalScore?: number
  solvedProblems?: string[]
  subjectProgress?: Partial<SubjectProgress>
  createdAt?: string
  updatedAt?: string
}

export interface AppConfig {
  aiEnabled: boolean
}

export interface LeaderboardUser {
  uid: string
  displayName: string
  photoURL?: string
  school?: string
  streakDays?: number
  tasksSolved: number
  totalScore: number
  solvedSubjects?: Partial<Record<SubjectKey, number>>
}

export interface TestCard {
  id: string
  title: string
  subject: SubjectKey
  description: string
  durationMinutes: number
  questionCount: number
  href: string
}

export type OlympiadStatus = "registration" | "ongoing" | "completed"

export interface Olympiad {
  id: string
  title: string
  subject: SubjectKey
  dates: string
  location?: string
  fee?: string
  description?: string
  status: OlympiadStatus
  type?: string
  url?: string
}
