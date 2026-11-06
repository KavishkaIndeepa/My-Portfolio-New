/* Loads each section from the pages folder into index.html.
   Other scripts wait for window.sectionsReady before they start. */
window.sectionsReady = (function () {
  var sections = document.querySelectorAll('[data-src]');

  function loadSection(section) {
    return fetch(section.getAttribute('data-src'))
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.text();
      })
      .then(function (html) {
        section.innerHTML = html;
      })
      .catch(function () {
        section.innerHTML = '<p class="load-error">This section could not be loaded. ' +
          'Please refresh the page. If you opened index.html directly, use Live Server instead.</p>';
      });
  }

  return Promise.all(Array.prototype.map.call(sections, loadSection));
})();
