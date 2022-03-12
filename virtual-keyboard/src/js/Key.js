import { create } from './util/create';

class Key {
  constructor({ small, shift, code }) {
    this.code = code;
    this.shift = shift;
    this.small = small;
    // fn keys
    this.isFnKey = Boolean(small.match(/Enter|Ctrl|arr|Del|Caps|Win|Alt|Tab|Back/));

    if (this.shift && this.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      this.subEl = create('div', 'sub', this.shift);
    } else {
      // no sub
      this.subEl = create('div', 'sub', ''); // html element
    }

    this.symvol = create('div', 'symvol', small); // html element
    this.div = create('div', 'keyboard__key', [this.subEl, this.symvol], null, ['code', this.code]);
  }
}
export { Key };
