
document.addEventListener('DOMContentLoaded', () => {
  const loginWrap = document.getElementById('login-wrap');
  const registerWrap = document.getElementById('register-wrap');
  const toggleToRegister = document.getElementById('toggle-to-register');
  const toggleToLogin = document.getElementById('toggle-to-login');

  toggleToRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    loginWrap.hidden = true;
    registerWrap.hidden = false;
  });

  toggleToLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    registerWrap.hidden = true;
    loginWrap.hidden = false;
  });

  const regForm = document.getElementById('register-form');
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passInput = document.getElementById('reg-password');
  const confInput = document.getElementById('reg-confirm');

  const setError = (el, msg) => {
    const span = el.parentElement.querySelector('.error');
    if (span) span.textContent = msg || '';
  };

  regForm?.addEventListener('submit', (e) => {
    let valid = true;
    const nameOk = /\S+/.test(nameInput.value.trim());
    if (!nameOk) { setError(nameInput, 'Name is required.'); valid = false; } else setError(nameInput, '');

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    if (!emailOk) { setError(emailInput, 'Enter a valid email.'); valid = false; } else setError(emailInput, '');

    if (passInput.value.length < 8) { setError(passInput, 'Password must be at least 8 characters.'); valid = false; } else setError(passInput, '');

    if (confInput.value !== passInput.value) { setError(confInput, 'Passwords do not match.'); valid = false; } else setError(confInput, '');

    if (!valid) e.preventDefault();
  });
});
