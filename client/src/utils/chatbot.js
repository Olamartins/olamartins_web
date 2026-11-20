// Rule-based chatbot engine — no LLM API involved.
// Each rule scores the user's message by summing the lengths of its keywords
// found in the text (longer keywords win, so specific phrases beat "hi").
// The highest-scoring rule replies; ties go to the first rule listed.

const RULES = [
  {
    id: 'greeting',
    keywords: ['hello', 'good morning', 'good afternoon', 'good evening', 'hey', 'hi ', ' hi', 'howdy', 'yo '],
    reply:
      "Hi there! I'm Ola's assistant. I can tell you about his services, the shop, free resources and how to book a consultation. What would you like to know?",
    quick: ['What do you do?', 'Show me the shop', 'Any free resources?', 'Book a consultation'],
  },
  {
    id: 'about',
    keywords: ['who are you', 'about you', 'about ola', 'who is ola', 'tell me about ola', 'bio', 'yourself', 'introduce yourself'],
    reply:
      "I'm Olawumi (Ola) Martins — Senior Data & Business Intelligence Leader based in Port Harcourt, Nigeria. 9+ years building enterprise BI solutions: semantic models, DAX, KPI dashboards, ETL and automation. Microsoft Certified Power BI Data Analyst and Fabric Analytics Engineer.",
    links: [{ label: 'Read the full story', to: '/about' }],
    quick: ['Your experience?', 'What tools do you use?', 'Book a consultation'],
  },
  {
    id: 'services',
    keywords: ['service', 'what do you do', 'what can you do', 'offer', 'help with', 'consult', 'analytics', 'dashboard design', 'bi '],
    reply:
      'Ola works in four areas:\n1. BI & advanced analytics — semantic models, DAX, KPI dashboards on EDW.\n2. Data visualization & UX — dashboards people actually adopt.\n3. Process automation & digital transformation — Power Automate, workflows.\n4. Training & mentorship — Power BI, Python and data literacy for teams.',
    links: [{ label: 'See services on About', to: '/about' }, { label: 'Book a consultation', to: '/contact' }],
    quick: ['How much does it cost?', 'Show me the shop', 'Free resources'],
  },
  {
    id: 'experience',
    keywords: ['experience', 'resume', 'cv', 'work history', 'career', 'previous', 'companies', 'nlng', 'jobs'],
    reply:
      'Highlights: Senior BI Developer (contract) at Nigeria LNG since 2022 — EDW-backed dashboards, RLS, +45% data availability; Data Analytics Executive at SKLD Integrated Services; 4+ years freelance BI across industries; earlier roles in data analysis and technical training. Full timeline is on the About page.',
    links: [{ label: 'Full experience timeline', to: '/about' }],
    quick: ['Certifications', 'Book a consultation'],
  },
  {
    id: 'skills',
    keywords: ['tools', 'stack', 'technologies', 'skills', 'power bi', 'dax', 'tableau', 'sql', 'fabric', 'excel', 'python', 'azure', 'certifications', 'certified'],
    reply:
      'Core stack: Power BI, DAX, Microsoft Fabric, Tableau, SQL, Excel & Power Query, Python, Azure, SharePoint, R, SPSS. Certifications include Microsoft Certified Power BI Data Analyst Associate, Fabric Analytics Engineer Associate, Google BI Certificate and Azure Fundamentals.',
    links: [{ label: 'Certifications list', to: '/about' }],
    quick: ['Show me the shop', 'Any free resources?'],
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'how much', 'fee', 'rate', 'charge', 'expensive', 'budget', 'pay'],
    reply:
      'Consulting is scoped in writing before work starts — fixed price, no hourly billing — after a free consultation. Ready-made dashboard templates in the shop are fixed-price and delivered instantly via Selar after checkout.',
    links: [{ label: 'Browse the shop', to: '/shop' }, { label: 'Book a free consultation', to: '/contact' }],
    quick: ['Show me the shop', 'Book a consultation'],
  },
  {
    id: 'shop',
    keywords: ['shop', 'buy', 'purchase', 'template', 'product', 'selar', 'sell', 'download pack', 'power bi template', 'excel template', 'tableau template', 'ebook', 'marketplace'],
    reply:
      'The shop sells digital products: Power BI templates, Excel dashboards, Tableau packs and ebooks. Click "Buy on Selar" on any product — payment and instant delivery are handled securely by Selar (selar.co).',
    links: [{ label: 'Open the shop', to: '/shop' }],
    quick: ['How does payment work?', 'Free resources instead', 'Book a consultation'],
  },
  {
    id: 'payment',
    keywords: ['payment', 'pay', 'checkout', 'card', 'refund', 'deliver', 'delivery', 'selar.co', 'secure'],
    reply:
      'Checkout happens on Selar (selar.co), a secure payment platform — card and other local payment methods are supported there. After payment you get instant access to your files. Ola never sees your card details.',
    links: [{ label: 'Open the shop', to: '/shop' }],
    quick: ['Show me the shop'],
  },
  {
    id: 'resources',
    keywords: ['free', 'resource', 'ebook', 'video', 'learn', 'course', 'tutorial', 'guide', 'download', 'study', 'training material'],
    reply:
      'The Resources page has free learning materials — ebooks, video courses and guides on Power BI, Excel, SQL, Tableau and dashboard design. No account or payment needed, just open and download/watch.',
    links: [{ label: 'Browse free resources', to: '/resources' }],
    quick: ['Show me the shop', 'Book a consultation'],
  },
  {
    id: 'articles',
    keywords: ['article', 'blog', 'post', 'writing', 'read', 'medium'],
    reply: 'Ola writes practical articles on analytics, dashboards and data storytelling — they are all on the Articles page.',
    links: [{ label: 'Read the articles', to: '/articles' }],
    quick: ['Free resources', 'Show me the shop'],
  },
  {
    id: 'whatsapp',
    keywords: ['whatsapp', 'whats app', 'wa.me', 'green button', 'chat directly'],
    reply:
      "You can chat with Ola directly on WhatsApp — tap the green WhatsApp button below this chat window, or use the link here.",
    links: [{ label: 'Chat on WhatsApp', href: 'https://wa.me/23412345678' }],
    quick: ['Book a call instead', 'What do you do?'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'phone', 'call', 'book', 'consultation', 'meet', 'reach', 'talk', 'hire', 'start a project', 'schedule'],
    reply:
      "You can reach Ola at olawumifadero.m@gmail.com or +2347031373640 (Port Harcourt, Nigeria) — or WhatsApp via the green button. Fastest way to start: the free consultation form on the Contact page; he replies within one business day.",
    links: [{ label: 'Open the contact form', to: '/contact' }, { label: 'Chat on WhatsApp', href: 'https://wa.me/23412345678' }],
    quick: ['What do you do?', 'Show me the shop'],
  },
  {
    id: 'availability',
    keywords: ['available', 'availability', 'slot', 'open for', 'hiring', 'busy', 'when can'],
    reply: 'Ola is currently available for new BI projects and consulting engagements — remote-friendly for teams in Africa, the US and Europe. Book a call to grab a slot.',
    links: [{ label: 'Book a free consultation', to: '/contact' }],
    quick: ['What do you do?', 'Pricing'],
  },
  {
    id: 'location',
    keywords: ['where', 'location', 'based', 'nigeria', 'lagos', 'port harcourt', 'remote', 'timezone', 'country'],
    reply: 'Based in Port Harcourt, Nigeria — and fully remote-friendly, with a live review every week whatever the time zone.',
    links: [{ label: 'Book a consultation', to: '/contact' }],
    quick: ['Are you available?', 'What do you do?'],
  },
  {
    id: 'admin',
    keywords: ['admin', 'login', 'dashboard', 'cms', 'log in', 'password'],
    reply: 'The admin CMS lives at /admin/login and is for the site owner only — visitors can browse everything without an account.',
    links: [{ label: 'Admin login', to: '/admin/login' }],
    quick: ['What do you do?', 'Show me the shop'],
  },
  {
    id: 'theme',
    keywords: ['dark mode', 'light mode', 'theme', 'dark theme', 'toggle theme'],
    reply: 'Use the sun/moon button in the top navigation bar to switch between light and dark mode. Your choice is remembered on this device.',
    quick: ['What do you do?', 'Show me the shop'],
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thx', 'appreciated', 'great'],
    reply: "You're welcome! If anything else comes up — services, shop, resources or booking a call — just ask.",
    quick: ['Book a consultation', 'Show me the shop', 'Free resources'],
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'good night'],
    reply: 'Bye for now! The consultation form is there whenever you are ready — have a great day.',
    quick: ['Book a consultation'],
  },
];

const FALLBACK = {
  id: 'fallback',
  reply:
    "I'm a simple rule-based assistant, so I answer from a fixed set of topics. Try asking about services, pricing, the shop, free resources, my experience or how to book a consultation.",
  quick: ['What do you do?', 'Pricing', 'Show me the shop', 'Free resources', 'Book a consultation'],
};

export const GREETING = {
  id: 'greeting-intro',
  reply:
    "Hi! I'm Ola's assistant — a rule-based bot, no AI API. Ask me about his services, the shop, free resources, pricing or how to book a consultation.",
  quick: ['What do you do?', 'Show me the shop', 'Free resources', 'Book a consultation'],
};

export function getReply(input) {
  const text = ` ${String(input || '').toLowerCase()} `;
  let best = null;
  let bestScore = 0;
  for (const rule of RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      best = rule;
      bestScore = score;
    }
  }
  return best || FALLBACK;
}
