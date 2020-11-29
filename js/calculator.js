'use strict';
const calcDisplay = document.querySelector('.calc-display');
let previousChar, char = '';
let firstKeyStroke = true;
let numberHasDecimal = false;
let accumulator = [];

// general functions --- start ---
const initialize = () => {
    firstKeyStroke = true;
    numberHasDecimal = false;
    char = '0';
    previousChar = '';
    accumulator = ['0'];
    printToCalcDisplay(accumulator);
};

const printToCalcDisplay = (array) => {
    array.length > 26
        ? calcDisplay.innerHTML = array.join('').slice(-26).padStart(29, '.')
        : calcDisplay.innerHTML = array.join('');
};

const addNextChar = () => {
    accumulator.push(char);
    previousChar = char;
    printToCalcDisplay(accumulator);
};

const replaceLastChar = () => {
    accumulator.pop();
    addNextChar();
};

const addZeroBeforeChar = () => {
    accumulator.push('0');
    addNextChar();
};
// general functions --- end ---

// adding eventListeners to calculator buttons
const startButtonWatch = () => {
    document.querySelectorAll('.op-button > button').forEach(element => element.addEventListener('click', operatorButtonsHandler));
    document.querySelector('.clearKey > button').addEventListener('click', initialize);
    document.querySelectorAll('.numericKey > button').forEach(element => element.addEventListener('click', numericButtonsHandler));
    document.querySelector('.decimalKey > button').addEventListener('click', decimalButtonHandler);
    document.querySelector('.enter-button > button').addEventListener('click', enterButtonHandler);
};

// button click event handlers
// operator buttons --- start ---
const operatorButtonsHandler = (event) => {
    char = event.target.innerHTML;
    firstKeyStroke ? firstOperatorHandler() : operatorHandler();
    numberHasDecimal = false;
};

const firstOperatorHandler = () => {
    if (char !== '+' || (char === '+' && accumulator.join() !== '0')) {
        addNextChar();
        firstKeyStroke = false;
    }
};

const operatorHandler = () => {
    ['+', '-', '×', '÷', '.'].indexOf(previousChar) === -1 ? addNextChar() : replaceLastChar();
    firstKeyStroke = false;
};
// operator buttons --- end ---

// numeric butons
const numericButtonsHandler = (event) => {
    char = event.target.innerHTML; 
    firstKeyStroke ? numberAsFirstInput() : addNextChar();
    firstKeyStroke = false;
};

const numberAsFirstInput = () => {
    accumulator = Array(char);
    printToCalcDisplay(accumulator);
}

// decimal button --- start ---
const decimalButtonHandler = (event) => {
    char = event.target.innerHTML;
    firstKeyStroke ? decimalAsFirstInput() : hasNumberDecimal();
    firstKeyStroke = false;
    numberHasDecimal = true;
};

const decimalAsFirstInput = () => {
    accumulator = ['0', '.'];
    printToCalcDisplay(accumulator);
}

const hasNumberDecimal = () => {if(!numberHasDecimal) { whatsBeforeDecimal() }};

const whatsBeforeDecimal = () => ['+', '-', '×', '÷'].indexOf(previousChar) === -1
    ? addNextChar()
    : addZeroBeforeChar();
// decimal button --- end ---

// enter button handler --- start ---
const enterButtonHandler = () => {
    let result = calculate().toString();
    calcDisplay.innerHTML = result;
    accumulator = [...result];
    firstKeyStroke = true;
};

const calculate = () => {
    if (accumulator[0] === '-') {accumulator.unshift('0')};
    if (['+', '-', '×', '÷', '.'].indexOf(accumulator[accumulator.length-1]) !== -1) {accumulator.pop();};
    let result = accumulator
    .join('')
    .replaceAll('-','+-')
    .split('+')
    .map(elem => evaluateForAddition(elem))
    .reduce(additionReducer);
    return result;
}

const evaluateForAddition = (text) => {
    if (parseFloat(text).toString().length == text.length) {
        return parseFloat(text);
    } else {
        return makeTheMultiplication(text);
    }
};

const makeTheMultiplication = (text) => text.split('×').map(elem => evaluateForMultiply(elem)).reduce(multiplyReducer);

const evaluateForMultiply = (text) => {
    if (parseFloat(text).toString().length == text.length) {
        return parseFloat(text);
    } else {
        return makeTheDivision(text);
    }    
};

const makeTheDivision = (text) => text.split('÷').map(elem => parseFloat(elem)).reduce(divisionReducer);

const divisionReducer = (x, y) => x / y;
const multiplyReducer = (x, y) => x * y;
const additionReducer = (x, y) => x + y;
// enter button handler --- end ---

initialize();
startButtonWatch();