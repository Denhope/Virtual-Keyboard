/** set interface
 * @param {String} tagName// div, span...
 * @param {String} classNames
 * @param {HTMLElement} children
 * @param {HTMLElement} parentNode
 * @param  {...array} dataAttr
 */

const create = (tagName, classNames, children, parentNode, ...dataAttr) => {
  let element = null;
  try {
    element = document.createElement(tagName);
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

  if (parentNode) {
    parentNode.appendChild(element);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrName, '');
      }
      if (attrName.match(/value|id|placeholder|cols|rows|autocorrect/)) {
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
