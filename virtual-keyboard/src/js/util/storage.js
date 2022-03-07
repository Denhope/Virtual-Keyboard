const setLocalStorage = (name, value) => {
  window.localStorage.setItem(name, JSON.stringify(value));
};

const getLocalStorage = (name, value = null) => {
  JSON.parse(window.localStorage.getItem(name) || value);
};

export { setLocalStorage, getLocalStorage };
