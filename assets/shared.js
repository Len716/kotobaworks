// Fade-in Observer
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('v');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fi').forEach(el => fadeObserver.observe(el));

// Header scroll effect
const header = document.querySelector('.site-header');
if (header) {
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Mobile nav toggle
const navToggle = document.querySelector('.site-nav-toggle');
const nav = document.querySelector('.site-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}
