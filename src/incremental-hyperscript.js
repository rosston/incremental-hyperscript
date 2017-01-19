import {
  attr,
  elementClose,
  elementOpenEnd,
  elementOpenStart,
  text
} from 'incremental-dom'

function hasOwnProperty (anObject, prop) {
  return Object.prototype.hasOwnProperty.call(anObject, prop)
}

function renderChild (child) {
  switch (typeof child) {
    case 'string':
      text(child)
      break
    case 'function':
      child()
      break
  }
}

export function h (tagName, props, children) {
  var outerArgs = arguments

  return function hRender () {
    elementOpenStart(tagName)

    for (var propName in props) {
      if (hasOwnProperty(props, propName)) {
        attr(propName, props[propName])
      }
    }

    elementOpenEnd()

    if (Array.isArray(children)) {
      children.forEach(renderChild)
    } else if (outerArgs.length > 2) {
      for (var i = 2; i < outerArgs.length; i++) {
        renderChild(outerArgs[i])
      }
    }

    elementClose(tagName)
  }
}
