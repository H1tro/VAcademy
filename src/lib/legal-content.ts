import type { Locale } from "@/i18n/config";

export { LEGAL_VERSION, LEGAL_CONTACT } from "./legal-config";
export const LEGAL_OPERATOR: Record<Locale, string> = {ru: "Арстанбек Анарбеков", en: "Arstanbek Anarbekov"};
export const LEGAL_COUNTRY: Record<Locale, string> = {ru: "США", en: "United States"};
export type LegalDocumentId = "privacy" | "terms" | "cookies";

type BilingualText = readonly [string, string];
type Section = readonly [string, BilingualText, readonly BilingualText[]];
type LegalDocument = { title: BilingualText; intro: BilingualText; sections: readonly Section[] };

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
  "privacy": {
    "title": [
      "Политика конфиденциальности",
      "Privacy policy"
    ],
    "intro": [
      "Эта политика объясняет, какие данные обрабатывает VAcademy при использовании учебной платформы, аккаунтов, AI и обращений в поддержку.",
      "This policy explains how VAcademy processes information when you use the learning platform, accounts, AI, and support."
    ],
    "sections": [
      [
        "operator",
        [
          "1. Кто отвечает за данные",
          "1. Who is responsible"
        ],
        [
          [
            "Оператор VAcademy — Арстанбек Анарбеков (Arstanbek Anarbekov), США. Вопросы о данных, запросы на доступ, исправление или удаление можно направить на указанный ниже email.",
            "VAcademy is operated by Arstanbek Anarbekov, United States. Use the email below for privacy questions and requests to access, correct, or delete information."
          ],
          [
            "Эта политика относится к VAcademy. Сайты организаторов олимпиад и внешние учебные ресурсы самостоятельно определяют правила обработки данных.",
            "This policy applies to VAcademy. Olympiad organizers and external learning resources have their own information practices."
          ]
        ]
      ],
      [
        "data",
        [
          "2. Какие данные мы обрабатываем",
          "2. Information we process"
        ],
        [
          [
            "При регистрации: email, выбранное имя, учётные данные Firebase Authentication, указанная возрастная группа и отметки о принятии условий и разрешении родителя для несовершеннолетнего. Пароль обрабатывается Firebase Authentication и не записывается в профиль VAcademy.",
            "At registration: email, chosen name, Firebase Authentication credentials, the age range you declare, and records of terms acceptance and parental permission for a minor. Firebase Authentication processes your password; it is not stored in the VAcademy profile."
          ],
          [
            "В профиле: фотография или её URL, школа или организация, класс, описание, цели, ники Codeforces и LeetCode, если вы их указываете. Учебные данные: ответы, пояснения, изображения решений, решённые задачи, баллы, прогресс, просмотренные видео и созданные учителем подборки.",
            "Profile information includes a photo or its URL, school or organization, grade, biography, goals, and Codeforces or LeetCode usernames, if provided. Learning information includes answers, explanations, solution images, completed problems, scores, progress, watched videos, and teacher-created collections."
          ],
          [
            "В поддержке: имя, email, выбранные предмет и категория, текст обращения; при обращении через Telegram — доступные боту идентификаторы, имя пользователя, сообщения и присланные файлы. При работе с AI передаются вопрос, предмет, режим помощи и язык.",
            "Support information includes your name, email, subject, category, and message. Telegram support may also process identifiers available to the bot, username, messages, and submitted files. AI requests include your question, subject, assistance mode, and language."
          ],
          [
            "Серверы и поставщики инфраструктуры могут обрабатывать IP-адрес, сведения о браузере, время запроса и технические журналы для доставки сайта, защиты и устранения ошибок. Браузер сохраняет данные входа, предпочтения интерфейса и результат последней практики, как описано в политике cookie.",
            "Servers and infrastructure providers may process IP addresses, browser information, request times, and technical logs to deliver the site, protect it, and troubleshoot errors. Your browser stores sign-in information, interface preferences, and the latest practice result as described in the cookie policy."
          ]
        ]
      ],
      [
        "purposes",
        [
          "3. Для чего нужны данные",
          "3. Why information is used"
        ],
        [
          [
            "Мы используем данные для создания и защиты аккаунта, сохранения учебных результатов, проверки ответов, показа рейтинга, работы учительских инструментов, ответов на обращения и отправки запрошенных служебных писем.",
            "We use information to create and protect accounts, save learning results, check answers, display rankings, operate teacher tools, respond to support requests, and send requested service emails."
          ],
          [
            "AI используется по вашему запросу; предпочтения языка и меню сохраняются для удобства интерфейса. Если применимое законодательство требует согласия на отдельную обработку, такое согласие запрашивается отдельно. Принятие условий использования не является согласием на рекламу.",
            "AI is used when you request it; language and menu preferences support the interface. Where applicable law requires consent for a particular processing activity, that consent must be requested separately. Accepting the terms does not provide advertising consent."
          ],
          [
            "На дату этой версии VAcademy не использует рекламные пиксели, рекламные сети или стороннюю аналитику посещений. Мы не продаём персональные данные и не используем их для поведенческой рекламы.",
            "At the date of this version, VAcademy does not use advertising pixels, advertising networks, or third-party visitor analytics. We do not sell personal information or use it for behavioral advertising."
          ]
        ]
      ],
      [
        "public",
        [
          "4. Что могут видеть другие",
          "4. Information others can see"
        ],
        [
          [
            "Рейтинг доступен посетителям сайта. В нём могут отображаться выбранное имя, фотография, баллы и количество решённых задач. Выберите псевдоним, если не хотите показывать настоящее имя. Если имя не задано, текущая реализация рейтинга может использовать часть email до символа @.",
            "Visitors can access the leaderboard. It may display your chosen name, photo, scores, and completed problem counts. Use a pseudonym if you do not want to display your real name. If no name is set, the current leaderboard implementation may use the portion of your email before @."
          ],
          [
            "Загруженные изображения хранятся в публичном Vercel Blob: файл доступен по ссылке. Не загружайте документы, адреса, изображения других людей без разрешения или другие сведения, которые не должны быть доступны по ссылке.",
            "Uploaded images are stored in public Vercel Blob storage and are accessible by URL. Do not upload documents, addresses, images of others without permission, or other information that should not be accessible by link."
          ],
          [
            "Обращения в поддержку доступны уполномоченным администраторам; при включённых уведомлениях имя, email и текст обращения пересылаются ответственным администраторам в Telegram.",
            "Support requests are available to authorized administrators. When notifications are configured, your name, email, and message are forwarded to the responsible administrators through Telegram."
          ]
        ]
      ],
      [
        "providers",
        [
          "5. Сервисы и передача данных",
          "5. Service providers and transfers"
        ],
        [
          [
            "Google Firebase Authentication обеспечивает вход; Firestore хранит профили, результаты, обращения и задания. Vercel обеспечивает размещение сайта и хранение загруженных файлов. Groq обрабатывает вопросы к AI. Resend отправляет служебные письма, включая подтверждение удаления аккаунта. Telegram используется для бота и уведомлений поддержки.",
            "Google Firebase Authentication provides sign-in; Firestore stores profiles, results, support requests, and assignments. Vercel hosts the site and uploaded files. Groq processes AI questions. Resend sends service emails, including account-deletion confirmation. Telegram is used for the support bot and notifications."
          ],
          [
            "При привязке Codeforces сайт обращается к его API, используя указанный вами публичный ник, чтобы проверить решения. Google Fonts получает запросы при загрузке шрифтов. Изображения по внешнему URL загружаются у их поставщика. YouTube-плеер подключается после отдельного нажатия кнопки загрузки видео.",
            "When you link Codeforces, the site uses its API and your public handle to check solutions. Google Fonts receives requests when fonts load. Images hosted at external URLs are loaded from their providers. The YouTube player connects only after you separately choose to load the video."
          ],
          [
            "Сервисы могут обрабатывать данные в США и других странах. Конкретные места хранения, сроки журналов и условия обработки зависят от настроек проекта и поставщика. Их политики доступны по ссылкам ниже; эта политика не обещает хранение всех данных только в одной стране.",
            "Providers may process information in the United States and other countries. Specific storage locations, log retention, and processing terms depend on project settings and the provider. Their policies are linked below; this policy does not promise that all information stays in one country."
          ]
        ]
      ],
      [
        "ai",
        [
          "6. Использование AI",
          "6. Using AI"
        ],
        [
          [
            "Текст вопроса и учебный контекст отправляются Groq для получения ответа. Не вводите пароли, платёжные данные, конфиденциальные документы или персональные сведения других людей. Текущая страница AI хранит ответ в состоянии страницы; отдельное сохранение истории диалога в профиле не реализовано.",
            "Question text and learning context are sent to Groq to generate a response. Do not enter passwords, payment details, confidential documents, or personal information about others. The current AI page keeps its answer in page state; it does not implement a separate saved conversation history in your profile."
          ],
          [
            "Обработка и возможное хранение запросов у поставщика регулируются его условиями и настройками. Ответ AI может быть ошибочным: проверяйте расчёты, источники и даты.",
            "Provider handling and possible retention of requests depend on its terms and settings. AI answers can be wrong; verify calculations, sources, and dates."
          ]
        ]
      ],
      [
        "children",
        [
          "7. Дети и несовершеннолетние",
          "7. Children and minors"
        ],
        [
          [
            "Аккаунты предназначены для пользователей от 13 лет. Пользователю младше возраста совершеннолетия по применимому праву требуется разрешение родителя или законного представителя. При регистрации запрашивается возрастная группа, а не полная дата рождения.",
            "Accounts are intended for users aged 13 and older. Users below the age of majority under applicable law need permission from a parent or legal guardian. Registration asks for an age range rather than a full date of birth."
          ],
          [
            "Регистрация с возрастной группой младше 13 лет не допускается. Отдельного процесса подтверждённого согласия родителей для аккаунтов младше 13 лет сейчас нет. Если вы считаете, что ребёнок младше 13 лет предоставил данные или создал аккаунт, напишите оператору для проверки и удаления.",
            "Registration is not permitted when the declared age range is under 13. There is currently no separate verifiable parental-consent process for accounts under 13. If you believe a child under 13 has provided information or created an account, contact the operator for review and deletion."
          ],
          [
            "Учителям и родителям следует использовать собственные аккаунты и не загружать сведения об учениках без необходимых полномочий и разрешений. Одна отметка в форме не заменяет подтверждённое согласие родителей там, где оно требуется законом.",
            "Teachers and parents should use their own accounts and must not upload student information without the required authority and permissions. A form checkbox does not replace verifiable parental consent where the law requires it."
          ]
        ]
      ],
      [
        "retention",
        [
          "8. Хранение и удаление",
          "8. Retention and deletion"
        ],
        [
          [
            "Профиль и учебные результаты хранятся для работы аккаунта до запроса удаления или до прекращения необходимости в них. Обращения, материалы учителя и служебные записи могут требовать отдельного удаления оператором. У автоматического подтверждения удаления срок действия ссылки — 24 часа; истечение ссылки само по себе не означает очистку всех серверных записей.",
            "Profiles and learning results are kept to operate your account until deletion is requested or the information is no longer needed. Support requests, teacher materials, and service records may need separate deletion by the operator. Automated deletion-confirmation links expire after 24 hours; link expiry does not itself clean up every server record."
          ],
          [
            "Удаление можно запросить в разделе «Профиль → Безопасность» или по email оператора. Текущий автоматический путь удаляет профиль и записи решений; удаление Firebase Authentication зависит от настройки и успешного ответа сервиса. Записи Codeforces, задания, обращения, файлы, сообщения Telegram и резервные копии не гарантированно очищаются этим автоматическим действием и должны быть включены в полный запрос оператору.",
            "Request deletion in Profile → Security or by emailing the operator. The current automated flow removes the profile and solution records; deletion from Firebase Authentication depends on configuration and the provider response. Codeforces records, assignments, support requests, files, Telegram messages, and backups are not guaranteed to be cleared by that automated action and should be included in a complete request to the operator."
          ],
          [
            "Оператор должен проверять необходимость оставшихся данных и удалять их, когда цель обработки прекращена, кроме сведений, которые требуется сохранить по закону или для разрешения конкретного спора. У поставщиков могут действовать отдельные сроки удаления журналов и резервных копий. Данные браузера можно очистить самостоятельно; удаление аккаунта не очищает их автоматически.",
            "The operator should review remaining information and delete it when its purpose ends, except records required by law or a specific dispute. Providers may apply separate log and backup deletion timelines. You can clear browser data yourself; account deletion does not automatically clear it."
          ]
        ]
      ],
      [
        "rights",
        [
          "9. Ваши запросы и защита данных",
          "9. Requests and security"
        ],
        [
          [
            "Вы можете запросить сведения о данных, копию, исправление или удаление, а также сообщить о возражении против обработки. Дополнительные права и сроки ответа зависят от применимого закона и места проживания. Мы можем запросить минимальные сведения, необходимые для проверки принадлежности аккаунта; не отправляйте пароль.",
            "You can request information about your data, a copy, correction, or deletion, and raise objections to processing. Additional rights and response deadlines depend on applicable law and your residence. We may request the minimum information needed to verify account ownership; do not send your password."
          ],
          [
            "Напишите с email аккаунта и укажите, к каким данным относится запрос: профиль, изображения, обращения, задания или другие записи. Родитель может обратиться по поводу данных ребёнка. При наличии оснований вы можете обратиться в уполномоченный орган по защите данных или потребителей.",
            "Write from your account email and identify the information covered: profile, images, support requests, assignments, or other records. A parent may contact us about a child's information. Where appropriate, you may contact the relevant privacy or consumer-protection authority."
          ],
          [
            "Доступ к защищённым функциям связан с входом в аккаунт; операторы и поставщики применяют технические меры защиты. Передача и хранение информации не могут быть гарантированно защищены от любых рисков. О подозрении на утечку или чужой доступ сообщайте оператору.",
            "Protected features require account authentication; the operator and providers apply technical safeguards. Transmission and storage cannot be guaranteed free from every risk. Report suspected exposure or unauthorized access to the operator."
          ]
        ]
      ],
      [
        "changes",
        [
          "10. Изменения политики",
          "10. Changes"
        ],
        [
          [
            "Версия и дата обновления указаны в начале страницы. При изменении состава сервисов или целей обработки политика должна быть обновлена; при необходимости нового согласия оно запрашивается отдельно. Продолжение использования не означает согласие на неизвестные будущие цели.",
            "The version and update date appear at the top. Changes to providers or processing purposes require an updated policy; new consent must be requested separately where necessary. Continued use does not constitute consent to unspecified future purposes."
          ]
        ]
      ]
    ]
  },
  "terms": {
    "title": [
      "Условия использования",
      "Terms of use"
    ],
    "intro": [
      "Эти условия описывают использование VAcademy — платформы подготовки к STEM-олимпиадам, практики и учебных инструментов.",
      "These terms describe use of VAcademy, a platform for STEM olympiad preparation, practice, and learning tools."
    ],
    "sections": [
      [
        "operator",
        [
          "1. Оператор и связь",
          "1. Operator and contact"
        ],
        [
          [
            "VAcademy предоставляет Арстанбек Анарбеков (Arstanbek Anarbekov), США. Контакт для вопросов о сервисе и условиях указан ниже.",
            "VAcademy is provided by Arstanbek Anarbekov, United States. The contact for service and terms questions is listed below."
          ],
          [
            "При регистрации вы явно принимаете текущую версию условий. Политика конфиденциальности объясняет обработку данных; ознакомление с ней не является отдельным согласием на рекламу или необязательное отслеживание.",
            "At registration you explicitly accept the current terms. The privacy policy describes information handling; acknowledging it does not provide separate consent for advertising or optional tracking."
          ]
        ]
      ],
      [
        "eligibility",
        [
          "2. Возраст и аккаунт",
          "2. Eligibility and account"
        ],
        [
          [
            "Регистрация разрешена с 13 лет. Если вы не достигли совершеннолетия по применимому праву, используйте сервис с разрешения родителя или законного представителя. Аккаунты детей младше 13 лет сейчас не поддерживаются.",
            "Registration is available from age 13. If you have not reached the age of majority under applicable law, use the service with permission from a parent or legal guardian. Accounts for children under 13 are not currently supported."
          ],
          [
            "Указывайте достоверную возрастную группу и контактный email, сохраняйте пароль в тайне и сообщайте о чужом доступе. При необходимости можно использовать псевдоним. Не выдавайте себя за другого пользователя или подтверждённого учителя.",
            "Provide an accurate age range and contact email, keep your password private, and report unauthorized access. You may use a pseudonym. Do not impersonate another user or an approved teacher."
          ],
          [
            "Доступ учителя к управлению подборками зависит от подтверждения оператором. Выбор роли при регистрации сам по себе не предоставляет повышенных прав.",
            "Teacher access to collection management depends on operator approval. Selecting a role at registration does not itself grant elevated permissions."
          ]
        ]
      ],
      [
        "learning",
        [
          "3. Учебные функции",
          "3. Learning features"
        ],
        [
          [
            "VAcademy предоставляет материалы, практику, проверку ответов, прогресс, рейтинг, симуляторы и AI-подсказки. Доступность функций зависит от их текущей реализации и настройки сервисов. Результаты платформы не являются официальными результатами олимпиад, оценками школы или гарантией призового места.",
            "VAcademy provides materials, practice, answer checking, progress, rankings, simulators, and AI hints. Availability depends on implementation and service configuration. Platform results are not official olympiad outcomes, school grades, or a guarantee of awards."
          ],
          [
            "AI и автоматическая проверка могут ошибаться. Проверяйте выводы и используйте правила организатора соревнования; не применяйте помощь платформы там, где она запрещена.",
            "AI and automated checking can make mistakes. Verify results and follow competition rules; do not use assistance where it is prohibited."
          ]
        ]
      ],
      [
        "conduct",
        [
          "4. Допустимое использование",
          "4. Acceptable use"
        ],
        [
          [
            "Не нарушайте закон и права других людей, не загружайте вредоносные файлы, незаконные материалы или чужие персональные данные без необходимых разрешений. Не обходите защиту, не подделывайте результаты, не перегружайте сервис автоматическими запросами и не пытайтесь получить доступ к чужим аккаунтам.",
            "Do not violate laws or others' rights, upload malicious files, unlawful materials, or another person's personal information without required permission. Do not bypass security, manipulate results, overload the service with automated requests, or access others' accounts."
          ],
          [
            "При подтверждённом нарушении или угрозе безопасности оператор может ограничить соответствующую функцию или аккаунт. Вопросы о таком ограничении можно направить по контактному email; обязательные права пользователя сохраняются.",
            "For a confirmed violation or security threat, the operator may restrict the affected feature or account. You may contact the operator about a restriction; mandatory user rights remain intact."
          ]
        ]
      ],
      [
        "content",
        [
          "5. Материалы и ваши работы",
          "5. Materials and your work"
        ],
        [
          [
            "Права на материалы, логотипы и внешний контент принадлежат их правообладателям. Используйте материалы для обучения в пределах указанной лицензии; не перепубликуйте и не продавайте материалы, если правообладатель этого не разрешает.",
            "Materials, logos, and external content belong to their respective rights holders. Use them for learning within the stated license; do not republish or sell them without the rights holder's permission."
          ],
          [
            "Вы сохраняете права на собственные решения и материалы. Загружая их, вы разрешаете необходимую для выбранной функции обработку, хранение и отображение; это не передаёт VAcademy право собственности на ваши работы. Учителя отвечают за необходимые разрешения на загружаемые сведения учеников.",
            "You retain rights to your solutions and materials. Uploading permits the processing, storage, and display needed for the selected feature; it does not transfer ownership to VAcademy. Teachers are responsible for the permissions required for uploaded student information."
          ],
          [
            "Изображения загружаются в публичное хранилище и доступны по URL; рейтинг может показывать имя, фото и результаты. Подробности приведены в политике конфиденциальности. О предполагаемом нарушении авторских прав сообщайте оператору, указав материал и ваши права.",
            "Images are uploaded to public storage and accessible by URL; rankings may display names, photos, and results. See the privacy policy for details. Report suspected copyright infringement to the operator with the affected material and your rights."
          ]
        ]
      ],
      [
        "external",
        [
          "6. Внешние сервисы",
          "6. External services"
        ],
        [
          [
            "Переходы на YouTube, MIT OCW, Google Drive, Codeforces и сайты организаторов регулируются их собственными правилами. Информация об олимпиадах может меняться; актуальные условия, даты, взносы и регистрацию проверяйте у официального организатора.",
            "YouTube, MIT OCW, Google Drive, Codeforces, and organizer websites have their own rules. Olympiad information can change; verify current conditions, dates, fees, and registration with the official organizer."
          ]
        ]
      ],
      [
        "payments",
        [
          "7. Оплата",
          "7. Payments"
        ],
        [
          [
            "На дату этой версии сайт не содержит встроенной покупки подписок или курсов. Эти условия не разрешают списания. Если появятся платные функции, цена, порядок оплаты, отмены и возврата должны быть представлены до оформления покупки.",
            "At the date of this version, the site does not include built-in purchases of subscriptions or courses. These terms do not authorize charges. If paid features are introduced, pricing, payment, cancellation, and refund terms must be provided before purchase."
          ]
        ]
      ],
      [
        "ending",
        [
          "8. Прекращение использования",
          "8. Ending use"
        ],
        [
          [
            "Вы можете прекратить использование и запросить удаление аккаунта в профиле или по email. Автоматическое удаление охватывает не все типы данных; для полного запроса используйте инструкции в политике конфиденциальности. Неиспользование аккаунта само по себе не запускает автоматическое удаление.",
            "You may stop using the service and request account deletion in your profile or by email. Automated deletion does not cover every type of information; follow the privacy-policy instructions for a complete request. Inactivity alone does not trigger automatic deletion."
          ]
        ]
      ],
      [
        "rights",
        [
          "9. Ответственность и применимые права",
          "9. Responsibility and applicable rights"
        ],
        [
          [
            "Мы стремимся поддерживать работоспособность сервиса, но возможны перерывы, ошибки и изменения функций. Не полагайтесь на платформу как на единственный источник учебных материалов или официальных сведений.",
            "We aim to maintain the service, but interruptions, errors, and feature changes may occur. Do not rely on the platform as your sole source of learning materials or official information."
          ],
          [
            "Эти условия не исключают ответственность, которую нельзя исключить по закону, и не ограничивают обязательные права потребителей или права на защиту данных. Применимое право и компетентный орган определяются обязательными нормами, в том числе правилами места проживания пользователя. Обязательный арбитраж и отказ от коллективных требований этой редакцией не устанавливаются.",
            "These terms do not exclude liability that cannot legally be excluded or limit mandatory consumer or privacy rights. Applicable law and jurisdiction are determined by mandatory rules, including rules tied to the user's residence. This version does not impose mandatory arbitration or a class-action waiver."
          ]
        ]
      ],
      [
        "changes",
        [
          "10. Изменения условий",
          "10. Changes to terms"
        ],
        [
          [
            "Действующая версия указана на странице. Существенные изменения не применяются задним числом; когда требуется новое принятие условий, его необходимо запросить отдельно. По вопросам изменений обращайтесь к оператору.",
            "The current version appears on this page. Material changes do not apply retroactively; new acceptance must be requested where required. Contact the operator about changes."
          ]
        ]
      ]
    ]
  },
  "cookies": {
    "title": [
      "Cookie и локальное хранение",
      "Cookies and local storage"
    ],
    "intro": [
      "Здесь описано, что VAcademy сохраняет в браузере и когда подключаются внешние ресурсы.",
      "This page describes what VAcademy stores in your browser and when external resources connect."
    ],
    "sections": [
      [
        "storage",
        [
          "1. Настройки интерфейса",
          "1. Interface preferences"
        ],
        [
          [
            "Cookie next-intl-locale хранит выбранный язык RU/EN до 365 дней с последнего переключения. Cookie sidebar_state хранит состояние бокового меню до 7 дней с последнего изменения. Эти настройки не содержат имя, email или ответы на задачи.",
            "The next-intl-locale cookie stores your RU/EN language choice for up to 365 days after the last switch. The sidebar_state cookie stores the sidebar state for up to 7 days after the last change. These preferences do not contain your name, email, or problem answers."
          ]
        ]
      ],
      [
        "auth",
        [
          "2. Вход в аккаунт",
          "2. Account sign-in"
        ],
        [
          [
            "Firebase Authentication использует браузерное хранилище, например IndexedDB или local storage, для поддержания входа. Конкретные ключи и сроки зависят от SDK и режима сессии. Выход из аккаунта прекращает текущую сессию; очистка только cookie языка не выполняет выход.",
            "Firebase Authentication uses browser storage, such as IndexedDB or local storage, to maintain sign-in. Specific keys and lifetimes depend on the SDK and session mode. Signing out ends the current session; clearing only the language cookie does not sign you out."
          ]
        ]
      ],
      [
        "practice",
        [
          "3. Практика и возрастная проверка",
          "3. Practice and age screening"
        ],
        [
          [
            "Local storage vacademy-practice хранит балл и число задач последней завершённой практики на этом устройстве. У него нет встроенного срока истечения: запись заменяется при следующей завершённой практике или удаляется при очистке. Это не история всех ваших ответов.",
            "The vacademy-practice local-storage entry keeps the score and question count of the latest completed practice on this device. It has no built-in expiry: the next completed practice replaces it, or you can clear it. It is not a history of all your answers."
          ],
          [
            "Если при регистрации выбрана группа младше 13 лет, session storage vacademy-age-restricted сохраняет только отметку ограничения до окончания сессии вкладки, чтобы не повторять возрастную проверку в ней. Email или дата рождения в этой записи не сохраняются.",
            "If an under-13 age range is selected at registration, the vacademy-age-restricted session-storage entry holds only a restriction flag until the tab session ends to avoid repeating age screening within that session. It contains no email or birth date."
          ]
        ]
      ],
      [
        "external",
        [
          "4. Внешние ресурсы",
          "4. External resources"
        ],
        [
          [
            "YouTube-плеер не загружается до нажатия «Загрузить видео». При загрузке и воспроизведении YouTube может обрабатывать IP-адрес, сведения о браузере и свои технологии хранения. Используется домен youtube-nocookie.com; это не означает отсутствие передачи данных после загрузки.",
            "The YouTube player does not load until you click Load video. On loading and playback, YouTube may process IP addresses, browser information, and its own storage technologies. The player uses youtube-nocookie.com; this does not mean no information is transmitted after loading."
          ],
          [
            "Шрифты Google Fonts загружаются при открытии сайта. Поставщики изображений получают запросы при загрузке внешних изображений. Переход на внешнюю ссылку открывает сайт с его собственными правилами cookie.",
            "Google Fonts loads when the site opens. Image providers receive requests for externally hosted images. Following an external link opens a site with its own cookie rules."
          ]
        ]
      ],
      [
        "tracking",
        [
          "5. Аналитика и реклама",
          "5. Analytics and advertising"
        ],
        [
          [
            "На дату этой версии VAcademy не использует рекламные cookie и стороннюю аналитику посещений. Если такие технологии будут добавлены и потребуют согласия, они должны оставаться выключенными до выбора пользователя с возможностью отказаться.",
            "At the date of this version, VAcademy does not use advertising cookies or third-party visitor analytics. If such technologies are added and require consent, they must remain disabled until the user chooses, with an option to decline."
          ]
        ]
      ],
      [
        "controls",
        [
          "6. Как управлять данными браузера",
          "6. Managing browser data"
        ],
        [
          [
            "Вы можете менять язык и меню, выйти из аккаунта, удалить данные сайта в настройках браузера или очистить предпочтения кнопкой ниже. Она удаляет настройки языка и меню и последний результат практики; данные аккаунта на сервере и сессия Firebase не удаляются.",
            "You can change language and sidebar preferences, sign out, remove site data in your browser settings, or clear preferences using the button below. It removes language and sidebar settings and the latest practice result; it does not delete server account data or the Firebase session."
          ],
          [
            "Блокировка браузерного хранилища может препятствовать входу и сохранению предпочтений. Разрешение YouTube-плеера действует только для текущего открытого видео: после закрытия и повторного открытия снова требуется нажатие. Дополнительные запросы о данных направляйте оператору.",
            "Blocking browser storage can interfere with sign-in and preferences. Permission to load a YouTube player applies only to the currently opened video: closing and reopening it requires another click. Send additional privacy requests to the operator."
          ]
        ]
      ]
    ]
  }
};

export const providerPolicies = [
  {name: "Firebase / Google", url: "https://firebase.google.com/support/privacy"},
  {name: "Vercel", url: "https://vercel.com/legal/privacy-notice"},
  {name: "Groq", url: "https://groq.com/privacy-policy"},
  {name: "Resend", url: "https://resend.com/legal/privacy-policy"},
  {name: "Telegram", url: "https://telegram.org/privacy"},
  {name: "YouTube / Google", url: "https://policies.google.com/privacy"},
];
