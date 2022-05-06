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
    this.div = create('div', `keyboard__key key-${this.code}`, [this.subElem, this.symvol], null);
  }
}

export { Key };
