export const curriculum = [
  {
    id: 1,
    title: "Алгебра",
    sections: [
      { level: "Basic", items: [
        "Числа и выражения",
        "Уравнения и неравенства"
      ]},
      { level: "Intermediate", items: [
        "Функции и их свойства",
        "Прогрессии",
        "Логарифмы"
      ]}
    ],
    keywords: [/algebra|алгебр/i]
  },
  {
    id: 2,
    title: "Геометрия",
    sections: [
      { level: "Basic", items: [
        "Планиметрия",
        "Векторы"
      ]},
      { level: "Intermediate", items: [
        "Стереометрия",
        "Координатная геометрия"
      ]}
    ],
    keywords: [/geometry|геометр/i]
  },
  {
    id: 3,
    title: "Математический анализ",
    sections: [
      { level: "Intermediate", items: [
        "Производная",
        "Интеграл",
        "Пределы"
      ]}
    ],
    keywords: [/calculus|анализ|производн|интегр/i]
  },
  {
    id: 4,
    title: "Теория вероятностей и статистика",
    sections: [
      { level: "Basic", items: [
        "Вероятность",
        "Случайные величины",
        "Статистические данные"
      ]}
    ],
    keywords: [/probab|вероятн|статист/i]
  },
  {
    id: 5,
    title: "Дискретная математика",
    sections: [
      { level: "Advanced", items: [
        "Комбинаторика",
        "Теория графов",
        "Алгоритмы"
      ]}
    ],
    keywords: [/discrete|дискрет|комбинат|граф/i]
  },
]

export default curriculum
