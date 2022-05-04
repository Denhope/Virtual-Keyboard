import { Keyboard } from './Keyboard';
import { create } from './util/create';

class Key {
  constructor({ small, shift, code }) {
    this.code = code;
    this.shift = shift;
    this.small = small;

    if (this.shift && this.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      this.subElem = create('div', 'sub-el', this.shift);
    } else {
      // no sub
      this.subElem = create('div', 'sub-el', ''); // html element
    }

    this.symvol = create('div', 'symvol', small); // html element
    this.div = create('div', 'keyboard__key', [this.subElem, this.symvol], null, ['code', this.code]);

    // this.div.onclick = () => {
    //   this.prehandlerEvent();
    // };
  }

  // prehandlerEvent(evt) {
  //   // evt.stopPropagation();
  //   console.log(this.code);
  //   this.div.addEventListener('mouseleave', this.resetButtonState);
  //   // this.handleEvent(evt);
  // }

  // resetButtonState = () => {
  //   this.div.removeEventListener('mouseleave', this.resetButtonState);
  // };

  // handleEvent = (evt) => {
  //   // this.textOutput.focus();

  //   const { code } = evt;

  //   const { type } = evt;
  //   if (!this.div) return;

  //   if (type.match(/keydown|mousedown/)) {
  //     // console.log(code, type);
  //     // if (type.match(/key/)) evt.preventDefault();
  //     this.div.style.backgroundColor = 'yellow';

  //     // change lang
  //     if (code.match(/ShiftLeft/)) this.shiftKey = true;
  //     if (code.match(/ShiftRight/)) this.shiftKey = true;
  //     if (code.match(/AltLeft/)) this.altKey = true;

  //     if (code.match(/ShiftLeft/) && this.altKey) this.changeLanguage();
  //     if (code.match(/AltLeft/) && this.shiftKey) this.changeLanguage();

  //     // caps press
  //     if (code.match(/Caps/) && !this.isCaps) {
  //       this.capsKey = true;
  //       this.isCaps = true;
  //     } else if (code.match(/Caps/) && this.isCaps) {
  //       this.isCaps = false;
  //       // this.switchUpperCase(false);
  //       // keyObj.divContainer.classList.remove('active');
  //       this.div.style.backgroundColor = 'black';
  //     }
  //     if (!this.isCaps) {
  //       this.printToTextArea(this, this.shiftKey ? this.shift : this.small);
  //     } else if (this.isCaps) {
  //       if (this.shiftKey) {
  //         this.printToTextArea(this, this.subElem.innerHTML ? this.shift : this.small);
  //       } else {
  //         this.printToTextArea(this, !this.subElem.innerHTML ? this.shift : this.small);
  //       }
  //     } else if (type.match(/keyup|mouseup/)) {
  //       // console.log(keyElemObj);
  //       if (code.match(/ShiftLeft/)) this.shiftKey = false;
  //       if (code.match(/AltLeft/)) this.altKey = false;
  //       keyElemObj.div.style.backgroundColor = 'black';
  //     }
  //   }
  // };
}
export { Key };
