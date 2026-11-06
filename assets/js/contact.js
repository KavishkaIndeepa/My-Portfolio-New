/* Contact form: sends through EmailJS and reports the result. */
window.sectionsReady.then(function () {
  var PUBLIC_KEY = 'oWNe54gKcJ23974uV';
  var SERVICE_ID = 'service_59fyps5';
  var TEMPLATE_ID = 'template_1cfaadl';

  var form = document.getElementById('contact-form');
  if (!form) {
    return; /* The contact section failed to load. */
  }

  var submitButton = form.querySelector('button[type="submit"]');

  emailjs.init(PUBLIC_KEY);

  function showPopup(options) {
    var styles = getComputedStyle(document.documentElement);
    options.background = styles.getPropertyValue('--surface').trim();
    options.color = styles.getPropertyValue('--text').trim();
    Swal.fire(options);
  }

  function setSending(isSending) {
    submitButton.disabled = isSending;
    submitButton.textContent = isSending ? 'Sending...' : 'Send Message';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setSending(true);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
      .then(function () {
        form.reset();
        showPopup({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Thank you for reaching out. I’ll get back to you soon.',
          confirmButtonColor: '#2563eb'
        });
      }, function (error) {
        showPopup({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to send your message: ' + error.text,
          confirmButtonColor: '#dc2626'
        });
      })
      .finally(function () {
        setSending(false);
      });
  });
});
