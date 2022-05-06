import { language } from './lang/language';
import { create } from './util/create';
import { Key } from './Key';
import { setLocalStorage } from './util/storage';
import { Texarea } from './Textarea';

class Keyboard {
  constructor(rowsLayout) {
    this.rowsLayout = rowsLayout;
    document.onkeydown = this.handleEvent;
    document.onkeyup = this.handleEvent;
  }

  initialize(lang) {
    // change rowsKeyboard (ru||en||...)
    this.wrapper = create('div', 'wrapper main__wrapper', [
      create('h1', 'title', 'Virtual Keyboard'),
      create('h3', 'subtitle', 'Windows keyboard'),
    ]);
    const main = create('main', 'main', this.wrapper);
    this.keyLangBase = language[lang]; // []
    // create texarea
    this.textOutput = new Texarea(this.wrapper);
    this.keyboardDiv = create('div', 'keyboard', null, this.wrapper, ['language', lang]);
    document.body.appendChild(main);
    main.appendChild(this.wrapper);
    return this;
  }

  // create Layout
  createLayout = () => {
    this.keyButtons = [];
    this.rowsLayout.forEach((row, i) => {
      const rowElem = create('div', 'keyboard__row', null, this.keyboardDiv, ['row', i + 1]);

      row.forEach((code) => {
        // key object from language
        const keyElemObj = this.keyLangBase.find((key) => key.code === code); //object
        if (keyElemObj) {
          const keyButton = new Key(keyElemObj);

          keyButton.div.onmousedown = (evt) => {
            keyButton.div.classList.add('click-active'); ///////
            this.handleEvent({ code: keyButton.code, type: evt.type });
          };

          keyButton.div.onmouseup = (evt) => {
            setTimeout(() => {
              keyButton.div.classList.remove('click-active');
            }, 170);
            this.handleEvent({ code: keyButton.code, type: evt.type });
          };

          this.keyButtons.push(keyButton);
          rowElem.appendChild(keyButton.div);
        }
      });
    });
    return this.keyButtons;
  };

  handleEvent = (evt) => {
    if (evt.stopPropagation) evt.stopPropagation();
    // distract evt(code and type)
    const { code } = evt;
    const { type } = evt;
    // console.log(code, type);
    const keyElemObj = this.keyButtons.find((key) => key.code === code); //obj

    // key not found
    if (!keyElemObj) return;

    if (type.match(/keydown|mousedown/)) {
      // console.log(code, type);
      if (type.match(/key/)) evt.preventDefault();
      keyElemObj.div.classList.add('active');

      // change lang
      if (code.match(/ShiftLeft/)) this.shiftKey = true;
      if (code.match(/ShiftRight/)) this.shiftKey = true;
      if (code.match(/AltLeft/)) this.altKey = true;

      if (code.match(/ShiftLeft/) && this.altKey) this.changeLanguage();
      if (code.match(/AltLeft/) && this.shiftKey) this.changeLanguage();

      // caps press
      if (code.match(/Caps/) && !this.isCaps) {
        // this.capsKey = true;
        this.isCaps = true;
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;

        keyElemObj.div.classList.remove('active');
      }

      //no Caps
      if (!this.isCaps) {
        this.textOutput.printToTextArea(keyElemObj, this.shiftKey ? keyElemObj.shift : keyElemObj.small);
      } else if (this.isCaps) {
        if (this.shiftKey) {
          this.textOutput.printToTextArea(
            keyElemObj,
            keyElemObj.subElem.innerHTML ? keyElemObj.shift : keyElemObj.small,
          );
        } else {
          this.textOutput.printToTextArea(
            keyElemObj,
            !keyElemObj.subElem.innerHTML ? keyElemObj.shift : keyElemObj.small,
          );
        }
      }
    } else if (type.match(/keyup|mouseup/)) {
      if (code.match(/ShiftLeft/)) this.shiftKey = false;
      if (code.match(/AltLeft/)) this.altKey = false;
      keyElemObj.div.classList.remove('active');
    }
  };

  changeLanguage = () => {
    const langID = Object.keys(language);
    let langIndex = langID.indexOf(this.keyboardDiv.dataset.language);

    this.keyLangBase =
      langIndex + 1 < langID.length ? language[langID[(langIndex += 1)]] : language[langID[(langIndex -= langIndex)]];

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
}

export { Keyboard };
