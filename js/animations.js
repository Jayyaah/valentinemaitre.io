document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  function updateScrollSpy() {
    const scrollY = window.scrollY;
    const offset = 100;
    let active = null;
    sections.forEach(section => {
      if (section.offsetTop - offset <= scrollY) active = section;
    });
    navLinks.forEach(link => link.classList.remove('active'));
    if (active) {
      const link = document.querySelector(`.nav-links .nav-link[href="#${active.id}"]`);
      if (link) link.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.setProperty('--i', i);
  });

  document.querySelectorAll('.timeline').forEach(timeline => {
    timeline.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.style.setProperty('--i', i);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal, .project-card').forEach(el => observer.observe(el));

  const selTabs = document.querySelectorAll('.sel-tab');
  const selItems = document.querySelectorAll('.sel-item');

  function showDetail(id) {
    document.querySelectorAll('.sel-detail').forEach(d => {
      d.classList.remove('sel-detail--active');
      d.style.display = 'none';
    });
    const target = document.getElementById(`detail-${id}`);
    if (target) {
      target.style.display = 'block';
      void target.offsetWidth;
      target.classList.add('sel-detail--active');
    }
  }

  selTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      selTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const group = tab.dataset.group;
      document.querySelectorAll('.sel-items').forEach(list => {
        list.classList.toggle('sel-items--hidden', list.dataset.group !== group);
      });
      const firstItem = document.querySelector(`.sel-items[data-group="${group}"] .sel-item`);
      if (firstItem) firstItem.click();
    });
  });

  selItems.forEach(item => {
    item.addEventListener('click', () => {
      const group = item.closest('.sel-items').dataset.group;
      document.querySelectorAll(`.sel-items[data-group="${group}"] .sel-item`).forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      showDetail(item.dataset.id);
    });
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;

      document.querySelectorAll('.project-card').forEach(card => card.classList.add('visible'));

      document.querySelectorAll('.project-card').forEach(card => {
        const matches = f === 'all' || card.dataset.cat === f;
        card.classList.remove('filter-show');
        if (matches) {
          const wasHidden = card.classList.contains('filtered-out');
          card.classList.remove('filtered-out');
          if (wasHidden) {
            void card.offsetWidth;
            card.classList.add('filter-show');
          }
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
});
