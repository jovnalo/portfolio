document.addEventListener('DOMContentLoaded', function () {

  /* ===============================
     Lightbox Trigger for Visit Page
  =============================== */
  const lightboxFigures = document.querySelectorAll('.lightbox-trigger');
  const previewNote = document.getElementById('previewNote');
  const livePreviewBtn = document.querySelector('.livePreviewBtn');

  lightboxFigures.forEach(figure => {
    figure.addEventListener('click', () => {
      const link = figure.getAttribute('data-link');
      
      if (link && link.trim() !== '') {
        livePreviewBtn.classList.remove('d-none');
        livePreviewBtn.setAttribute('href', link);

        if (previewNote) previewNote.classList.remove('d-none'); // show note only if button visible
      } else {
        livePreviewBtn.classList.add('d-none');
        livePreviewBtn.removeAttribute('href');

        if (previewNote) previewNote.classList.add('d-none'); // hide note
      }
    });
  });

  /* ===============================
     View More / View Less Toggle
  =============================== */
  document.querySelectorAll('.viewMore button').forEach(button => {
    const btnText = button.querySelector('.btn-text');
    const btnArrow = button.querySelector('.btn-arrow');
    const targetId = button.getAttribute('data-bs-target');
    const collapseEl = document.querySelector(targetId);

    if (!collapseEl) return;

    collapseEl.classList.add('fade-collapse');

    collapseEl.addEventListener('shown.bs.collapse', () => {
      if (btnText) btnText.textContent = 'View Less';
      if (btnArrow) btnArrow.innerHTML = '&#9652;';
      collapseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    collapseEl.addEventListener('hidden.bs.collapse', () => {
      if (btnText) btnText.textContent = 'View More';
      if (btnArrow) btnArrow.innerHTML = '&#9662;';
      button.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ===============================
     Section Animation Trigger
  =============================== */
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));

  /* ===============================
     Nav Active State
  =============================== */
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    if (scrollPosition >= documentHeight - 2) {
      current = sections[sections.length - 1]?.getAttribute('id');
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });

  /* ===============================
     Smooth Scroll
  =============================== */
  document.querySelectorAll('.scrollLink').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href')?.substring(1);
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, null, ' ');
    });
  });

  /* ===============================
     Lightbox Modal + Carousel
  =============================== */
  const triggers = document.querySelectorAll('.lightbox-trigger');
  const modal = document.getElementById('lightboxModal');

  if (modal) {
    const modalTitle = modal.querySelector('.modal-title');
    const carouselEl = modal.querySelector('#lightboxCarousel');
    const carouselInner = modal.querySelector('.carousel-inner');
    const thumbs = modal.querySelector('.lightbox-thumbs');
    const liveBtn = modal.querySelector('.livePreviewBtn');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const title = trigger.dataset.title || '';
        const images = trigger.dataset.images?.split(',') || [];
        const link = trigger.dataset.link || '';

        if (modalTitle) modalTitle.textContent = title;
        if (carouselInner) carouselInner.innerHTML = '';
        if (thumbs) thumbs.innerHTML = '';

        images.forEach((src, index) => {
          const cleanSrc = src.trim();

          /* Slide */
          const slide = document.createElement('div');
          slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
          slide.innerHTML = `<img src="${cleanSrc}" class="d-block w-100 rounded">`;
          carouselInner.appendChild(slide);

          /* Thumbnail */
          if (thumbs) {
            const thumb = document.createElement('img');
            thumb.src = cleanSrc;
            thumb.className = `thumb mx-1 ${index === 0 ? 'active' : ''}`;
            thumb.dataset.bsSlideTo = index;
            thumbs.appendChild(thumb);
          }
        });

        /* Live Preview Button + Note */
        if (liveBtn) {
          if (link.trim() !== '') {
            liveBtn.href = link;
            liveBtn.classList.remove('d-none');
            if (previewNote) previewNote.classList.remove('d-none');
          } else {
            liveBtn.classList.add('d-none');
            liveBtn.removeAttribute('href');
            if (previewNote) previewNote.classList.add('d-none');
          }
        }

        /* Reset Carousel Instance */
        const existing = bootstrap.Carousel.getInstance(carouselEl);
        if (existing) existing.dispose();

        carouselEl.classList.add('carousel-fade');

        const carousel = new bootstrap.Carousel(carouselEl, {
          interval: 3000,
          ride: 'carousel', // autoplay enabled
          pause: 'hover',
          wrap: true
        });

        /* Thumbnails click handler */
        if (thumbs) {
          thumbs.querySelectorAll('.thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
              thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
              thumb.classList.add('active');
              const index = parseInt(thumb.dataset.bsSlideTo, 10);
              carousel.to(index); // go to slide without breaking autoplay
            });
          });
        }

        /* Stop autoplay on modal close */
        modal.addEventListener('hidden.bs.modal', () => {
          carousel.pause();
        });
      });
    });
  }

  /* ===============================
     Reliable Collapse Toggle
  =============================== */
  document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = document.querySelector(btn.dataset.bsTarget);
      if (!target) return;
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(target);
      bsCollapse.toggle();
    });
  });

});
