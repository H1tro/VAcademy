export type Material = {
  name: string
  url: string
}

export type FizikaTopic = {
  id: number
  title: string
  section: string
  level: "Beginner" | "Intermediate" | "Advanced"
  sections: { level: string; items: string[] }[]
  mathPrerequisites: string[]
  materials: Material[]
  keywords: RegExp[]
}

export const curriculum: FizikaTopic[] = [
  // ===== BEGINNER (17 topics) =====
  {
    id: 1,
    title: "Основы физики и измерений",
    section: "Основы",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Система СИ",
          "Физические величины",
          "Размерности",
          "Перевод единиц",
          "Значащие цифры",
          "Оценка порядка величины",
        ],
      },
    ],
    mathPrerequisites: [
      "Дроби и проценты",
      "Степени десяти",
      "Научная запись числа",
      "Пропорции",
      "Работа с формулами",
      "Размерностный анализ",
    ],
    materials: [
      { name: "Khan Academy: Units and Measurement", url: "https://www.khanacademy.org/science/physics/intro-to-physics/units-and-dimensions" },
    ],
    keywords: [/измерени|система си|единиц/i],
  },
  {
    id: 2,
    title: "Векторы и скаляры",
    section: "Механика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Скалярные и векторные величины",
          "Сложение векторов",
          "Разложение по осям",
          "Проекции векторов",
          "Равновесие нескольких векторов",
        ],
      },
    ],
    mathPrerequisites: [
      "Координатная плоскость",
      "Теорема Пифагора",
      "Синус, косинус и тангенс",
      "Прямоугольные треугольники",
      "Проекции отрезков",
    ],
    materials: [
      { name: "Khan Academy: Vectors", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws/vector-addition" },
    ],
    keywords: [/вектор|скаляр/i],
  },
  {
    id: 3,
    title: "Кинематика",
    section: "Механика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Система отсчёта",
          "Путь и перемещение",
          "Скорость",
          "Равномерное движение",
          "Ускорение",
          "Равноускоренное движение",
          "Свободное падение",
          "Графики x(t), v(t), a(t)",
        ],
      },
    ],
    mathPrerequisites: [
      "Функции и графики",
      "Системы уравнений",
      "Квадратные уравнения",
      "Наклон прямой",
      "Таблицы значений",
      "Базовая тригонометрия",
    ],
    materials: [
      { name: "Khan Academy: Kinematic Equations", url: "https://www.khanacademy.org/science/physics/one-dimensional-motion" },
      { name: "Khan Academy: 2D Kinematics", url: "https://www.khanacademy.org/science/physics/two-dimensional-motion" },
    ],
    keywords: [/кинемат|движени/i],
  },
  {
    id: 4,
    title: "Законы Ньютона",
    section: "Механика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Инерция",
          "Первый, второй и третий законы Ньютона",
          "Сила тяжести",
          "Реакция опоры",
          "Сила натяжения",
          "Сила трения",
          "Наклонная плоскость",
          "Связанные тела",
        ],
      },
    ],
    mathPrerequisites: [
      "Системы линейных уравнений",
      "Разложение величин по осям",
      "Работа со знаками",
      "Тригонометрические тождества",
      "Преобразование формул",
    ],
    materials: [
      { name: "Khan Academy: Forces and Newton's Laws", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws" },
      { name: "Khan Academy: Friction", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws#inclined-planes-friction" },
    ],
    keywords: [/ньютон|динамик/i],
  },
  {
    id: 5,
    title: "Работа, энергия и мощность",
    section: "Механика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Механическая работа",
          "Мощность",
          "Кинетическая энергия",
          "Потенциальная энергия",
          "Закон сохранения энергии",
          "КПД",
          "Работа силы трения",
        ],
      },
    ],
    mathPrerequisites: [
      "Квадраты и корни",
      "Пропорции",
      "Площадь прямоугольника и треугольника",
      "График силы и перемещения",
      "Средние значения",
    ],
    materials: [
      { name: "Khan Academy: Work and Energy", url: "https://www.khanacademy.org/science/physics/work-and-energy" },
    ],
    keywords: [/работа|энерг|мощност/i],
  },
  {
    id: 6,
    title: "Импульс и столкновения",
    section: "Механика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Импульс тела",
          "Импульс силы",
          "Закон сохранения импульса",
          "Отдача",
          "Упругие и неупругие столкновения",
          "Реактивное движение",
          "Центр масс простой системы",
        ],
      },
    ],
    mathPrerequisites: [
      "Линейные системы",
      "Координаты вектора",
      "Среднее взвешенное",
      "Алгебраические преобразования",
      "Графическое решение",
    ],
    materials: [
      { name: "Khan Academy: Momentum", url: "https://www.khanacademy.org/science/physics/linear-momentum" },
    ],
    keywords: [/импульс|столкновен|сохранени/i],
  },
  {
    id: 7,
    title: "Статика",
    section: "Механика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Условия равновесия",
          "Момент силы",
          "Плечо силы",
          "Рычаги",
          "Блоки",
          "Центр тяжести",
          "Устойчивость тела",
        ],
      },
    ],
    mathPrerequisites: [
      "Подобие треугольников",
      "Теорема Пифагора",
      "Сумма моментов",
      "Геометрический центр фигур",
      "Решение линейных уравнений",
    ],
    materials: [
      { name: "Khan Academy: Torque and Equilibrium", url: "https://www.khanacademy.org/science/torque-and-equilibrium" },
    ],
    keywords: [/статик|равновес|момент/i],
  },
  {
    id: 8,
    title: "Гравитация",
    section: "Механика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Закон всемирного тяготения",
          "Ускорение свободного падения",
          "Вес тела",
          "Первая космическая скорость",
          "Движение спутников на базовом уровне",
          "Потенциальная энергия вблизи поверхности Земли",
        ],
      },
    ],
    mathPrerequisites: [
      "Обратная пропорциональность",
      "Квадратичные зависимости",
      "Окружность",
      "Радиан",
      "Приближённые вычисления",
    ],
    materials: [
      { name: "Khan Academy: Gravitational Force", url: "https://www.khanacademy.org/science/physics/centripetal-force-and-gravitation" },
    ],
    keywords: [/гравит|тяготени/i],
  },
  {
    id: 9,
    title: "Давление и жидкости",
    section: "Молекулярная физика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Давление",
          "Закон Паскаля",
          "Гидростатическое давление",
          "Собщающиеся сосуды",
          "Архимедова сила",
          "Плавание тел",
          "Атмосферное давление",
        ],
      },
    ],
    mathPrerequisites: [
      "Площади плоских фигур",
      "Объёмы тел",
      "Пропорции",
      "Плотность как отношение величин",
      "Единицы площади и объёма",
    ],
    materials: [
      { name: "Khan Academy: Fluids", url: "https://www.khanacademy.org/science/physics/fluids" },
    ],
    keywords: [/давлени|жидкост|архимед/i],
  },
  {
    id: 10,
    title: "Температура и молекулярная физика",
    section: "Молекулярная физика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Молекулы и атомы",
          "Тепловое движение",
          "Диффузия",
          "Агрегатные состояния",
          "Абсолютная температура",
          "Внутренняя энергия",
        ],
      },
    ],
    mathPrerequisites: [
      "Линейные зависимости",
      "Перевод температурных шкал",
      "Средние значения",
      "Степени десяти",
      "Чтение графиков",
    ],
    materials: [
      { name: "Khan Academy: Temperature and Kinetic Theory", url: "https://www.khanacademy.org/science/physics/thermodynamics" },
    ],
    keywords: [/температур|молекул|теплов/i],
  },
  {
    id: 11,
    title: "Тепловые явления",
    section: "Молекулярная физика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Количество теплоты",
          "Удельная теплоёмкость",
          "Уравнение теплового баланса",
          "Плавление и кристаллизация",
          "Испарение и конденсация",
          "КПД нагревателей",
        ],
      },
    ],
    mathPrerequisites: [
      "Линейные уравнения",
      "Суммирование вкладов",
      "Уравнения с параметрами",
      "Перевод единиц",
      "Средневзвешенные величины",
    ],
    materials: [
      { name: "Khan Academy: Heat and Temperature", url: "https://www.khanacademy.org/science/physics/thermodynamics" },
    ],
    keywords: [/теплот|теплов|плавлен/i],
  },
  {
    id: 12,
    title: "Электрический заряд и поле",
    section: "Электричество",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Электрический заряд",
          "Закон сохранения заряда",
          "Закон Кулона на базовом уровне",
          "Электризация тел",
          "Проводники и диэлектрики",
          "Линии электрического поля",
        ],
      },
    ],
    mathPrerequisites: [
      "Обратная пропорциональность",
      "Квадратичные зависимости",
      "Сложение направленных величин",
      "Степенные функции",
      "Научная запись числа",
    ],
    materials: [
      { name: "Khan Academy: Coulomb's Law", url: "https://www.khanacademy.org/science/physics/electric-charge-electric-force-and-voltage" },
    ],
    keywords: [/кулон|заряд|электр/i],
  },
  {
    id: 13,
    title: "Постоянный электрический ток",
    section: "Электричество",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Сила тока",
          "Напряжение",
          "Сопротивление",
          "Закон Ома",
          "Последовательное соединение",
          "Параллельное соединение",
          "Работа и мощность тока",
          "Закон Джоуля-Ленца",
        ],
      },
    ],
    mathPrerequisites: [
      "Системы уравнений",
      "Дроби и обратные величины",
      "Пропорции",
      "График I(U)",
      "Суммирование сопротивлений",
    ],
    materials: [
      { name: "Khan Academy: Ohm's Law", url: "https://www.khanacademy.org/science/physics/circuits" },
      { name: "Khan Academy: Circuits", url: "https://www.khanacademy.org/science/physics/circuits" },
    ],
    keywords: [/ом|ток|сопротивлен/i],
  },
  {
    id: 14,
    title: "Магнитные явления",
    section: "Электричество",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Магнитное поле",
          "Магнитное поле тока",
          "Сила Ампера",
          "Действие поля на проводник",
          "Правило левой руки",
          "Электромагниты",
        ],
      },
    ],
    mathPrerequisites: [
      "Направления в пространстве",
      "Угол между векторами",
      "Синус угла",
      "Координатная система",
      "Пропорциональности",
    ],
    materials: [
      { name: "Khan Academy: Magnetism", url: "https://www.khanacademy.org/science/physics/magnetic-forces-and-magnetic-fields" },
    ],
    keywords: [/магнит|ампер/i],
  },
  {
    id: 15,
    title: "Геометрическая оптика",
    section: "Оптика",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Распространение света",
          "Отражение",
          "Преломление",
          "Плоское зеркало",
          "Линзы",
          "Построение изображений",
          "Оптическая сила",
        ],
      },
    ],
    mathPrerequisites: [
      "Подобие треугольников",
      "Углы и биссектрисы",
      "Синус и косинус",
      "Радиус кривизны",
      "Обратные величины",
    ],
    materials: [
      { name: "Khan Academy: Geometric Optics", url: "https://www.khanacademy.org/science/physics/geometric-optics" },
      { name: "Khan Academy: Lenses and Mirrors", url: "https://www.khanacademy.org/science/physics/geometric-optics" },
    ],
    keywords: [/оптик|линз|отражен|преломл/i],
  },
  {
    id: 16,
    title: "Колебания и волны",
    section: "Колебания и волны",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Период и частота",
          "Амплитуда",
          "Маятник",
          "Пружинный маятник",
          "Длина волны",
          "Скорость волны",
          "Звук",
        ],
      },
    ],
    mathPrerequisites: [
      "Синусоидальная функция",
      "Периодические функции",
      "Радианы",
      "Пропорции",
      "Графики колебаний",
    ],
    materials: [
      { name: "Khan Academy: Simple Harmonic Motion", url: "https://www.khanacademy.org/science/physics/mechanical-waves-and-sound" },
    ],
    keywords: [/колебан|волн|маятник/i],
  },
  {
    id: 17,
    title: "Экспериментальная физика",
    section: "Эксперимент",
    level: "Beginner",
    sections: [
      {
        level: "Beginner",
        items: [
          "Измерения",
          "Таблицы результатов",
          "Прямые и косвенные измерения",
          "Среднее значение",
          "Абсолютная и относительная погрешность",
          "Построение графиков",
        ],
      },
    ],
    mathPrerequisites: [
      "Среднее арифметическое",
      "Разность и относительная ошибка",
      "Масштаб",
      "Наклон прямой",
      "Линейная зависимость",
    ],
    materials: [
      { name: "Khan Academy: Measurement", url: "https://www.khanacademy.org/science/physics/intro-to-physics" },
    ],
    keywords: [/эксперимент|измерен|погрешност/i],
  },

  // ===== INTERMEDIATE (24 topics) =====
  {
    id: 18,
    title: "Движение в двух и трёх измерениях",
    section: "Механика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Бросок под углом",
          "Горизонтальный бросок",
          "Относительное движение",
          "Движение по окружности",
          "Тангенциальное и нормальное ускорение",
          "Криволинейное движение",
        ],
      },
    ],
    mathPrerequisites: [
      "Параметрические уравнения",
      "Производная как скорость изменения",
      "Векторные компоненты",
      "Тригонометрические тождества",
      "Геометрия окружности",
    ],
    materials: [
      { name: "Khan Academy: 2D Motion", url: "https://www.khanacademy.org/science/physics/two-dimensional-motion" },
    ],
    keywords: [/кинемат|двух измерен/i],
  },
  {
    id: 19,
    title: "Законы сохранения в механике",
    section: "Механика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Центр масс",
          "Импульс системы",
          "Столкновения в двух измерениях",
          "Упругие столкновения",
          "Баллистический маятник",
          "Работа переменной силы",
          "Потенциальные диаграммы",
        ],
      },
    ],
    mathPrerequisites: [
      "Скалярное произведение",
      "Системы уравнений",
      "Площадь под графиком",
          "Квадратичные формы",
      "Средние и относительные величины",
    ],
    materials: [
      { name: "Khan Academy: Conservation of Energy", url: "https://www.khanacademy.org/science/physics/work-and-energy" },
    ],
    keywords: [/сохранен|импульс|энерг/i],
  },
  {
    id: 20,
    title: "Вращательное движение",
    section: "Механика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Угловая скорость",
          "Угловое ускорение",
          "Момент инерции",
          "Теорема Штейнера",
          "Кинетическая энергия вращения",
          "Момент импульса",
          "Качение без проскальзывания",
        ],
      },
    ],
    mathPrerequisites: [
      "Радианы",
      "Производные угловых функций",
      "Определённый интеграл",
      "Скалярное и векторное произведение",
      "Геометрия масс",
    ],
    materials: [
      { name: "Khan Academy: Rotational Motion", url: "https://www.khanacademy.org/science/torque-and-equilibrium" },
    ],
    keywords: [/вращен|момент|инерц/i],
  },
  {
    id: 21,
    title: "Неинерциальные системы",
    section: "Механика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Силы инерции",
          "Центробежная сила",
          "Сила Кориолиса",
          "Равновесие во вращающейся системе",
          "Маятник Фуко на качественном уровне",
        ],
      },
    ],
    mathPrerequisites: [
      "Векторное произведение",
      "Производные векторов",
      "Угловая скорость как вектор",
      "Координатные преобразования",
      "Тригонометрические разложения",
    ],
    materials: [
      { name: "Khan Academy: Non-inertial frames", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws" },
    ],
    keywords: [/неинерци|псевдосил|кориолис/i],
  },
  {
    id: 22,
    title: "Гравитация и орбиты",
    section: "Механика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Законы Кеплера",
          "Орбитальная скорость",
          "Период обращения",
          "Потенциал гравитационного поля",
          "Энергия орбиты",
          "Эллиптические траектории",
          "Скорость убегания",
        ],
      },
    ],
    mathPrerequisites: [
      "Обратные квадраты",
      "Эллипс",
      "Полярные координаты",
      "Производные",
      "Приближённые разложения",
      "Простые уравнения движения",
    ],
    materials: [
      { name: "Khan Academy: Kepler's Laws", url: "https://www.khanacademy.org/science/cosmology-and-astronomy/earth-history-topic" },
    ],
    keywords: [/кеплер|орбит|гравит/i],
  },
  {
    id: 23,
    title: "Гидродинамика",
    section: "Молекулярная физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Уравнение неразрывности",
          "Уравнение Бернулли",
          "Истечение из отверстий",
          "Закон Торричелли",
          "Ламинарное течение",
          "Вязкость",
          "Закон Стокса",
          "Поверхностное натяжение",
        ],
      },
    ],
    mathPrerequisites: [
      "Дифференцирование",
      "Интегрирование простых функций",
      "Анализ размерностей",
      "Поток через поверхность",
      "Оценка порядков величин",
    ],
    materials: [
      { name: "Khan Academy: Fluid Dynamics", url: "https://www.khanacademy.org/science/physics/fluids" },
    ],
    keywords: [/гидродинамик|бернулли|течени/i],
  },
  {
    id: 24,
    title: "Упругость и деформация",
    section: "Молекулярная физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Напряжение и деформация",
          "Закон Гука",
          "Модуль Юнга",
          "Сдвиг и кручение",
          "Энергия деформации",
          "Изгиб балок",
          "Устойчивость стержней",
        ],
      },
    ],
    mathPrerequisites: [
      "Наклон графика",
      "Пропорциональность",
      "Производная",
      "Интеграл площади",
      "Геометрия сечений",
      "Степенные зависимости",
    ],
    materials: [
      { name: "Khan Academy: Springs and Hooke's Law", url: "https://www.khanacademy.org/science/physics/mechanical-waves-and-sound" },
    ],
    keywords: [/упруг|деформац|гук/i],
  },
  {
    id: 25,
    title: "Молекулярно-кинетическая теория",
    section: "Молекулярная физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Идеальный газ",
          "Уравнение состояния",
          "Давление как результат столкновений",
          "Средняя кинетическая энергия",
          "Среднеквадратичная скорость",
          "Число Авогадро",
          "Степени свободы",
        ],
      },
    ],
    mathPrerequisites: [
      "Формулы с несколькими переменными",
      "Средние квадраты",
      "Логарифмы",
      "Основы вероятности",
      "Интеграл распределения",
      "Графики функций",
    ],
    materials: [
      { name: "Khan Academy: Ideal Gas Law", url: "https://www.khanacademy.org/science/physics/thermodynamics/temp-kinetic-theory-ideal-gas-law" },
    ],
    keywords: [/молекул|газ|кинетик/i],
  },
  {
    id: 26,
    title: "Термодинамика",
    section: "Молекулярная физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Работа газа",
          "Первый закон термодинамики",
          "Изопроцессы",
          "Адиабатный процесс",
          "Тепловые машины",
          "Цикл Карно",
          "КПД",
          "Энтропия на качественном уровне",
        ],
      },
    ],
    mathPrerequisites: [
      "Площадь под графиком p(V)",
      "Степенные функции",
      "Логарифмы",
      "Циклические процессы",
      "Средние значения",
      "Уравнения с параметрами",
    ],
    materials: [
      { name: "Khan Academy: Thermodynamics", url: "https://www.khanacademy.org/science/physics/thermodynamics" },
    ],
    keywords: [/термодинамик|изопроцес|карно/i],
  },
  {
    id: 27,
    title: "Реальные газы и фазовые переходы",
    section: "Молекулярная физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Уравнение Ван-дер-Ваальса",
          "Насыщенный пар",
          "Влажность",
          "Точка росы",
          "Критическая точка",
          "Фазовые диаграммы",
          "Теплопроводность и диффузия",
        ],
      },
    ],
    mathPrerequisites: [
      "Фазовые диаграммы",
      "Производная и экстремум",
      "Логарифмы",
      "Интерполяция",
      "Размерностный анализ",
    ],
    materials: [
      { name: "Khan Academy: Phase Diagrams", url: "https://www.khanacademy.org/science/physics/thermodynamics" },
    ],
    keywords: [/реальн.*газ|фазов|ван-дер-ваальс/i],
  },
  {
    id: 28,
    title: "Электрическое поле и потенциал",
    section: "Электричество",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Закон Кулона в векторной форме",
          "Принцип суперпозиции",
          "Напряжённость поля",
          "Потенциал",
          "Работа электрического поля",
          "Эквипотенциальные поверхности",
          "Электрический диполь",
          "Теорема Гаусса для симметричных задач",
        ],
      },
    ],
    mathPrerequisites: [
      "Скалярное произведение",
      "Градиент на интуитивном уровне",
      "Поверхностные интегралы",
      "Симметрия",
      "Полярные и цилиндрические координаты",
    ],
    materials: [
      { name: "Khan Academy: Electric Potential", url: "https://www.khanacademy.org/science/physics/electric-charge-electric-force-and-voltage" },
    ],
    keywords: [/потенциал|гаусс|кулон/i],
  },
  {
    id: 29,
    title: "Конденсаторы и диэлектрики",
    section: "Электричество",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Электрическая ёмкость",
          "Плоский конденсатор",
          "Соединения конденсаторов",
          "Энергия поля",
          "Диэлектрики",
          "Поляризация",
          "Зарядка и разрядка конденсатора",
        ],
      },
    ],
    mathPrerequisites: [
      "Обратные величины",
      "Системы уравнений",
      "Экспонента",
      "Графики затухания",
      "Последовательности",
      "Интеграл энергии",
    ],
    materials: [
      { name: "Khan Academy: Capacitors", url: "https://www.khanacademy.org/science/physics/capacitors-topic" },
    ],
    keywords: [/конденсатор|ёмкост|диэлектрик/i],
  },
  {
    id: 30,
    title: "Сложные электрические цепи",
    section: "Электричество",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Законы Кирхгофа",
          "Внутреннее сопротивление",
          "Смешанные цепи",
          "Потенциалы узлов",
          "Мостовые схемы",
          "Шунты",
          "Измерительные цепи",
          "RC-переходные процессы",
        ],
      },
    ],
    mathPrerequisites: [
      "Метод Гаусса",
      "Матрицы на базовом уровне",
      "Экспоненциальные функции",
      "ОДУ первого порядка",
      "Графики переходных процессов",
    ],
    materials: [
      { name: "Khan Academy: DC Circuits", url: "https://www.khanacademy.org/science/physics/circuits" },
    ],
    keywords: [/кирхгоф|цеп|мост/i],
  },
  {
    id: 31,
    title: "Магнитное поле и индукция",
    section: "Электричество",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Сила Лоренца",
          "Движение заряда в магнитном поле",
          "Циклотронное движение",
          "Закон Ампера",
          "Закон Био-Савара-Лапласа",
          "Магнитный поток",
          "Закон Фарадея",
          "Правило Ленца",
          "Самоиндукция",
        ],
      },
    ],
    mathPrerequisites: [
      "Синус угла между векторами",
      "Производная потока",
      "Интегралы по контурам",
      "Параметрические уравнения",
      "Дифференциальные уравнения",
    ],
    materials: [
      { name: "Khan Academy: Magnetic Induction", url: "https://www.khanacademy.org/science/physics/magnetic-forces-and-magnetic-fields" },
    ],
    keywords: [/индукци|лоренц|фарадей/i],
  },
  {
    id: 32,
    title: "Электромагнитные колебания и переменный ток",
    section: "Электричество",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "LC-контур",
          "RLC-контур",
          "Энергия поля",
          "Резонанс",
          "Переменный ток",
          "Действующие значения",
          "Импеданс",
          "Трансформатор",
        ],
      },
    ],
    mathPrerequisites: [
      "Синусоидальные функции",
      "Фазовые сдвиги",
      "Экспоненциальная форма",
      "ОДУ второго порядка",
      "Векторные диаграммы",
    ],
    materials: [
      { name: "Khan Academy: AC Circuits", url: "https://www.khanacademy.org/science/physics/circuits-topic" },
    ],
    keywords: [/lc-контур|rlc|резонанс|трансформатор/i],
  },
  {
    id: 33,
    title: "Волновая оптика",
    section: "Оптика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Интерференция",
          "Разность хода",
          "Тонкие плёнки",
          "Опыт Юнга",
          "Дифракционная решётка",
          "Дифракция на щели",
          "Поляризация",
          "Закон Малюса",
        ],
      },
    ],
    mathPrerequisites: [
      "Синусоидальные функции",
      "Разность фаз",
      "Условия максимумов и минимумов",
      "Комплексная амплитуда",
      "Периодические функции",
    ],
    materials: [
      { name: "Khan Academy: Wave Optics", url: "https://www.khanacademy.org/science/physics/light-waves" },
    ],
    keywords: [/интерференц|дифракц|поляризац/i],
  },
  {
    id: 34,
    title: "Колебания и звук",
    section: "Колебания и волны",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Гармонический осциллятор",
          "Энергия колебаний",
          "Затухание",
          "Вынужденные колебания",
          "Резонанс",
          "Биения",
          "Стоячие волны",
          "Эффект Доплера",
        ],
      },
    ],
    mathPrerequisites: [
      "Синус и косинус",
      "Экспоненциальное затухание",
      "Фазовые диаграммы",
      "Комплексные амплитуды",
      "Системы линейных уравнений",
    ],
    materials: [
      { name: "Khan Academy: Waves", url: "https://www.khanacademy.org/science/physics/mechanical-waves-and-sound" },
    ],
    keywords: [/резонанс|биения|доплер/i],
  },
  {
    id: 35,
    title: "Атомная и ядерная физика: введение",
    section: "Квантовая физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Модели атома",
          "Спектры",
          "Фотоэффект",
          "Энергия фотона",
          "Радиоактивность",
          "Период полураспада",
          "Дефект массы",
          "Ядерные реакции",
        ],
      },
    ],
    mathPrerequisites: [
      "Экспоненциальный закон",
      "Логарифмические уравнения",
          "Графики распада",
      "Закон сохранения энергии и импульса",
      "Базовая вероятность",
    ],
    materials: [
      { name: "Khan Academy: Quantum Physics", url: "https://www.khanacademy.org/science/physics/quantum-physics" },
    ],
    keywords: [/атом|ядр|радиоактив|фотоэффект/i],
  },
  {
    id: 36,
    title: "Специальная теория относительности: введение",
    section: "Квантовая физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Постулаты Эйнштейна",
          "Преобразования Лоренца",
          "Замедление времени",
          "Сокращение длины",
          "Относительность одновременности",
          "Связь массы и энергии",
        ],
      },
    ],
    mathPrerequisites: [
      "Квадратичные формы",
      "Системы линейных уравнений",
      "Координатные преобразования",
      "Гипербола",
      "Предельный переход",
    ],
    materials: [
      { name: "Khan Academy: Special Relativity", url: "https://www.khanacademy.org/science/physics/special-relativity" },
    ],
    keywords: [/эйнштейн|лоренц|относительн/i],
  },
  {
    id: 37,
    title: "Экспериментальная физика",
    section: "Эксперимент",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Планирование эксперимента",
          "Выбор приборов",
          "Систематические и случайные погрешности",
          "Линеаризация зависимостей",
          "Поиск параметра по графику",
          "Проверка гипотезы",
        ],
      },
    ],
    mathPrerequisites: [
      "Среднеквадратичное отклонение",
      "Линейная регрессия",
      "Коэффициент наклона",
      "Распространение погрешности",
      "Логарифмическая линеаризация",
    ],
    materials: [
      { name: "Khan Academy: Experimental Physics", url: "https://www.khanacademy.org/science/physics" },
    ],
    keywords: [/эксперимент|погрешност|регресс/i],
  },
  {
    id: 38,
    title: "Теплопередача",
    section: "Молекулярная физика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Теплопроводность",
          "Конвекция",
          "Тепловое излучение",
          "Закон охлаждения Ньютона",
          "Диффузия",
          "Стационарный и нестационарный теплообмен",
        ],
      },
    ],
    mathPrerequisites: [
      "Градиент температуры",
      "Экспоненциальные зависимости",
      "Производные и интегралы",
      "Граничные условия",
      "Анализ размерностей",
    ],
    materials: [
      { name: "Khan Academy: Heat Transfer", url: "https://www.khanacademy.org/science/physics/thermodynamics" },
    ],
    keywords: [/теплопроводн|теплообмен|излучен/i],
  },
  {
    id: 39,
    title: "Продвинутая электростатика",
    section: "Электричество",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Проводники в электростатическом поле",
          "Метод изображений",
          "Электрический диполь",
          "Энергия системы зарядов",
          "Электростатическое давление",
          "Теорема Гаусса для симметричных систем",
        ],
      },
    ],
    mathPrerequisites: [
      "Градиент и поток",
      "Поверхностные интегралы",
      "Симметрия",
      "Полярные и цилиндрические координаты",
      "Квадратичные зависимости",
    ],
    materials: [
      { name: "Khan Academy: Electric Fields", url: "https://www.khanacademy.org/science/physics/electric-charge-electric-force-and-voltage" },
    ],
    keywords: [/электростатик|изображен|проводник/i],
  },
  {
    id: 40,
    title: "Оптические приборы и аберрации",
    section: "Оптика",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Системы линз",
          "Микроскоп",
          "Телескоп",
          "Интерферометр",
          "Увеличение и разрешающая способность",
          "Сферическая и хроматическая аберрация",
        ],
      },
    ],
    mathPrerequisites: [
      "Подобие треугольников",
      "Параксиальное приближение",
      "Производные",
      "Матричное описание лучей",
      "Оптимизация",
    ],
    materials: [
      { name: "Khan Academy: Optics Instruments", url: "https://www.khanacademy.org/science/physics/geometric-optics" },
    ],
    keywords: [/микроскоп|телескоп|интерферометр/i],
  },
  {
    id: 41,
    title: "Олимпиадные математические методы",
    section: "Методы",
    level: "Intermediate",
    sections: [
      {
        level: "Intermediate",
        items: [
          "Оценка сверху и снизу",
          "Приближения",
          "Симметрия",
          "Инварианты",
          "Логика доказательства",
          "Оценочные вычисления",
        ],
      },
    ],
    mathPrerequisites: [
      "Неравенства",
      "Ряды и приближения",
      "Производные",
      "Размерностный анализ",
      "Графический метод",
      "Анализ предельных случаев",
      "Оценка порядка величины",
    ],
    materials: [
      { name: "Khan Academy: Problem Solving", url: "https://www.khanacademy.org/computing/computer-science" },
    ],
    keywords: [/олимпиад|оценк|приближен/i],
  },

  // ===== ADVANCED (22 topics) =====
  {
    id: 42,
    title: "Аналитическая механика",
    section: "Механика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Обобщённые координаты",
          "Принцип наименьшего действия",
          "Уравнения Лагранжа",
          "Циклические координаты",
          "Законы сохранения из симметрий",
          "Канонический импульс",
          "Уравнения Гамильтона",
          "Фазовое пространство",
        ],
      },
    ],
    mathPrerequisites: [
      "Частные производные",
      "Полный дифференциал",
      "Многомерные функции",
      "Вариации функционалов",
      "Матрицы и определители",
      "Обыкновенные дифференциальные уравнения",
    ],
    materials: [
      { name: "MIT OCW: Analytical Mechanics", url: "https://ocw.mit.edu/courses/8-01sc-physics-i-classical-mechanics-fall-2016/" },
    ],
    keywords: [/лагранж|гамильтон|действи/i],
  },
  {
    id: 43,
    title: "Продвинутая динамика твёрдого тела",
    section: "Механика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Тензор инерции",
          "Главные оси инерции",
          "Уравнения Эйлера",
          "Свободное вращение",
          "Прецессия и нутация",
          "Устойчивость вращения",
          "Гироскопические системы",
        ],
      },
    ],
    mathPrerequisites: [
      "Собственные значения матриц",
      "Диагонализация",
      "Линейные системы ОДУ",
      "Комплексные числа",
      "Гармонический анализ",
    ],
    materials: [
      { name: "MIT OCW: Rigid Body Dynamics", url: "https://ocw.mit.edu/courses/8-01sc-physics-i-classical-mechanics-fall-2016/" },
    ],
    keywords: [/твёрд.*тел|тензор|эйлер|нутац/i],
  },
  {
    id: 44,
    title: "Малые колебания и нормальные моды",
    section: "Механика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Линеаризация уравнений",
          "Нормальные координаты",
          "Связанные осцилляторы",
          "Собственные частоты",
          "Дисперсия в цепочках",
          "Волны в дискретных системах",
          "Фононы на качественном уровне",
        ],
      },
    ],
    mathPrerequisites: [
      "Матрицы",
          "Собственные значения и векторы",
      "Тензоры второго ранга",
      "Векторное произведение",
      "Системы дифференциальных уравнений",
    ],
    materials: [
      { name: "MIT OCW: Normal Modes", url: "https://ocw.mit.edu/courses/8-01sc-physics-i-classical-mechanics-fall-2016/" },
    ],
    keywords: [/нормальн.*мод|осциллятор|фонон/i],
  },
  {
    id: 45,
    title: "Механика сплошных сред",
    section: "Механика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Уравнения Эйлера",
          "Уравнение Навье-Стокса на базовом уровне",
          "Вихревое движение",
          "Потенциальное течение",
          "Число Рейнольдса",
          "Волны на поверхности жидкости",
          "Тензор напряжений",
          "Уравнения упругости",
        ],
      },
    ],
    mathPrerequisites: [
      "Дивергенция и ротор",
      "Поток и циркуляция",
      "Частные производные",
      "Граничные условия",
      "Безразмерные параметры",
      "Уравнения в частных производных",
    ],
    materials: [
      { name: "MIT OCW: Fluid Mechanics", url: "https://ocw.mit.edu/courses/2-06-fluid-mechanics-spring-2012/" },
    ],
    keywords: [/навье-стокс|сплошн.*сред|вихр/i],
  },
  {
    id: 46,
    title: "Статистическая физика",
    section: "Молекулярная физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Микросостояния и макросостояния",
          "Энтропия Больцмана",
          "Распределение Максвелла",
          "Распределение Больцмана",
          "Канонический ансамбль",
          "Флуктуации",
          "Фазовые переходы",
          "Вырожденный газ на вводном уровне",
        ],
      },
    ],
    mathPrerequisites: [
      "Дискретные и непрерывные распределения",
      "Многомерные интегралы",
      "Экспоненты и логарифмы",
      "Нормальное распределение",
      "Производящие функции",
      "Комбинаторика",
    ],
    materials: [
      { name: "MIT OCW: Statistical Physics", url: "https://ocw.mit.edu/courses/8-333-statistical-mechanics-i-statistical-mechanics-of-particles-fall-2013/" },
    ],
    keywords: [/статистическ.* физик|больцман|максвелл/i],
  },
  {
    id: 47,
    title: "Продвинутая термодинамика",
    section: "Молекулярная физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Энтальпия",
          "Свободная энергия",
          "Потенциал Гиббса",
          "Химический потенциал",
          "Соотношения Максвелла",
          "Условия устойчивости",
          "Критические явления",
          "Фазовые равновесия",
        ],
      },
    ],
    mathPrerequisites: [
      "Частные производные",
      "Полные дифференциалы",
      "Якобианы",
      "Экстремумы функций нескольких переменных",
      "Дифференциальные формы",
      "Логарифмические преобразования",
    ],
    materials: [
      { name: "MIT OCW: Thermodynamics", url: "https://ocw.mit.edu/courses/2-005-thermal-fluids-engineering-i-fall-2011/" },
    ],
    keywords: [/энталпиа|гиббс|максвелл.*соотношен/i],
  },
  {
    id: 48,
    title: "Уравнения Максвелла",
    section: "Электричество",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Электрическое и магнитное поля",
          "Поток и циркуляция поля",
          "Уравнения Максвелла",
          "Ток смещения",
          "Граничные условия",
          "Электромагнитные волны",
          "Энергия и импульс поля",
        ],
      },
    ],
    mathPrerequisites: [
      "Градиент, дивергенция и ротор",
      "Теоремы Гаусса и Стокса",
      "Поверхностные и объёмные интегралы",
      "Уравнения в частных производных",
      "Граничные задачи",
    ],
    materials: [
      { name: "MIT OCW: Electromagnetism", url: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/" },
    ],
    keywords: [/максвелл|электромагнит/i],
  },
  {
    id: 49,
    title: "Продвинутая электродинамика",
    section: "Электричество",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Запаздывающие потенциалы",
          "Дипольное излучение",
          "Давление света",
          "Волноводы",
          "Поляризация волн",
          "Дисперсия и поглощение",
          "Плазменные колебания",
          "Электромагнитные резонаторы",
        ],
      },
    ],
    mathPrerequisites: [
      "Волновое уравнение",
      "Преобразование Фурье",
      "Комплексные функции",
      "Граничные задачи",
      "Векторные потенциалы",
    ],
    materials: [
      { name: "MIT OCW: Advanced Electrodynamics", url: "https://ocw.mit.edu/courses/8-07-electromagnetism-ii-fall-2012/" },
    ],
    keywords: [/электродинамик|излучен|волновод/i],
  },
  {
    id: 50,
    title: "Квантовая механика",
    section: "Квантовая физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Волновая функция",
          "Вероятностная интерпретация",
          "Уравнение Шрёдингера",
          "Квантование энергии",
          "Потенциальная яма",
          "Туннельный эффект",
          "Гармонический осциллятор",
          "Принцип неопределённости",
          "Операторы и измерения",
        ],
      },
    ],
    mathPrerequisites: [
      "Комплексная экспонента",
      "Дифференциальные уравнения",
      "Собственные значения и функции",
      "Нормировка",
      "Скалярное произведение функций",
      "Вероятностные распределения",
    ],
    materials: [
      { name: "MIT OCW: Quantum Mechanics", url: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/" },
    ],
    keywords: [/квантов.*механик|шрёдингер|туннель/i],
  },
  {
    id: 51,
    title: "Атомная физика",
    section: "Квантовая физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Атом водорода",
          "Энергетические уровни",
          "Спектральные серии",
          "Квантовые числа",
          "Спин на качественном уровне",
          "Правила отбора",
          "Поглощение и испускание фотонов",
          "Лазерный принцип",
        ],
      },
    ],
    mathPrerequisites: [
      "Дифференциальные уравнения",
      "Ортогональность функций",
      "Комплексные числа",
      "Спектральное разложение",
      "Вероятностные распределения",
    ],
    materials: [
      { name: "MIT OCW: Atomic Physics", url: "https://ocw.mit.edu/courses/8-421-atomic-and-optical-physics-i-spring-2008/" },
    ],
    keywords: [/атом.* физик|спектр|спин|лазер/i],
  },
  {
    id: 52,
    title: "Ядерная физика",
    section: "Квантовая физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Строение ядра",
          "Энергия связи",
          "Радиоактивные цепочки",
          "Альфа-, бета- и гамма-распад",
          "Ядерные реакции",
          "Деление и синтез",
          "Ядерные сечения",
          "Дозиметрия",
        ],
      },
    ],
    mathPrerequisites: [
      "Дифференциальные уравнения распада",
      "Пуассоновское распределение",
      "Закон сохранения энергии и импульса",
      "Релятивистская кинематика",
      "Логарифмы",
    ],
    materials: [
      { name: "MIT OCW: Nuclear Physics", url: "https://ocw.mit.edu/courses/22-101-applied-nuclear-physics-fall-2005/" },
    ],
    keywords: [/ядр.* физик|распад|делен|синтез/i],
  },
  {
    id: 53,
    title: "Физика элементарных частиц",
    section: "Квантовая физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Кварки и лептоны",
          "Античастицы",
          "Фундаментальные взаимодействия",
          "Диаграммы реакций",
          "Квантовые числа",
          "Энергия порога реакции",
          "Распады частиц",
        ],
      },
    ],
    mathPrerequisites: [
      "Четырёхмерные импульсы",
      "Квадратичные уравнения",
      "Системы законов сохранения",
      "Вероятности",
      "Графы реакций",
    ],
    materials: [
      { name: "MIT OCW: Particle Physics", url: "https://ocw.mit.edu/courses/8-701-introduction-to-nuclear-and-particle-physics-fall-2020/" },
    ],
    keywords: [/частиц|кварк|лептон|античастиц/i],
  },
  {
    id: 54,
    title: "Специальная теория относительности",
    section: "Квантовая физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Преобразования Лоренца",
          "Пространственно-временной интервал",
          "Четырёхмерный импульс",
          "Релятивистская энергия",
          "Сложение скоростей",
          "Доплеровский эффект для света",
          "Пороговые энергии реакций",
          "Релятивистские столкновения",
        ],
      },
    ],
    mathPrerequisites: [
      "Матрицы преобразований",
      "Квадратичные формы",
      "Гиперболические функции",
      "Четырёхмерные векторы",
      "Инварианты",
    ],
    materials: [
      { name: "MIT OCW: Special Relativity", url: "https://ocw.mit.edu/courses/8-20-introduction-to-special-relativity-january-iap-2012/" },
    ],
    keywords: [/лоренц|релятивист|интервал/i],
  },
  {
    id: 55,
    title: "Астрофизика и космология",
    section: "Астрофизика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Светимость и звёздные величины",
          "Спектры звёзд",
          "Закон Стефана-Больцмана",
          "Закон Вина",
          "Диаграмма Герцшпрунга-Рассела",
          "Строение звёзд",
          "Белые карлики",
          "Нейтронные звёзды",
          "Чёрные дыры на вводном уровне",
          "Расширение Вселенной",
        ],
      },
    ],
    mathPrerequisites: [
      "Логарифмические шкалы",
      "Оценки порядков величин",
      "Дифференциальные уравнения",
      "Геометрия сфер",
      "Закон обратных квадратов",
      "Работа с большими расстояниями и временами",
    ],
    materials: [
      { name: "MIT OCW: Astrophysics", url: "https://ocw.mit.edu/courses/8-282-astrophysics-i-solar-physics-fall-2003/" },
    ],
    keywords: [/астрофизик|звёзд|космолог/i],
  },
  {
    id: 56,
    title: "Продвинутая экспериментальная физика",
    section: "Эксперимент",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Калибровка приборов",
          "Корреляция величин",
          "Нелинейная регрессия",
          "Метод наименьших квадратов",
          "Доверительные интервалы",
          "Распространение неопределённостей",
          "Проверка согласия модели с данными",
        ],
      },
    ],
    mathPrerequisites: [
      "Теория вероятностей",
      "Ковариация и корреляция",
      "Регрессия",
      "Численное решение уравнений",
      "Интерполяция и экстраполяция",
      "Оценка статистической значимости",
    ],
    materials: [
      { name: "MIT OCW: Experimental Methods", url: "https://ocw.mit.edu/courses/8-13-experimental-physics-i-jii-fall-2016/" },
    ],
    keywords: [/эксперимент|калибровк|регресс/i],
  },
  {
    id: 57,
    title: "Численные методы и моделирование",
    section: "Методы",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Численное интегрирование",
          "Численное дифференцирование",
          "Метод Эйлера",
          "Метод Рунге-Кутты на вводном уровне",
          "Моделирование движения",
          "Решение цепей и колебаний",
          "Метод Монте-Карло",
          "Численный поиск экстремума",
        ],
      },
    ],
    mathPrerequisites: [
      "Алгоритмы и циклы",
      "Массивы и таблицы",
      "Погрешность округления",
      "Итерационные методы",
      "Графики функций",
      "Основы Python или другого языка",
    ],
    materials: [
      { name: "MIT OCW: Computational Methods", url: "https://ocw.mit.edu/courses/18-335j-numerical-methods-for-scientific-computing-fall-2006/" },
    ],
    keywords: [/численн.*метод|моделирован|монте-карло/i],
  },
  {
    id: 58,
    title: "Смешанные олимпиадные задачи",
    section: "Олимпиады",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Механика с электричеством",
          "Колебания в механических и электрических системах",
          "Тепловые и механические процессы",
          "Электромагнитные силы в движущихся системах",
          "Оптика и механика",
          "Оценочные задачи",
          "Многоэтапные задачи",
          "Нестандартные модели",
        ],
      },
    ],
    mathPrerequisites: [
      "Полный математический анализ",
      "Векторы и матрицы",
      "Дифференциальные уравнения",
      "Вероятность и статистика",
      "Комплексные числа",
      "Размерностный анализ",
      "Приближённые методы",
      "Логика доказательства",
    ],
    materials: [
      { name: "IPhO Problems", url: "https://ipho-new.org/problems/" },
      { name: "Khan Academy: Physics Problems", url: "https://www.khanacademy.org/science/physics" },
    ],
    keywords: [/олимпиад|смешан/i],
  },
  {
    id: 59,
    title: "Центральное движение и небесная механика",
    section: "Механика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Эффективный потенциал",
          "Радиальное и угловое движение",
          "Орбиты в центральном поле",
          "Прецессия орбит",
          "Приливные эффекты",
          "Задача двух тел",
          "Основы задачи трёх тел",
        ],
      },
    ],
    mathPrerequisites: [
      "Производные в полярной системе",
      "Дифференциальные уравнения второго порядка",
      "Интегралы движения",
      "Приближённые методы",
      "Геометрия конических сечений",
    ],
    materials: [
      { name: "MIT OCW: Classical Mechanics", url: "https://ocw.mit.edu/courses/8-01sc-physics-i-classical-mechanics-fall-2016/" },
    ],
    keywords: [/центральн.* движени|небесн.* механик|двух тел/i],
  },
  {
    id: 60,
    title: "Продвинутая оптика",
    section: "Оптика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Интерферометры",
          "Интерференция в тонких плёнках",
          "Дифракция Френеля и Фраунгофера",
          "Разрешающая способность",
          "Поляризация и двулучепреломление",
          "Оптические резонаторы",
          "Волоконная оптика и волноводы",
        ],
      },
    ],
    mathPrerequisites: [
      "Комплексные амплитуды",
      "Преобразование Фурье",
      "Интегралы",
      "Фазовые разности",
      "Граничные условия",
      "Спектральный анализ",
    ],
    materials: [
      { name: "MIT OCW: Optics", url: "https://ocw.mit.edu/courses/8-03-physics-iii-vibrations-and-waves-fall-2004/" },
    ],
    keywords: [/интерферометр|френель|фраунгофер/i],
  },
  {
    id: 61,
    title: "Перенос и неравновесные процессы",
    section: "Молекулярная физика",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Теплопроводность",
          "Диффузия",
          "Вязкость",
          "Законы Фика и Фурье",
          "Кинетика столкновений",
          "Длина свободного пробега",
          "Транспортные коэффициенты",
        ],
      },
    ],
    mathPrerequisites: [
      "Градиент и дивергенция",
      "Уравнение теплопроводности",
      "Многомерные интегралы",
      "Вероятностные распределения",
      "Анализ размерностей",
      "Граничные задачи",
    ],
    materials: [
      { name: "MIT OCW: Transport Processes", url: "https://ocw.mit.edu/courses/2-06-fluid-mechanics-spring-2012/" },
    ],
    keywords: [/перенос|неравновес|фурье|фик/i],
  },
  {
    id: 62,
    title: "Излучение и взаимодействие волн",
    section: "Электричество",
    level: "Advanced",
    sections: [
      {
        level: "Advanced",
        items: [
          "Дипольное излучение",
          "Давление света",
          "Энергия и импульс волны",
          "Дисперсия и поглощение",
          "Электромагнитные резонаторы",
          "Плазменные колебания",
          "Волноводы",
        ],
      },
    ],
    mathPrerequisites: [
      "Уравнения в частных производных",
      "Комплексные функции",
      "Преобразование Фурье",
      "Граничные условия",
      "Векторные потенциалы",
    ],
    materials: [
      { name: "MIT OCW: Electromagnetic Waves", url: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/" },
    ],
    keywords: [/излучен.*волн|взаимодействи.*волн/i],
  },
]
  // РАЗДЕЛ 1: МЕХАНИКА
  {
    id: 1,
    title: "Кинематика",
    section: "Механика",
    sections: [
      {
        level: "Beginner",
        items: [
          "Кинематика — изучение движения без рассмотрения причин",
          "Равноускоренное движение: v = v₀ + at, s = v₀t + ½at²",
          "Свободное падение (g ≈ 9.8 м/с²)",
          "Единицы: скорость м/с, ускорение м/с², время с",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Движение под углом — разложение на компоненты (v₀ₓ = v₀cosθ, v₀ᵧ = v₀sinθ)",
          "Дальность полёта R = v₀²sin(2θ)/g",
          "Максимальная высота h_max = v₀²sin²θ/(2g)",
          "Векторный анализ в двух измерениях",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Неинерциальные системы отсчёта, псевдосилы (центробежная, Кориолиса)",
          "Орбитальная механика: v = √(GM/r)",
          "Период обращения (закон Кеплера) T = 2π√(r³/GM)",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Kinematic Equations", url: "https://www.khanacademy.org/science/physics/one-dimensional-motion" },
      { name: "Khan Academy: 2D Kinematics", url: "https://www.khanacademy.org/science/physics/two-dimensional-motion" },
    ],
    keywords: [/kinemat|кинемат/i],
  },
  {
    id: 2,
    title: "Динамика и законы Ньютона",
    section: "Механика",
    sections: [
      {
        level: "Beginner",
        items: [
          "Первый закон Ньютона (инерция)",
          "Второй закон: ΣF = ma",
          "Третий закон: действие равно противодействию",
          "Единицы: сила Н (кг·м/с²), масса кг",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Динамика на наклонной плоскости",
          "Сила трения f = μN, N = mgcosθ",
          "Компонента веса вдоль плоскости mg·sinθ",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Неинерциальные системы, псевдосилы",
          "Уравнение Циолковского: Δv = vₑ·ln(m₀/m_f)",
          "Системы с переменной массой",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Forces and Newton's Laws", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws" },
      { name: "Khan Academy: Friction", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws#inclined-planes-friction" },
    ],
    keywords: [/dynam|динамик|ньютон/i],
  },
  {
    id: 3,
    title: "Гравитация и орбитальная механика",
    section: "Механика",
    sections: [
      {
        level: "Beginner",
        items: [
          "Закон всемирного тяготения: F = G·m₁m₂/r²",
          "Вес W = mg (g ≈ 9.8 м/с²)",
          "G = 6.67×10⁻¹¹ Н·м²/кг²",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Круговая орбита: v = √(GM/r)",
          "Период (закон Кеплера): T = 2π√(r³/GM)",
          "Энергия орбиты E = -GMm/(2r)",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Эллиптические орбиты, законы Кеплера",
          "Большая полуось a = (r_a + r_p)/2",
          "Эксцентриситет e = (r_a - r_p)/(r_a + r_p)",
          "Гравитационные манёвры, задача трёх тел",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Gravitational Force", url: "https://www.khanacademy.org/science/physics/centripetal-force-and-gravitation" },
      { name: "Khan Academy: Kepler's Laws", url: "https://www.khanacademy.org/science/cosmology-and-astronomy/earth-history-topic" },
    ],
    keywords: [/gravit|гравит|орбит/i],
  },

  // РАЗДЕЛ 2: МОЛЕКУЛЯРНАЯ ФИЗИКА
  {
    id: 4,
    title: "Молекулярная физика и термодинамика",
    section: "Молекулярная физика",
    sections: [
      {
        level: "Beginner",
        items: [
          "Уравнение состояния идеального газа: PV = nRT",
          "Молярная масса M = m/n",
          "R = 8.31 Дж/(моль·К)",
          "Единицы: давление Па, объём м³, T в Кельвинах",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Молекулярно-кинетическая теория",
          "Средняя кинетическая энергия: ⟨Eₖ⟩ = 3kT/2",
          "Среднеквадратичная скорость v_rms = √(3RT/M)",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Распределение Максвелла-Больцмана",
          "Вероятность нахождения молекулы с определённой скоростью",
          "Первый закон термодинамики: ΔU = Q - W",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Ideal Gas Law", url: "https://www.khanacademy.org/science/physics/thermodynamics/temp-kinetic-theory-ideal-gas-law" },
      { name: "Khan Academy: Kinetic Theory of Gases", url: "https://www.khanacademy.org/science/physics/thermodynamics" },
    ],
    keywords: [/molecul|молекул|термодин|идеальн/i],
  },

  // РАЗДЕЛ 3: ЭЛЕКТРИЧЕСТВО
  {
    id: 5,
    title: "Электростатика и закон Кулона",
    section: "Электричество",
    sections: [
      {
        level: "Beginner",
        items: [
          "Закон Кулона: F = k·q₁q₂/r² (k = 9×10⁹)",
          "Электрическое поле E = kQ/r²",
          "Заряды: положительные и отрицательные",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Электрический потенциал V = kQ/r",
          "Разность потенциалов (напряжение) U = V₁ - V₂",
          "Работа W = qU",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Теорема Гаусса: ∮E·dA = Q/ε₀",
          "Поле равномерно заряженной сферы (внутри и снаружи)",
          "Вычисление полей с высокой симметрией",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Coulomb's Law", url: "https://www.khanacademy.org/science/physics/electric-charge-electric-force-and-voltage" },
      { name: "Khan Academy: Electric Potential", url: "https://www.khanacademy.org/science/physics/electric-charge-electric-force-and-voltage" },
    ],
    keywords: [/electro|электро|кулон/i],
  },
  {
    id: 6,
    title: "Электрический ток и сопротивление",
    section: "Электричество",
    sections: [
      {
        level: "Beginner",
        items: [
          "Закон Ома: V = IR",
          "Сопротивление R = ρL/A",
          "Единицы: ток А, напряжение В, сопротивление Ом",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Последовательное и параллельное соединение резисторов",
          "R_total = R₁+R₂+... (последовательно)",
          "1/R_total = 1/R₁ + 1/R₂ + ... (параллельно)",
          "Мощность P = VI = I²R = V²/R",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Правила Кирхгофа (токи и напряжения)",
          "Закон сохранения заряда и энергии в цепях",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Ohm's Law", url: "https://www.khanacademy.org/science/physics/circuits" },
      { name: "Khan Academy: Circuits", url: "https://www.khanacademy.org/science/physics/circuits" },
    ],
    keywords: [/current|ток|ом|сопротивл/i],
  },

  // РАЗДЕЛ 4: КОЛЕБАНИЯ И ВОЛНЫ
  {
    id: 7,
    title: "Гармонические колебания и волны",
    section: "Колебания и волны",
    sections: [
      {
        level: "Beginner",
        items: [
          "Гармоническое колебание x(t) = A·sin(ωt + φ)",
          "Период T = 2π/ω, частота f = 1/T",
          "Амплитуда A, угловая частота ω",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Энергия колебаний: E = ½mω²A²",
          "Переход между кинетической и потенциальной энергией",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Затухающие колебания x(t) = Ae^(-γt)sin(ω't + φ)",
          "Вынужденные колебания, резонанс",
          "Волновое уравнение y = A·sin(kx - ωt)",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Simple Harmonic Motion", url: "https://www.khanacademy.org/science/physics/mechanical-waves-and-sound" },
      { name: "Khan Academy: Energy in Simple Harmonic Motion", url: "https://www.khanacademy.org/science/physics/mechanical-waves-and-sound" },
    ],
    keywords: [/oscillat|колебан|гармон|волн/i],
  },

  // РАЗДЕЛ 5: ОПТИКА
  {
    id: 8,
    title: "Геометрическая и волновая оптика",
    section: "Оптика",
    sections: [
      {
        level: "Beginner",
        items: [
          "Закон отражения θᵢ = θᵣ",
          "Закон преломления (Снеллиуса): n₁sinθ₁ = n₂sinθ₂",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Тонкая линза: 1/f = 1/u + 1/v",
          "Увеличение M = -v/u",
          "Собирающие и рассеивающие линзы",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Волновая оптика: интерференция и дифракция",
          "Конструктивная интерференция Δ = mλ",
          "Дифракция на щели a·sinθ = mλ",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Geometric Optics", url: "https://www.khanacademy.org/science/physics/geometric-optics" },
      { name: "Khan Academy: Lenses and Mirrors", url: "https://www.khanacademy.org/science/physics/geometric-optics" },
    ],
    keywords: [/optic|оптик|линз|преломл/i],
  },

  // РАЗДЕЛ 6: КВАНТОВАЯ ФИЗИКА
  {
    id: 9,
    title: "Фотоны и квантовая физика",
    section: "Квантовая физика",
    sections: [
      {
        level: "Beginner",
        items: [
          "Энергия фотона E = hf = hc/λ",
          "Фотоэффект: hf = W + Eₖ",
          "Постоянная Планка h = 6.63×10⁻³⁴ Дж·с",
        ],
      },
      {
        level: "Intermediate",
        items: [
          "Модель Бора атома водорода",
          "Уровни Eₙ = -13.6 эВ/n²",
          "Переходы между уровнями, излучение фотонов",
        ],
      },
      {
        level: "Advanced",
        items: [
          "Волна-частица дуальность, длина волны де Бройля λ = h/p",
          "Принцип неопределённости Гейзенберга Δx·Δp ≥ h/(4π)",
          "Уравнение Шрёдингера",
        ],
      },
    ],
    materials: [
      { name: "Khan Academy: Photons and the Photoelectric Effect", url: "https://www.khanacademy.org/science/physics/quantum-physics" },
      { name: "Khan Academy: Bohr Model", url: "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms" },
    ],
    keywords: [/quantum|квант|фотон|бор|фотоэффект/i],
  },
]

export default curriculum
