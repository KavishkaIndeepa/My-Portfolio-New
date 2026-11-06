/* Runs in <head>, before the page paints, so the saved theme never flashes. */
(function () {
  var root = document.documentElement;
  var theme = null;

  try {
    theme = localStorage.getItem('theme');
  } catch (error) {
    /* Storage can be blocked; fall back to the system preference. */
  }

  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  root.setAttribute('data-theme', theme);
  root.classList.add('js');
})();
