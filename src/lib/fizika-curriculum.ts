export type Material = {
  name: string
  url: string
}

export type FizikaTopic = {
  id: number
  title: string
  section: string
  sections: { level: string; items: string[] }[]
  materials: Material[]
  keywords: RegExp[]
}

export const curriculum: FizikaTopic[] = [
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
      { name: "Павел Виктор: Кинематика для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Кинематика" },
      { name: "Физика с АВ: Равноускоренное движение", url: "https://www.youtube.com/results?search_query=Физика+с+АВ+Равноускоренное+движение" },
      { name: "Khan Academy: Kinematic Equations", url: "https://www.khanacademy.org/science/physics/one-dimensional-motion" },
      { name: "Павел Виктор: Движение под углом", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Движение+под+углом+к+горизонту" },
      { name: "Walter Lewin: Projectile Motion", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Projectile+Motion" },
      { name: "Khan Academy: 2D Kinematics", url: "https://www.khanacademy.org/science/physics/two-dimensional-motion" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Законы Ньютона", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Законы+Ньютона" },
      { name: "Walter Lewin: Newton's Laws", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Newton%27s+Laws" },
      { name: "Khan Academy: Forces and Newton's Laws", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws" },
      { name: "Павел Виктор: Динамика на наклонной плоскости", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Наклонная+плоскость" },
      { name: "Walter Lewin: Friction and Inclined Planes", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Friction+Inclined+Planes" },
      { name: "Khan Academy: Friction", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws#inclined-planes-friction" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Гравитация и вес", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Закон+всемирного+тяготения" },
      { name: "Walter Lewin: Gravity and Orbits", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Gravity" },
      { name: "Khan Academy: Gravitational Force", url: "https://www.khanacademy.org/science/physics/centripetal-force-and-gravitation" },
      { name: "Павел Виктор: Орбитальная механика", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Космические+скорости" },
      { name: "Walter Lewin: Orbital Mechanics", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Central+Forces" },
      { name: "Khan Academy: Kepler's Laws", url: "https://www.khanacademy.org/science/cosmology-and-astronomy/earth-history-topic" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Идеальный газ для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Идеальный+газ" },
      { name: "Физика с АВ: Молекулярная физика", url: "https://www.youtube.com/results?search_query=Физика+с+АВ+МКТ" },
      { name: "Khan Academy: Ideal Gas Law", url: "https://www.khanacademy.org/science/physics/thermodynamics/temp-kinetic-theory-ideal-gas-law" },
      { name: "Павел Виктор: Молекулярно-кинетическая теория", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Основное+уравнение+МКТ" },
      { name: "Khan Academy: Kinetic Theory of Gases", url: "https://www.khanacademy.org/science/physics/thermodynamics" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Электростатика для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Электростатика" },
      { name: "Walter Lewin: Electrostatics", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Electrostatics" },
      { name: "Khan Academy: Coulomb's Law", url: "https://www.khanacademy.org/science/physics/electric-charge-electric-force-and-voltage" },
      { name: "Павел Виктор: Электрический потенциал", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Потенциал" },
      { name: "Walter Lewin: Electric Potential", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Electric+Potential" },
      { name: "Khan Academy: Electric Potential", url: "https://www.khanacademy.org/science/physics/electric-charge-electric-force-and-voltage" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Закон Ома для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Закон+Ома" },
      { name: "Walter Lewin: Ohm's Law", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Ohm+Law" },
      { name: "Khan Academy: Ohm's Law", url: "https://www.khanacademy.org/science/physics/circuits" },
      { name: "Павел Виктор: Электрические цепи", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Последовательное+параллельное+соединение" },
      { name: "Walter Lewin: Circuits", url: "https://www.youtube.com/results?search_query=Walter+Lewin+DC+Circuits" },
      { name: "Khan Academy: Circuits", url: "https://www.khanacademy.org/science/physics/circuits" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Гармонические колебания", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Гармонические+колебания" },
      { name: "Khan Academy: Simple Harmonic Motion", url: "https://www.khanacademy.org/science/physics/mechanical-waves-and-sound" },
      { name: "Павел Виктор: Энергия колебаний", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Превращение+энергии+при+колебаниях" },
      { name: "Khan Academy: Energy in Simple Harmonic Motion", url: "https://www.khanacademy.org/science/physics/mechanical-waves-and-sound" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Геометрическая оптика", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Геометрическая+оптика" },
      { name: "Khan Academy: Geometric Optics", url: "https://www.khanacademy.org/science/physics/geometric-optics" },
      { name: "Павел Виктор: Линзы и зеркала", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Линзы" },
      { name: "Khan Academy: Lenses and Mirrors", url: "https://www.khanacademy.org/science/physics/geometric-optics" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
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
      { name: "Павел Виктор: Фотоны и фотоэффект", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Фотоэффект" },
      { name: "Khan Academy: Photons and the Photoelectric Effect", url: "https://www.khanacademy.org/science/physics/quantum-physics" },
      { name: "Павел Виктор: Модель Бора", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Постулаты+Бора" },
      { name: "Khan Academy: Bohr Model", url: "https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms" },
      { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
    ],
    keywords: [/quantum|квант|фотон|бор|фотоэффект/i],
  },
]

export default curriculum
