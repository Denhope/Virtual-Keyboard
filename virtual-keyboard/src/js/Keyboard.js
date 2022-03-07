/* eslint-disable import/named */
import { language } from './lang/language';
import { create } from './util/create';
import { Key } from './Key';
// import { rowsLayout } from './rowsKeyboard';

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
    this.isCaps = false;
  }

  initialize(langString) {
    // change rowsKeyboard (ru||en)
    this.keyElements = language[langString];
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

    this.div = create('div', 'keyboard', null, wrapper, ['language', langString]);
    document.body.appendChild(main);
    main.appendChild(wrapper);
    return this;
  }

  // create Layout
  createLayout() {
    this.keyButtons = [];
    this.rowsLayout.forEach((row, i) => {
      const rowElem = create('div', 'keyboard__row', null, this.div, ['row', i + 1]);
      rowElem.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        // key object from language
        const keyElem = this.keyElements.find((key) => key.code === code);
        if (keyElem) {
          const keyButton = new Key(keyElem);
          this.keyButtons.push(keyButton);
          rowElem.appendChild(keyButton.div);
        }
      });
    });
  }
}

export { Keyboard };
