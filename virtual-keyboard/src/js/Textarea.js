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
    this.textOutput.focus;
    // console.log(symvol);
    console.log(keyElemObj.code);
    // console.log(keyElemObj.small);
    let cursorPosition = this.textOutput.selectionStart;
    const start = this.textOutput.value.slice(0, cursorPosition);
    const end = this.textOutput.value.slice(cursorPosition);

    if (!keyElemObj.isFnKey) {
      cursorPosition += 1;
      this.textOutput.value = `${start}${symvol}${end}`;
    } else {
      if (keyElemObj.code == 'Tab') {
        this.textOutput.value = `${start}\t${end}`;
        cursorPosition += 1;
      } else if (keyElemObj.code == 'ArrowLeft') {
        console.log('111');
        cursorPosition = cursorPosition - 1 >= 0 ? cursorPosition - 1 : 0;
      } else if (keyElemObj.code == 'ArrowRight') {
        cursorPosition = cursorPosition += 1;
      } else if (keyElemObj.code == 'Enter') {
        this.textOutput.value = `${start}\n${end}`;
        cursorPosition += 1;
      } else if (keyElemObj.code == 'Backspace') {
        this.textOutput.value = `${start.slice(0, -1)}${end}`;
        cursorPosition -= 1;
      }
    }
  };
}
export { Texarea };
