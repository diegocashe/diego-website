export const site = {
  name:     'Diego Castillo',
  role:     'Lead Frontend & Full-Stack Developer',
  email:    'diegocashe17@gmail.com',
  phone:    '+58 414 363 5330',
  location: 'Venezuela',
  linkedin: 'https://www.linkedin.com/in/diegocashe',
  github:   'https://github.com/diegocastillo',
  twitter:  'https://twitter.com/diegocastillo',
  domain:   'diegocastillo.dev',
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
