export interface OlympiadResource {
  name: string
  url: string
  description?: string
}

export interface OlympiadCategory {
  title: string
  icon: "trophy" | "globe" | "book" | "map"
  items: OlympiadResource[]
}

export const INFORMATIKA_OLYMPIADS: OlympiadCategory[] = [
  {
    title: "Главные международные олимпиады",
    icon: "trophy",
    items: [
      { name: "IOI (International Olympiad in Informatics)", url: "https://ioi.org", description: "Самая престижная международная олимпиада по информатике" },
      { name: "Международная Жаутыковская олимпиада (IZhO)", url: "https://izho.kz", description: "Командная олимпиада по математике, физике и информатике" },
      { name: "Балтийская олимпиада по информатике (BOI)", url: "https://boi2025.org", description: "Европейская олимпиада для старших классов" },
      { name: "European Girls' Olympiad in Informatics (EGOI)", url: "https://egoi.org", description: "Европейская олимпиада по информатике среди девочек" },
    ],
  },
  {
    title: "Открытые международные и онлайн-олимпиады",
    icon: "globe",
    items: [
      { name: "Codeforces", url: "https://codeforces.com", description: "Крупнейшая платформа для спортивного программирования" },
      { name: "LeetCode", url: "https://leetcode.com", description: "Тематический тренажёр по алгоритмам и структурам данных" },
      { name: "USACO (USA Computing Olympiad)", url: "https://usaco.org", description: "Американская олимпиада, открытая для участников со всего мира" },
      { name: "COCI (Croatian Open Competition in Informatics)", url: "https://hsin.hr/COCI", description: "Хорватская открытая олимпиада по информатике" },
      { name: "AtCoder", url: "https://atcoder.jp", description: "Японская платформа для олимпиад по программированию" },
      { name: "Google Code Jam", url: "https://codingcompetitions.withgoogle.com/codejam", description: "Ежегодное соревнование от Google" },
      { name: "Meta Hacker Cup", url: "https://www.facebook.com/hackercup", description: "Ежегодное соревнование от Meta" },
    ],
  },
  {
    title: "Российские и региональные олимпиады",
    icon: "book",
    items: [
      { name: "Всероссийская олимпиада школьников (ВсОШ) по информатике", url: "https://olimpiada.ru", description: "Главная официальная олимпиада России" },
      { name: "Олимпиада «Ломоносов» по информатике", url: "https://olymp.msu.ru", description: "Олимпиада МГУ им. Ломоносова" },
      { name: "Олимпиада «Высшая проба» по информатике", url: "https://olymp.hse.ru", description: "Олимпиада НИУ ВШЭ" },
      { name: "Олимпиада «Фоксфорд» по информатике", url: "https://foxford.ru", description: "Бесплатная онлайн-олимпиада" },
      { name: "Турнир городов", url: "https://codeforces.com", description: "Командная олимпиада для школьников" },
    ],
  },
]
