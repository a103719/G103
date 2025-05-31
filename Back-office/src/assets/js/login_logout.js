(() => {
  const KEY = 'ee_logged';
  const store = sessionStorage;             
  const loginItem  = document.getElementById('menuLogin');
  const logoutItem = document.getElementById('menuLogout');
  const logoutLink = document.getElementById('logoutLink');

  const logged = store.getItem(KEY) === 'true';
  loginItem ?.classList.toggle('d-none',  logged);
  logoutItem?.classList.toggle('d-none', !logged);

  logoutLink?.addEventListener('click', e => {
    e.preventDefault();
    store.removeItem(KEY);
    location.href = './authentication-login.html';
  });
})();