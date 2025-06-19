class Calculator {
    constructor() {
        this.history = document.getElementById('history');
        this.result = document.getElementById('result');
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;

        this.setupEventListeners();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        document.querySelectorAll('.key').forEach(button => {
            button.addEventListener('click', () => {
                this.handleInput(button.textContent);
                this.addClickEffect(button);
            });
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    setupThemeToggle() {
        // Load saved theme
        const savedTheme = localStorage.getItem('calculator-theme') || 'modern';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Theme toggle buttons
        document.getElementById('modern-theme').addEventListener('click', () => this.setTheme('modern'));
        document.getElementById('retro-theme').addEventListener('click', () => this.setTheme('retro'));
        document.getElementById('cyber-theme').addEventListener('click', () => this.setTheme('cyber'));
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('calculator-theme', theme);
        
        // Add theme change animation
        const calculator = document.querySelector('.calculator');
        calculator.style.animation = 'none';
        calculator.offsetHeight; // Trigger reflow
        calculator.style.animation = 'floating 3s ease-in-out infinite'; // Reapply floating animation
    }

    addClickEffect(button) {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 100);
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
        if (e.key === '.') this.appendNumber('.');
        if (e.key === '=' || e.key === 'Enter') this.evaluate();
        if (e.key === 'Backspace') this.delete();
        if (e.key === 'Escape') this.clear();
        if (['+', '-', '*', '/', '%'].includes(e.key)) {
            const operatorMap = {
                '*': '×',
                '/': '÷'
            };
            this.setOperation(operatorMap[e.key] || e.key);
        }
    }

    handleInput(value) {
        if (value >= '0' && value <= '9' || value === '.') {
            this.appendNumber(value);
        } else if (['+', '-', '×', '÷', '%'].includes(value)) {
            this.setOperation(value);
        } else if (value === '=') {
            this.evaluate();
        } else if (value === 'AC') {
            this.clear();
        } else if (value === '±') {
            this.toggleSign();
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    setOperation(operator) {
        if (this.operation && this.shouldResetScreen) {
            this.operation = operator;
            return;
        }