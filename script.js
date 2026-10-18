const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const revealElements = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  revealElements.forEach((element) => observer.observe(element));
}

const tiltCard = document.querySelector('[data-tilt]');
if (tiltCard && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  tiltCard.addEventListener('pointermove', (event) => {
    const bounds = tiltCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltCard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) rotateZ(3deg)`;
  });
  tiltCard.addEventListener('pointerleave', () => {
    tiltCard.style.transform = 'rotate(5deg)';
  });
}

document.querySelectorAll('.project-card').forEach((card) => {
  const preview = card.querySelector('.project-preview');
  const destination = card.querySelector('.circle-link');
  const title = card.querySelector('h3')?.textContent?.trim();
  if (!preview || !destination) return;

  preview.setAttribute('role', 'link');
  preview.setAttribute('tabindex', '0');
  preview.setAttribute('aria-label', `Deschide proiectul ${title || ''}`.trim());

  const openProject = () => window.open(destination.href, '_blank', 'noopener,noreferrer');
  preview.addEventListener('click', openProject);
  preview.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openProject();
  });
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
