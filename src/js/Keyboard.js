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
    // change rowsKeyboard (ru||en)
    this.wrapper = create('div', 'wrapper main__wrapper', [
      create('h1', 'title', 'Virtual Keyboard'),
      create('h3', 'subtitle', 'Keyboard for Windows'),
      create('p', 'disctiption', 'Shift + Alt for change language'),
    ]);
    const main = create('main', 'main', this.wrapper);
    this.keyLangBase = language[lang];
    // create texarea
    this.textOutput = new Texarea(this.wrapper);
    this.keyboardDiv = create('div', 'keyboard', null, this.wrapper, ['language', lang]);
    document.body.appendChild(main);
    main.appendChild(this.wrapper);
    // this.textOutput.focus()
    return this;
  }

  // create Layout
  createLayout = () => {
    this.keyButtons = [];
    this.rowsLayout.forEach((row, i) => {
      const rowElem = create('div', `keyboard__row row-${i + 1}`, null, this.keyboardDiv);

      row.forEach((code) => {
        // key object from language
        const keyElemObj = this.keyLangBase.find((key) => key.code === code);
        if (keyElemObj) {
          const keyButton = new Key(keyElemObj);

          keyButton.div.onmousedown = (evt) => {
            this.handleEvent({ code: keyButton.code, type: evt.type });
            keyButton.div.onmouseleave = () => {
              keyButton.div.classList.remove('active');
            };
          };

          keyButton.div.onmouseup = (evt) => {
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
    const keyElemObj = this.keyButtons.find((key) => key.code === code);

    // key not found
    if (!keyElemObj) return;

    if (type.match(/keydown|mousedown/)) {
      if (type.match(/key/)) evt.preventDefault();
      keyElemObj.div.classList.add('active');

      // change lang
      if (code.match(/Shift/)) this.shiftKey = true;
      if (code.match(/AltLeft/)) this.altKey = true;

      if (code.match(/ShiftLeft/) && this.altKey) this.changeLanguage();
      if (code.match(/AltLeft/) && this.shiftKey) this.changeLanguage();
      if (this.shiftKey) this.changeUpperKey(true);

      // caps press
      if (code.match(/Caps/) && !this.isCaps) {
        this.isCaps = true;
        this.changeUpperKey(true);
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.changeUpperKey(false);

        setTimeout(() => {
          keyElemObj.div.classList.remove('active');
        });
      }

      // no Caps
      if (!this.isCaps) {
        this.textOutput.printToTextArea(
          keyElemObj,
          this.shiftKey ? keyElemObj.shift : keyElemObj.small,
        );
        // Upper Case
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
      if (code.match(/Shift/)) {
        this.shiftKey = false;
        this.changeUpperKey(false);
      }
      if (code.match(/AltLeft/)) this.altKey = false;
      keyElemObj.div.classList.remove('active');
    }
  };

  changeLanguage = () => {
    const langID = Object.keys(language);
    let langIndex = langID.indexOf(this.keyboardDiv.dataset.language);

    this.keyLangBase = langIndex + 1 < langID.length
      ? language[langID[(langIndex += 1)]]
      : language[langID[(langIndex -= langIndex)]];

    this.keyboardDiv.dataset.language = langID[langIndex];
    setLocalStorage('lang', langID[langIndex]);

    this.keyButtons.forEach((keyButton) => {
      const keyElemObj = this.keyLangBase.find((key) => key.code === keyButton.code);
      if (!keyElemObj) return;
      const keyButtonCur = keyButton;
      keyButtonCur.shift = keyElemObj.shift;
      keyButtonCur.small = keyElemObj.small;

      if (keyElemObj.shift && keyElemObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        keyButtonCur.subElem.innerHTML = keyElemObj.shift;
      } else {
        keyButtonCur.subElem.innerHTML = '';
      }
      keyButtonCur.symvol.innerHTML = keyElemObj.small;
    });
  };

  changeUpperKey(isTrue) {
    if (isTrue) {
      this.keyButtons.forEach((keyButton) => {
        const keyButtonCur = keyButton;
        if (
          !keyButtonCur.isFnKey
          && this.isCaps
          && !this.shiftKey
          && !keyButtonCur.subElem.innerHTML
        ) {
          keyButtonCur.symvol.innerHTML = keyButton.shift;
        } else if (!keyButtonCur.isFnKey && this.isCaps && this.shiftKey) {
          keyButtonCur.symvol.innerHTML = keyButton.small;
        } else if (!keyButtonCur.isFnKey && !keyButtonCur.subElem.innerHTML) {
          keyButtonCur.symvol.innerHTML = keyButton.shift;
        }
      });
    } else {
      this.keyButtons.forEach((keyButton) => {
        const keyButtonCur = keyButton;
        if (keyButtonCur.subElem.innerHTML && !keyButtonCur.isFnKey) {
          if (!this.isCaps) {
            keyButtonCur.symvol.innerHTML = keyButton.small;
          }
        } else if (!keyButtonCur.isFnKey) {
          if (this.isCaps) {
            keyButtonCur.symvol.innerHTML = keyButton.shift;
          } else {
            keyButtonCur.symvol.innerHTML = keyButton.small;
          }
        }
      });
    }
  }
}

export { Keyboard };
