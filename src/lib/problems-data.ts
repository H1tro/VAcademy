export type ProblemSubject = 'mathematics' | 'physics' | 'informatics' | 'chemistry' | 'biology'
export type ProblemDifficulty = 'easy' | 'medium' | 'hard'
export type ProblemType = 'text' | 'choice'

export type ExternalPlatform = 'codeforces' | 'leetcode'

export interface Problem {
  id: string
  title: string
  description: string
  subject: ProblemSubject
  difficulty: ProblemDifficulty
  type: ProblemType
  options?: string[]
  correctAnswer: string
  explanation: string
}

export interface ExternalProblem {
  id: string
  platform: ExternalPlatform
  externalId: string
  title: string
  subject: ProblemSubject
  difficulty: ProblemDifficulty
  url: string
}

export const DIFFICULTY_POINTS: Record<ProblemDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
}

export function isExternalProblem(
  p: Problem | ExternalProblem,
): p is ExternalProblem {
  return 'platform' in p
}

export const problemsData: Problem[] = []

export const externalProblemsData: ExternalProblem[] = []
