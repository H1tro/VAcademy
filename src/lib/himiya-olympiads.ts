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

export const HIMIYA_OLYMPIADS: OlympiadCategory[] = [
  {
    title: "Главные международные олимпиады",
    icon: "trophy",
    items: [
      { name: "Международная химическая олимпиада (IChO)", url: "https://icho-official.org", description: "Самая престижная школьная олимпиада по химии. Июль 2026" },
      { name: "Международная Менделеевская олимпиада (IMChO)", url: "https://olimp.msu.ru", description: "Одна из самых престижных олимпиад мира после IChO" },
      { name: "Международная Жаутыковская олимпиада (IZhO)", url: "https://izho.kz", description: "Олимпиада по химии, физике и математике. Январь 2026" },
      { name: "Международная олимпиада имени Абу Райхана Беруни", url: "https://olimpiada.ru", description: "Одна из сильнейших олимпиад Центральной Азии. Узбекистан" },
      { name: "Международная олимпиада «Шёлковый путь»", url: "https://olimpiada.ru", description: "Олимпиада для школьников стран Центральной Азии" },
      { name: "Международная олимпиада имени Аль-Фараби", url: "https://olimpiada.ru", description: "Олимпиада по химии. Казахстан" },
      { name: "IJSO (International Junior Science Olympiad)", url: "https://ijsoweb.org", description: "Для учеников младше 16 лет. Химия + физика + биология. Декабрь 2025" },
    ],
  },
  {
    title: "Открытые международные и онлайн-олимпиады",
    icon: "globe",
    items: [
      { name: "Open International Chemistry Olympiad (OICO)", url: "https://olimpiada.ru", description: "Международная открытая олимпиада по химии. Июль" },
      { name: "International Chemistry Tournament (IChTo)", url: "https://ichto.org", description: "Командный турнир исследовательского типа. Июнь" },
      { name: "International Young Chemists' Tournament (IYCT)", url: "https://iyct.org", description: "Командный исследовательский турнир. Июль" },
      { name: "National Chemistry Battles", url: "https://olimpiada.ru", description: "Национальные химические бои. Задачи + эксперимент + дискуссии" },
      { name: "Химический турнир имени Ломоносова", url: "https://olimpiada.ru", description: "Командная олимпиада с исследовательскими задачами" },
      { name: "Open Chemistry Olympiad (Турция)", url: "https://olimpiada.ru", description: "Ежегодная международная открытая олимпиада" },
    ],
  },
  {
    title: "Российские перечневые олимпиады",
    icon: "book",
    items: [
      { name: "Олимпиада «Ломоносов» по химии", url: "https://olymp.msu.ru", description: "Олимпиада МГУ. Дистанционный и очный этапы" },
      { name: "Олимпиада СПбГУ по химии", url: "https://olimp.english.spbu.ru", description: "Популярна среди сильных олимпиадников СНГ" },
      { name: "Всесибирская открытая олимпиада школьников по химии", url: "https://sesc.nsu.ru/olympvsesib", description: "Одна из сильнейших олимпиад на русском языке. НГУ" },
      { name: "Московская олимпиада школьников (МОШ) по химии", url: "https://mos.olimpiada.ru", description: "Задачи высокого уровня сложности" },
      { name: "Олимпиада «Высшая проба» по химии", url: "https://olymp.hse.ru", description: "Организатор — НИУ ВШЭ. Дистанционный этап" },
      { name: "Олимпиада «Фоксфорд» по химии", url: "https://foxford.ru", description: "Бесплатная онлайн-олимпиада для всех классов" },
    ],
  },
]
