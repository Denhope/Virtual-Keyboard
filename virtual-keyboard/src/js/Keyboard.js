import { language } from './lang/language';
import { create } from './util/create';
import { Key } from './Key';
import { setLocalStorage } from './util/storage';

// create main
const wrapper = create('div', 'wrapper main__wrapper', [
  create('h1', 'title', 'Virtual Keyboard'),
  create('h3', 'subtitle', 'Windows keyboard'),
]);
const main = create('main', 'main', wrapper);

class Keyboard {
  constructor(rowsLayout) {
    this.rowsLayout = rowsLayout;
    this.keysActive = {};
  }

  initialize(lang) {
    // change rowsKeyboard (ru||en||...)
    this.keyLangBase = language[lang]; // []
    // create texarea
    this.textOutput = create(
      'textarea',
      'text-output',
      null,
      wrapper,
      ['placeholder', 'Please type anything'],
      ['rows', 5],
      ['cols', 60],
      ['autocorect', 'off'],
    );

    this.keyboardDiv = create('div', 'keyboard', null, wrapper, ['language', lang]);
    document.body.appendChild(main);
    main.appendChild(wrapper);
    return this;
  }

  // create Layout
  createLayout = () => {
    this.keyButtons = [];
    this.rowsLayout.forEach((row, i) => {
      const rowElem = create('div', 'keyboard__row', null, this.keyboardDiv, ['row', i + 1]);
      // rowElem.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        // key object from language
        const keyElemObj = this.keyLangBase.find((key) => key.code === code);
        if (keyElemObj) {
          const keyButton = new Key(keyElemObj);
          this.keyButtons.push(keyButton);
          rowElem.appendChild(keyButton.div);
        }
      });
    });
    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.keyboardDiv.onmousedown = this.preHandleEvent;
    this.keyboardDiv.onmouseup = this.preHandleEvent;
  };

  preHandleEvent = (evt) => {
    evt.stopPropagation();
    // if (evt.target.matches('.keyboard__key')) {
    const keyDiv = evt.target.closest('.keyboard__key');
    const {
      dataset: { code },
    } = keyDiv;
    keyDiv.addEventListener('mouseleave', this.resetButtonState);
    this.handleEvent({ code, type: evt.type });
    // }
  };

  resetButtonState = ({
    target: {
      dataset: { code },
    },
  }) => {
    const keyObjElem = this.keyButtons.find((key) => key.code === code);
    // keyObjElem.div.classList.remove('active');
    keyObjElem.div.removeEventListener('mouseleave', this.resetButtonState);
  };

  handleEvent = (evt) => {
    if (evt.stopPropagation) evt.stopPropagation();
    // distract evt(code and type)
    const { code } = evt;
    const { type } = evt;
    // console.log(code, type);
    const keyElemObj = this.keyButtons.find((key) => key.code === code);
    this.textOutput.focus();

    // key not found
    if (!keyElemObj) return;

    if (type.match(/keydown|mousedown/)) {
      // console.log(code, type);
      if (type.match(/key/)) evt.preventDefault();
      keyElemObj.div.style.backgroundColor = 'yellow';

      // change lang
      if (code.match(/ShiftLeft/)) this.shiftKey = true;
      if (code.match(/ShiftRight/)) this.shiftKey = true;
      if (code.match(/AltLeft/)) this.altKey = true;

      if (code.match(/ShiftLeft/) && this.altKey) this.changeLanguage();
      if (code.match(/AltLeft/) && this.shiftKey) this.changeLanguage();

      // caps press
      if (code.match(/Capslock/)) {
        this.capsKey = true;
        this.isCaps = true;
      }
      if (!this.isCaps) {
        this.printToTextArea(keyElemObj, this.shiftKey ? keyElemObj.shift : keyElemObj.small);
      } else if (this.isCaps) {
        if (this.shiftKey) {
          this.printToTextArea(
            keyElemObj,
            keyElemObj.subElem.innerHTML ? keyElemObj.shift : keyElemObj.small,
          );
        } else {
          this.printToTextArea(
            keyElemObj,
            !keyElemObj.subElem.innerHTML ? keyElemObj.shift : keyElemObj.small,
          );
        }
      }
    } else if (type.match(/keyup|mouseup/)) {
      // console.log(keyElemObj);
      if (code.match(/ShiftLeft/)) this.shiftKey = false;
      if (code.match(/AltLeft/)) this.altKey = false;
      keyElemObj.div.style.backgroundColor = 'black';
    }
  };

  changeLanguage = () => {
    const langID = Object.keys(language);
    let langIndex = langID.indexOf(this.keyboardDiv.dataset.language);

    this.keyLangBase =
      langIndex + 1 < langID.length
        ? language[langID[(langIndex += 1)]]
        : language[langID[(langIndex -= langIndex)]];

    this.keyboardDiv.dataset.language = langID[langIndex];
    setLocalStorage('lang', langID[langIndex]);

    this.keyButtons.forEach((keybutton) => {
      const keyElemObj = this.keyLangBase.find((key) => key.code === keybutton.code);
      if (!keyElemObj) return;
      keybutton.shift = keyElemObj.shift;
      keybutton.small = keyElemObj.small;

      if (keyElemObj.shift && keyElemObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        keybutton.subElem.innerHTML = keyElemObj.shift;
      } else {
        keybutton.subElem.innerHTML = '';
      }
      keybutton.symvol.innerHTML = keyElemObj.small;
    });
  };

  printToTextArea = (keyElemObj, symvol) => {
    console.log(symvol);
  };
}

export { Keyboard };
