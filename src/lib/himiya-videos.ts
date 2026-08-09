export interface ChemistryVideo {
  name: string
  url: string
}

export interface ChemistryChapter {
  title: string
  section: string
  videos: ChemistryVideo[]
}

export interface ChemistryLevel {
  level: string
  chapters: ChemistryChapter[]
}

export const chemistryVideos: ChemistryLevel[] = [
  {
    level: "Уровень 1 — Базовый химик",
    chapters: [
      {
        title: "1. Общая химия",
        section: "Ур.1: Общая химия",
        videos: [
          { name: "Строение атома", url: "https://www.youtube.com/results?search_query=строение+атома+химия+урок" },
          { name: "История моделей атома", url: "https://www.youtube.com/watch?v=thnDxFdkzZs" },
          { name: "Протоны, нейтроны, электроны", url: "https://www.youtube.com/watch?v=IFKnq9QM6_A" },
          { name: "Изотопы", url: "https://www.youtube.com/results?search_query=изотопы+химия+урок" },
          { name: "Атомная масса", url: "https://www.youtube.com/watch?v=NtNnJyJ1jq8" },
          { name: "Квантовые числа", url: "https://www.youtube.com/results?search_query=квантовые+числа+химия" },
          { name: "Электронные конфигурации", url: "https://www.youtube.com/watch?v=ako0iJrG03Q" },
          { name: "Правило Хунда", url: "https://www.youtube.com/results?search_query=правило+Хунда+химия" },
          { name: "Принцип Паули", url: "https://www.youtube.com/results?search_query=принцип+Паули+химия" },
          { name: "Принцип наименьшей энергии", url: "https://www.youtube.com/results?search_query=правило+Клечковского+химия" },
          { name: "Периодический закон", url: "https://www.youtube.com/results?search_query=периодический+закон+Менделеева+химия" },
          { name: "Периодические свойства элементов", url: "https://www.youtube.com/results?search_query=периодические+свойства+элементов+химия" },
          { name: "Электроотрицательность", url: "https://www.youtube.com/results?search_query=электроотрицательность+химия" },
          { name: "Энергия ионизации", url: "https://www.youtube.com/results?search_query=энергия+ионизации+химия" },
          { name: "Электронное сродство", url: "https://www.youtube.com/results?search_query=электронное+сродство+химия" },
        ],
      },
      {
        title: "2. Химическая связь",
        section: "Ур.1: Химическая связь",
        videos: [
          { name: "Ионная связь", url: "https://www.youtube.com/results?search_query=ионная+связь+химия" },
          { name: "Ковалентная связь", url: "https://www.youtube.com/results?search_query=ковалентная+связь+химия" },
          { name: "Полярная и неполярная связь", url: "https://www.youtube.com/results?search_query=полярная+неполярная+ковалентная+связь" },
          { name: "Металлическая связь", url: "https://www.youtube.com/results?search_query=металлическая+связь+химия" },
          { name: "Водородная связь", url: "https://www.youtube.com/results?search_query=водородная+связь+химия" },
          { name: "Межмолекулярные взаимодействия", url: "https://www.youtube.com/results?search_query=межмолекулярные+взаимодействия+химия" },
          { name: "VSEPR", url: "https://www.youtube.com/results?search_query=VSEPR+теория+химия+русский" },
          { name: "Гибридизация", url: "https://www.youtube.com/results?search_query=гибридизация+орбиталей+химия" },
          { name: "Геометрия молекул", url: "https://www.youtube.com/results?search_query=геометрия+молекул+VSEPR+химия" },
        ],
      },
      {
        title: "3. Стехиометрия и растворы",
        section: "Ур.1: Стехиометрия",
        videos: [
          { name: "Моль", url: "https://www.youtube.com/results?search_query=моль+химия+урок" },
          { name: "Число Авогадро", url: "https://www.youtube.com/results?search_query=число+Авогадро+химия" },
          { name: "Молярная масса", url: "https://www.youtube.com/results?search_query=молярная+масса+химия" },
          { name: "Массовая доля", url: "https://www.youtube.com/results?search_query=массовая+доля+химия" },
          { name: "Молярная концентрация", url: "https://www.youtube.com/results?search_query=молярная+концентрация+химия" },
          { name: "Нормальность", url: "https://www.youtube.com/results?search_query=нормальная+концентрация+нормальность+химия" },
          { name: "Разбавление растворов", url: "https://www.youtube.com/results?search_query=разбавление+растворов+химия" },
          { name: "Выход реакции", url: "https://www.youtube.com/results?search_query=выход+реакции+химия+задачи" },
          { name: "Ограничивающий реагент", url: "https://www.youtube.com/results?search_query=лимитирующий+реагент+химия" },
        ],
      },
    ],
  },
  {
    level: "Уровень 2 — Продвинутый",
    chapters: [
      {
        title: "4. Физическая химия — термодинамика",
        section: "Ур.2: Термодинамика",
        videos: [
          { name: "Первый закон термодинамики", url: "https://www.youtube.com/results?search_query=первый+закон+термодинамики+химия" },
          { name: "Энтальпия", url: "https://www.youtube.com/watch?v=fucyI7Ouj2c" },
          { name: "Закон Гесса", url: "https://www.youtube.com/watch?v=2q2u5sj4V00" },
          { name: "Энтальпия образования", url: "https://www.youtube.com/results?search_query=энтальпия+образования+химия" },
          { name: "Энтальпия сгорания", url: "https://www.youtube.com/results?search_query=энтальпия+сгорания+химия" },
          { name: "Энтропия", url: "https://www.youtube.com/watch?v=8N1BxHgsoOw" },
          { name: "Энергия Гиббса", url: "https://www.youtube.com/results?search_query=энергия+Гиббса+химия" },
          { name: "Самопроизвольность процессов", url: "https://www.youtube.com/results?search_query=самопроизвольность+химических+процессов+Гиббс" },
        ],
      },
      {
        title: "5. Химическое равновесие",
        section: "Ур.2: Равновесие",
        videos: [
          { name: "Закон действующих масс", url: "https://www.youtube.com/results?search_query=закон+действующих+масс+химия" },
          { name: "Константа равновесия", url: "https://www.youtube.com/results?search_query=константа+химического+равновесия+химия" },
          { name: "Kc", url: "https://www.youtube.com/results?search_query=Kc+константа+равновесия+химия" },
          { name: "Kp", url: "https://www.youtube.com/results?search_query=Kp+константа+равновесия+химия" },
          { name: "Реакционный коэффициент Q", url: "https://www.youtube.com/results?search_query=реакционный+коэффициент+Q+химия" },
          { name: "Принцип Ле Шателье", url: "https://www.youtube.com/watch?v=Uw5yLtGrv-A" },
          { name: "Смещение равновесия", url: "https://www.youtube.com/results?search_query=смещение+химического+равновесия+химия" },
        ],
      },
      {
        title: "6. Кислоты и основания",
        section: "Ур.2: Кислоты и основания",
        videos: [
          { name: "Теория Аррениуса", url: "https://www.youtube.com/results?search_query=теория+Аррениуса+кислоты+основания" },
          { name: "Бренстед—Лоури", url: "https://www.youtube.com/results?search_query=Бренстед+Лоури+кислоты+основания" },
          { name: "Теория Льюиса", url: "https://www.youtube.com/results?search_query=теория+Льюиса+кислоты+основания" },
          { name: "pH", url: "https://www.youtube.com/results?search_query=pH+кислоты+основания+химия" },
          { name: "pOH", url: "https://www.youtube.com/results?search_query=pOH+химия" },
          { name: "Буферные растворы", url: "https://www.youtube.com/results?search_query=буферные+растворы+химия" },
          { name: "Титрование", url: "https://www.youtube.com/results?search_query=титрование+химия+урок" },
          { name: "Гидролиз солей", url: "https://www.youtube.com/results?search_query=гидролиз+солей+химия" },
        ],
      },
      {
        title: "7. Химическая кинетика",
        section: "Ур.2: Кинетика",
        videos: [
          { name: "Скорость реакции", url: "https://www.youtube.com/results?search_query=скорость+химической+реакции+химия" },
          { name: "Закон скорости", url: "https://www.youtube.com/results?search_query=закон+скорости+химическая+кинетика" },
          { name: "Порядок реакции", url: "https://www.youtube.com/results?search_query=порядок+реакции+химическая+кинетика" },
          { name: "Молекулярность", url: "https://www.youtube.com/results?search_query=молекулярность+реакции+химия" },
          { name: "Энергия активации", url: "https://www.youtube.com/results?search_query=энергия+активации+химия" },
          { name: "Уравнение Аррениуса", url: "https://www.youtube.com/results?search_query=уравнение+Аррениуса+химия" },
          { name: "Катализ", url: "https://www.youtube.com/results?search_query=катализ+химическая+кинетика" },
        ],
      },
      {
        title: "8. Электрохимия",
        section: "Ур.2: Электрохимия",
        videos: [
          { name: "ОВР", url: "https://www.youtube.com/results?search_query=окислительно+восстановительные+реакции+химия" },
          { name: "Гальванический элемент", url: "https://www.youtube.com/results?search_query=гальванический+элемент+химия" },
          { name: "Электролиз", url: "https://www.youtube.com/results?search_query=электролиз+химия+урок" },
          { name: "Электродные потенциалы", url: "https://www.youtube.com/results?search_query=электродный+потенциал+химия" },
          { name: "Уравнение Нернста", url: "https://www.youtube.com/results?search_query=уравнение+Нернста+химия" },
        ],
      },
    ],
  },
  {
    level: "Уровень 3 — Неорганика",
    chapters: [
      {
        title: "9. Неорганическая химия",
        section: "Ур.3: Неорганика",
        videos: [
          { name: "Водород и его соединения", url: "https://www.youtube.com/results?search_query=водород+гидриды+пероксиды+химия" },
          { name: "Литий", url: "https://www.youtube.com/results?search_query=литий+химия+неорганика" },
          { name: "Натрий", url: "https://www.youtube.com/results?search_query=натрий+химия+неорганика" },
          { name: "Калий", url: "https://www.youtube.com/results?search_query=калий+химия+неорганика" },
          { name: "Магний", url: "https://www.youtube.com/results?search_query=магний+химия+неорганика" },
          { name: "Кальций", url: "https://www.youtube.com/results?search_query=кальций+химия+неорганика" },
          { name: "Бор", url: "https://www.youtube.com/results?search_query=бор+химия+неорганика" },
          { name: "Углерод", url: "https://www.youtube.com/results?search_query=углерод+химия+неорганика" },
          { name: "Азот", url: "https://www.youtube.com/results?search_query=азот+химия+неорганика" },
          { name: "Кислород", url: "https://www.youtube.com/results?search_query=кислород+химия+неорганика" },
          { name: "Фосфор", url: "https://www.youtube.com/results?search_query=фосфор+химия+неорганика" },
          { name: "Сера", url: "https://www.youtube.com/results?search_query=сера+химия+неорганика" },
          { name: "Галогены", url: "https://www.youtube.com/results?search_query=галогены+химия+неорганика" },
          { name: "Благородные газы", url: "https://www.youtube.com/results?search_query=благородные+газы+химия" },
          { name: "Переходные металлы", url: "https://www.youtube.com/results?search_query=переходные+металлы+химия" },
          { name: "Комплексные соединения", url: "https://www.youtube.com/results?search_query=комплексные+соединения+химия" },
          { name: "Координационная химия", url: "https://www.youtube.com/results?search_query=координационная+химия+лекция" },
          { name: "Теория кристаллического поля", url: "https://www.youtube.com/results?search_query=теория+кристаллического+поля+химия" },
          { name: "Лантаноиды", url: "https://www.youtube.com/results?search_query=лантаноиды+химия" },
          { name: "Актиноиды", url: "https://www.youtube.com/results?search_query=актиноиды+химия" },
          { name: "Неорганика — обзор элементов", url: "https://www.youtube.com/playlist?list=PLqOZ6FD_RQ7kGnKLTbdwZ3IGVNXK43k7S" },
        ],
      },
    ],
  },
  {
    level: "Уровень 4 — Органическая химия",
    chapters: [
      {
        title: "10. Органическая химия (Clayden)",
        section: "Ур.4: Органика",
        videos: [
          { name: "Строение органических молекул", url: "https://www.youtube.com/results?search_query=строение+органических+молекул+органическая+химия" },
          { name: "Резонанс", url: "https://www.youtube.com/results?search_query=резонанс+органическая+химия" },
          { name: "Индуктивный эффект", url: "https://www.youtube.com/results?search_query=индуктивный+эффект+органическая+химия" },
          { name: "Гиперсопряжение", url: "https://www.youtube.com/results?search_query=гиперсопряжение+органическая+химия" },
          { name: "Стереохимия", url: "https://www.youtube.com/results?search_query=стереохимия+органическая+химия+русский" },
          { name: "Хиральность", url: "https://www.youtube.com/results?search_query=хиральность+органическая+химия" },
          { name: "Конформационный анализ", url: "https://www.youtube.com/results?search_query=конформационный+анализ+органическая+химия" },
          { name: "Алканы", url: "https://www.youtube.com/results?search_query=алканы+органическая+химия" },
          { name: "Алкены", url: "https://www.youtube.com/results?search_query=алкены+органическая+химия" },
          { name: "Алкины", url: "https://www.youtube.com/results?search_query=алкины+органическая+химия" },
          { name: "Арены", url: "https://www.youtube.com/results?search_query=арены+ароматические+соединения+органическая+химия" },
          { name: "SN1", url: "https://www.youtube.com/results?search_query=SN1+органическая+химия+русский" },
          { name: "SN2", url: "https://www.youtube.com/results?search_query=SN2+органическая+химия+русский" },
          { name: "E1", url: "https://www.youtube.com/results?search_query=E1+реакция+органическая+химия" },
          { name: "E2", url: "https://www.youtube.com/results?search_query=E2+реакция+органическая+химия" },
          { name: "Электрофильное присоединение", url: "https://www.youtube.com/results?search_query=электрофильное+присоединение+органическая+химия" },
          { name: "Нуклеофильное замещение", url: "https://www.youtube.com/results?search_query=нуклеофильное+замещение+органическая+химия" },
          { name: "Электрофильное ароматическое замещение", url: "https://www.youtube.com/results?search_query=электрофильное+ароматическое+замещение+химия" },
          { name: "Спирты", url: "https://www.youtube.com/results?search_query=спирты+органическая+химия" },
          { name: "Эфиры", url: "https://www.youtube.com/results?search_query=эфиры+органическая+химия" },
          { name: "Альдегиды", url: "https://www.youtube.com/results?search_query=альдегиды+органическая+химия" },
          { name: "Кетоны", url: "https://www.youtube.com/results?search_query=кетоны+органическая+химия" },
          { name: "Карбоновые кислоты", url: "https://www.youtube.com/results?search_query=карбоновые+кислоты+органическая+химия" },
          { name: "Сложные эфиры", url: "https://www.youtube.com/results?search_query=сложные+эфиры+органическая+химия" },
          { name: "Амины", url: "https://www.youtube.com/results?search_query=амины+органическая+химия" },
          { name: "Амиды", url: "https://www.youtube.com/results?search_query=амиды+органическая+химия" },
          { name: "Нитрилы", url: "https://www.youtube.com/results?search_query=нитрилы+органическая+химия" },
          { name: "Ретросинтез", url: "https://www.youtube.com/results?search_query=ретросинтез+органическая+химия" },
          { name: "Многостадийный синтез", url: "https://www.youtube.com/results?search_query=многостадийный+органический+синтез+олимпиада" },
        ],
      },
    ],
  },
  {
    level: "Уровень 5 — Аналитика",
    chapters: [
      {
        title: "11. Аналитическая химия",
        section: "Ур.5: Аналитика",
        videos: [
          { name: "Качественный анализ", url: "https://www.youtube.com/results?search_query=качественный+анализ+аналитическая+химия" },
          { name: "Количественный анализ", url: "https://www.youtube.com/results?search_query=количественный+анализ+аналитическая+химия" },
          { name: "Гравиметрия", url: "https://www.youtube.com/results?search_query=гравиметрический+анализ+химия" },
          { name: "Титриметрия", url: "https://www.youtube.com/results?search_query=титриметрический+анализ+химия" },
          { name: "Комплексонометрия", url: "https://www.youtube.com/results?search_query=комплексонометрия+химия" },
          { name: "Потенциометрия", url: "https://www.youtube.com/results?search_query=потенциометрия+аналитическая+химия" },
        ],
      },
      {
        title: "12. Инструментальный анализ",
        section: "Ур.5: Инструменты",
        videos: [
          { name: "UV-Vis спектроскопия", url: "https://www.youtube.com/results?search_query=UV+Vis+спектроскопия+химия+русский" },
          { name: "IR / ИК-спектроскопия", url: "https://www.youtube.com/results?search_query=ИК+спектроскопия+IR+химия+русский" },
          { name: "NMR / ЯМР", url: "https://www.youtube.com/results?search_query=ЯМР+спектроскопия+химия+русский" },
          { name: "Масс-спектрометрия", url: "https://www.youtube.com/results?search_query=масс+спектрометрия+химия+русский" },
          { name: "HPLC", url: "https://www.youtube.com/results?search_query=ВЭЖХ+HPLC+химия+русский" },
          { name: "GC", url: "https://www.youtube.com/results?search_query=газовая+хроматография+GC+химия" },
          { name: "Электрофорез", url: "https://www.youtube.com/results?search_query=электрофорез+аналитическая+химия" },
        ],
      },
    ],
  },
  {
    level: "Уровень 6 — Биохимия",
    chapters: [
      {
        title: "13. Биохимия",
        section: "Ур.6: Биохимия",
        videos: [
          { name: "Аминокислоты", url: "https://www.youtube.com/results?search_query=аминокислоты+биохимия+лекция" },
          { name: "Белки", url: "https://www.youtube.com/results?search_query=белки+биохимия+лекция" },
          { name: "Углеводы", url: "https://www.youtube.com/results?search_query=углеводы+биохимия+лекция" },
          { name: "Липиды", url: "https://www.youtube.com/results?search_query=липиды+биохимия+лекция" },
          { name: "ДНК", url: "https://www.youtube.com/results?search_query=ДНК+биохимия+лекция" },
          { name: "РНК", url: "https://www.youtube.com/results?search_query=РНК+биохимия+лекция" },
          { name: "Репликация", url: "https://www.youtube.com/results?search_query=репликация+ДНК+биохимия" },
          { name: "Транскрипция", url: "https://www.youtube.com/results?search_query=транскрипция+биохимия" },
          { name: "Трансляция", url: "https://www.youtube.com/results?search_query=трансляция+биохимия" },
          { name: "Ферменты", url: "https://www.youtube.com/results?search_query=ферменты+биохимия+лекция" },
          { name: "Метаболизм", url: "https://www.youtube.com/results?search_query=метаболизм+биохимия+лекция" },
        ],
      },
    ],
  },
  {
    level: "Уровень 7 — Олимпиадный / IChO",
    chapters: [
      {
        title: "14. Олимпиадная химия",
        section: "Ур.7: Олимпиады",
        videos: [
          { name: "Всерос по химии — разбор", url: "https://www.youtube.com/results?search_query=Всероссийская+олимпиада+по+химии+разбор" },
          { name: "Менделеевская олимпиада", url: "https://www.youtube.com/results?search_query=Менделеевская+олимпиада+химия+разбор" },
          { name: "IChO theoretical problems", url: "https://www.youtube.com/results?search_query=IChO+theoretical+problems+solutions" },
          { name: "IChO practical problems", url: "https://www.youtube.com/results?search_query=IChO+practical+problems+solutions" },
          { name: "Олимпиадная неорганика", url: "https://www.youtube.com/results?search_query=олимпиадная+неорганическая+химия+разбор" },
          { name: "Олимпиадная органика", url: "https://www.youtube.com/results?search_query=олимпиадная+органическая+химия+разбор" },
          { name: "Олимпиадная физхимия", url: "https://www.youtube.com/results?search_query=олимпиадная+физическая+химия+разбор" },
          { name: "Олимпиадная аналитика", url: "https://www.youtube.com/results?search_query=олимпиадная+аналитическая+химия+разбор" },
        ],
      },
    ],
  },
]
