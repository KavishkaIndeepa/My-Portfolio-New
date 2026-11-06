/* Shared page behaviour. Each feature only runs if its elements are on the page. */
(function () {
  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Dark / light mode ---------- */
  function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');

    function updateLabel() {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    }

    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        /* The theme still applies to this page when storage is blocked. */
      }
      updateLabel();
    });

    updateLabel();
  }

  /* ---------- Responsive navigation ---------- */
  function initNavigation() {
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');
    var icon = toggle.querySelector('i');

    function setOpen(isOpen) {
      links.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      icon.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
    }

    toggle.addEventListener('click', function () {
      setOpen(!links.classList.contains('is-open'));
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && links.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      /* Links scroll within this page, so the menu has to close itself. */
      if (!event.target.closest('.navbar') || event.target.closest('.nav-links a')) {
        setOpen(false);
      }
    });
  }

  /* ---------- Highlight the section currently on screen ---------- */
  function initScrollSpy() {
    var links = document.querySelectorAll('.nav-links a, .footer-links a');
    var sections = Array.prototype.map.call(document.querySelectorAll('.nav-links a'), function (link) {
      return document.querySelector(link.getAttribute('href'));
    });

    return function update() {
      var marker = window.scrollY + window.innerHeight * 0.35;
      var isAtBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
      var current = sections[0];

      sections.forEach(function (section) {
        if (section.offsetTop <= marker) {
          current = section;
        }
      });

      if (isAtBottom) {
        current = sections[sections.length - 1];
      }

      links.forEach(function (link) {
        if (link.getAttribute('href') === '#' + current.id) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };
  }

  /* ---------- Header shadow, scroll progress and back-to-top ---------- */
  function initScrollEffects() {
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('.scroll-progress');
    var backToTop = document.getElementById('back-to-top');
    var updateScrollSpy = initScrollSpy();
    var isQueued = false;

    function update() {
      var scrollable = root.scrollHeight - window.innerHeight;
      var position = window.scrollY;
      header.classList.toggle('is-scrolled', position > 10);
      backToTop.classList.toggle('is-visible', position > 400);
      progress.style.transform = 'scaleX(' + (scrollable > 0 ? position / scrollable : 0) + ')';
      updateScrollSpy();
      isQueued = false;
    }

    window.addEventListener('scroll', function () {
      if (!isQueued) {
        isQueued = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener('resize', update);

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    update();
  }

  /* ---------- Scroll animations ---------- */
  function initRevealOnScroll() {
    var elements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) {
        element.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.addEventListener('transitionend', function () {
            entry.target.classList.add('is-settled');
          }, { once: true });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ---------- Project filtering ---------- */
  function initProjectFilter() {
    var buttons = document.querySelectorAll('.filter-button');
    var cards = document.querySelectorAll('.project-card');
    var status = document.getElementById('filter-status');

    if (!buttons.length) {
      return;
    }

    function applyFilter(filter) {
      var shown = 0;

      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-filter') === filter));
      });

      cards.forEach(function (card) {
        var matches = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !matches;
        if (matches) {
          shown += 1;
          card.classList.remove('filter-in');
          void card.offsetWidth; /* Restart the fade-in animation. */
          card.classList.add('filter-in');
        }
      });

      status.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
    }

    function isCategory(name) {
      return name !== 'all' && Array.prototype.some.call(buttons, function (button) {
        return button.getAttribute('data-filter') === name;
      });
    }

    /* Links such as #mobile jump to the projects section on that category. */
    function applyFilterFromLink() {
      var requested = location.hash.slice(1);
      if (isCategory(requested)) {
        applyFilter(requested);
        document.getElementById('projects').scrollIntoView();
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');
        applyFilter(filter);
        history.replaceState(null, '', '#' + (filter === 'all' ? 'projects' : filter));
      });
    });

    window.addEventListener('hashchange', applyFilterFromLink);

    applyFilter('all');
    applyFilterFromLink();
  }

  /* ---------- Open on the requested section ---------- */
  /* The browser looks for #about before the sections exist, so jump there once they have loaded. */
  function scrollToLinkedSection() {
    var target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: 'auto' });
    }
  }

  /* ---------- Rotating role on the home page ---------- */
  function initRoleRotator() {
    var element = document.getElementById('role-rotator');

    if (!element || prefersReducedMotion) {
      return;
    }

    var roles = ['Aspiring Software Engineer', 'Web Developer', 'Mobile App Developer', 'UI/UX Designer'];
    var index = 0;

    setInterval(function () {
      element.classList.add('is-changing');
      setTimeout(function () {
        index = (index + 1) % roles.length;
        element.textContent = roles[index];
        element.classList.remove('is-changing');
      }, 300);
    }, 3000);
  }

  initThemeToggle();
  initNavigation();

  window.sectionsReady.then(function () {
    scrollToLinkedSection();
    initProjectFilter();
    initScrollEffects();
    initRevealOnScroll();
    initRoleRotator();
  });
})();
