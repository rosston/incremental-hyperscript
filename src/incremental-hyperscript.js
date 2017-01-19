import {
  attr,
  elementClose,
  elementOpenEnd,
  elementOpenStart,
  text
} from 'incremental-dom'

function forEachChildInArgs (args, iteratee) {
  if (args.length > 2) {
    for (var i = 2; i < args.length; i++) {
      iteratee(args[i])
    }
  }
}

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

export function h (tag, props, children) {
  var outerArgs = arguments

  switch (typeof tag) {
    case 'string':
      return function hRender () {
        elementOpenStart(tag)

        for (var propName in props) {
          if (hasOwnProperty(props, propName)) {
            attr(propName, props[propName])
          }
        }

        elementOpenEnd()

        if (Array.isArray(children)) {
          children.forEach(renderChild)
        } else {
          forEachChildInArgs(outerArgs, renderChild)
        }

        elementClose(tag)
      }
    case 'function':
      var childrenArray
      if (Array.isArray(children)) {
        childrenArray = children
      } else {
        childrenArray = []
        forEachChildInArgs(outerArgs, function (child) {
          childrenArray.push(child)
        })
      }
      return tag(props, childrenArray)
  }
}
