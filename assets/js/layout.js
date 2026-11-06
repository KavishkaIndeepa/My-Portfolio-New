/* Shared header, footer and social links. Edit them here to update the whole site. */
(function () {
  var NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
  ];

  var SOCIAL_LINKS = [
    { label: 'LinkedIn', icon: 'fa-linkedin', href: 'https://www.linkedin.com/in/kavishka-indeepa-977bb9381/' },
    { label: 'GitHub', icon: 'fa-github', href: 'https://github.com/KavishkaIndeepa' },
    { label: 'Facebook', icon: 'fa-facebook', href: 'https://www.facebook.com/share/1CiYNLcKco/' },
    { label: 'Instagram', icon: 'fa-instagram', href: 'https://www.instagram.com/kavishka_indeepa/' }
  ];

  function navItems() {
    return NAV_LINKS.map(function (link) {
      return '<li><a href="' + link.href + '">' + link.label + '</a></li>';
    }).join('');
  }

  function socialItems() {
    return SOCIAL_LINKS.map(function (link) {
      return '<a href="' + link.href + '" target="_blank" rel="noopener" aria-label="' + link.label + '">' +
        '<i class="fab ' + link.icon + '" aria-hidden="true"></i></a>';
    }).join('');
  }

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<div class="scroll-progress" aria-hidden="true"></div>' +
    '<header class="site-header">' +
      '<nav class="container navbar" aria-label="Main">' +
        '<a class="brand" href="#home">Kavishka Indeepa</a>' +
        '<ul class="nav-links" id="nav-links">' + navItems() + '</ul>' +
        '<div class="nav-actions">' +
          '<button class="icon-button" id="theme-toggle" type="button" aria-label="Switch colour theme">' +
            '<i class="fas fa-moon" aria-hidden="true"></i><i class="fas fa-sun" aria-hidden="true"></i>' +
          '</button>' +
          '<button class="icon-button nav-toggle" id="nav-toggle" type="button" aria-label="Open menu" ' +
            'aria-expanded="false" aria-controls="nav-links"><i class="fas fa-bars" aria-hidden="true"></i></button>' +
        '</div>' +
      '</nav>' +
    '</header>';

  var footer =
    '<footer class="site-footer">' +
      '<div class="container footer-grid">' +
        '<div><h2>Kavishka Indeepa</h2><p>Building modern, responsive web and mobile applications.</p></div>' +
        '<div><h2>Quick Links</h2><ul class="footer-links">' + navItems() + '</ul></div>' +
        '<div><h2>Follow Me</h2><div class="social-links">' + socialItems() + '</div></div>' +
      '</div>' +
      '<p class="footer-bottom">&copy; ' + new Date().getFullYear() + ' Kavishka Indeepa. All rights reserved.</p>' +
    '</footer>' +
    '<button class="back-to-top" id="back-to-top" type="button" aria-label="Back to top">' +
      '<i class="fas fa-arrow-up" aria-hidden="true"></i></button>';

  document.body.insertAdjacentHTML('afterbegin', header);
  document.querySelector('main').insertAdjacentHTML('afterend', footer);

  window.sectionsReady.then(function () {
    document.querySelectorAll('[data-social-links]').forEach(function (element) {
      element.innerHTML = socialItems();
    });
  });
})();
