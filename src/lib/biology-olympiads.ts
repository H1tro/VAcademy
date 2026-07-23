export interface OlympiadResource {
  name: string
  url: string
  description?: string
}

export const BIOLOGY_OLYMPIAD: OlympiadResource[] = [
  {
    name: "Официальный архив IBO (International Biology Olympiad) — задания, тесты и ключи",
    url: "https://www.ibo-info.org/",
  },
  {
    name: "Biolympiads — крупнейший архив задач IBO, USABO, BBO и др.",
    url: "https://biolympiads.com/",
  },
  {
    name: "Архив Всероссийской олимпиады (ВсОШ) на Olimpiada.ru",
    url: "https://olimpiada.ru/",
  },
  {
    name: "Всероссийский Биотурнир — разборы теоретических и практических туров",
    url: "https://bioturnir.ru/",
  },
]
