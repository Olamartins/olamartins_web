import bcrypt from 'bcryptjs';
import { initDb, query, pool } from '../src/config/db.js';

// Creates the first admin (from ADMIN_* env vars) and inserts placeholder
// content. Safe to re-run: existing rows are left untouched.

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@olamartins.com').toLowerCase().trim();
const adminName = process.env.ADMIN_NAME || 'Ola Martins';
const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-please';

const settings = {
  siteName: 'Ola Martins',
  tagline: 'Senior Data & Business Intelligence Leader',
  hero: {
    eyebrow: "I'm Ola Martins — Senior Data & BI Leader, Port Harcourt, Nigeria",
    title: 'Clarity from complexity.',
    subtitle:
      'I design and deliver enterprise BI solutions — semantic models, DAX, KPI dashboards and automated pipelines — that leadership actually uses. 9+ years across Oil & Gas, retail, e-commerce, healthcare and NGOs.',
    primaryCta: { label: 'Book a free consultation', href: '/contact' },
    secondaryCta: { label: 'Browse the shop', href: '/shop' },
  },
  stats: [
    { value: '9+', label: 'Years in data & BI' },
    { value: '120+', label: 'Dashboards delivered' },
    { value: '45%', label: 'More data availability' },
    { value: '-30%', label: 'Manual processing time' },
  ],
  highlights: [
    {
      metric: '+45%',
      title: 'Data availability, unified reporting',
      description:
        'Integrated ERP, legacy and cloud sources into one EDW-backed reporting layer at Nigeria LNG, enabling reliable cross-functional reporting across programme, finance and operations.',
      tag: 'Nigeria LNG',
    },
    {
      metric: '-30%',
      title: 'Manual processing time',
      description:
        'Automated business workflows with Power Automate alongside an ML engineer, cutting manual processing time by 30% and improving operational throughput.',
      tag: 'Process automation',
    },
    {
      metric: '+45%',
      title: 'Leadership responsiveness',
      description:
        'Delivered end-to-end freelance BI engagements whose tailored reporting and data storytelling improved leadership responsiveness by 45% across client engagements.',
      tag: 'The Transcender Solutions',
    },
  ],
  services: [
    {
      icon: 'BarChart3',
      title: 'BI & Advanced Analytics',
      description: 'Semantic layer design, DAX/MDX, hierarchies, row-level security and EDW-backed KPI dashboards that leadership adopts.',
    },
    {
      icon: 'PenTool',
      title: 'Data Visualization & UX',
      description: 'Dashboard design with UX/UI standards and corporate branding — clear visual narratives, not cluttered reports.',
    },
    {
      icon: 'Rocket',
      title: 'Automation & Digital Transformation',
      description: 'Power Automate workflows, ETL automation, multi-source integration and process optimization roadmaps.',
    },
    {
      icon: 'GraduationCap',
      title: 'Training & Mentorship',
      description: 'Power BI, DAX and data-literacy training for teams, plus mentoring junior analysts on modelling and reporting standards.',
    },
  ],
  experience: [
    {
      role: 'Senior Business Intelligence Developer — Contract',
      company: 'Nigeria LNG Limited, Nigeria',
      period: 'Jul 2022 – Present',
      points: [
        'Own end-to-end delivery of BI and reporting layers: semantic models, DAX measures, hierarchies and RLS aligned to access-control requirements.',
        'Built KPI dashboards for budget compliance, programme timelines and impact metrics with UX/UI and branding standards for adoption.',
        'Tuned Power BI models with Import mode, aggregations and query optimization to meet data-refresh SLAs; +45% data availability from ERP/legacy/cloud integration.',
        'Automated workflows with Power Automate (−30% manual processing); mentored junior analysts on modelling and DAX standards.',
      ],
    },
    {
      role: 'Data Analytics Executive — Full Time',
      company: 'SKLD Integrated Services, Lagos',
      period: 'Jan 2022 – Jun 2022',
      points: [
        'Designed dynamic Power BI dashboards for business performance and customer-retention KPIs.',
        'Root-cause and churn analysis translated into visual narratives that shaped retention strategy.',
      ],
    },
    {
      role: 'Freelance Business & Data Analyst',
      company: 'The Transcender Solutions, Lagos (Remote)',
      period: 'Mar 2017 – Dec 2021',
      points: [
        'End-to-end BI engagements across industries: requirements, semantic models, dashboards, executive reporting.',
        'Reporting and data-storytelling assets improved leadership responsiveness by 45% across engagements.',
      ],
    },
    {
      role: 'Data Analyst — Full Time',
      company: 'Living Faith Church Worldwide, Lagos',
      period: 'Oct 2020 – Nov 2021',
      points: [
        'Automated weekly consolidation across 50+ branches with Power Query, eliminating manual aggregation.',
        'Standardized operational reporting templates, reducing reconciliation effort.',
      ],
    },
    {
      role: 'IT Instructor — Full Time',
      company: 'New Horizon System Solutions, Ikeja, Lagos',
      period: 'Mar 2018 – Sep 2020',
      points: [
        'Built performance-tracking dashboards for learner outcomes and engagement.',
        'Delivered Python and Scratch workshops; 75% improvement in student performance outcomes.',
      ],
    },
  ],
  certifications: [
    'MS Certified: Fabric Analytics Engineer Associate (2024)',
    'MS Certified: Power BI Data Analyst Associate (2024)',
    'Certified Risk Management Expert — Six Sigma Academy (2024)',
    'Google Business Intelligence Certificate (2023)',
    'MS Certified: Azure Fundamentals (2023)',
    'MS Certified: Power Platform Fundamentals (2022)',
    'Google Data Analytics Professional Certificate (2021)',
    'Agile Scrum Master — Simplilearn (2022)',
  ],
  tools: ['Power BI', 'DAX', 'Microsoft Fabric', 'Tableau', 'SQL', 'Excel', 'Power Query', 'Python', 'Azure', 'SharePoint', 'R', 'SPSS', 'GitHub'],
  about: {
    heading: 'I Deliver Measurable Results',
    subheading: 'Senior Data & BI Leader — Olawumi Fadero (Ola Martins)',
    body: [
      'Senior Business Intelligence Developer with over 9 years of experience designing and delivering enterprise BI solutions across Oil & Gas, services and non-profit sectors — Power BI, DAX, semantic layer development and ETL architecture, backed by enterprise data warehouses.',
      'I turn complex business requirements into practical, scalable reporting solutions, working closely with stakeholders through requirements gathering, UAT, deployment and change management — and I mentor junior developers along the way.',
    ],
  },
  mission:
    'To empower organizations to unlock the full potential of their data by delivering bespoke analytics solutions that are as intuitive as they are intelligent.',
  vision:
    'A world where every strategic decision is illuminated by clarity, powered by data, and executed with confidence.',
  contact: {
    phone: '+2347031373640',
    email: 'olawumifadero.m@gmail.com',
    address: 'Port Harcourt, Nigeria',
  },
  socials: {
    linkedin: 'https://www.linkedin.com/in/olamartins07',
    twitter: 'https://x.com/',
    medium: 'https://medium.com/',
  },
};

// ---- Placeholder content (replace these from the admin dashboard) --------

const posts = [
  {
    title: 'From Raw Data to Boardroom Decisions',
    excerpt: 'Why most dashboards fail and how to design analytics people actually use.',
    content: [
      '# From Raw Data to Boardroom Decisions',
      '',
      'Most analytics projects do not fail because of the data. They fail because the insight never reaches the person who can act on it.',
      '',
      '## Design for the decision, not the dataset',
      '',
      'Start every dashboard with a single question: what decision will this support? If you cannot name the decision, you do not need the chart.',
      '',
      '- Put the most important KPI at the top left, where eyes land first',
      '- Use one accent color for the metric that matters, neutral colors for context',
      '- Replace tables with comparisons whenever possible',
      '',
      '## Keep the narrative short',
      '',
      'A good dashboard tells a story in five seconds. If a stakeholder needs a training session to read it, redesign it.',
    ].join('\n'),
    cover_image: '',
    published: true,
  },
  {
    title: '5 Power BI Patterns I Reuse on Every Project',
    excerpt: 'Modeling and DAX patterns that keep client dashboards fast and maintainable.',
    content: [
      '# 5 Power BI Patterns I Reuse on Every Project',
      '',
      'After 120+ dashboard projects, a few patterns keep showing up. Here are five I now start with by default.',
      '',
      '## 1. A dedicated date table',
      '',
      'Never rely on auto date/time. A proper date table unlocks time intelligence and keeps relationships clean.',
      '',
      '## 2. Star schema, always',
      '',
      'Fact tables in the middle, dimensions around them. It is the single biggest performance lever in Power BI.',
      '',
      '## 3. Measures over calculated columns',
      '',
      'Calculated columns consume memory at refresh; measures compute on the fly. Prefer measures unless you must filter or group by the value.',
    ].join('\n'),
    cover_image: '',
    published: true,
  },
  {
    title: 'Data Storytelling: The Skill Nobody Teaches Analysts',
    excerpt: 'Turning a static report into a narrative that moves stakeholders to act.',
    content: [
      '# Data Storytelling: The Skill Nobody Teaches Analysts',
      '',
      'You can have the best model in the company and still lose the room if the story is missing.',
      '',
      '## Structure every insight in three beats',
      '',
      '1. What we expected',
      '2. What the data actually shows',
      '3. What we should do next',
      '',
      'That structure works in a dashboard tooltip, a slide, or a hallway conversation.',
    ].join('\n'),
    cover_image: '',
    published: true,
  },
];

const resources = [
  {
    title: 'Power BI Fundamentals — Free Sample eBook',
    description:
      'A free sample chapter from my Power BI starter guide: data modeling, DAX basics and your first dashboard in one afternoon.',
    type: 'ebook',
    format: 'pdf',
    file_url: 'https://example.com/resources/power-bi-fundamentals-sample.pdf',
    thumbnail: '',
    tags: ['power-bi', 'beginner', 'free'],
    published: true,
  },
  {
    title: 'Excel for Analysts — Video Masterclass',
    description:
      'A hands-on video course covering lookups, pivot tables, dynamic arrays and dashboard-grade formatting in Excel.',
    type: 'video',
    format: 'mp4',
    file_url: 'https://example.com/resources/excel-for-analysts-masterclass',
    thumbnail: '',
    tags: ['excel', 'video', 'free'],
    published: true,
  },
  {
    title: 'Dashboard Design Principles — Free Guide',
    description: 'Layout, color and hierarchy rules that make analytics dashboards instantly readable.',
    type: 'guide',
    format: 'pdf',
    file_url: 'https://example.com/resources/dashboard-design-principles.pdf',
    thumbnail: '',
    tags: ['design', 'dashboards', 'free'],
    published: true,
  },
  {
    title: 'SQL for Business Analysts — Crash Course',
    description: 'The exact SQL you need for analysis: joins, aggregations, window functions and clean reporting queries.',
    type: 'video',
    format: 'mp4',
    file_url: 'https://example.com/resources/sql-crash-course',
    thumbnail: '',
    tags: ['sql', 'video', 'free'],
    published: true,
  },
  {
    title: 'Tableau Public Portfolio Starter',
    description: 'How to structure a Tableau Public portfolio that gets you noticed by recruiters and clients.',
    type: 'article',
    format: 'link',
    file_url: 'https://example.com/resources/tableau-portfolio-starter',
    thumbnail: '',
    tags: ['tableau', 'career', 'free'],
    published: true,
  },
  {
    title: 'Data Storytelling Cheat Sheet',
    description: 'One page, printable: the three-beat insight structure, color rules and KPI placement checklist.',
    type: 'ebook',
    format: 'pdf',
    file_url: 'https://example.com/resources/data-storytelling-cheatsheet.pdf',
    thumbnail: '',
    tags: ['storytelling', 'cheatsheet', 'free'],
    published: true,
  },
];

const products = [
  {
    title: 'Sales Performance Power BI Template',
    description:
      'A production-ready Power BI template for sales teams: revenue trends, pipeline, rep performance and YoY comparisons, wired to a clean star schema.',
    category: 'power-bi',
    price: 29,
    currency: 'USD',
    selar_url: 'https://selar.co/m/olamartins/power-bi-sales-template',
    thumbnail: '',
    features: [
      '20+ ready-to-use DAX measures',
      'Star-schema model with date table',
      'Mobile-optimized layout',
      'Free updates for 12 months',
    ],
    is_featured: true,
    published: true,
  },
  {
    title: 'Executive KPI Excel Dashboard',
    description:
      'A board-level KPI workbook in Excel with dynamic arrays, sparklines and a one-page executive summary that updates automatically.',
    category: 'excel',
    price: 19,
    currency: 'USD',
    selar_url: 'https://selar.co/m/olamartins/excel-kpi-dashboard',
    thumbnail: '',
    features: ['Dynamic-array formulas (no VBA)', 'Auto-refreshing summary page', 'Data-validation dropdowns', 'Works in Excel 365 & 2021'],
    is_featured: true,
    published: true,
  },
  {
    title: 'Retail Analytics Tableau Pack',
    description:
      'Three linked Tableau dashboards for retail: basket analysis, store performance and customer cohorts, with sample data included.',
    category: 'tableau',
    price: 39,
    currency: 'USD',
    selar_url: 'https://selar.co/m/olamartins/tableau-retail-pack',
    thumbnail: '',
    features: ['3 connected dashboards', 'Sample dataset included', 'Step-by-step setup guide', 'Lifetime access'],
    is_featured: true,
    published: true,
  },
  {
    title: 'Data Storytelling Handbook (eBook)',
    description:
      'The complete guide to presenting analytics so people act: narrative structure, visual hierarchy and stakeholder-ready slides.',
    category: 'ebook',
    price: 15,
    currency: 'USD',
    selar_url: 'https://selar.co/m/olamartins/data-storytelling-handbook',
    thumbnail: '',
    features: ['180-page PDF', 'Real dashboard makeovers', 'Slide templates included', 'Lifetime updates'],
    is_featured: false,
    published: true,
  },
  {
    title: 'Financial Modeling Excel Template',
    description:
      'A three-statement financial model template with scenario switching, sensitivity tables and clean, auditable formatting.',
    category: 'excel',
    price: 24,
    currency: 'USD',
    selar_url: 'https://selar.co/m/olamartins/excel-financial-model',
    thumbnail: '',
    features: ['3-statement model', 'Scenario manager built in', 'Sensitivity tables', 'Color-coded inputs vs formulas'],
    is_featured: false,
    published: true,
  },
  {
    title: 'HR Analytics Power BI Template',
    description:
      'Track headcount, attrition, time-to-hire and engagement in one Power BI report with an HR-ready data model.',
    category: 'power-bi',
    price: 25,
    currency: 'USD',
    selar_url: 'https://selar.co/m/olamartins/power-bi-hr-analytics',
    thumbnail: '',
    features: ['Attrition & turnover KPIs', 'Time-to-hire funnel', 'Department drill-downs', 'Sample HR dataset'],
    is_featured: false,
    published: true,
  },
];

function slugify(text) {
  return String(text).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');
}

async function main() {
  await initDb();
  console.log('Schema ready.');

  const hash = await bcrypt.hash(adminPassword, 10);
  await query(
    `INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    [adminName, adminEmail, hash]
  );
  console.log(`Admin ensured: ${adminEmail}`);

  await query(
    `INSERT INTO site_settings (id, data) VALUES (1, $1)
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(settings)]
  );

  for (const p of posts) {
    await query(
      `INSERT INTO posts (title, slug, excerpt, content, cover_image, published) VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO NOTHING`,
      [p.title, slugify(p.title), p.excerpt, p.content, p.cover_image, p.published]
    );
  }

  for (const r of resources) {
    await query(
      `INSERT INTO resources (title, slug, description, type, format, file_url, thumbnail, tags, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (slug) DO NOTHING`,
      [r.title, slugify(r.title), r.description, r.type, r.format, r.file_url, r.thumbnail, r.tags, r.published]
    );
  }

  for (const p of products) {
    await query(
      `INSERT INTO products (title, slug, description, category, price, currency, selar_url, thumbnail, features, is_featured, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (slug) DO NOTHING`,
      [p.title, slugify(p.title), p.description, p.category, p.price, p.currency, p.selar_url, p.thumbnail, JSON.stringify(p.features), p.is_featured, p.published]
    );
  }

  console.log(`Seeded placeholder content: ${posts.length} articles, ${resources.length} resources, ${products.length} products.`);
  console.log('Replace them anytime from the admin dashboard at /admin.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
