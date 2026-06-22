// TODO : Refactor to use GSAP's ScrambleTextPlugin once it supports scrambling to random characters instead of just the target text.
// or maybe only change Intervals to RAF and use the plugin's render method to update the text content, which would be more efficient and smoother.
const GLITCH_CHARS = "!@#$%&*?X0123456789ABCDEFGHIJKLMNOPQRST";

function scramble(el: HTMLElement, duration = 0.55): void {
  const original = el.textContent;
  const len = original.length;
  const totalFrames = Math.round(duration * 60);
  let frame = 0;

  const id = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const resolved = Math.floor(Math.pow(progress, 1.8) * len);

    el.textContent = original
      .split("")
      .map((char, i) => {
        if (i < resolved || char === " ") return char;
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      })
      .join("");

    if (frame >= totalFrames) {
      el.textContent = original;
      clearInterval(id);
    }
  }, 1000 / 60);
}

function glitchFlash(el: HTMLElement): void {
  const original = el.textContent;
  el.textContent = original
    .split("")
    .map((c) =>
      c === " " ? c : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
    )
    .join("");
  setTimeout(() => {
    el.textContent = original;
  }, 100);
}

type CleanupFn = () => void;
let cleanups: CleanupFn[] = [];

function cleanup(): void {
  cleanups.forEach((fn) => { fn(); });
  cleanups = [];
}

function init(): void {
  cleanup();

  const titles = document.querySelectorAll<HTMLElement>("[data-glitch]");
  if (!titles.length) return;

  titles.forEach((el) => {
    const scrambleTimeout = setTimeout(() => { scramble(el, 0.6); }, 120);
    cleanups.push(() => { clearTimeout(scrambleTimeout); });

    const interval = setInterval(() => { glitchFlash(el); }, 5000);
    cleanups.push(() => { clearInterval(interval); });
  });
}

document.addEventListener("astro:before-swap", cleanup);
document.addEventListener("astro:page-load", init);
