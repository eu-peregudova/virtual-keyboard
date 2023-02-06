import data from './modules/data.js';
import KeysClass, { getCharSc } from './modules/keysClass.js';

const mainArea = document.createElement('main');
const textArea = document.createElement('textarea');
const keysPlate = document.createElement('div');
const langDescription = document.createElement('p');
keysPlate.classList.add('keys-plate');

let capsState = false;
let shiftState;

if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'english');
}

const functionKeys = ['Tab', 'CapsLock', 'Shift', 'Alt', 'Control', 'Meta', 'Backspace', 'Enter',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Delete'];

document.body.append(mainArea);
mainArea.append(langDescription);
mainArea.append(textArea, keysPlate);
langDescription.innerText = localStorage.getItem('language') === 'english'
  ? 'to change the language ctrl + alt'
  : 'для смены языка ctrl + alt';

for (let rowArray = 0; rowArray < data.length; rowArray += 1) {
  const lang = localStorage.getItem('language');
  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add(`row--${rowArray + 1}`);
  keysPlate.append(row);

  for (let obj = 0; obj < data[rowArray].length; obj += 1) {
    const key = new KeysClass(
      data[rowArray][obj].code,
      data[rowArray][obj].russian,
      data[rowArray][obj].russianUp,
      data[rowArray][obj].english,
      data[rowArray][obj].englishUp,
    );
    key.node.innerText = key[`${lang}`];
    key.node.id = key.code;
    row.append(key.node);
  }
}

const capsLock = document.querySelector('#CapsLock');

function xor(a, b) {
  return (a || b) && !(a && b);
}

function langChange() {
  const up = xor(capsState, shiftState) ? 'Up' : '';
  const lang = localStorage.getItem('language');

  for (let i = 0; i < KeysClass.instances.length; i += 1) {
    KeysClass.instances[i].node.innerText = KeysClass.instances[i][`${lang}${up}`];
  }

  langDescription.innerText = localStorage.getItem('language') === 'english'
    ? 'to change the language ctrl + alt'
    : 'для смены языка ctrl + alt';

  if (capsState) {
    capsLock.classList.add('caps--active');
  } else {
    capsLock.classList.remove('caps--active');
  }
}

function selectAll() {
  textArea.selectionStart = 0;
  textArea.selectionEnd = textArea.value.length;
}

function addCharToScreen(char) {
  const caretStart = textArea.selectionStart;
  const caretEnd = textArea.selectionEnd;
  textArea.value = textArea.value.slice(0, caretStart)
        + char + textArea.value.slice(caretEnd, textArea.value.length);
  textArea.selectionStart = caretStart + char.length;
  textArea.selectionEnd = caretStart + char.length;
}

function findChar(code) {
  const language = localStorage.getItem('language');
  const up = xor(capsState, shiftState) ? 'Up' : '';
  let char;
  for (let object = 0; object < data.flat().length; object += 1) {
    if (data.flat()[object].code === code) {
      char = data.flat()[object][`${language}${up}`];
    }
  }
  return char;
}

document.addEventListener('keydown', (event) => {
  if (event.repeat) {
    return;
  }

  if (!findChar(event.code, shiftState)) {
    return;
  }

  textArea.focus();
  langChange(capsState, shiftState);

  if (event.key === 'Tab') {
    event.preventDefault();
    addCharToScreen('    ');
  }
  if (event.key === 'CapsLock') {
    event.preventDefault();
    capsState = !capsState;
  }
  if (event.key === 'Shift') {
    shiftState = true;
    langChange(capsState, shiftState);
  }
  if (event.altKey && event.ctrlKey) {
    if (localStorage.getItem('language') === 'english') {
      localStorage.setItem('language', 'russian');
    } else {
      localStorage.setItem('language', 'english');
    }
    langChange();
  }
  if (event.ctrlKey && event.code === 'KeyA') {
    selectAll();
    return;
  }

  if (!functionKeys.includes(event.key)) {
    event.preventDefault();
    addCharToScreen(findChar(event.code, shiftState));
  }

  document.querySelector(`#${event.code}`).classList.add('key-button--active');
});

document.addEventListener('keyup', (event) => {
  if (!findChar(event.code, shiftState)) {
    return;
  }

  langChange(capsState, shiftState);

  if (event.key === 'Shift') {
    shiftState = false;
    langChange(capsState, shiftState);
  }
  if (event.repeat) {
    return;
  }
  document.querySelector(`#${event.code}`).classList.remove('key-button--active');
});

document.addEventListener('click', (e) => {
  const caps = xor(capsState, e.shiftKey) ? 'Up' : '';
  langChange(capsState, shiftState);

  if (!e.target.classList.contains('button-key')) {
    return;
  }
  const lang = localStorage.getItem('language');
  textArea.focus();

  if (!(e.target.id === 'ControlLeft'
        || e.target.id === 'ControlRight'
        || e.target.id === 'AltLeft'
        || e.target.id === 'AltRight'
        || e.target.id === 'MetaLeft'
        || e.target.id === 'ShiftRight'
        || e.target.id === 'ShiftLeft')) {
    if (e.target.id === 'Backspace' || e.target.id === 'Delete') {
      const caretStart = textArea.selectionStart;
      const back = Number(e.target.id === 'Backspace');
      if (textArea.selectionEnd !== caretStart) {
        addCharToScreen('');
      } else {
        textArea.value = textArea.value.slice(0, caretStart - back)
                    + textArea.value.slice(caretStart + 1 - back, textArea.value.length);
        textArea.selectionStart = caretStart - back;
        textArea.selectionEnd = caretStart - back;
      }
    } else if (e.target.id === 'Tab') {
      addCharToScreen('    ');
    } else if (e.target.id === 'Enter') {
      addCharToScreen('\n');
    } else if (e.target.id === 'CapsLock') {
      capsState = !capsState;
      langChange(capsState, shiftState);
    } else {
      addCharToScreen(getCharSc(e.target.id, lang, caps));
    }
  }
});

document.addEventListener('mousedown', (e) => {
  shiftState = true;
  if (e.target.id === 'ShiftRight' || e.target.id === 'ShiftLeft') {
    langChange(capsState, shiftState);
  }
});

document.addEventListener('mouseup', (e) => {
  shiftState = false;
  if (e.target.id === 'ShiftRight' || e.target.id === 'ShiftLeft') {
    langChange(capsState, shiftState);
  }
});
