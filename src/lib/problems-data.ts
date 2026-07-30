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

export const problemsData: Problem[] = [
  {
    id: "math-001",
    title: "Сумма чисел",
    description: "Найдите сумму первых 100 натуральных чисел.",
    subject: "mathematics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "5050",
    explanation: "Используем формулу суммы арифметической прогрессии: S = n(n+1)/2 = 100*101/2 = 5050",
  },
  {
    id: "math-002",
    title: "Простое число",
    description: "Является ли число 97 простым? Ответьте 'да' или 'нет'.",
    subject: "mathematics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "да",
    explanation: "97 делится только на 1 и на себя, поэтому это простое число.",
  },
  {
    id: "phys-001",
    title: "Свободное падение",
    description: "Тело падает с высоты 45 м. Сколько секунд длится падение? Ускорение g = 10 м/с². Ответ округлите до целого.",
    subject: "physics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "3",
    explanation: "h = gt²/2 → t = √(2h/g) = √(90/10) = √9 = 3 секунды.",
  },
  {
    id: "phys-002",
    title: "Закон Ома",
    description: "Через резистор 10 Ом течёт ток 2 А. Какое напряжение на резисторе?",
    subject: "physics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "20",
    explanation: "U = I·R = 2·10 = 20 В.",
  },
  {
    id: "inf-001",
    title: "Бинарный поиск",
    description: "Сколько сравнений нужно в худшем случае для бинарного поиска в массиве из 16 элементов?",
    subject: "informatics",
    difficulty: "medium",
    type: "text",
    correctAnswer: "4",
    explanation: "log₂(16) = 4 сравнения.",
  },
  {
    id: "chem-001",
    title: "Молярная масса",
    description: "Чему равна молярная масса воды H₂O? Ответ округлите до целого.",
    subject: "chemistry",
    difficulty: "easy",
    type: "text",
    correctAnswer: "18",
    explanation: "2·1 + 16 = 18 г/моль.",
  },
  {
    id: "bio-001",
    title: "Клеточное дыхание",
    description: "Какой газ поглощается при фотосинтезе?",
    subject: "biology",
    difficulty: "easy",
    type: "choice",
    options: ["Кислород", "Углекислый газ", "Азот", "Водород"],
    correctAnswer: "Углекислый газ",
    explanation: "При фотосинтезе растения поглощают CO₂ и выделяют O₂.",
  },
]

const cf = (c: number, i: string, t: string): ExternalProblem => ({
  id: `cf-${c}${i}`,
  platform: "codeforces",
  externalId: `${c}/${i}`,
  title: t,
  subject: "informatics",
  difficulty: "easy",
  url: `https://codeforces.com/problemset/problem/${c}/${i}`,
})

export const externalProblemsData: ExternalProblem[] = [
  cf(1, "A", "Theatre Square"),
  cf(4, "A", "Watermelon"),
  cf(41, "A", "Translation"),
  cf(50, "A", "Domino piling"),
  cf(58, "A", "Chat room"),
  cf(59, "A", "Word"),
  cf(61, "A", "Ultra-Fast Mathematician"),
  cf(69, "A", "Young Physicist"),
  cf(71, "A", "Way Too Long Words"),
  cf(80, "A", "Panoramix's Prediction"),
  cf(96, "A", "Football"),
  cf(112, "A", "Petya and Strings"),
  cf(116, "A", "Tram"),
  cf(118, "A", "String Task"),
  cf(133, "A", "HQ9+"),
  cf(151, "A", "Soft Drinking"),
  cf(158, "A", "Next Round"),
  cf(160, "A", "Twins"),
  cf(200, "B", "Drinks"),
  cf(228, "A", "Is your horseshoe on the other hoof?"),
  cf(231, "A", "Team"),
  cf(236, "A", "Boy or Girl"),
  cf(263, "A", "Beautiful Matrix"),
  cf(271, "A", "Beautiful Year"),
  cf(281, "A", "Word Capitalization"),
  cf(282, "A", "Bit++"),
  cf(318, "A", "Even Odds"),
  cf(339, "A", "Helpful Maths"),
  cf(405, "A", "Gravity Flip"),
  cf(467, "A", "George and Accommodation"),
  cf(469, "A", "I Wanna Be the Guy"),
  cf(479, "A", "Expression"),
  cf(486, "A", "Calculating Function"),
  cf(546, "A", "Soldier and Bananas"),
  cf(617, "A", "Elephant"),
  cf(677, "A", "Vanya and Fence"),
  cf(703, "A", "Mishka and Game"),
  cf(705, "A", "Hulk"),
  cf(734, "A", "Anton and Danik"),
  cf(785, "A", "Anton and Polyhedrons"),
  cf(791, "A", "Bear and Big Brother"),
  cf(977, "A", "Wrong Subtraction"),
  cf(1030, "A", "In Search of an Easy Problem"),
  cf(1669, "A", "Division?"),
  cf(1703, "A", "YES or YES?"),
  cf(1772, "A", "A+B?"),
  cf(1807, "A", "Plus or Minus"),
  cf(1829, "A", "Love Story"),
  cf(1915, "A", "Odd One Out"),
  cf(1950, "A", "Stair, Peak, or Neither?"),
  cf(1971, "A", "My First Sorting Problem"),
  cf(1999, "A", "A+B Again?"),
  cf(2010, "B", "Three Brothers"),
  cf(2052, "M", "Managing Cluster"),
  cf(2167, "A", "Square?"),
  cf(2167, "B", "Your Name"),
  cf(2185, "B", "Prefix Max"),
]
