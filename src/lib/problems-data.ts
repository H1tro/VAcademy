export type ProblemSubject = 'mathematics' | 'physics' | 'informatics' | 'chemistry' | 'biology'
export type ProblemDifficulty = 'easy' | 'medium' | 'hard'
export type ProblemType = 'text' | 'choice'

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

export const problemsData: Problem[] = []
