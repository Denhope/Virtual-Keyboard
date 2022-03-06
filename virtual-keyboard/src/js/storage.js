function setLocalStorage(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}
function getLocalStorage(name, value = null) {
  return JSON.parse(window.localStorage.getItem(name) || value);
}

export { setLocalStorage, getLocalStorage };
