export type ProjectStatus = 'delivered' | 'in-progress';
export type ProjectCategory = 'Full-Stack' | 'Frontend' | 'Enterprise' | 'AI / Data';

export interface ProjectLink {
  label: string;
  href:  string;
}

export interface Project {
  slug:            string;
  title:           string;
  description:     string;
  longDescription?: string;
  highlights?:     readonly string[];
  links?:          readonly ProjectLink[];
  tags:            readonly string[];
  category:        ProjectCategory;
  status:          ProjectStatus;
  year:            number;
  company:         string;
  gradient:        string;
  featured?:       boolean;
}

export const projects: Project[] = [
  {
    slug:        'lms-platform',
    title:       'White-Label LMS Platform',
    description: 'Scalable learning management platform architected with React and NestJS. Same core codebase deployed under two completely different UI designs for corporate hospitality buyers — no forking, no duplication.',
    longDescription: 'Built a multi-tenant LMS from the ground up for TagWizz, serving corporate hospitality clients. The core challenge: two buyers required entirely distinct brand experiences — different design systems, different onboarding flows — but maintaining two codebases was off the table. The solution was a theme-layer architecture where the NestJS API drives tenant configuration at runtime and the React frontend composes from a shared design token system. Both tenants run on the same deployment with zero code duplication.',
    highlights: [
      'Single codebase powering two fully distinct UI themes with zero code duplication',
      'NestJS multi-tenant API with per-tenant configuration resolved at runtime',
      'Role-based access control across learner, instructor, and admin surfaces',
      'Module progress tracking, quiz engine, and completion certificate generation',
      'CI/CD pipeline with per-tenant preview deployments',
    ],
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
    longDescription: 'A retail client was managing inventory across multiple sales platforms with a patchwork of spreadsheets, manual reconciliations, and weekly reports that were always stale. This ERP replaced all of it: a CakePHP backend handles the domain logic — stock movements, warehouse zones, reorder thresholds — while a React frontend gives the operations team live visibility into catalog status and purchase orders. Node.js workers handle the async catalog sync jobs across platforms without blocking the main application.',
    highlights: [
      'Multi-platform catalog synchronization with conflict resolution',
      'Warehouse zoning with bin-level stock tracking',
      'Automated reorder rules with configurable thresholds per SKU',
      'Purchase order generation and supplier management module',
      'Replaced 100% of spreadsheet-based inventory tracking',
    ],
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
    longDescription: 'Operations teams at this fintech were working blind — transaction data lived in backend logs and ad-hoc queries. This dashboard surfaces live payment flows via WebSocket, giving ops the ability to monitor, filter, and act on transactions in real time. Multi-currency reconciliation runs server-side and the UI presents discrepancies clearly. Fraud signals from the detection layer are surfaced as flagged items with a review queue. RBAC ensures analysts, supervisors, and admins each see only what they need.',
    highlights: [
      'WebSocket-driven live transaction feed with sub-second latency',
      'Multi-currency reconciliation with automated discrepancy flagging',
      'Fraud review queue with status workflow and audit log',
      'Role-based access for analyst, supervisor, and admin roles',
      'Exportable reports with configurable date ranges and filters',
    ],
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
    longDescription: 'TagWizz QA teams were spending hours scrubbing through gameplay recordings looking for bugs. An AI model was already flagging anomalies in the video stream — the gap was a usable interface to review those reports. Built with QML and Python, the tool presents flagged timestamps on a video timeline; analysts can jump to any flagged moment, accept or dismiss the report, add annotations, and export structured bug reports. The result cut manual review time significantly.',
    highlights: [
      'Timeline-based video editor with AI-flagged event markers',
      'One-click jump to flagged timestamp with frame-accurate scrubbing',
      'Accept / dismiss / annotate workflow for each AI report',
      'Structured bug report export compatible with the team\'s issue tracker',
      'Python backend bridges AI model output to the QML UI layer',
    ],
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
    longDescription: 'An SMS-based role-playing game platform needed a way to surface live session data to players and admins. The backend data pipeline was already processing high-volume game events; the work was building a front-end that could keep up. Built on React and NestJS with AWS infrastructure, the dashboard renders live leaderboards, session replays, and event streams without polling — server-sent events push updates as they happen. The architecture handles traffic spikes during peak gameplay hours without degradation.',
    highlights: [
      'Real-time leaderboards and event streams via server-sent events',
      'Session analytics with per-player and aggregate views',
      'AWS infrastructure optimized for traffic spike tolerance',
      'NestJS API layer with efficient event fan-out',
      'Responsive design supporting both player and admin contexts',
    ],
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
    longDescription: 'A Pay-for-Game platform required tight integration between a gaming front-end and decentralized infrastructure. Built with Vue 2, the application handles crypto-wallet connection flows, surfaces blockchain transaction history in a readable UI, and includes CRM views for player account management. The platform was shipped on the App Store, requiring careful attention to native-feeling UX patterns within a web-based shell. Wallet connection, transaction signing, and error states all had to be made accessible to non-technical players.',
    highlights: [
      'Crypto-wallet connection with MetaMask and WalletConnect support',
      'Blockchain transaction history UI with human-readable status labels',
      'Pay-for-Game purchase flow with on-chain confirmation feedback',
      'CRM views for player account management and support workflows',
      'Shipped on App Store via hybrid container',
    ],
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
    longDescription: 'Carbones del Zulia, a state-owned mining company, was tracking thousands of technological and infrastructure assets across departments using manual spreadsheets and paper records. The system built here replaced all of that: a CakePHP MVC web application where each department can register, update, and audit assets. The backend enforces ownership rules and audit trails; the frontend gives department heads visibility into their full asset catalog with status history. Deployed and running on internal infrastructure.',
    highlights: [
      'Multi-department asset registry with ownership and accountability tracking',
      'Full audit trail for every asset status change',
      'Department-level access control with admin oversight',
      'Bulk import tooling for migrating legacy spreadsheet data',
      'Printable inventory reports for compliance audits',
    ],
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
    longDescription: 'A financial client needed consolidated visibility into market prices and data spread across a dozen web sources — each with different formats, update frequencies, and access patterns. Built entirely in Python, the pipelines scrape, normalize, and load this data on schedule using Pandas for transformation and SQL for storage. The unified dataset feeds BI dashboards that give the client a single source of truth for decision-making. Error handling and alerting ensure data gaps are caught before they affect downstream reports.',
    highlights: [
      'Multi-source scraping pipeline covering 12+ financial data sources',
      'Pandas-based ETL with normalization and deduplication logic',
      'Scheduled execution with failure alerting and retry logic',
      'Unified SQL data warehouse feeding BI dashboard layer',
      'Significant reduction in manual data consolidation work per week',
    ],
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
    longDescription: 'A series of production websites for SME clients where performance and SEO were the primary deliverables. Each site uses Astro for static output and Strapi as the headless CMS, giving clients a familiar editing interface without sacrificing performance. The architecture ships zero JavaScript by default — interactivity islands are hydrated only where needed. Multi-language SEO is handled via hreflang, structured data, and locale-aware routing. Every site scored 95+ on Core Web Vitals across mobile and desktop.',
    highlights: [
      'Zero-JS-by-default architecture with selective island hydration',
      '95+ Core Web Vitals scores across mobile and desktop',
      'Multi-language SEO with hreflang, structured data, and locale routing',
      'Strapi headless CMS giving clients full content control',
      'Multiple production sites deployed for distinct SME clients',
    ],
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
