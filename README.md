# incremental-hyperscript

> A [hyperscript](https://github.com/dominictarr/hyperscript)-like interface for [Incremental DOM](https://github.com/google/incremental-dom)

## Usage

Use `h` to create render functions, and call them within `patch`:

```js
var h = require('incremental-hyperscript')
var patch = require('incremental-dom').patch

function render(data) {
    var text = (data.shouldSpeakToUniverse) ? 'Hello universe!' : 'Hello world!'
    return h('div', {style: {color: 'red'}}, text)
}

var someData = {shouldSpeakToUniverse: false}
patch(myElement, render(someData))

var otherData = {shouldSpeakToUniverse: true}
patch(myElement, render(otherData))
```

## API

### `h(tagName, [properties], [children])`

* `tagName` (required) - A string representing a tag name (e.g., `span`).
* `properties` (optional) - An object specifying properties (and their
  corresponding values) to be set on the element.
* `children` (optional) - A string, function, or array (of strings and/or
  functions). If a string, a single text node child will be rendered. If
  a function, a single child element (created and returned by the function)
  will be rendered. If an array, several children (either text node or
  elements) will be rendered.

Returns a render function to be called within `patch`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install --save incremental-hyperscript incremental-dom
```

## Acknowledgments

incremental-hyperscript was inspired by
[hyperscript](https://github.com/dominictarr/hyperscript),
[virtual-dom](https://github.com/Matt-Esch/virtual-dom), and
[React](https://facebook.github.io/react/).

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)

## License

Apache-2.0

