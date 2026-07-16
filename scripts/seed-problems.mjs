import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { config } from "dotenv"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, "..", ".env.local") })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
}

const problemsData = [
  {
    id: "math-1",
    title: "Сумма первых n чисел",
    description: "Найдите сумму первых 100 натуральных чисел: 1 + 2 + 3 + ... + 100.",
    subject: "mathematics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "5050",
    explanation: "Используем формулу суммы арифметической прогрессии: S = n(n+1)/2 = 100·101/2 = 5050.",
  },
  {
    id: "math-2",
    title: "Квадратное уравнение",
    description: "Решите уравнение x² − 5x + 6 = 0. Введите корни через запятую в порядке возрастания.",
    subject: "mathematics",
    difficulty: "medium",
    type: "text",
    correctAnswer: "2,3",
    explanation: "D = 25 − 24 = 1, корни: x₁ = (5−1)/2 = 2, x₂ = (5+1)/2 = 3.",
  },
  {
    id: "math-3",
    title: "Производная функции",
    description: "Найдите производную функции f(x) = 3x⁴ − 2x² + 7x − 5. Введите ответ в виде многочлена (например: 12x^3-4x+7).",
    subject: "mathematics",
    difficulty: "medium",
    type: "text",
    correctAnswer: "12x^3-4x+7",
    explanation: "f'(x) = 3·4x³ − 2·2x + 7 = 12x³ − 4x + 7.",
  },
  {
    id: "math-4",
    title: "Площадь треугольника",
    description: "Найдите площадь треугольника со сторонами 13, 14, 15.",
    subject: "mathematics",
    difficulty: "hard",
    type: "text",
    correctAnswer: "84",
    explanation: "По формуле Герона: p = (13+14+15)/2 = 21, S = √(21·8·7·6) = √7056 = 84.",
  },
  {
    id: "phys-1",
    title: "Закон Ома",
    description: "Через резистор сопротивлением 5 Ом проходит ток 2 А. Какое напряжение приложено к резистору? Ответ в вольтах.",
    subject: "physics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "10",
    explanation: "По закону Ома: U = I·R = 2·5 = 10 В.",
  },
  {
    id: "phys-2",
    title: "Свободное падение",
    description: "Тело падает с высоты 45 м без начальной скорости. Через сколько секунд оно достигнет земли? g = 10 м/с².",
    subject: "physics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "3",
    explanation: "h = gt²/2, t = √(2h/g) = √(90/10) = √9 = 3 с.",
  },
  {
    id: "phys-3",
    title: "Второй закон Ньютона",
    description: "Тело массой 2 кг под действием силы приобретает ускорение 3 м/с². Чему равна сила? Ответ в ньютонах.",
    subject: "physics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "6",
    explanation: "F = m·a = 2·3 = 6 Н.",
  },
  {
    id: "phys-4",
    title: "Кинетическая энергия",
    description: "Автомобиль массой 1000 кг движется со скоростью 20 м/с. Найдите его кинетическую энергию в килоджоулях.",
    subject: "physics",
    difficulty: "medium",
    type: "text",
    correctAnswer: "200",
    explanation: "Eк = mv²/2 = 1000·400/2 = 200000 Дж = 200 кДж.",
  },
  {
    id: "inf-1",
    title: "Количество информации",
    description: "Сколько байт в 2 Кбайтах?",
    subject: "informatics",
    difficulty: "easy",
    type: "text",
    correctAnswer: "2048",
    explanation: "1 Кбайт = 1024 байт, 2 Кбайта = 2048 байт.",
  },
  {
    id: "inf-2",
    title: "Двоичная система",
    description: "Переведите число 27 из десятичной системы в двоичную. Запишите только цифры (без основания).",
    subject: "informatics",
    difficulty: "medium",
    type: "text",
    correctAnswer: "11011",
    explanation: "27₁₀ = 16+8+2+1 = 11011₂.",
  },
  {
    id: "inf-3",
    title: "Алгоритм Евклида",
    description: "Найдите НОД чисел 48 и 18.",
    subject: "informatics",
    difficulty: "medium",
    type: "text",
    correctAnswer: "6",
    explanation: "НОД(48,18): 48÷18 = 2 (ост.12), 18÷12 = 1 (ост.6), 12÷6 = 2 (ост.0). НОД = 6.",
  },
  {
    id: "inf-4",
    title: "Значение выражения",
    description: "Чему равно значение выражения: (15 & 7) | 3, где & — побитовое И, | — побитовое ИЛИ?",
    subject: "informatics",
    difficulty: "hard",
    type: "text",
    correctAnswer: "7",
    explanation: "15 = 1111₂, 7 = 0111₂, 15 & 7 = 0111₂ = 7. 7 | 3 = 111₂ = 7.",
  },
  {
    id: "chem-1",
    title: "Молярная масса воды",
    description: "Чему равна молярная масса воды (H₂O)?",
    subject: "chemistry",
    difficulty: "easy",
    type: "choice",
    options: ["16 г/моль", "17 г/моль", "18 г/моль", "20 г/моль"],
    correctAnswer: "18 г/моль",
    explanation: "M(H₂O) = 2·1 + 16 = 18 г/моль.",
  },
  {
    id: "chem-2",
    title: "Индикатор кислоты",
    description: "Какой индикатор краснеет в кислой среде?",
    subject: "chemistry",
    difficulty: "easy",
    type: "choice",
    options: ["Фенолфталеин", "Лакмус", "Метилоранж", "Универсальный"],
    correctAnswer: "Лакмус",
    explanation: "Лакмус краснеет в кислой среде, синеет в щелочной.",
  },
  {
    id: "chem-3",
    title: "Тип химической связи",
    description: "Какой тип химической связи в молекуле NaCl?",
    subject: "chemistry",
    difficulty: "medium",
    type: "choice",
    options: ["Ковалентная полярная", "Ковалентная неполярная", "Ионная", "Металлическая"],
    correctAnswer: "Ионная",
    explanation: "Na отдаёт электрон, Cl принимает — образуется ионная связь.",
  },
  {
    id: "bio-1",
    title: "Фотосинтез",
    description: "В каких органоидах клетки происходит фотосинтез?",
    subject: "biology",
    difficulty: "easy",
    type: "choice",
    options: ["Митохондрии", "Хлоропласты", "Рибосомы", "Лизосомы"],
    correctAnswer: "Хлоропласты",
    explanation: "Фотосинтез происходит в хлоропластах, содержащих хлорофилл.",
  },
  {
    id: "bio-2",
    title: "Единица строения живого",
    description: "Какая структура является основной единицей строения всех живых организмов?",
    subject: "biology",
    difficulty: "easy",
    type: "choice",
    options: ["Ткань", "Молекула", "Клетка", "Орган"],
    correctAnswer: "Клетка",
    explanation: "Клетка — элементарная структурная и функциональная единица живого.",
  },
  {
    id: "bio-3",
    title: "Кровеносная система человека",
    description: "Сколько камер в сердце человека?",
    subject: "biology",
    difficulty: "easy",
    type: "choice",
    options: ["Две", "Три", "Четыре", "Пять"],
    correctAnswer: "Четыре",
    explanation: "Сердце человека имеет 4 камеры: два предсердия и два желудочка.",
  },
  {
    id: "bio-4",
    title: "ДНК расшифровка",
    description: "Что означает аббревиатура ДНК?",
    subject: "biology",
    difficulty: "medium",
    type: "choice",
    options: ["Двойная нуклеиновая кислота", "Дезоксирибонуклеиновая кислота", "Динуклеотидная кислота", "Длинная нить калия"],
    correctAnswer: "Дезоксирибонуклеиновая кислота",
    explanation: "ДНК — дезоксирибонуклеиновая кислота, носитель генетической информации.",
  },
]

async function seed() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  console.log(`Seeding ${problemsData.length} problems...`)

  let seeded = 0
  for (const problem of problemsData) {
    try {
      await setDoc(doc(db, "problems", problem.id), problem)
      seeded++
      console.log(`  ✓ ${problem.id} — ${problem.title}`)
    } catch (err) {
      console.error(`  ✗ ${problem.id}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log(`\nDone! ${seeded}/${problemsData.length} problems seeded.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
