let currentInput = '0';
let operator = null;
let previousInput = null;

const display = document.getElementById('display');

function updateDisplay() {
    // Prevent display from overflowing by limiting length or relying on CSS word-break
    if (currentInput.length > 12) {
        display.innerText = Number(currentInput).toExponential(5);
    } else {
        display.innerText = currentInput;
    }
}

function appendNumber(number) {
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        // Prevent multiple decimals
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (previousInput !== null && operator !== null && currentInput !== '') {
        calculate();
    }
    operator = op;
    previousInput = currentInput;
    currentInput = '';
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    updateDisplay();
}

function calculate() {
    if (operator === null || previousInput === null || currentInput === '') return;
    
    let a = parseFloat(previousInput);
    let b = parseFloat(currentInput);
    let result = 0;

    switch (operator) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b === 0) {
                currentInput = 'Error';
                operator = null;
                previousInput = null;
                updateDisplay();
                setTimeout(clearDisplay, 1500);
                return;
            }
            result = a / b;
            break;
    }

    // Handle floating point precision issues
    currentInput = String(Math.round(result * 100000000) / 100000000);
    operator = null;
    previousInput = null;
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (/[0-9.]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
