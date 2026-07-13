export const curriculum = [
  {
    id: 1,
    title: "Общая химия",
    sections: [
      { level: "Basic", items: [
        "Строение атома",
        "Периодический закон",
        "Химическая связь"
      ]},
      { level: "Intermediate", items: [
        "Стехиометрия",
        "Классы неорганических соединений"
      ]}
    ],
    keywords: [/general|общ|атом|период|связ|стехиом/i]
  },
  {
    id: 2,
    title: "Неорганическая химия",
    sections: [
      { level: "Intermediate", items: [
        "Металлы",
        "Неметаллы",
        "Галогены",
        "Халькогены"
      ]},
      { level: "Advanced", items: [
        "Комплексные соединения"
      ]}
    ],
    keywords: [/inorganic|неорганич|металл|неметалл|галоген|халькоген/i]
  },
  {
    id: 3,
    title: "Органическая химия",
    sections: [
      { level: "Intermediate", items: [
        "Углеводороды",
        "Спирты и фенолы",
        "Карбоновые кислоты",
        "Амины и аминокислоты"
      ]}
    ],
    keywords: [/organic|органич|углеводород|спирт|кислот|амин/i]
  },
  {
    id: 4,
    title: "Физическая химия",
    sections: [
      { level: "Advanced", items: [
        "Термохимия",
        "Химическая кинетика",
        "Химическое равновесие"
      ]}
    ],
    keywords: [/physical|физическ|термохим|кинетик|равновес/i]
  },
  {
    id: 5,
    title: "Аналитическая химия",
    sections: [
      { level: "Intermediate", items: [
        "Качественный анализ",
        "Количественный анализ",
        "Индикаторы"
      ]}
    ],
    keywords: [/analytic|аналит|индикатор|качеств|количеств/i]
  },
]

export default curriculum
