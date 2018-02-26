"use strict";

const form = document.getElementById('form');

const startYear = 1920;
const years = Array.from(new Array(new Date().getFullYear() - startYear + 1), (x, i) => i + startYear);

const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const genderBtns = document.querySelectorAll('input[name="gender"]');

const sendButton = document.querySelector('button.big');

const scriptURL = 'https://script.google.com/macros/u/0/s/AKfycbwOOFKwFMoiNHu-jQAiH1PPg4ZiDLvEBwJMb1mjX5M0cm2s4Jw/exec';

let lastSym; //хранит последний введенный символ в полях "Фамилия" и "Имя"

const maritalStatus = {
    male: ['женат', 'в «гражданском браке»', 'разведен', 'холост', 'вдовец'],
    female: ['замужем', 'в «гражданском браке»', 'разведена', 'не замужем', 'вдова']
}

function e(tagName, attributes, children) {
    const element = document.createElement(tagName);
    if (typeof attributes === 'object') {
        Object.keys(attributes).forEach(i => {
            element.setAttribute(i, attributes[i])
        });
    }
    if ((typeof children === 'string') || (typeof children === 'number')) {
        element.textContent = children;
    } else if (children instanceof Array) {
        children.forEach(child => element
            .appendChild(child));
    }
    return element;
}

function daysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function initDateSelect(year, month) {
    const selected = form.birth_day.value;
    form.birth_day.innerHTML = '';
    const days = Array.from(new Array(daysInMonth(new Date(year, month, 1))), (x, i) => i + 1);
    for (const day of days) {
        form.birth_day.add(e('option', {value: day}, day));
    }
    if (selected) form.birth_day.value = selected;
}

function initMaritalSelect(gender) {
    form.marital_status.innerHTML = '';
    for (const status of maritalStatus[gender]) {
        form.marital_status.add(e('option', {value: status}, status));
    }
}

function translit(event) {
    const transl = [];
    transl['А']='A';     transl['а']='a';
    transl['Б']='B';     transl['б']='b';
    transl['В']='V';     transl['в']='v';
    transl['Г']='G';     transl['г']='g';
    transl['Д']='D';     transl['д']='d';
    transl['Е']='E';     transl['е']='e';
    transl['Ё']='Yo';    transl['ё']='yo';
    transl['Ж']='Zh';    transl['ж']='zh';
    transl['З']='Z';     transl['з']='z';
    transl['И']='I';     transl['и']='i';
    transl['Й']='J';     transl['й']='j';
    transl['К']='K';     transl['к']='k';
    transl['Л']='L';     transl['л']='l';
    transl['М']='M';     transl['м']='m';
    transl['Н']='N';     transl['н']='n';
    transl['О']='O';     transl['о']='o';
    transl['П']='P';     transl['п']='p';
    transl['Р']='R';     transl['р']='r';
    transl['С']='S';     transl['с']='s';
    transl['Т']='T';     transl['т']='t';
    transl['У']='U';     transl['у']='u';
    transl['Ф']='F';     transl['ф']='f';
    transl['Х']='X';     transl['х']='x';
    transl['Ц']='C';     transl['ц']='c';
    transl['Ч']='Ch';    transl['ч']='ch';
    transl['Ш']='Sh';    transl['ш']='sh';
    transl['Щ']='Shh';    transl['щ']='shh';
    transl['Ъ']='"';     transl['ъ']='"';
    transl['Ы']='Y\'';    transl['ы']='y\'';
    transl['Ь']='\'';    transl['ь']='\'';
    transl['Э']='E\'';    transl['э']='e\'';
    transl['Ю']='Yu';    transl['ю']='yu';
    transl['Я']='Ya';    transl['я']='ya';

    const target = event.target.id + '_en'

    if (event.inputType === 'insertText') {
        form[target].value += (transl[event.data] !== undefined) ? transl[event.data] : event.data;
        lastSym = event.data;
    } else if (event.inputType === 'deleteContentBackward') {
        form[target].value = (transl[lastSym]) ? form[target].value.slice(0, -transl[lastSym].length) : form[target].value.slice(0, -1);
        lastSym = event.target.value[event.target.value.length - 1];
    }
}

function getDate() {
    return new Date(parseInt(form.birth_year.value) + 90, parseInt(form.birth_month.value), parseInt(form.birth_day.value));
}

function ageCheck() {
    return getDate() < new Date();
}

for (let year of years) {
    form.birth_year.add(e('option', {value: year}, year));
}

form.birth_year.value = new Date().getFullYear();

for (let [index, value] of months.entries()) {
    form.birth_month.add(e('option', {value: index}, value))
}

form.birth_month.value = new Date().getMonth();

initDateSelect(parseInt(form.birth_year.value), parseInt(form.birth_month.value));
initMaritalSelect(form.gender.value);

form.birth_day.addEventListener('change', (event) => {
    event.target.parentElement.parentElement.classList.toggle('warning', ageCheck());
    form.bdvalidation.value = new Date(new Date() - getDate()).getFullYear();
    sendButton.disabled = !form.checkValidity();
});
form.birth_month.addEventListener('change', (event) => {
    initDateSelect(parseInt(form.birth_year.value), parseInt(form.birth_month.value));
    event.target.parentElement.parentElement.classList.toggle('warning', ageCheck());
    form.bdvalidation.value = new Date(new Date() - getDate()).getFullYear();
    sendButton.disabled = !form.checkValidity();
});
form.birth_year.addEventListener('change', (event) => {
    initDateSelect(parseInt(form.birth_year.value), parseInt(form.birth_month.value));
    event.target.parentElement.parentElement.classList.toggle('warning', ageCheck());
    form.bdvalidation.value = new Date(new Date() - getDate()).getFullYear();
    sendButton.disabled = !form.checkValidity();
});

form.birth_day.value = new Date().getDate();

form.bdvalidation.value = new Date(new Date() - getDate()).getFullYear();

form.lastname.addEventListener('input', translit);
form.firstname.addEventListener('input', translit);

genderBtns.forEach((btn) => btn.addEventListener('click', () => initMaritalSelect(form.gender.value)));

for (let input of form.elements) {
    input.addEventListener('blur', () => sendButton.disabled = !form.checkValidity());
}

form.accept.addEventListener('change', () => sendButton.disabled = !form.checkValidity());

form.addEventListener('submit', event => {
    event.preventDefault();

    fetch(scriptURL, {method: 'POST', body: new FormData(document.form['form'])})
        .then(res => console.log(res))
        .catch(err => console.log(err));
})
