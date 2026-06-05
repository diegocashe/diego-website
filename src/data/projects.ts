export type ProjectStatus = 'delivered' | 'in-progress';
export type ProjectCategory = 'Full-Stack' | 'Frontend' | 'Enterprise' | 'AI / Data';

export interface Project {
  slug:        string;
  title:       string;
  description: string;
  tags:        readonly string[];
  category:    ProjectCategory;
  status:      ProjectStatus;
  year:        number;
  company:     string;
  gradient:    string;
  featured?:   boolean;
}

export const projects: Project[] = [
  {
    slug:        'lms-platform',
    title:       'White-Label LMS Platform',
    description: 'Scalable learning management platform architected with React and NestJS. Same core codebase deployed under two completely different UI designs for corporate hospitality buyers — no forking, no duplication.',
    tags:        ['React', 'NestJS', 'TypeScript', 'Multi-tenant'],
    category:    'Full-Stack',
    status:      'delivered',
    year:        2025,
    company:     'TagWizz',
    gradient:    'linear-gradient(135deg, #0f1923 0%, #1f4fd6 100%)',
    featured:    true,
  },
  {
    slug:        'erp-inventory',
    title:       'Enterprise ERP & Inventory System',
    description: 'End-to-end ERP for retail brands: multi-platform catalog synchronization, complex stock movement logic, warehouse zoning, and automated reorder rules. Replaced a fragmented spreadsheet workflow.',
    tags:        ['CakePHP', 'Node.js', 'React', 'MySQL', 'MVC'],
    category:    'Enterprise',
    status:      'delivered',
    year:        2024,
    company:     'Freelance',
    gradient:    'linear-gradient(135deg, #111827 0%, #065f46 100%)',
    featured:    true,
  },
  {
    slug:        'fintech-dashboard',
    title:       'Real-Time Payments Dashboard',
    description: 'High-frequency payments platform with live transaction monitoring, multi-currency reconciliation, fraud flag UI, and role-based access for operations teams.',
    tags:        ['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
    category:    'Full-Stack',
    status:      'delivered',
    year:        2024,
    company:     'Freelance',
    gradient:    'linear-gradient(135deg, #1b2330 0%, #2d6cff 100%)',
    featured:    true,
  },
  {
    slug:        'ai-video-qa',
    title:       'AI Video QA Analysis Tool',
    description: 'Internal tool for video game QA. An AI model flags bugs automatically; this UI lets analysts review those reports on a timeline-based video editor built in QML and Python.',
    tags:        ['QML', 'Python', 'AI Integration', 'Video Editor'],
    category:    'AI / Data',
    status:      'delivered',
    year:        2024,
    company:     'TagWizz',
    gradient:    'linear-gradient(135deg, #1a0533 0%, #7c3aed 100%)',
  },
  {
    slug:        'sms-rp-analytics',
    title:       'SMS RP Game Analytics System',
    description: 'High-traffic front-end for a real-time data pipeline that processes and displays video game session analytics, leaderboards, and event streams for an SMS role-play platform.',
    tags:        ['React', 'NestJS', 'AWS', 'Real-time'],
    category:    'Frontend',
    status:      'delivered',
    year:        2023,
    company:     'TagWizz',
    gradient:    'linear-gradient(135deg, #0c1a12 0%, #16a34a 100%)',
  },
  {
    slug:        'web3-gaming-platform',
    title:       'Web3 Gaming Platform',
    description: 'Decentralized workflows and crypto-wallet connections integrated into a gaming front-end. Blockchain transaction UI, wallet connection flows, and CRM views for a Pay-for-Game platform shipped on the App Store.',
    tags:        ['Vue 2', 'Web3', 'Crypto-Wallet', 'Blockchain', 'CRM'],
    category:    'Frontend',
    status:      'delivered',
    year:        2023,
    company:     'TagWizz',
    gradient:    'linear-gradient(135deg, #170d2a 0%, #d97706 100%)',
  },
  {
    slug:        'carbozulia-asset-mgmt',
    title:       'CARBOZULIA Asset Management',
    description: 'Custom internal web application for Carbones del Zulia to automate large-scale technological and infrastructure asset inventory — replacing manual tracking across multiple departments.',
    tags:        ['CakePHP', 'PHP', 'MySQL', 'MVC'],
    category:    'Enterprise',
    status:      'delivered',
    year:        2022,
    company:     'CARBOZULIA',
    gradient:    'linear-gradient(135deg, #1c1408 0%, #b45309 100%)',
  },
  {
    slug:        'data-pipelines',
    title:       'Financial Data Pipelines',
    description: 'Automated scraping and ETL pipelines in Python that track, extract, and consolidate dynamic multi-platform financial data and market prices from diverse web sources into unified BI dashboards.',
    tags:        ['Python', 'Pandas', 'Web Scraping', 'SQL', 'Business Intelligence'],
    category:    'AI / Data',
    status:      'delivered',
    year:        2023,
    company:     'Freelance',
    gradient:    'linear-gradient(135deg, #0a1628 0%, #0891b2 100%)',
  },
  {
    slug:        'headless-sme-websites',
    title:       'Headless CMS Web Suite (SMEs)',
    description: 'Series of production websites for small and mid-sized businesses using Astro + Strapi as headless CMS. Focused on Core Web Vitals, multi-language SEO, and zero-JS-by-default performance.',
    tags:        ['Astro', 'Next.js', 'Strapi', 'TypeScript', 'SEO'],
    category:    'Frontend',
    status:      'delivered',
    year:        2024,
    company:     'Freelance',
    gradient:    'linear-gradient(135deg, #0d1f2d 0%, #0e7490 100%)',
  },
];

/** Top 3 featured projects for the landing page section */
export const featuredProjects = projects.filter((p) => p.featured);

export const categories: string[] = ['All', 'Full-Stack', 'Frontend', 'Enterprise', 'AI / Data'];
