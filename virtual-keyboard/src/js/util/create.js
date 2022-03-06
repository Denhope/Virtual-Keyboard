/** set interface
 * @param {String} el// div, span...
 * @param {String} classNames
 * @param {HTMLElement} children
 * @param {HTMLElement} parent
 * @param  {...array} dataAttr
 */

const create = (el, classNames, children, parent, ...dataAttr) => {
  let element = null;
  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('Unable to create element');
  }

  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }

  if (children && Array.isArray(children)) {
    children.forEach((childElement) => childElement && element.appendChild(childElement));
  } else if (children && typeof children === 'object') {
    element.appendChild(children);
  } else if (children && typeof children === 'string') {
    element.innerHTML = children;
  }

  if (parent) {
    parent.appendChild(element);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrName, '');
      }
      if (attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        // for data atrr
        element.dataset[attrName] = attrValue;
      }
    });
  }
  return element;
};

export { create };
