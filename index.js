document.addEventListener('DOMContentLoaded', function () {

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
     Nav Link Active State on Scroll
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
      current = sections[sections.length - 1].getAttribute('id');
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });

  /* ===============================
     Smooth Scroll (No URL Hash)
  =============================== */
  document.querySelectorAll('.scrollLink').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, null, ' ');
    });
  });

  /* ===============================
     Lightbox Modal Carousel
     - Fade effect
     - Autoplay starts after first thumb click
  =============================== */
  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {

      const modal = document.getElementById('lightboxModal');
      const titleEl = modal.querySelector('.modal-title');
      const carouselEl = modal.querySelector('#lightboxCarousel');
      const carouselInner = carouselEl.querySelector('.carousel-inner');
      const thumbs = modal.querySelector('.lightbox-thumbs');

      const title = trigger.dataset.title || '';
      const images = trigger.dataset.images.split(',');

      // Reset modal content
      titleEl.textContent = title;
      carouselInner.innerHTML = '';
      thumbs.innerHTML = '';

      // Build slides and thumbnails
      images.forEach((src, index) => {

        // Slide
        const slide = document.createElement('div');
        slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${src.trim()}" class="d-block w-100 rounded">`;
        carouselInner.appendChild(slide);

        // Thumbnail
        const thumb = document.createElement('img');
        thumb.src = src.trim();
        thumb.className = `thumb mx-1 ${index === 0 ? 'active' : ''}`;
        thumb.dataset.bsTarget = '#lightboxCarousel';
        thumb.dataset.bsSlideTo = index;

        thumb.addEventListener('click', () => {
          thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');

          // Start autoplay on first click
          const carouselInstance = bootstrap.Carousel.getInstance(carouselEl);
          if (carouselInstance) carouselInstance.cycle();
        });

        thumbs.appendChild(thumb);
      });

      // Dispose existing carousel instance if any
      const existing = bootstrap.Carousel.getInstance(carouselEl);
      if (existing) existing.dispose();

      // Add fade class
      carouselEl.classList.add('carousel-fade');

      // Initialize carousel WITHOUT autoplay
      new bootstrap.Carousel(carouselEl, {
        interval: 3000,
        ride: false,
        pause: 'hover',
        wrap: true
      });
    });
  });

  // Stop autoplay when modal closes
  const lightboxModal = document.getElementById('lightboxModal');
  lightboxModal.addEventListener('hidden.bs.modal', () => {
    const carousel = bootstrap.Carousel.getInstance(
      document.getElementById('lightboxCarousel')
    );
    if (carousel) carousel.pause();
  });

  /* ===============================
     Bootstrap Collapse – Ensure Reliable Toggle
  =============================== */
  document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = document.querySelector(btn.dataset.bsTarget);
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(target);
      bsCollapse.toggle();
    });
  });

  /* ===============================
     View More / View Less Toggle
     with fade animation
  =============================== */
  const moreWorks = document.getElementById('moreWorks');
  const toggleBtn = document.getElementById('toggleWorksBtn');
  const btnText = toggleBtn.querySelector('.btn-text');
  const btnArrow = toggleBtn.querySelector('.btn-arrow');

  // Add fade-collapse class
  moreWorks.classList.add('fade-collapse');

  moreWorks.addEventListener('shown.bs.collapse', () => {
    btnText.textContent = 'View Less';
    btnArrow.classList.add('rotate');
    moreWorks.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  moreWorks.addEventListener('hidden.bs.collapse', () => {
    btnText.textContent = 'View More';
    btnArrow.classList.remove('rotate');
    toggleBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

});
