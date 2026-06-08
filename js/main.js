// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Active nav link
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links > li > a').forEach(a => {
  if (a.getAttribute('href') === page) {
    a.classList.add('active');
  }
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group || 'default';
    document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.dataset.filter;
    document.querySelectorAll('[data-tags]').forEach(card => {
      card.style.display = (tag === 'all' || card.dataset.tags.includes(tag)) ? '' : 'none';
    });
  });
});

// Class pill active on class bar
document.querySelectorAll('.class-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.class-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});
