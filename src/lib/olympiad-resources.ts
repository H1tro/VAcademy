export interface OlympiadLink {
  name: string
  url: string
  description?: string
}

export const OLYMPIAD_RESOURCES: Record<string, { title: string; links: OlympiadLink[] }[]> = {
  physics: [
    {
      title: "Главные международные олимпиады",
      links: [
        { name: "Международная физическая олимпиада (IPhO)", url: "https://ipho-new.org" },
        { name: "Азиатская физическая олимпиада (APhO)", url: "https://asianphysicsolympiad.org" },
        { name: "Европейская физическая олимпиада (EuPhO)", url: "https://eupho.ee" },
        { name: "Международная Жаутыковская олимпиада (IZhO)", url: "https://izho.kz" },
        { name: "Международная олимпиада по экспериментальной физике (IEPhO)", url: "https://iepho.su" },
        { name: "Международная олимпиада «Туймаада»", url: "https://tuymaada.lenskykray.ru" },
        { name: "Международный турнир юных физиков (IYPT)", url: "https://iypt.org" },
        { name: "Международная олимпиада по астрономии и астрофизике (IOAA)", url: "https://ioaastrophysics.org" },
      ],
    },
    {
      title: "Открытые международные и онлайн-олимпиады",
      links: [
        { name: "Physics Cup", url: "https://physicscup.ee" },
        { name: "Online Physics Olympiad (OPhO)", url: "https://opho.physoly.tech" },
        { name: "Phystech.International", url: "https://phystech.international" },
        { name: "Physics Unlimited Premier Competition", url: "https://physicsu.org/premier" },
        { name: "International PhysiCo Olympiad", url: "https://physico.stemco.org" },
      ],
    },
    {
      title: "Российские перечневые олимпиады",
      links: [
        { name: "Олимпиада «Физтех»", url: "https://olymp.mipt.ru" },
        { name: "Олимпиада «Росатом»", url: "https://olymp.mephi.ru/rosatom" },
        { name: "Московская олимпиада школьников (МОШ) по физике", url: "https://mos.olimpiada.ru" },
        { name: "Олимпиада «Ломоносов» по физике", url: "https://olymp.msu.ru" },
        { name: "Олимпиада «Высшая проба» по физике", url: "https://olymp.hse.ru" },
        { name: "Всесибирская открытая олимпиада школьников", url: "https://sesc.nsu.ru/olympvsesib" },
        { name: "Отраслевая олимпиада «Курчатов»", url: "https://olimpiadakurchatov.ru" },
      ],
    },
    {
      title: "Сборники задач",
      links: [
        { name: "Архивы IPhO", url: "https://ipho.olimpicos.net/" },
        { name: "Архивы APhO", url: "https://apho.olimpicos.net/" },
        { name: "Иродов Е.И. — сборник задач", url: "https://www.google.com/search?q=Иродов+Е.И.+задачи+по+физике" },
      ],
    },
  ],
  chemistry: [
    {
      title: "Главные международные олимпиады",
      links: [
        { name: "Международная химическая олимпиада (IChO)", url: "https://icho-official.org" },
        { name: "Международная Менделеевская олимпиада (IMChO)", url: "https://olimp.msu.ru" },
        { name: "Международная Жаутыковская олимпиада (IZhO) — химия", url: "https://izho.kz" },
        { name: "IJSO (International Junior Science Olympiad)", url: "https://ijsoweb.org" },
      ],
    },
    {
      title: "Открытые международные и онлайн-олимпиады",
      links: [
        { name: "International Chemistry Tournament (IChTo)", url: "https://ichto.org" },
        { name: "International Young Chemists' Tournament (IYCT)", url: "https://iyct.org" },
      ],
    },
    {
      title: "Российские перечневые олимпиады",
      links: [
        { name: "Олимпиада «Ломоносов» по химии", url: "https://olymp.msu.ru" },
        { name: "Олимпиада СПбГУ по химии", url: "https://olymp.msu.ru" },
        { name: "Всесибирская открытая олимпиада школьников по химии", url: "https://sesc.nsu.ru/olympvsesib" },
        { name: "Московская олимпиада школьников (МОШ) по химии", url: "https://mos.olimpiada.ru" },
        { name: "Олимпиада «Высшая проба» по химии", url: "https://olymp.hse.ru" },
      ],
    },
  ],
  informatics: [
    {
      title: "Главные международные олимпиады",
      links: [
        { name: "IOI (International Olympiad in Informatics)", url: "https://ioi.org" },
        { name: "Международная Жаутыковская олимпиада (IZhO)", url: "https://izho.kz" },
        { name: "Балтийская олимпиада по информатике (BOI)", url: "https://boi2025.org" },
        { name: "European Girls' Olympiad in Informatics (EGOI)", url: "https://egoi.org" },
      ],
    },
    {
      title: "Онлайн-платформы для тренировки",
      links: [
        { name: "Codeforces", url: "https://codeforces.com", description: "Крупнейшая платформа для спортивного программирования" },
        { name: "LeetCode", url: "https://leetcode.com", description: "Тематический тренажёр по алгоритмам и структурам данных" },
        { name: "USACO (USA Computing Olympiad)", url: "https://usaco.org" },
        { name: "COCI (Croatian Open Competition in Informatics)", url: "https://hsin.hr/COCI" },
        { name: "AtCoder", url: "https://atcoder.jp" },
      ],
    },
    {
      title: "Российские и региональные олимпиады",
      links: [
        { name: "Всероссийская олимпиада школьников (ВсОШ) по информатике", url: "https://olimpiada.ru" },
        { name: "Олимпиада «Ломоносов» по информатике", url: "https://olymp.msu.ru" },
        { name: "Олимпиада «Высшая проба» по информатике", url: "https://olymp.hse.ru" },
      ],
    },
  ],
  biology: [
    {
      title: "Олимпиадные ресурсы",
      links: [
        { name: "Официальный архив IBO (International Biology Olympiad)", url: "https://www.ibo-info.org/" },
        { name: "Biolympiads — крупнейший архив задач IBO, USABO, BBO", url: "https://biolympiads.com/" },
        { name: "Архив Всероссийской олимпиады (ВсОШ)", url: "https://olimpiada.ru/" },
        { name: "Всероссийский Биотурнир", url: "https://bioturnir.ru/" },
      ],
    },
  ],
  mathematics: [
    {
      title: "Ресурсы по олимпиадной математике",
      links: [
        { name: "Архивы IMO (International Mathematical Olympiad)", url: "https://www.imo-official.org/" },
        { name: "AoPS (Art of Problem Solving)", url: "https://artofproblemsolving.com/" },
        { name: "Турнир городов", url: "https://www.turgor.ru/" },
      ],
    },
  ],
}
