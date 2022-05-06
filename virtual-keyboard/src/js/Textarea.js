import { create } from './util/create';
class Texarea {
  constructor(parent) {
    this.textOutput = create(
      'textarea',
      'text-output',
      null,
      parent,
      ['placeholder', 'Please type anything'],
      ['rows', 5],
      ['cols', 60],
      ['autocorect', 'off'],
    );
  }

  printToTextArea = (keyElemObj, symvol) => {
    // console.log(symvol);
    // console.log(keyElemObj.code);
    // console.log(keyElemObj.small);
    let cursorPosition = this.textOutput.selectionStart;
    const start = this.textOutput.value.slice(0, cursorPosition);
    const end = this.textOutput.value.slice(cursorPosition);

    if (!keyElemObj.isFnKey) {
      cursorPosition += 1;
      this.textOutput.value = `${start}${symvol}${end}`;
    }
  };
}
export { Texarea };
