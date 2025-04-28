document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const appContainers = document.querySelectorAll('.app-container');

    // Function to switch tabs
    function openTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));
        appContainers.forEach(container => container.classList.remove('active'));
        document.getElementById(tabId + '-tab').classList.add('active');
        document.getElementById(tabId + '-container').classList.add('active');
        localStorage.setItem('activeTab', tabId);
    }

    // Event listeners for tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            openTab(tab.id.replace('-tab', ''));
        });
    });

    // Load the initially active tab from local storage or default to tic-tac-toe
    const activeTab = localStorage.getItem('activeTab') || 'tic-tac-toe';
    openTab(activeTab);

    // ----- Tic-Tac-Toe Logic -----
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const messageDisplay = document.querySelector('.message');
    const restartButton = document.getElementById('restart-btn');
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.dataset.index);

        if (gameBoard[cellIndex] === '' && gameActive) {
            gameBoard[cellIndex] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);
            checkWin();
            switchPlayer();
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkWin() {
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                messageDisplay.textContent = `Player ${gameBoard[a]} wins!`;
                gameActive = false;
                return;
            }
        }

        if (!gameBoard.includes('') && gameActive) {
            messageDisplay.textContent = "It's a draw!";
            gameActive = false;
        }
    }

    function restartGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        messageDisplay.textContent = '';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // ----- Notes Logic -----
    const previousNotesList = document.getElementById('previous-notes');
    const noteTextarea = document.getElementById('note-text');
    const newNoteButton = document.getElementById('new-note-btn');
    const saveNoteButton = document.getElementById('save-note-btn');
    const currentNoteIndexInput = document.getElementById('current-note-index');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    function displayNotes() {
        previousNotesList.innerHTML = '';
        notes.forEach((note, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = note.substring(0, 10) + (note.length > 10 ? '...' : '');
            listItem.dataset.index = index;
            listItem.addEventListener('dblclick', () => editNote(index));
            previousNotesList.appendChild(listItem);
        });
    }

    function newNote() {
        noteTextarea.value = '';
        currentNoteIndexInput.value = '';
        saveNoteButton.style.display = 'block';
        newNoteButton.style.display = 'none';
    }

    function saveNote() {
        const note = noteTextarea.value.trim();
        const currentIndex = currentNoteIndexInput.value;

        if (note) {
            if (currentIndex === '') {
                notes.push(note);
            } else {
                notes[currentIndex] = note;
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            displayNotes();
            noteTextarea.value = '';
            currentNoteIndexInput.value = '';
            saveNoteButton.style.display = 'none';
            newNoteButton.style.display = 'block';
        }
    }

    function editNote(index) {
        noteTextarea.value = notes[index];
        currentNoteIndexInput.value = index;
        saveNoteButton.style.display = 'block';
        newNoteButton.style.display = 'none';
    }

    newNoteButton.addEventListener('click', newNote);
    saveNoteButton.addEventListener('click', saveNote);
    displayNotes();

    // ----- Calculator Logic -----
    const display = document.getElementById('display');
    let currentInput = '';
    let operator = null;
    let previousValue = null;

    function appendNumber(number) {
        currentInput += number;
        display.value = currentInput;
    }

    function appendOperator(op) {
        if (currentInput === '') return;
        if (previousValue !== null) {
            calculate();
        }
        previousValue = parseFloat(currentInput);
        operator = op;
        currentInput = '';
    }

    function appendDecimal() {
        if (!currentInput.includes('.')) {
            currentInput += '.';
            display.value = currentInput;
        }
    }

    function clearDisplay() {
        currentInput = '';
        operator = null;
        previousValue = null;
        display.value = '';
    }

    function deleteLast() {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput;
    }

    function calculate() {
        if (operator === null || previousValue === null) return;

        let result;
        const currentValue = parseFloat(currentInput);

        switch (operator) {
