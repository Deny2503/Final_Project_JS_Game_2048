// records.js
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('recordsTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    let users = JSON.parse(localStorage.getItem('users') || '[]').filter(u => u.bestScore > 0);
    users.sort((a, b) => b.bestScore - a.bestScore);

    tbody.innerHTML = '';
    users.slice(0, 10).forEach((u, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i + 1}</td><td>${u.username}</td><td>${u.bestScore}</td>`;
        tbody.appendChild(tr);
    });
});
