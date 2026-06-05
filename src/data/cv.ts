export interface SkillGroup {
  category: string;
  items:     readonly string[];
}

export interface Experience {
  company:  string;
  location: string;
  role:     string;
  period:   string;
  current:  boolean;
  bullets:  readonly string[];
}

export interface Education {
  institution: string;
  degree:      string;
  focus:       string;
  location:    string;
  period:      string;
  current:     boolean;
}

export interface Publication {
  title:    string;
  authors:  string;
  abstract: string;
}

export const skills: SkillGroup[] = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'Astro', 'TypeScript', 'JavaScript ES6+', 'Tailwind CSS', 'Vue 2', 'QML', 'UI Architecture', 'SEO'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'NestJS', 'PHP', 'Laravel', 'CakePHP', 'Strapi', 'RESTful APIs', 'MVC Architecture'],
  },
  {
    category: 'Cloud & Infra',
    items: ['AWS', 'Deployments', 'Proxies', 'VPNs', 'Server-Side Config'],
  },
  {
    category: 'Data & AI',
    items: ['Python', 'Pandas', 'Web Scraping', 'Data Pipelines', 'SQL', 'MySQL', 'Business Intelligence', 'NLP', 'Prolog'],
  },
  {
    category: 'Architecture & Practices',
    items: ['Software Architecture', 'Team Leadership', 'Scrum', 'Agile', 'Integration Testing', 'UI Component Testing', 'Security Guidelines', 'API Integration'],
  },
  {
    category: 'Enterprise & Web3',
    items: ['ERP Systems', 'CRM Systems', 'Inventory Management', 'Multi-Tenant Architecture', 'Web3', 'Crypto-Wallet Integration', 'Blockchain'],
  },
];

export const experience: Experience[] = [
  {
    company:  'ConLuc Corp.',
    location: 'México',
    role:     'Frontend Lead',
    period:   'Oct 2025 – Present',
    current:  true,
    bullets: [
      'Direct and manage the Frontend Department: core team of 6, scales to 12 cross-functional engineers during major module rollouts.',
      'Architect modern web applications, define Definitions of Done (DoD), and establish development and security guidelines.',
      'Partner with Backend Lead to design bulletproof API integration strategies that prevent breaking changes in production.',
      'Enforce integration testing and atomic UI component testing for zero-downtime deployments.',
    ],
  },
  {
    company:  'TagWizz',
    location: 'Ciudad de México, México',
    role:     'Software Engineer Senior',
    period:   'Apr 2024 – Jun 2026',
    current:  false,
    bullets: [
      'Architected a white-label LMS using React and NestJS — same core deployed under two distinct UI designs for corporate hospitality.',
      'Co-developed an internal AI-driven video analysis tool for game QA; built a timeline-based video editor UI in QML + Python.',
      'Maintained and upgraded legacy Laravel/PHP platforms: security fixes, framework migrations, multi-language SEO.',
      'Managed and deployed front-end builds on AWS using proxies, VPNs, and server-side configurations.',
    ],
  },
  {
    company:  'Freelance',
    location: 'Remote',
    role:     'Full Stack Developer',
    period:   'Jun 2019 – Jun 2026',
    current:  false,
    bullets: [
      'Architected and deployed ERP and inventory management systems for retail brands: multi-platform catalog sync, stock logic, warehouse zoning (CakePHP, Node.js, React).',
      'Delivered web applications for SMEs using React, TypeScript, Next.js, Astro, Node.js/Express, PHP, and Strapi headless CMS.',
      'Engineered automated data pipelines and web scraping tools in Python for multi-platform financial data and market intelligence.',
      'Developed secure plugins and extensions for production admin software, expanding business logic without disrupting existing systems.',
    ],
  },
  {
    company:  'TagWizz',
    location: 'México',
    role:     'Software Engineer / Full-Stack Developer',
    period:   'Jan 2023 – Apr 2024',
    current:  false,
    bullets: [
      'Integrated decentralized workflows and crypto-wallet connections into gaming platform front-ends, adhering to strict blockchain security standards.',
      'Developed CRM and management views in Vue 2 for a legacy "Pay-for-Game" platform published on the App Store.',
      'Built high-performance static and dynamic web applications for corporate clients with advanced SEO from scratch.',
      'Deployed applications and configured AWS environments for optimal client-server communication.',
    ],
  },
  {
    company:  'TagWizz',
    location: 'México',
    role:     'Web Developer',
    period:   'Jun 2022 – Jan 2023',
    current:  false,
    bullets: [
      'Engineered the front-end architecture for a high-traffic SMS RP data system processing and displaying video game analytics.',
      'Partnered with the Backend Team to design and integrate scalable APIs using NestJS.',
      'Coordinated task delivery in agile teams, aligning front-end components with back-end logic — accelerated internal promotion.',
      'Built foundational AWS experience: microservice consumption and secure server access via VPN/proxies.',
    ],
  },
  {
    company:  'Carbones del Zulia S.A. (CARBOZULIA)',
    location: 'Venezuela',
    role:     'Software Development Engineer',
    period:   'Jan 2022 – Jun 2022',
    current:  false,
    bullets: [
      'Designed and deployed a custom internal web app in CakePHP to automate large-scale technological asset inventory management.',
      'Streamlined corporate workflows via high-performance web features, reducing manual overhead and improving data tracking accuracy.',
      'Applied MVC architecture to upgrade internal platforms — secure, stable, and maintainable codebases.',
    ],
  },
  {
    company:  'Disdibuca',
    location: 'Venezuela',
    role:     'IT Manager',
    period:   'Jan 2018 – Dec 2018',
    current:  false,
    bullets: [
      'Administered and optimized relational SQL databases for high availability and integrity across core corporate environments.',
      'Maintained critical workstations and infrastructure for Finance, Logistics, and Operations departments.',
      'Led internal digital transformation: evaluated hardware/software needs, upgraded legacy systems, implemented modern solutions.',
    ],
  },
];

export const education: Education[] = [
  {
    institution: 'Universidad Dr. José Gregorio Hernández',
    degree:      "Master's Degree — Gerencia de Telecomunicaciones",
    focus:       'Project Management · AI in Agile Development (thesis)',
    location:    'Maracaibo, Venezuela',
    period:      'Jul 2023 – Present',
    current:     true,
  },
  {
    institution: 'Universidad Dr. José Gregorio Hernández',
    degree:      'B.S. — Ingeniería de Sistemas',
    focus:       'Systems Engineering',
    location:    'Maracaibo, Venezuela',
    period:      'May 2017 – Apr 2022',
    current:     false,
  },
];

export const publications: Publication[] = [
  {
    title:    'Artificial Intelligence in the Software Development Life Cycle',
    authors:  'Diego Armando Castillo Hernandez, José Andrés Hernandez Chirinos',
    abstract: 'Demonstrates that tools like GitHub Copilot and ChatGPT can accelerate coding speed by up to 55%, reduce developer mental fatigue, and automate repetitive tasks — while concluding AI still requires human oversight for complex problems.',
  },
  {
    title:    'Industry 4.0 vs Industry 5.0: Emerging Technologies in the Digital Transformation',
    authors:  'Diego Armando Castillo Hernandez, José Andrés Hernandez Chirinos',
    abstract: 'Descriptive analysis of the transition from Industry 4.0 to Industry 5.0, exploring how collaborative robots, sustainability, and human-centered design expand — rather than replace — the automation achievements of the previous era.',
  },
];
