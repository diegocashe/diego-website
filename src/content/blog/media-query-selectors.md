---
title: "Los selectores que te salvan la vida (y por qué no los usas)"
description: "prefers-reduced-motion, hover: none y otros media queries que deberías tener en cada proyecto interactivo. No son accesibilidad opcional, son parte del contrato con el usuario."
pubDate: 2026-06-08
tags: ["CSS", "JavaScript", "Accesibilidad", "UX"]
readTime: 6
---

Tengo un cursor personalizado en mi sitio. Sigue al mouse, tiene un efecto de lag, reacciona a los hover. Se ve bien. Pero durante semanas, en cualquier dispositivo táctil ese cursor aparecía pegado en el centro de la pantalla, inutilizando parte del layout.

El fix fue una línea:

```js
if (window.matchMedia('(hover: none)').matches) return;
```

Eso me hizo pensar en cuántos bugs silenciosos viven en código interactivo por ignorar el contexto del dispositivo y las preferencias del usuario. Este artículo es sobre esos selectores que deberían ser checklist obligatorio.

---

## El problema de asumir el contexto

Cuando construyes animaciones, efectos de cursor, o transiciones, el instinto es probar en tu máquina, en tu navegador, con tu mouse. Funciona. Lo desplegás. Y en algún lugar:

- Un usuario con epilepsia fotosensible ve flashes que le causan malestar físico real.
- Alguien en un iPad ve el cursor pegado en pantalla porque no hay mouse.
- Un usuario con `prefers-reduced-motion` activado ve animaciones que explícitamente eligió no ver.

No son edge cases. Son usuarios reales, con configuraciones reales, que tomaron decisiones sobre cómo quieren que se comporte su sistema.

---

## `prefers-reduced-motion`

Este es el más importante. Usuarios con vestibular disorders, epilepsia fotosensible, o simplemente sensibilidad a movimiento, activan esta preferencia en el sistema operativo. Es una señal explícita: *no quiero movimiento*.

### En JavaScript

```js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```

Úsalo antes de inicializar cualquier animación basada en JS: GSAP, Framer Motion en vanilla, Three.js, canvas animations, scroll-based effects.

```js
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    // lógica de parallax
  });
}
```

### En CSS

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Esta versión nuclear desactiva todo. Útil como fallback global, pero preferible hacer overrides quirúrgicos por componente para no romper transiciones funcionales (como las de focus o feedback de estado).

### Por qué no `prefers-reduced-motion: no-preference`

El valor `no-preference` significa que el usuario no expresó preferencia. No significa que quiere animaciones. Es el estado neutral. Siempre detectá el caso `reduce`, no el `no-preference`.

---

## `hover: none`

Este media query detecta si el dispositivo primario de puntero puede hacer hover. En pantallas táctiles: `hover: none`. En desktop con mouse: `hover: hover`.

```js
if (window.matchMedia('(hover: none)').matches) return;
```

### Cuándo usarlo

**Cursores personalizados.** Si tenés un `<div>` que sigue al mouse, en touch ese div se queda donde fue el último toque. Inutilizable.

```js
class CustomCursor {
  init() {
    if (window.matchMedia('(hover: none)').matches) return;
    // registrar eventos de mouse
  }
}
```

**Efectos en hover que reemplazan información.** Si un elemento muestra texto solo en `:hover`, en touch ese texto nunca aparece. El usuario queda sin información.

**Tooltips basados en mouse position.** En touch, el `mousemove` no existe de la misma forma. Mejor detectarlo y ofrecer una alternativa.

### En CSS

```css
@media (hover: hover) {
  .card:hover {
    transform: translateY(-4px);
  }
}
```

Sin este media query, en iOS ese efecto de hover queda "pegado" en el primer tap. El elemento queda visualmente levantado hasta que el usuario toca otro lugar.

---

## `pointer: coarse`

Complementa a `hover: none`. Detecta si el puntero primario es impreciso (dedo en touch) vs preciso (mouse).

```css
@media (pointer: coarse) {
  .button {
    min-height: 44px; /* WCAG touch target size */
    padding: 12px 20px;
  }
}
```

La diferencia con `hover: none`: podés tener un stylus que no hace hover pero es preciso. O un mouse que hace hover pero el usuario tiene temblor motor. `pointer` te habla de precisión, `hover` te habla de capacidad de hover. Útiles juntos, no intercambiables.

---

## `prefers-color-scheme`

Obvio, pero vale la pena mencionar el patrón en JS:

```js
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

Lo interesante es escuchar cambios en tiempo real:

```js
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  updateTheme(e.matches ? 'dark' : 'light');
});
```

Si tu tema cambia con una clase en `<html>`, el usuario que cambia el tema del sistema a las 11pm no debería tener que recargar la página.

---

## `prefers-contrast`

Menos conocido, muy útil para interfaces con mucho texto o elementos visuales sutiles.

```css
@media (prefers-contrast: more) {
  .subtle-border {
    border-color: currentColor;
  }

  .muted-text {
    color: inherit;
  }
}
```

Usuarios con baja visión o cataratas activan esto. Si tu diseño usa grises suaves para texto secundario, esos usuarios básicamente no lo ven.

---

## El patrón que uso

En cualquier componente con JS interactivo tengo esto al inicio del `init()`:

```js
class InteractiveComponent {
  init() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.bindEvents();
    this.startAnimations();
  }
}
```

Y en CSS, siempre envuelvo los hover effects:

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { /* ... */ }
}
```

El `pointer: fine` adicional filtra styli que técnicamente hacen hover pero no con la precisión de un mouse.

---

## Por qué son mejores que user-agent sniffing

La alternativa que vi mucho antes: detectar si es "mobile" parseando el user-agent string.

```js
// No hagas esto
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
```

Problemas:
1. El user-agent string es mentira. Navegadores lo falsifican, extensions lo modifican.
2. "Mobile" no implica touch. Hay laptops con pantalla táctil.
3. "Desktop" no implica mouse. Surface, iPad con teclado, Chromebook táctil.
4. No captura preferencias del usuario, solo el dispositivo.

Los media queries de capacidad y preferencia responden a la realidad actual del dispositivo y a las decisiones explícitas del usuario. No a lo que el string dice que es.

---

## Checklist para componentes interactivos

Antes de considerar algo terminado:

- [ ] ¿Funciona con `prefers-reduced-motion: reduce`? ¿Se desactivan las animaciones o degradan gracefully?
- [ ] ¿Funciona en touch (`hover: none`)? ¿O hay elementos que dependen de hover para mostrar información?
- [ ] ¿Los touch targets tienen mínimo 44x44px (`pointer: coarse`)?
- [ ] ¿El contraste funciona con `prefers-contrast: more`?
- [ ] ¿El tema responde a `prefers-color-scheme` en tiempo real?

No es accesibilidad como checklist para cumplir un requerimiento. Es construcción honesta de interfaces para el rango real de usuarios que las van a usar.
