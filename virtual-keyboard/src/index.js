/* eslint-disable import/named */
import { getLocalStorage } from './js/util/storage';
import { rowsLayout } from './js/rowsKeyboard';
import { Keyboard } from './js/Keyboard';

const lang = getLocalStorage('lang', '"en"');

new Keyboard(rowsLayout).initialize(lang).createLayout();
