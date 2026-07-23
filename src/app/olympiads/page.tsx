"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, CircleDollarSign, ExternalLink, Bell, MessageCircle, Filter, BookCheck, Sigma, Dna, Atom, FlaskConical } from "lucide-react"
import Link from "next/link"

type OlympiadSubject = "Математика" | "Биология" | "Химия" | "Физика"

type Olympiad = {
  title: string
  subject: OlympiadSubject
  dates: string
  location: string
  description: string
  fee: string
  status: string
  type: string
  sortGroup: 0 | 1 | 2
}

const olympiads: Olympiad[] = [
  // ========== МАТЕМАТИКА ==========
  {
    title: "Олимпиада им. Л. Эйлера I тур",
    subject: "Математика",
    dates: "Начало декабря, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Дистанционный этап. Участие бесплатное, места ограничены.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Олимпиада им. Л. Эйлера II тур",
    subject: "Математика",
    dates: "Конец января, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Дистанционный этап. Участие бесплатное, места ограничены.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Национальная олимпиада по математике Кыргызской Республики",
    subject: "Математика",
    dates: "I этап: январь 2026 | II этап: февраль 2026 | III этап: март 2026 | IV этап: апрель 2026",
    location: "Кыргызстан",
    fee: "Бесплатно",
    description: "Главная официальная олимпиада Кыргызстана по математике. Четыре этапа.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "AIME (American Invitational Mathematics Examination)",
    subject: "Математика",
    dates: "13 февраля, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "По результатам AMC 10/12. Бесплатно для приглашённых участников.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Заключительный этап Олимпиады имени Л. Эйлера",
    subject: "Математика",
    dates: "Конец марта, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Бесплатно",
    description: "Офлайн. Приглашаются ученики с высокими баллами на АМС 8, финалисты олимпиады Эйлера, Смагулова, IMAS.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Азиатско-Тихоокеанская математическая олимпиада (APMO)",
    subject: "Математика",
    dates: "Март, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Участники — победители предыдущих этапов Национальной олимпиады по математике.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная математическая олимпиада «Шелковый путь»",
    subject: "Математика",
    dates: "Март, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Участники — победители предыдущих этапов Национальной олимпиады по математике.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "XX Устная олимпиада по геометрии им. И.Ф.Шарыгина",
    subject: "Математика",
    dates: "Апрель, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Бесплатно",
    description: "Устная олимпиада по геометрии. Участие бесплатное.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "AMC 10/12A (American Mathematics Competitions)",
    subject: "Математика",
    dates: "5 ноября, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "1200 сом",
    description: "Американская олимпиада по математике. Для учеников 9–12 классов.",
    status: "Идет регистрация",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "AMC 10/12B (American Mathematics Competitions)",
    subject: "Математика",
    dates: "13 ноября, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "1200 сом",
    description: "Американская олимпиада по математике. Для учеников 9–12 классов.",
    status: "Идет регистрация",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "AMC 8 (American Mathematics Competitions)",
    subject: "Математика",
    dates: "24–25 января, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "1200 сом",
    description: "Американская олимпиада по математике. Для учеников 5–8 классов.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "IMAS (International Mathematics Assessment for Schools)",
    subject: "Математика",
    dates: "I этап: середина января, 2026 | II этап: середина марта, 2026",
    location: "Кыргызстан, официальное участие",
    fee: "1500 сом",
    description: "Международная олимпиада по математике для школьников. Два этапа (офлайн).",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "Smart Kangaroo",
    subject: "Математика",
    dates: "12 февраля, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "250 сом",
    description: "Международная математическая олимпиада для школьников.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "Олимпиада им. Ш. Смагулова",
    subject: "Математика",
    dates: "I этап: февраль 2026 | II этап: апрель 2026 | Финал: июнь 2026",
    location: "Кыргызстан / Казахстан",
    fee: "1200 сом",
    description: "Три этапа. I–II этапы (офлайн) в Кыргызстане, финал (офлайн) в Казахстане.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "XII Иранская олимпиада по геометрии (IGO)",
    subject: "Математика",
    dates: "I тур: 12 октября, 2025 | II тур: 17 октября, 2025",
    location: "Кыргызстан, официальное участие",
    fee: "Уточняется",
    description: "Олимпиада имеет международный статус. Задачи очень сложные.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "EMC (Европейский Математический Кубок)",
    subject: "Математика",
    dates: "Конец декабря, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "Уточняется",
    description: "Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Международная Жаутыковская олимпиада (IZhO)",
    subject: "Математика",
    dates: "Январь, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Уточняется",
    description: "Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Caucasus Mathematical Olympiad",
    subject: "Математика",
    dates: "Март, 2026 год",
    location: "РФ, официальное участие",
    fee: "Уточняется",
    description: "Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "EGMO (European Girls' Mathematical Olympiad)",
    subject: "Математика",
    dates: "Конец апреля, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Уточняется",
    description: "Европейская математическая олимпиада среди девочек.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Балканская Математическая Олимпиада (BMO)",
    subject: "Математика",
    dates: "Май, 2026 год",
    location: "Греция, официальное участие",
    fee: "Уточняется",
    description: "Балканская математическая олимпиада.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },

  // ========== БИОЛОГИЯ ==========
  {
    title: "Республиканская олимпиада школьников (Кыргызстан)",
    subject: "Биология",
    dates: "Школьный: октябрь | Районный: декабрь | Областной: январь | Республиканский: март",
    location: "Кыргызстан",
    fee: "Бесплатно",
    description: "Главная официальная олимпиада страны. 7–11 классы. Победители проходят в сборную.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Областные/городские олимпиады",
    subject: "Биология",
    dates: "Зима–весна (по регионам)",
    location: "Кыргызстан",
    fee: "Бесплатно",
    description: "Отбор на республиканский этап. 7–11 классы.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Международная биологическая олимпиада (IBO)",
    subject: "Биология",
    dates: "Июль, ежегодно",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Самая престижная олимпиада мира по биологии. До 20 лет.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "IJSO (International Junior Science Olympiad)",
    subject: "Биология",
    dates: "Декабрь",
    location: "Международное участие",
    fee: "Бесплатно (через отбор)",
    description: "Комплексная олимпиада: биология + химия + физика. До 15 лет.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Олимпиады вузов России (Ломоносов, СПбГУ)",
    subject: "Биология",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Дают льготы при поступлении в вузы РФ. 9–11 классы.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиады Казахстана (РФМШ, НИШ)",
    subject: "Биология",
    dates: "Зима–весна",
    location: "Казахстан",
    fee: "Бесплатно",
    description: "Сильный уровень подготовки. 7–11 классы.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "British Biology Olympiad (BBO)",
    subject: "Биология",
    dates: "Ноябрь–февраль",
    location: "Великобритания / онлайн",
    fee: "~£10–15",
    description: "Популярная международная олимпиада из Великобритании. Старшие классы.",
    status: "Идет регистрация",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "International Biology Bowl",
    subject: "Биология",
    dates: "Весна",
    location: "Международное участие",
    fee: "Платно",
    description: "Командная олимпиада по биологии. Для школьников и студентов.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "Фоксфорд (Foxford)",
    subject: "Биология",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Платно",
    description: "Онлайн-олимпиады и курсы. 1–11 классы.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Coursera / edX олимпиады и курсы",
    subject: "Биология",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Платно (есть бесплатный доступ)",
    description: "Не классические олимпиады, но полезны для подготовки.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Uchi.ru",
    subject: "Биология",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Бесплатно / Платно",
    description: "Простые школьные олимпиады онлайн. 1–11 классы.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },

  // ========== ХИМИЯ ==========
  {
    title: "Национальная олимпиада по химии Кыргызской Республики",
    subject: "Химия",
    dates: "I этап: январь 2026 | II этап: февраль 2026 | III этап: март 2026 | IV этап: апрель 2026",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Главная официальная олимпиада страны по химии. Четыре этапа.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Международная Жаутыковская олимпиада по химии (IZhO)",
    subject: "Химия",
    dates: "Январь, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Бесплатно (через отбор)",
    description: "Приглашаются сильнейшие школьники по результатам национальных олимпиад и отбора.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная Менделеевская олимпиада по химии (IMChO)",
    subject: "Химия",
    dates: "Конец апреля – начало мая, 2026 год",
    location: "Ежегодно меняется",
    fee: "Бесплатно (через сборную)",
    description: "Одна из самых престижных олимпиад мира после IChO.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная химическая олимпиада (IChO)",
    subject: "Химия",
    dates: "Июль, 2026 год",
    location: "Ежегодно меняется",
    fee: "Бесплатно (через сборную)",
    description: "Самая престижная школьная олимпиада по химии. Только члены национальной сборной.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная олимпиада имени Абу Райхана Беруни",
    subject: "Химия",
    dates: "Май–июнь",
    location: "Узбекистан",
    fee: "Бесплатно (через сборную)",
    description: "Одна из сильнейших международных олимпиад Центральной Азии.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная олимпиада «Шёлковый путь» по химии",
    subject: "Химия",
    dates: "Март–апрель",
    location: "Кыргызстан / Казахстан",
    fee: "Бесплатно (через отбор)",
    description: "Участвуют лучшие школьники стран Центральной Азии.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "IJSO (International Junior Science Olympiad)",
    subject: "Химия",
    dates: "Декабрь, 2025",
    location: "Международное участие",
    fee: "Бесплатно (через отбор)",
    description: "Для учеников младше 16 лет. Химия + физика + биология.",
    status: "Прошёл",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная олимпиада имени Аль-Фараби по химии",
    subject: "Химия",
    dates: "Март–апрель",
    location: "Казахстан",
    fee: "Бесплатно",
    description: "Участвуют школьники из разных стран.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Ломоносов» по химии",
    subject: "Химия",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Организатор — МГУ. Дистанционный и очный этапы.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиада СПбГУ по химии",
    subject: "Химия",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Популярна среди сильных олимпиадников стран СНГ.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Всесибирская открытая олимпиада школьников по химии",
    subject: "Химия",
    dates: "Январь–март",
    location: "Россия (Новосибирск)",
    fee: "Бесплатно",
    description: "Организатор — НГУ. Одна из сильнейших олимпиад по химии на русском языке.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Московская олимпиада школьников (МОШ) по химии",
    subject: "Химия",
    dates: "Январь–март",
    location: "Москва",
    fee: "Бесплатно",
    description: "Задачи высокого уровня сложности.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Высшая проба» по химии",
    subject: "Химия",
    dates: "Январь–апрель",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Организатор — НИУ ВШЭ. Дистанционный и заключительный этап.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Open International Chemistry Olympiad (OICO)",
    subject: "Химия",
    dates: "Июль",
    location: "Международное участие",
    fee: "Уточняется",
    description: "Международная открытая олимпиада по химии.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "International Chemistry Tournament (IChTo)",
    subject: "Химия",
    dates: "Июнь",
    location: "Международное участие",
    fee: "Уточняется",
    description: "Командный турнир исследовательского типа. Участники решают открытые научные задачи.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "International Young Chemists' Tournament (IYCT)",
    subject: "Химия",
    dates: "Июль",
    location: "Международное участие",
    fee: "Уточняется",
    description: "Командный исследовательский турнир.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Национальные химические бои (National Chemistry Battles)",
    subject: "Химия",
    dates: "Ежегодно",
    location: "Международное участие",
    fee: "Уточняется",
    description: "Решение задач, эксперименты, научные дискуссии. Подготовка к международным олимпиадам.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Химический турнир имени Ломоносова",
    subject: "Химия",
    dates: "Ежегодно",
    location: "Россия",
    fee: "Уточняется",
    description: "Командная олимпиада. Исследовательские и нестандартные задачи.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 2,
  },
  {
    title: "Open Chemistry Olympiad (Турция)",
    subject: "Химия",
    dates: "Ежегодно",
    location: "Турция",
    fee: "Уточняется",
    description: "Ежегодная международная открытая олимпиада.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },

  // ========== ФИЗИКА ==========
  // Главные международные
  {
    title: "Международная физическая олимпиада (IPhO)",
    subject: "Физика",
    dates: "Июль, ежегодно",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Самая престижная олимпиада по физике в мире. Проводится с 1967 года, участвуют сборные (до 5 человек) из ~90 стран. Теоретический и экспериментальный туры.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Азиатская физическая олимпиада (APhO)",
    subject: "Физика",
    dates: "Май–июнь, ежегодно",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Главная континентальная олимпиада для стран Азии и Океании, проводится по правилам IPhO (теория + эксперимент). Страны Средней Азии регулярно участвуют.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Европейская физическая олимпиада (EuPhO)",
    subject: "Физика",
    dates: "Апрель–май, ежегодно",
    location: "Европа",
    fee: "Бесплатно (через сборную)",
    description: "Престижная олимпиада с «исследовательским» форматом задач (краткие условия, простор для творчества). Казахстан — страна-участница.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная Жаутыковская олимпиада по физике (IZhO)",
    subject: "Физика",
    dates: "Январь, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Бесплатно (через отбор)",
    description: "Одна из самых престижных командных олимпиад для физматшкол мира, проводится с 2005 года в Алматы. Языки: казахский, русский, английский.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная научная олимпиада по физике (ISPhO)",
    subject: "Физика",
    dates: "Июнь–июль",
    location: "Россия",
    fee: "Бесплатно (через сборную)",
    description: "Международная олимпиада для национальных сборных, организуемая МФТИ. Программа соответствует APhO, есть теоретический и экспериментальный туры.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная олимпиада по экспериментальной физике (IEPhO)",
    subject: "Физика",
    dates: "Июнь",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Уникальная олимпиада, полностью посвящённая эксперименту: 3 тура по 5 часов работы с реальным оборудованием. Для 8–11 классов.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная олимпиада «Туймаада»",
    subject: "Физика",
    dates: "Июнь–июль",
    location: "Россия (Якутск)",
    fee: "Бесплатно",
    description: "Международная олимпиада по математике, физике, химии и информатике. Рабочий язык — русский, традиционно участвуют команды из Казахстана и других стран СНГ.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная олимпиада им. Ахмада аль-Фергани",
    subject: "Физика",
    dates: "Апрель–май",
    location: "Узбекистан (Фергана)",
    fee: "Бесплатно (через сборную)",
    description: "Международная олимпиада по физике в Узбекистане. Два тура: теоретический и практический. Участвуют сборные многих стран.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международный турнир юных физиков (IYPT)",
    subject: "Физика",
    dates: "Июль",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Командное соревнование: команды заранее исследуют открытые задачи, а затем защищают решения в научной дискуссии. Исследовательский формат.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международный турнир юных естествоиспытателей (IYNT)",
    subject: "Физика",
    dates: "Июнь–июль",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Командный научный турнир для школьников 12–17 лет по естественным наукам (значительная часть задач — физика).",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная олимпиада по астрономии и астрофизике (IOAA)",
    subject: "Физика",
    dates: "Октябрь–ноябрь",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Для тех, кто увлекается физикой космоса: задачи по астрофизике требуют серьёзной физической подготовки.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  // Открытые онлайн
  {
    title: "Physics Cup",
    subject: "Физика",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Бесплатно",
    description: "Знаменитая онлайн-олимпиада Яана Калды (Эстония): в течение года публикуются очень сложные задачи, решения принимаются от школьников со всего мира. Высоко ценится в олимпиадном сообществе.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Online Physics Olympiad (OPhO)",
    subject: "Физика",
    dates: "Ежегодно",
    location: "Онлайн",
    fee: "Бесплатно",
    description: "Одна из крупнейших онлайн-олимпиад мира: командный открытый тур и индивидуальный инвитационный. Открыта для школьников всех стран.",
    status: "Скоро",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Phystech.International",
    subject: "Физика",
    dates: "Ежегодно",
    location: "Онлайн",
    fee: "Бесплатно",
    description: "Международная онлайн-олимпиада МФТИ по физике и математике для иностранных школьников (120+ стран). Победа повышает шансы на квоту для бесплатного обучения в МФТИ.",
    status: "Скоро",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Международная олимпиада CAU",
    subject: "Физика",
    dates: "Ежегодно",
    location: "Узбекистан (Ташкент)",
    fee: "Уточняется",
    description: "Новая международная олимпиада Central Asian University по физике, математике и химии для школьников 9–11 классов стран Центральной Азии.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Олимпиада НИЯУ МИФИ (GlobalUni)",
    subject: "Физика",
    dates: "Ежегодно",
    location: "Онлайн",
    fee: "Бесплатно",
    description: "Полностью дистанционная бесплатная олимпиада (в т.ч. по физике) на русском и английском языках; победителям — льготы при поступлении в МИФИ.",
    status: "Скоро",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Physics Unlimited Premier Competition",
    subject: "Физика",
    dates: "Ежегодно",
    location: "Онлайн",
    fee: "Бесплатно",
    description: "Онлайн-соревнование по физике от Принстонского университета (США), открытое для школьников всего мира.",
    status: "Скоро",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "International PhysiCo Olympiad",
    subject: "Физика",
    dates: "Ежегодно",
    location: "Онлайн",
    fee: "Бесплатно",
    description: "Международная онлайн-олимпиада по физике, популярная среди школьников СНГ.",
    status: "Скоро",
    type: "Онлайн",
    sortGroup: 1,
  },
  // Российские перечневые
  {
    title: "Олимпиада «Физтех»",
    subject: "Физика",
    dates: "Январь–апрель",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Одна из сильнейших физических олимпиад России (МФТИ). Отборочный этап онлайн, финалы — на площадках, в том числе в странах СНГ.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Росатом»",
    subject: "Физика",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Физико-математическая олимпиада НИЯУ МИФИ и ГК «Росатом» для 7–11 классов. Дистанционный отборочный тур; очные туры и в странах СНГ.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Московская олимпиада школьников (МОШ) по физике",
    subject: "Физика",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Престижная олимпиада высокого уровня с дистанционным отборочным этапом.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Ломоносов» по физике",
    subject: "Физика",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Олимпиада МГУ им. Ломоносова, отборочный этап проходит онлайн.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Покори Воробьёвы горы!»",
    subject: "Физика",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Совместная олимпиада МГУ и «Московского комсомольца», отборочный этап дистанционный.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Всесибирская открытая олимпиада школьников по физике",
    subject: "Физика",
    dates: "Январь–март",
    location: "Россия (Новосибирск)",
    fee: "Бесплатно",
    description: "Олимпиада НГУ (Новосибирск) с дистанционным этапом, открыта всем желающим.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Высшая проба» по физике",
    subject: "Физика",
    dates: "Январь–апрель",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Олимпиада НИУ ВШЭ, отборочный этап онлайн, доступна иностранным школьникам.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Отраслевая олимпиада «Курчатов»",
    subject: "Физика",
    dates: "Январь–апрель",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Олимпиада НИЦ «Курчатовский институт», отборочный этап онлайн.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Интернет-олимпиада школьников по физике (СПбГУ)",
    subject: "Физика",
    dates: "Январь–апрель",
    location: "Россия (онлайн)",
    fee: "Бесплатно",
    description: "Полностью дистанционная олимпиада СПбГУ и Университета ИТМО для 7–11 классов.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Шаг в будущее» (МГТУ им. Баумана)",
    subject: "Физика",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Инженерно-физическая олимпиада МГТУ им. Баумана с дистанционным отборочным этапом.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Кубок ЛФИ",
    subject: "Физика",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Командная физическая олимпиада Лаборатории физических исследований МФТИ, популярна у сильных школьников СНГ.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиада «Фоксфорд» по физике",
    subject: "Физика",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Бесплатно",
    description: "Бесплатная онлайн-олимпиада для всех классов — хороший стартовый уровень.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },
  // Национальные Средняя Азия
  {
    title: "Республиканская олимпиада Казахстана по физике",
    subject: "Физика",
    dates: "Школьный → районный → областной → республиканский",
    location: "Казахстан",
    fee: "Бесплатно",
    description: "Официальная многоэтапная олимпиада, финалистов отбирают в сборную Казахстана. Организатор — РНПЦ «Дарын».",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Городская Жаутыковская олимпиада (Алматы)",
    subject: "Физика",
    dates: "Зима",
    location: "Казахстан (Алматы)",
    fee: "Бесплатно",
    description: "Городская олимпиада на базе РФМШ Алматы — отбор и тренировка перед IZhO.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Республиканская олимпиада Узбекистана (Fan olimpiadasi)",
    subject: "Физика",
    dates: "Зима–весна",
    location: "Узбекистан",
    fee: "Бесплатно",
    description: "Государственная предметная олимпиада Узбекистана, отбор в национальную сборную.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Республиканские олимпиады Кыргызстана и Таджикистана",
    subject: "Физика",
    dates: "Зима–весна",
    location: "Кыргызстан / Таджикистан",
    fee: "Бесплатно",
    description: "Национальные многоэтапные олимпиады, проводимые министерствами образования.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
]

const allSubjects: { value: OlympiadSubject | "all"; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "Все предметы", icon: <Filter className="h-4 w-4" /> },
  { value: "Математика", label: "Математика", icon: <Sigma className="h-4 w-4" /> },
  { value: "Биология", label: "Биология", icon: <Dna className="h-4 w-4" /> },
  { value: "Химия", label: "Химия", icon: <FlaskConical className="h-4 w-4" /> },
  { value: "Физика", label: "Физика", icon: <Atom className="h-4 w-4" /> },
]

const statusColors: Record<string, string> = {
  "Скоро": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "Отбор": "bg-blue-500/15 text-blue-500 border-blue-500/30",
  "Идет регистрация": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  "Круглый год": "bg-violet-500/15 text-violet-500 border-violet-500/30",
  "Прошёл": "bg-muted text-muted-foreground border-border/40",
}

function OlympiadsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get("subject") as OlympiadSubject | null

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const currentSubject: OlympiadSubject | "all" = subjectParam && allSubjects.some(s => s.value === subjectParam)
    ? subjectParam
    : "all"

  const filteredOlympiads = currentSubject === "all"
    ? olympiads
    : olympiads.filter((o) => o.subject === currentSubject)

  const handleSubjectChange = (subject: OlympiadSubject | "all") => {
    const params = new URLSearchParams(searchParams.toString())
    if (subject === "all") {
      params.delete("subject")
    } else {
      params.set("subject", subject)
    }
    const query = params.toString()
    router.push(query ? `/olympiads?${query}` : "/olympiads")
  }

  const askAssistant = async () => {
    setError(null)
    setAnswer(null)
    const text = question.trim()

    if (!text) {
      setError("Пожалуйста, задайте вопрос.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/olympiad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "Ошибка сервера. Попробуйте позже.")
      } else {
        setAnswer(data.answer || "К сожалению, ответ не получен.")
      }
    } catch {
      setError("Не удалось получить ответ. Проверьте подключение и ключ Groq.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">Дашборд</Link>
            <span className="text-xs">/</span>
            <span className="text-sm text-foreground font-medium">Олимпиады</span>
          </div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Olympiad Hub</h1>
          <p className="text-muted-foreground text-lg">
            Ваш навигатор в мире олимпиад и интеллектуальных соревнований
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-12 rounded-full border-border/40 hover:bg-secondary" asChild>
            <Link href="/dashboard">
              Назад
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-12 border-primary/30 text-primary hover:bg-primary/5 rounded-full"
          >
            <Bell className="mr-2 h-4 w-4" />
            Уведомлять о новых
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {allSubjects.map((s) => (
          <button
            key={s.value}
            onClick={() => handleSubjectChange(s.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              currentSubject === s.value
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card/50 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <BookCheck className="h-4 w-4" />
        <span>
          Найдено: <span className="font-bold text-foreground">{filteredOlympiads.length}</span>
          {" "}олимпиад{currentSubject !== "all" && (
            <span> по предмету «<span className="font-semibold text-foreground">{currentSubject}</span>»</span>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOlympiads.map((olimp, i) => (
          <Card
            key={i}
            className="border-border/40 bg-card/50 shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-200 group overflow-hidden"
          >
            <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5">
                  {olimp.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 ${statusColors[olimp.status] || "bg-muted text-muted-foreground border-border/40"}`}
                >
                  {olimp.status}
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5">
                  {olimp.subject}
                </Badge>
              </div>

              <h3 className="font-headline font-bold text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                {olimp.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {olimp.description}
              </p>

              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-primary shrink-0" />
                  <span>{olimp.dates}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">{olimp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-3 w-3 text-primary shrink-0" />
                  <span>{olimp.fee}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-secondary/10 border-border/40">
        <CardHeader>
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-black tracking-tight">AI-ассистент по олимпиадам</h2>
            <p className="text-muted-foreground max-w-3xl text-base">
              Задавайте вопросы по подготовке, стратегиям, расписанию этапов и выбору предметов. Ответ генерируется с
              помощью Groq API.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4">
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Например: Как лучше подготовиться к олимпиаде по информатике?"
              rows={5}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={askAssistant} disabled={isLoading}>
                {isLoading ? "Жду ответа..." : "Спросить AI"}
              </Button>
              <Button variant="outline" onClick={() => { setQuestion(""); setAnswer(null); setError(null) }}>
                Очистить
              </Button>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {answer ? (
              <div className="rounded-3xl border border-border/30 bg-background p-6">
                <h3 className="text-xl font-semibold">Ответ AI</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{answer}</p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-border/40">
        <CardHeader>
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-black tracking-tight">Обратная связь</h2>
            <p className="text-muted-foreground max-w-3xl text-base">
              По всем вопросам обращайтесь к нашему Telegram-боту.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <a
            href="https://t.me/VAcademi_Support_Bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <MessageCircle className="mr-2 h-5 w-5" />
              @VAcademi_Support_Bot
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OlympiadsHub() {
  return (
    <Suspense fallback={
      <div className="space-y-8 px-6 py-10 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-card/40 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <OlympiadsPageContent />
    </Suspense>
  )
}
