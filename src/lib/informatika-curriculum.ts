export const curriculum = [
  {
    id: 1,
    title: "Основы программирования",
    sections: [
      { level: "Basic", items: [
        "Переменные и типы данных",
        "Условия и циклы",
        "Функции"
      ]},
      { level: "Intermediate", items: [
        "Структуры данных",
        "Рекурсия"
      ]}
    ],
    keywords: [/basic|основ|программир|цикл|функц/i]
  },
  {
    id: 2,
    title: "Алгоритмы и структуры данных",
    sections: [
      { level: "Intermediate", items: [
        "Сортировки",
        "Поиск",
        "Графы и деревья"
      ]},
      { level: "Advanced", items: [
        "Динамическое программирование",
        "Жадные алгоритмы"
      ]}
    ],
    keywords: [/algorith|алгоритм|структура|сортир|граф|дерев/i]
  },
  {
    id: 3,
    title: "Теория чисел",
    sections: [
      { level: "Intermediate", items: [
        "Делимость",
        "Остатки",
        "Решето Эратосфена"
      ]}
    ],
    keywords: [/number|чисел|теори|делимост|эратосфен/i]
  },
  {
    id: 4,
    title: "Комбинаторика и теория игр",
    sections: [
      { level: "Intermediate", items: [
        "Перестановки и сочетания",
        "Принцип Дирихле",
        "Игры с полной информацией"
      ]}
    ],
    keywords: [/combinator|комбинат|дирихле|игра|перестанов/i]
  },
  {
    id: 5,
    title: "Графы",
    sections: [
      { level: "Advanced", items: [
        "Обход графов",
        "Кратчайшие пути",
        "Минимальное остовное дерево"
      ]}
    ],
    keywords: [/graph|граф|остовн|пути|обход/i]
  },
]

export default curriculum
