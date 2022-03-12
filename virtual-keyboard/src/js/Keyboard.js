import { language } from './lang/language';
import { create } from './util/create';
import { Key } from './Key';

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

  initialize(langString) {
    // change rowsKeyboard (ru||en||...)
    this.keyLangBase = language[langString]; // []
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

    this.keyboardDiv = create('div', 'keyboard', null, wrapper, ['language', langString]);
    document.body.appendChild(main);
    main.appendChild(wrapper);
    return this;
  }

  // create Layout
  createLayout = () => {
    this.keyButtons = [];
    this.rowsLayout.forEach((row, i) => {
      const rowElem = create('div', 'keyboard__row', null, this.keyboardDiv, ['row', i + 1]);
      rowElem.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
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
  };

  handleEvent = (evt) => {
    if (evt.stopPropagation) evt.stopPropagation();
    // distract evt(code and type)
    const { code, type } = evt;
    // console.log(code, type);
    const keyElemObj = this.keyButtons.find((key) => key.code === code);
    this.textOutput.focus();

    // key not found
    if (!keyElemObj) return;

    if (type.match(/keydown/)) {
      if (type.match(/key/)) evt.preventDefault();
      // console.log(keyElemObj);
      keyElemObj.div.style.backgroundColor = 'yellow';
    } else if (type.match(/keyup/)) {
      // console.log(keyElemObj);
      keyElemObj.div.style.backgroundColor = 'black';
    }
  };
}

export { Keyboard };
