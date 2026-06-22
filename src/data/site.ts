export const site = {
  name:        'Diego Castillo',
  role:        'Lead Frontend & Full-Stack Developer',
  email:       'hello@diegocashe.dev',
  phone:       '+58 414 363 5330',
  location:    'Venezuela',
  linkedin:    'https://www.linkedin.com/in/diegocashe/?locale=en-US',
  github:      'https://github.com/diegocashe',
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
  { label: 'LinkedIn', href: site.linkedin },
] as const;
