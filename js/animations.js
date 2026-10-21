document.addEventListener('DOMContentLoaded', () => {
  const footerYear = document.querySelector('#footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

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
      target.style.display = 'grid';
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
  const gallery = document.querySelector('#projectGallery');
  const galleryPosition = document.querySelector('#projectGalleryPosition');
  const galleryProgress = document.querySelector('.project-gallery-progress');
  const galleryProgressFill = document.querySelector('#projectGalleryProgress');
  const galleryArrows = document.querySelectorAll('.project-gallery-arrow');

  function updateGalleryStatus() {
    if (!gallery) return;

    const visibleCards = [...gallery.querySelectorAll('.project-card:not(.filtered-out)')];
    const total = visibleCards.length;
    const gap = parseFloat(getComputedStyle(gallery).columnGap) || 0;
    const cardWidth = visibleCards[0]?.getBoundingClientRect().width || 0;
    const step = cardWidth + gap;
    const maxScroll = gallery.scrollWidth - gallery.clientWidth;
    const current = total
      ? maxScroll <= 2
        ? total
        : Math.min(total, Math.floor((gallery.scrollLeft + gap / 2) / step) + 1)
      : 0;

    if (galleryPosition) {
      galleryPosition.textContent = `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
    if (galleryProgressFill) {
      galleryProgressFill.style.width = `${total ? (current / total) * 100 : 0}%`;
    }
    if (galleryProgress) {
      galleryProgress.setAttribute('aria-valuemax', String(total || 1));
      galleryProgress.setAttribute('aria-valuenow', String(current));
    }
    galleryArrows.forEach(arrow => {
      arrow.disabled = !total || (arrow.dataset.direction === 'previous'
        ? gallery.scrollLeft <= 2
        : gallery.scrollLeft >= maxScroll - 2);
    });
  }

  if (gallery) {
    gallery.addEventListener('scroll', updateGalleryStatus, { passive: true });
    window.addEventListener('resize', updateGalleryStatus);
    galleryArrows.forEach(arrow => {
      arrow.addEventListener('click', () => {
        const firstVisibleCard = gallery.querySelector('.project-card:not(.filtered-out)');
        if (!firstVisibleCard) return;

        const gap = parseFloat(getComputedStyle(gallery).columnGap) || 0;
        const direction = arrow.dataset.direction === 'next' ? 1 : -1;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gallery.scrollBy({
          left: direction * (firstVisibleCard.getBoundingClientRect().width + gap),
          behavior: reducedMotion ? 'auto' : 'smooth'
        });
      });
    });
    updateGalleryStatus();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

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
      if (gallery) gallery.scrollTo({ left: 0, behavior: 'auto' });
      updateGalleryStatus();
    });
  });

  const projectModals = document.querySelectorAll('.project-detail-modal');
  let pendingModal = null;
  let modalTransitioning = false;

  function getVisibleProjects() {
    return [...document.querySelectorAll('.project-card:not(.filtered-out)')]
      .map(card => {
        const trigger = card.querySelector('[data-bs-target^="#modal"]');
        return {
          modal: trigger && document.querySelector(trigger.dataset.bsTarget),
          trigger,
          title: card.querySelector('.project-title')?.textContent.trim() || ''
        };
      })
      .filter(project => project.modal);
  }

  // Parcours : one entry per .sel-item, linked to the modal opened from its detail panel.
  const journeyEntries = [...document.querySelectorAll('.sel-item')]
    .map(item => {
      const trigger = document.getElementById(`detail-${item.dataset.id}`)?.querySelector('[data-bs-target]');
      return {
        item,
        group: item.closest('.sel-items')?.dataset.group,
        modal: trigger && document.querySelector(trigger.dataset.bsTarget),
        trigger,
        title: item.querySelector('.sel-title')?.textContent.trim() || ''
      };
    })
    .filter(entry => entry.modal);

  function getModalSequence(modal) {
    if (modal.classList.contains('project-detail-modal')) {
      return { noun: 'Projet', items: getVisibleProjects() };
    }
    const entry = journeyEntries.find(journey => journey.modal === modal);
    if (!entry) return null;
    return {
      noun: entry.group === 'form' ? 'Formation' : 'Expérience',
      items: journeyEntries.filter(journey => journey.group === entry.group)
    };
  }

  function selectJourneyEntry(entry) {
    const tab = document.querySelector(`.sel-tab[data-group="${entry.group}"]`);
    if (tab && !tab.classList.contains('active')) tab.click();
    if (!entry.item.classList.contains('active')) entry.item.click();
  }

  function createModalNav(noun) {
    const nav = document.createElement('nav');
    nav.className = 'modal-project-nav';
    const plural = { Projet: 'projets', Formation: 'formations', 'Expérience': 'expériences' }[noun];
    nav.setAttribute('aria-label', `Navigation entre les ${plural}`);
    nav.innerHTML = `
      <button type="button" class="modal-project-nav-btn">
        <i class="bi bi-arrow-left" aria-hidden="true"></i><span>Précédent</span>
      </button>
      <span class="modal-project-nav-label"></span>
      <button type="button" class="modal-project-nav-btn modal-project-nav-btn--next">
        <span>Suivant</span><i class="bi bi-arrow-right" aria-hidden="true"></i>
      </button>`;
    return nav;
  }

  function updateModalNav(modal, sequence) {
    const nav = modal.querySelector('.modal-project-nav');
    if (!nav) return;

    const { noun, items } = sequence;
    const index = items.findIndex(entry => entry.modal === modal);
    const label = nav.querySelector('.modal-project-nav-label');
    const buttons = nav.querySelectorAll('.modal-project-nav-btn');
    if (index === -1 || items.length < 2) {
      buttons.forEach(button => { button.hidden = true; });
      if (label) label.textContent = index === -1 ? '' : `${noun} 1 / 1`;
      return;
    }

    if (label) label.textContent = `${noun} ${index + 1} / ${items.length}`;
    buttons.forEach(button => {
      const isNext = button.classList.contains('modal-project-nav-btn--next');
      const target = items[(index + (isNext ? 1 : -1) + items.length) % items.length];
      button.hidden = false;
      button.dataset.projectTarget = `#${target.modal.id}`;
      const ending = noun === 'Projet' ? '' : 'e';
      button.setAttribute('aria-label', `${noun} ${isNext ? 'suivant' : 'précédent'}${ending} : ${target.title}`);
    });
  }

  const sequencedModals = new Set([...projectModals, ...journeyEntries.map(entry => entry.modal)]);
  sequencedModals.forEach(modal => {
    const noun = getModalSequence(modal)?.noun;
    if (noun && !modal.querySelector('.modal-project-nav')) {
      modal.querySelector('.modal-content').appendChild(createModalNav(noun));
    }
  });

  sequencedModals.forEach(modal => {
    modal.addEventListener('show.bs.modal', () => {
      modalTransitioning = true;
      const sequence = getModalSequence(modal);
      if (sequence) updateModalNav(modal, sequence);
      const journey = journeyEntries.find(entry => entry.modal === modal);
      if (journey) selectJourneyEntry(journey);
    });
    modal.addEventListener('shown.bs.modal', () => {
      modalTransitioning = false;
    });
    modal.addEventListener('hide.bs.modal', () => {
      modalTransitioning = true;
    });
    modal.addEventListener('hidden.bs.modal', () => {
      modalTransitioning = false;
      if (pendingModal) {
        const next = pendingModal;
        pendingModal = null;
        bootstrap.Modal.getOrCreateInstance(next).show();
        return;
      }
      const trigger = getModalSequence(modal)?.items.find(entry => entry.modal === modal)?.trigger;
      if (trigger) trigger.focus();
    });
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('.modal-project-nav-btn');
    if (!button) return;

    const currentModal = button.closest('.modal');
    const nextModal = document.querySelector(button.dataset.projectTarget);
    if (!currentModal || !nextModal || pendingModal || modalTransitioning) return;

    pendingModal = nextModal;
    bootstrap.Modal.getOrCreateInstance(currentModal).hide();
  });

  const imageViewer = document.querySelector('#projectImageViewer');
  if (imageViewer) {
    const viewerImage = imageViewer.querySelector('.project-image-viewer-image');
    const viewerCaption = imageViewer.querySelector('.project-image-viewer-caption');
    const closeButton = imageViewer.querySelector('.project-image-viewer-close');
    const previousButton = imageViewer.querySelector('.project-image-viewer-prev');
    const nextButton = imageViewer.querySelector('.project-image-viewer-next');
    let viewerImages = [];
    let viewerIndex = 0;
    let returnFocus = null;

    function displayViewerImage(index) {
      viewerIndex = (index + viewerImages.length) % viewerImages.length;
      const image = viewerImages[viewerIndex];
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerCaption.textContent = `${image.alt} · ${viewerIndex + 1} / ${viewerImages.length}`;
      const hasMultipleImages = viewerImages.length > 1;
      previousButton.hidden = !hasMultipleImages;
      nextButton.hidden = !hasMultipleImages;
    }

    function closeImageViewer() {
      imageViewer.hidden = true;
      document.body.classList.remove('project-image-viewer-open');
      if (returnFocus?.isConnected) returnFocus.focus();
    }

    document.querySelectorAll('.modal-project-gallery .carousel-item img').forEach(image => {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Ouvrir en grand : ${image.alt}`);
    });

    document.querySelectorAll('.modal-project-gallery').forEach(galleryElement => {
      galleryElement.addEventListener('click', event => {
        const image = event.target.closest('.carousel-item img');
        if (!image) return;

        viewerImages = [...galleryElement.querySelectorAll('.carousel-item img')];
        returnFocus = image;
        // Inside the open modal so Bootstrap's focus trap and Escape handling include the viewer.
        (galleryElement.closest('.modal') || document.body).appendChild(imageViewer);
        displayViewerImage(viewerImages.indexOf(image));
        imageViewer.hidden = false;
        document.body.classList.add('project-image-viewer-open');
        closeButton.focus();
      });

      galleryElement.addEventListener('keydown', event => {
        if ((event.key !== 'Enter' && event.key !== ' ') || !event.target.matches('.carousel-item img')) return;
        event.preventDefault();
        event.target.click();
      });
    });

    closeButton.addEventListener('click', closeImageViewer);
    previousButton.addEventListener('click', () => displayViewerImage(viewerIndex - 1));
    nextButton.addEventListener('click', () => displayViewerImage(viewerIndex + 1));
    imageViewer.addEventListener('click', event => {
      if (event.target === imageViewer) closeImageViewer();
    });

    projectModals.forEach(modal => {
      modal.addEventListener('hide.bs.modal', () => {
        if (!imageViewer.hidden && modal.contains(imageViewer)) closeImageViewer();
      });
    });

    imageViewer.addEventListener('keydown', event => {
      if (imageViewer.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeImageViewer();
      } else if (event.key === 'ArrowLeft' && viewerImages.length > 1) {
        displayViewerImage(viewerIndex - 1);
      } else if (event.key === 'ArrowRight' && viewerImages.length > 1) {
        displayViewerImage(viewerIndex + 1);
      } else if (event.key === 'Tab') {
        const focusable = [closeButton, previousButton, nextButton].filter(button => !button.hidden);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
});
