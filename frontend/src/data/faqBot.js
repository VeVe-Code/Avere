/** FAQ knowledge for the public chat assistant (free, no AI API). */

export const FAQ_ITEMS = [
  {
    id: 'about',
    keywords: [
      'about avere', 'about the company', 'about company', 'who are you',
      'what is avere', 'founded', 'history', 'our story', 'based in',
      'bangkok', 'thailand', 'ကုမ္ပဏီ',
    ],
    // weak keywords only count if no stronger topic wins
    weakKeywords: ['about', 'company', 'avere'],
    question: 'About Avere',
    answer:
      'Happy to share. We’re Avere Co., Ltd. — a small IT team in Bangkok, started in 2016. We focus on practical cloud and IT work that helps businesses move forward steadily, without overpromising. If you’d like, I can also walk you through what we offer.',
  },
  {
    id: 'services',
    keywords: [
      'service', 'services', 'what do you offer', 'what can i get', 'what can you do',
      'offer', 'offering', 'capability', 'capabilities', 'help with', 'do you provide',
      'ဝန်ဆောင်မှု',
    ],
    weakKeywords: [],
    question: 'Our services',
    answer:
      'Of course. We mainly help with cloud support (by the day), software development, cloud migration, DevOps & automation, database care, and licensing/hardware. Tell me which area you’re interested in and I’ll explain it more simply — or you can open the Services page for the full list.',
  },
  {
    id: 'cloud',
    keywords: [
      'cloud', 'aws', 'azure', 'gcp', 'google cloud', 'huawei', 'migration',
      'infrastructure', 'man-day', 'manday', 'man day',
    ],
    weakKeywords: [],
    question: 'Cloud & migration',
    answer:
      'Yes — cloud is one of our core strengths. We work with AWS, Azure, Google Cloud, and Huawei Cloud: setup, migration, troubleshooting, and day-to-day support. We keep things clear and careful so your systems stay reliable. Want help choosing a path, or migrating something specific?',
  },
  {
    id: 'software',
    keywords: [
      'software', 'development', 'app', 'application', 'custom software',
      'devops', 'ci/cd', 'automation', 'build an app',
    ],
    weakKeywords: [],
    question: 'Software & DevOps',
    answer:
      'We can help build custom software and set up DevOps (CI/CD and smoother releases). We aim for solutions that are useful and maintainable — not flashy for the sake of it. Share what you’re trying to build and we’ll guide you honestly.',
  },
  {
    id: 'database',
    keywords: ['database', 'db', 'backup', 'sql', 'data platform'],
    weakKeywords: [],
    question: 'Database services',
    answer:
      'Yes. We support database migration, backups, and performance tuning — carefully, because data matters. If something feels slow or you’re planning a move, our team can review it with you.',
  },
  {
    id: 'licensing',
    keywords: ['license', 'licensing', 'hardware', 'reseller', 'software license'],
    weakKeywords: [],
    question: 'Licensing & hardware',
    answer:
      'We also help with enterprise licensing and hardware as an authorized reseller. If you’re unsure what you need, just ask — we’ll keep the advice straightforward.',
  },
  {
    id: 'clients',
    keywords: ['client', 'clients', 'customer', 'customers', 'partner', 'who do you work', 'references'],
    weakKeywords: [],
    question: 'Who we work with',
    answer:
      'We work with organizations across healthcare, finance, and technology. Client details stay private — if you’d like to talk about whether we’re a fit, we’re happy to discuss that directly.',
  },
  {
    id: 'contact',
    keywords: [
      'contact', 'email', 'phone', 'call', 'reach', 'location', 'address',
      'ဆက်သွယ်', 'contact us', 'get in touch',
    ],
    weakKeywords: [],
    question: 'Contact us',
    answer:
      'Sure. The easiest way is the Contact page on this site, or email info@avere.example.com. If you’d rather speak with someone now, tap “Talk to a human” and our team will reply in live chat as soon as we can.',
  },
  {
    id: 'jobs',
    keywords: ['job', 'jobs', 'career', 'careers', 'position', 'hire', 'hiring', 'vacancy', 'work with you'],
    weakKeywords: [],
    question: 'Careers',
    answer:
      'Thanks for your interest. Open roles are listed on our Careers / Position page. Feel free to browse there, and apply if something feels like a good fit — we’d be glad to hear from you.',
  },
  {
    id: 'events',
    keywords: ['event', 'events', 'upcoming event'],
    weakKeywords: [],
    question: 'Events',
    answer:
      'You can find our events on the Events page in the menu. That’s the best place for dates and details.',
  },
  {
    id: 'news',
    keywords: ['news', 'headline', 'press', 'announcement'],
    weakKeywords: [],
    question: 'News',
    answer:
      'Latest company news is on the News page in the menu. You’re welcome to browse there anytime.',
  },
  {
    id: 'knowledge',
    keywords: ['knowledge', 'article', 'blog', 'learn', 'guide', 'how to'],
    weakKeywords: [],
    question: 'Knowledge',
    answer:
      'We share helpful guides in the Knowledge section. You’re welcome to browse there anytime — and if something’s unclear, ask us or talk to a human.',
  },
]

export const QUICK_PROMPTS = [
  'Tell me about Avere',
  'What services do you offer?',
  'Do you work with AWS?',
  'How can I contact you?',
]

const TOPIC_PRIORITY = [
  'services',
  'cloud',
  'software',
  'database',
  'licensing',
  'contact',
  'jobs',
  'events',
  'news',
  'knowledge',
  'about',
]

/**
 * Score FAQ items against user text. Returns best match or null.
 */
export function matchFaq(rawText) {
  const text = String(rawText || '')
    .toLowerCase()
    .trim()
  if (!text) return null

  const scored = FAQ_ITEMS.map((item) => {
    let score = 0
    for (const kw of item.keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += kw.length >= 8 ? 4 : kw.length > 4 ? 3 : 2
      }
    }
    for (const kw of item.weakKeywords || []) {
      if (text.includes(kw.toLowerCase())) {
        score += 1
      }
    }
    // Prefer services when user mentions getting/offering help + company
    if (
      item.id === 'services' &&
      /\b(service|services|offer|get|provide|help)\b/.test(text)
    ) {
      score += 5
    }
    if (item.id === 'about' && /\b(service|services)\b/.test(text)) {
      score -= 4
    }
    return { item, score }
  }).filter((x) => x.score > 0)

  if (!scored.length) return null

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return TOPIC_PRIORITY.indexOf(a.item.id) - TOPIC_PRIORITY.indexOf(b.item.id)
  })

  return scored[0].item
}

export function wantsHuman(rawText) {
  const text = String(rawText || '').toLowerCase()
  return (
    /\b(human|agent|person|staff|live\s*chat|real\s*person|talk to (a )?human|speak to)\b/.test(text) ||
    text.includes('လူ') ||
    text.includes('live chat')
  )
}

/** Short greetings like hi / hello / hey */
export function isGreeting(rawText) {
  const text = String(rawText || '')
    .toLowerCase()
    .trim()
    .replace(/[!?.,]+$/g, '')
  if (!text) return false
  return /^(hi|hello|hey|hiya|yo|good\s*(morning|afternoon|evening)|မင်္ဂလာပါ|ဟိုင်း|ဟဲလို)$/i.test(
    text
  )
}

export const GREETING_REPLY =
  'Hello — nice to meet you. How can I help today? Feel free to ask about Avere, our services, or how to get in touch. If you’d rather talk to a person, just say so.'

export function relatedPath(id) {
  if (id === 'services' || id === 'cloud' || id === 'software' || id === 'database' || id === 'licensing') {
    return '/service'
  }
  if (id === 'about' || id === 'clients') return '/about'
  if (id === 'contact') return '/contactus'
  if (id === 'jobs') return '/position'
  if (id === 'events') return '/events'
  if (id === 'news') return '/news'
  if (id === 'knowledge') return '/knowledge'
  return null
}
