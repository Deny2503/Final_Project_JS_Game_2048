// game.js

let board, score, bestScore;
let size = 4;

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function isGuest() {
    const params = new URLSearchParams(window.location.search);
    return params.get('guest') === 'true';
}

function getBestScore() {
    const user = getCurrentUser();
    if (user) return user.bestScore || 0;
    if (localStorage.getItem('guestBest')) return Number(localStorage.getItem('guestBest'));
    return 0;
}

function saveBestScore(newScore) {
    const user = getCurrentUser();
    if (user) {
        if (newScore > (user.bestScore || 0)) {
            user.bestScore = newScore;
            localStorage.setItem('currentUser', JSON.stringify(user));
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users = users.map(u => u.username === user.username ? user : u);
            localStorage.setItem('users', JSON.stringify(users));
        }
    } else if (isGuest()) {
        let guestBest = Number(localStorage.getItem('guestBest') || '0');
        if (newScore > guestBest) localStorage.setItem('guestBest', newScore);
    }
}

function initGame() {
    board = Array(size).fill(0).map(() => Array(size).fill(0));
    score = 0;
    addRandomTile();
    addRandomTile();
    updateBoard();
    document.getElementById('score').textContent = score;
    document.getElementById('bestScore').textContent = getBestScore();
    document.getElementById('gameMessage').textContent = '';
}

function addRandomTile() {
    let empty = [];
    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            if (board[i][j] === 0) empty.push([i, j]);
    if (empty.length === 0) return;
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    const boardDiv = document.getElementById('gameBoard');
    boardDiv.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = board[i][j] === 0 ? '' : board[i][j];
            if (board[i][j]) tile.style.background = getTileColor(board[i][j]);
            boardDiv.appendChild(tile);
        }
    }
}

function getTileColor(val) {
    const colors = {
        2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
        32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
        512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[val] || '#3c3a32';
}

function move(dir) {
    let moved = false, merged = Array(size).fill(0).map(() => Array(size).fill(false));
    function slide(row) {
        let arr = row.filter(v => v);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(v => v);
        while (arr.length < size) arr.push(0);
        return arr;
    }
    let prev = JSON.stringify(board);
    if (dir === 'left') {
        for (let i = 0; i < size; i++) board[i] = slide(board[i]);
    }
    if (dir === 'right') {
        for (let i = 0; i < size; i++) board[i] = slide(board[i].slice().reverse()).reverse();
    }
    if (dir === 'up') {
        for (let j = 0; j < size; j++) {
            let col = [];
            for (let i = 0; i < size; i++) col.push(board[i][j]);
            col = slide(col);
            for (let i = 0; i < size; i++) board[i][j] = col[i];
        }
    }
    if (dir === 'down') {
        for (let j = 0; j < size; j++) {
            let col = [];
            for (let i = 0; i < size; i++) col.push(board[i][j]);
            col = slide(col.reverse()).reverse();
            for (let i = 0; i < size; i++) board[i][j] = col[i];
        }
    }
    if (JSON.stringify(board) !== prev) moved = true;
    if (moved) {
        addRandomTile();
        updateBoard();
        document.getElementById('score').textContent = score;
        if (score > getBestScore()) {
            document.getElementById('bestScore').textContent = score;
            saveBestScore(score);
        }
        if (!canMove()) {
            document.getElementById('gameMessage').textContent = 'Игра окончена!';
            saveBestScore(score);
            document.removeEventListener('keydown', handleKey);
        }
    }
}

function canMove() {
    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            if (board[i][j] === 0) return true;
    for (let i = 0; i < size; i++)
        for (let j = 0; j < size - 1; j++)
            if (board[i][j] === board[i][j + 1]) return true;
    for (let i = 0; i < size - 1; i++)
        for (let j = 0; j < size; j++)
            if (board[i][j] === board[i + 1][j]) return true;
    return false;
}

function handleKey(e) {
    if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown'
    ) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!getCurrentUser() && !isGuest()) {
        window.location.href = 'login.html';
        return;
    }
    initGame();
    document.addEventListener('keydown', handleKey);
    document.getElementById('restartBtn').onclick = function () {
        initGame();
        document.addEventListener('keydown', handleKey);
    };
});