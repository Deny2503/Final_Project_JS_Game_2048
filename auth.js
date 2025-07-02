function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// Login logic
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      const users = getUsers();
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        window.location.href = 'game.html';
      } else {
        document.getElementById('loginError').textContent = 'Неверный логин или пароль.';
      }
    });
  }
});

// Register logic
document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value.trim();
      const password = document.getElementById('registerPassword').value;
      const password2 = document.getElementById('registerPasswordRepeat').value;
      const users = getUsers();
      if (!username || !password) {
        document.getElementById('registerError').textContent = 'Заполните все поля.';
        return;
      }
      if (users.some(u => u.username === username)) {
        document.getElementById('registerError').textContent = 'Такой пользователь уже существует.';
        return;
      }
      if (password.length < 3) {
        document.getElementById('registerError').textContent = 'Пароль слишком короткий.';
        return;
      }
      if (password !== password2) {
        document.getElementById('registerError').textContent = 'Пароли не совпадают.';
        return;
      }
      users.push({ username, password, bestScore: 0 });
      saveUsers(users);
      window.location.href = 'login.html';
    });
  }
});
