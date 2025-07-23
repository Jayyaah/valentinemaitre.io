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
      responseDiv.className = 'alert alert-success visible';
      responseDiv.textContent = 'Merci pour votre message, je vous répondrai rapidement !';
      form.reset();
    } else {
      response.json().then(data => {
        responseDiv.className = 'alert alert-danger visible';
        responseDiv.textContent = data.errors
          ? data.errors.map(error => error.message).join(", ")
          : 'Une erreur est survenue, veuillez réessayer.';
      });
    }
  }).catch(() => {
    responseDiv.className = 'alert alert-danger visible';
    responseDiv.textContent = 'Une erreur est survenue, veuillez vérifier votre connexion.';
  });
});
