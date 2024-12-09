const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Vérifier l'email
function checkEmail() {
  const regexEmail = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const email = inputEmail.value.trim();
  if (email === '' || !regexEmail.test(email)) {
    emailError.innerText = 'Email invalide';
    emailError.style.display = 'block';
  } else {
    emailError.style.display = 'none';
  }
}

// Vérifier le mot de passe
function checkPassword() {
  const regexPassword = /^.{3,}$/;
  const password = inputPassword.value.trim();
  if (!regexPassword.test(password)) {
    passwordError.innerText = 'Mot de passe invalide';
    passwordError.style.display = 'block';
  } else {
    passwordError.style.display = 'none';
  }
}

// Vérifier l'email en temps réel
inputEmail.addEventListener('change', () => {
  checkEmail();
});

// Vérifier le mot de passe en temps réel
inputPassword.addEventListener('change', () => {
  checkPassword();
});

async function postLogin() {
  const data = {
    email: inputEmail.value.trim(),
    password: inputPassword.value.trim(),
  };
  console.log(data);
  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      Headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Vérifier les champs et envoyer le formulaire
function submitLogin() {
  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    checkEmail();
    checkPassword();
    if (
      emailError.style.display === 'none' &&
      passwordError.style.display === 'none'
    ) {
      postLogin();
    } else {
      console.log('Ne pas envoyer la requête');
    }
  });
}

submitLogin();
