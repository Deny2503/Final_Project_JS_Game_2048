function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function isGuest() {
    const params = new URLSearchParams(window.location.search);
    return params.get('guest') === 'true';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        if (getCurrentUser()) logoutBtn.style.display = '';
        logoutBtn.addEventListener('click', logout);
    }
    const backBtn = document.getElementById('backMenuBtn');
    if (backBtn) backBtn.onclick = () => window.location.href = 'index.html';

    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        const user = getCurrentUser();
        if (user) {
            userInfo.textContent = `Пользователь: ${user.username}`;
        } else if (isGuest()) {
            userInfo.textContent = `Гость`;
        }
    }
});
