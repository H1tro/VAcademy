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

export const FIZIKA_OLYMPIADS: OlympiadCategory[] = [
  {
    title: "Главные международные олимпиады",
    icon: "trophy",
    items: [
      { name: "Международная физическая олимпиада (IPhO)", url: "https://ipho-new.org", description: "Самая престижная олимпиада по физике в мире. Архив: ipho-unofficial.org" },
      { name: "Азиатская физическая олимпиада (APhO)", url: "https://asianphysicsolympiad.org", description: "Главная континентальная олимпиада для стран Азии и Океании" },
      { name: "Европейская физическая олимпиада (EuPhO)", url: "https://eupho.ee", description: "Престижная олимпиада с исследовательским форматом задач" },
      { name: "Международная Жаутыковская олимпиада (IZhO)", url: "https://izho.kz", description: "Одна из самых престижных командных олимпиад для физматшкол мира" },
      { name: "Международная научная олимпиада по физике (ISPhO)", url: "https://ispho.mipt.ru", description: "Организуемая МФТИ, соответствует программе APhO" },
      { name: "Международная олимпиада по экспериментальной физике (IEPhO)", url: "https://iepho.su", description: "Полностью посвящена эксперименту: 3 тура по 5 часов" },
      { name: "Международная олимпиада «Туймаада»", url: "https://tuymaada.lenskykray.ru", description: "Олимпиада по математике, физике, химии и информатике в Якутске" },
      { name: "Международная олимпиада им. Ахмада аль-Фергани", url: "https://olimpiada.ru", description: "Олимпиада по физике в Узбекистане (Фергана)" },
      { name: "Международный турнир юных физиков (IYPT)", url: "https://iypt.org", description: "Командное соревнование с исследовательским форматом" },
      { name: "Международный турнир юных естествоиспытателей (IYNT)", url: "https://iynt.org", description: "Командный научный турнир для школьников 12–17 лет" },
      { name: "Международная олимпиада по астрономии и астрофизике (IOAA)", url: "https://ioaastrophysics.org", description: "Задачи по астрофизике требуют серьёзной физической подготовки" },
    ],
  },
  {
    title: "Открытые международные и онлайн-олимпиады",
    icon: "globe",
    items: [
      { name: "Physics Cup", url: "https://physicscup.ee", description: "Знаменитая онлайн-олимпиада Яана Калды (Эстония)" },
      { name: "Online Physics Olympiad (OPhO)", url: "https://opho.physoly.tech", description: "Одна из крупнейших онлайн-олимпиад мира" },
      { name: "Phystech.International", url: "https://phystech.international", description: "Онлайн-олимпиада МФТИ для иностранных школьников (120+ стран)" },
      { name: "Международная олимпиада CAU", url: "https://centralasian.uz", description: "Олимпиада Central Asian University для школьников Центральной Азии" },
      { name: "Олимпиада НИЯУ МИФИ (GlobalUni)", url: "https://mephi.ru/foreignnationals/entrant/globaluni", description: "Полностью дистанционная бесплатная олимпиада" },
      { name: "Physics Unlimited Premier Competition", url: "https://physicsu.org/premier", description: "Онлайн-соревнование от Принстонского университета" },
      { name: "International PhysiCo Olympiad", url: "https://physico.stemco.org", description: "Популярная онлайн-олимпиада среди школьников СНГ" },
    ],
  },
  {
    title: "Российские перечневые олимпиады",
    icon: "book",
    items: [
      { name: "Олимпиада «Физтех»", url: "https://olymp.mipt.ru", description: "Одна из сильнейших физических олимпиад России (МФТИ)" },
      { name: "Олимпиада «Росатом»", url: "https://olymp.mephi.ru/rosatom", description: "Физико-математическая олимпиада НИЯУ МИФИ и ГК «Росатом»" },
      { name: "Московская олимпиада школьников (МОШ) по физике", url: "https://mos.olimpiada.ru", description: "Престижная олимпиада высокого уровня" },
      { name: "Олимпиада «Ломоносов» по физике", url: "https://olymp.msu.ru", description: "Олимпиада МГУ им. Ломоносова" },
      { name: "Олимпиада «Покори Воробьёвы горы!»", url: "https://pvg.mk.ru", description: "Совместная олимпиада МГУ и «Московского комсомольца»" },
      { name: "Всесибирская открытая олимпиада школьников", url: "https://sesc.nsu.ru/olympvsesib", description: "Олимпиада НГУ (Новосибирск) с дистанционным этапом" },
      { name: "Олимпиада «Высшая проба» по физике", url: "https://olymp.hse.ru", description: "Олимпиада НИУ ВШЭ, отборочный этап онлайн" },
      { name: "Отраслевая олимпиада «Курчатов»", url: "https://olimpiadakurchatov.ru", description: "Олимпиада НИЦ «Курчатовский институт»" },
      { name: "Интернет-олимпиада школьников по физике (СПбГУ)", url: "https://distolymp2.spbu.ru", description: "Полностью дистанционная олимпиада СПбГУ и ИТМО" },
      { name: "Олимпиада «Шаг в будущее» (МГТУ им. Баумана)", url: "https://olymp.bmstu.ru", description: "Инженерно-физическая олимпиада" },
      { name: "Кубок ЛФИ", url: "https://lpr-olimp.ru", description: "Командная физическая олимпиада Лаборатории физических исследований МФТИ" },
      { name: "Олимпиада «Фоксфорд» по физике", url: "https://foxford.ru", description: "Бесплатная онлайн-олимпиада для всех классов" },
    ],
  },
  {
    title: "Национальные олимпиады стран Средней Азии",
    icon: "map",
    items: [
      { name: "Республиканская олимпиада Казахстана по физике", url: "https://daryn.kz", description: "Официальная многоэтапная олимпиада (архив задач: matol.kz)" },
      { name: "Городская Жаутыковская олимпиада (Алматы)", url: "https://almaty.fizmat.kz", description: "Отбор и тренировка перед IZhO" },
      { name: "Республиканская олимпиада Узбекистана (Fan olimpiadasi)", url: "https://olympiads.uz", description: "Государственная предметная олимпиада, отбор в сборную" },
      { name: "Республиканские олимпиады Кыргызстана и Таджикистана", url: "https://edu.gov.kg", description: "Национальные многоэтапные олимпиады" },
    ],
  },
]

export const FIZIKA_OLYMPIAD_LINKS = [
  { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
  { name: "Архивы APhO", url: "https://apho.olimpicos.net/" },
  { name: "Иродов Е.И. — сборник задач", url: "https://www.google.com/search?q=Иродов+Е.И.+задачи+по+физике" },
  { name: "Кротов Н.Н. — олимпиадные задачи", url: "https://www.google.com/search?q=Кротов+Н.Н.+олимпиадные+задачи+по+физике" },
]
