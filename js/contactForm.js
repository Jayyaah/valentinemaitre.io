
const form = document.getElementById('contactForm');
const responseDiv = document.getElementById('formResponse');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const data = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      responseDiv.style.display = 'block';
      responseDiv.className = 'alert alert-success';
      responseDiv.textContent = 'Merci pour votre message, je vous répondrai rapidement !';
      form.reset();
    } else {
      response.json().then(data => {
        if (data.errors) {
          responseDiv.style.display = 'block';
          responseDiv.className = 'alert alert-danger';
          responseDiv.textContent = data.errors.map(error => error.message).join(", ");
        } else {
          responseDiv.style.display = 'block';
          responseDiv.className = 'alert alert-danger';
          responseDiv.textContent = 'Une erreur est survenue, veuillez réessayer.';
        }
      });
    }
  }).catch(() => {
    responseDiv.style.display = 'block';
    responseDiv.className = 'alert alert-danger';
    responseDiv.textContent = 'Une erreur est survenue, veuillez vérifier votre connexion.';
  });
});
