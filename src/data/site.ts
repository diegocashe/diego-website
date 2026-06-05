export const site = {
  name:        'Diego Castillo',
  role:        'Lead Frontend & Full-Stack Developer',
  email:       'diegocashe17@gmail.com',
  phone:       '+58 414 363 5330',
  location:    'Venezuela',
  linkedin:    'https://www.linkedin.com/in/diegocashe',
  github:      'https://github.com/diegocastillo',
  twitter:     'https://twitter.com/diegocastillo',
  twitterHandle: '@diegocashe',
  domain:      'diegocastillo.dev',
} as const;

/** SEO / meta defaults — change siteUrl when deploying */
export const seo = {
  siteUrl:      'https://diegocastillo.dev',
  defaultTitle: 'Diego Castillo · Lead Frontend & Full-Stack Developer',
  defaultDesc:  'Lead Frontend & Full-Stack Developer con más de 7 años construyendo aplicaciones web de alto rendimiento. Especialista en React, Node.js, TypeScript y arquitectura de software.',
  defaultImage: '/og-default.png',   // place a 1200×630 image in /public
  locale:       'es_VE',
  themeColor:   '#14181f',
} as const;

export const navLinks = [
  { label: 'Proyectos', href: '/projects' },
  { label: 'Blog',      href: '/blog'     },
  { label: 'CV',        href: '/cv'       },
  { label: 'Contacto',  href: '/#contacto'},
] as const;

export const socialLinks = [
  { label: 'GitHub',   href: site.github   },
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'Twitter',  href: site.twitter  },
] as const;
