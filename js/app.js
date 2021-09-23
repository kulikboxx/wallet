'use strict';

let root = document.documentElement;

const icons = {
    income: '<i class="fas fa-money-bill-wave"></i>',
    shopping: '<i class="fas fa-shopping-cart"></i>',
    food: '<i class="fas fa-hamburger"></i>',
    cinema: '<i class="fas fa-film"></i>'
}

function getInputsValue(list, selector) {
    let inputs = document.querySelectorAll(selector),
        name, amount, category;

    inputs.forEach(input => {
        switch (input.id) {
            case 'name':
                name = input.value;
                break;
            case 'amount':
                amount = +input.value;
                break;
            case 'category':
                category = input.value;
                break;
            default:
                return;
        }
    });

    if (checkInputs(inputs)) appendLiItems(list, name, amount, category);
}

function checkInputs(inputs) {
    let result = false;

    inputs.forEach(input => {
        trimNameValue(input);

        if (input.id !== 'category' && input.value == '') {
            input.nextElementSibling.textContent = 'Enter at least 1 character';
            result = false;
        } else if (input.id === 'category' && input.selectedIndex == 0) {
            input.nextElementSibling.textContent = 'Select an option';
            result = false;
        } else {
            input.nextElementSibling.textContent = '';
            result = true;
        }
    });
    return result;
}

function trimNameValue(input) {
    return input.value = input.value.replace(/^\s+/, '');
}

function appendLiItems(list, name, amount, category) {
    let ulLists = document.querySelectorAll(list),
        liItem = document.createElement('li');

    liItem.innerHTML = `
            <p>${icons[category]}${name}</p>
            <p><span class="app__amount">${amount.toFixed(2)}</span>USD<i class="fas fa-times"></i></p>
        `;

    if (category === 'income') ulLists[0].append(liItem);
    else ulLists[1].append(liItem);

    showAvailableFunds();
    showModal();
    clearInputs();
}

function computeTransactions() {
    let incInp = document.querySelectorAll('#income .app__amount'),
        expInp = document.querySelectorAll('#expenses .app__amount'),
        incArr = [0],
        expArr = [0],
        x, y;

    incInp.forEach(item => incArr.push(+item.textContent));
    expInp.forEach(item => expArr.push(+item.textContent));

    x = incArr.reduce((a, b) => a + b);
    y = expArr.reduce((a, b) => a + b);

    return x - y;
}

function showAvailableFunds() {
    let funds = document.querySelector('.app__funds'),
        result = computeTransactions();

    funds.textContent = `${result.toFixed(2)}USD`;
}

function clearInputs() {
    document.querySelectorAll('.modal__input').forEach(input => {
        input.value = '';
        input.selectedIndex = 0;
        input.nextElementSibling.textContent = '';
    });
}

function removeTransaction(e) {
    e.target.classList.contains('fa-times') && e.target.closest('li').remove();
    showAvailableFunds();
}

function removeAllTransactions(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => element.remove());
    showAvailableFunds();
}

function showModal() {
    const modal = document.querySelector('.modal');

    if (!modal.classList.contains('show-modal')) {
        modal.classList.add('show-modal');
        return;
    }
    modal.classList.remove('show-modal');
    clearInputs();
}

showAvailableFunds();
document.querySelector('.app__remove').addEventListener('click', () => removeAllTransactions('.app__list li'));
document.querySelector('.app__add').addEventListener('click', showModal);
document.querySelector('.modal__cancel').addEventListener('click', showModal);
document.querySelector('.modal__save').addEventListener('click', () => getInputsValue('.app__list', '.modal__input'));
document.querySelector('.app__boxes').addEventListener('click', e => removeTransaction(e));
document.querySelector('.app__light').addEventListener('click', () => {
    root.style.setProperty('--white-color', '#ffffff');
    root.style.setProperty('--dark-color', '#14161F');
    root.style.setProperty('--light-color', '#f9f9f9');
});
document.querySelector('.app__dark').addEventListener('click', () => {
    root.style.setProperty('--white-color', '#14161F');
    root.style.setProperty('--dark-color', '#f9f9f9');
    root.style.setProperty('--light-color', '#14161F');
});