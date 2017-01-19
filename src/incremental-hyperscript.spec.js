/* eslint-env mocha */

import {expect} from 'chai'
import {patch} from 'incremental-dom'
import {h} from './incremental-hyperscript'

describe('h()', function () {
  let container

  beforeEach(function () {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(function () {
    document.body.removeChild(container)
  })

  it('should be a function', function () {
    expect(h).to.be.a('function')
  })

  it('should return a function', function () {
    expect(h('div')).to.be.a('function')
  })

  it('should support simple components', function () {
    function SpecialContainer (child) {
      return h(
        'section',
        {id: 'special-container'},
        child
      )
    }
    function Button (buttonText) {
      return h(
        'button',
        {id: 'regular-button'},
        buttonText
      )
    }
    function render () {
      return h(
        'div',
        null,
        SpecialContainer(
          Button('zort')
        )
      )
    }

    patch(container, render())

    var el = container.childNodes[0]
    var childEl = el.childNodes[0]
    var descendentEl = childEl.childNodes[0]

    expect(el.tagName).to.equal('DIV')

    expect(childEl.tagName).to.equal('SECTION')
    expect(childEl.getAttribute('id')).to.equal('special-container')

    expect(descendentEl.tagName).to.equal('BUTTON')
    expect(descendentEl.getAttribute('id')).to.equal('regular-button')
    expect(descendentEl.textContent).to.equal('zort')
  })

  it('should support passing a component as tag', function () {
    function SpecialContainer (props, children) {
      return h(
        'section',
        {id: 'special-container', class: props['class']},
        children
      )
    }
    function Button (props, children) {
      return h(
        'button',
        {id: 'regular-button'},
        props.text
      )
    }
    function render () {
      return h(
        'div',
        null,
        h(
          SpecialContainer,
          {class: 'my-best-special-container'},
          h(
            Button,
            {text: 'zort'}
          )
        )
      )
    }

    patch(container, render())

    var el = container.childNodes[0]
    var childEl = el.childNodes[0]
    var descendentEl = childEl.childNodes[0]

    expect(el.tagName).to.equal('DIV')

    expect(childEl.tagName).to.equal('SECTION')
    expect(childEl.getAttribute('id')).to.equal('special-container')
    expect(childEl.getAttribute('class')).to.equal('my-best-special-container')

    expect(descendentEl.tagName).to.equal('BUTTON')
    expect(descendentEl.getAttribute('id')).to.equal('regular-button')
    expect(descendentEl.textContent).to.equal('zort')
  })

  it('should support passing multiple children when providing a component as tag', function () {
    function SpecialContainer (props, children) {
      return h(
        'section',
        {id: 'special-container', class: props['class']},
        children
      )
    }
    function AnotherContainer (props, children) {
      return h(
        'section',
        {id: 'another-container'},
        children
      )
    }
    function Button (props, children) {
      return h(
        'button',
        {id: 'regular-button'},
        props.text
      )
    }
    function render () {
      return h(
        'div',
        null,
        h(
          SpecialContainer,
          {class: 'my-best-special-container'},
          h(
            AnotherContainer,
            null,
            [
              h(
                'div',
                null,
                'poit'
              ),
              h(
                'div',
                null,
                'troz'
              )
            ]
          ),
          h(
            Button,
            {text: 'zort'}
          )
        )
      )
    }

    patch(container, render())

    var el = container.childNodes[0]
    var specialContainer = el.childNodes[0]
    var anotherContainer = specialContainer.childNodes[0]
    var poit = anotherContainer.childNodes[0]
    var troz = anotherContainer.childNodes[1]
    var button = specialContainer.childNodes[1]

    expect(el.tagName).to.equal('DIV')

    expect(specialContainer.tagName).to.equal('SECTION')
    expect(specialContainer.getAttribute('id')).to.equal('special-container')
    expect(specialContainer.getAttribute('class')).to.equal('my-best-special-container')

    expect(anotherContainer.tagName).to.equal('SECTION')
    expect(anotherContainer.getAttribute('id')).to.equal('another-container')

    expect(poit.tagName).to.equal('DIV')
    expect(poit.textContent).to.equal('poit')

    expect(troz.tagName).to.equal('DIV')
    expect(troz.textContent).to.equal('troz')

    expect(button.tagName).to.equal('BUTTON')
    expect(button.getAttribute('id')).to.equal('regular-button')
    expect(button.textContent).to.equal('zort')
  })

  describe('returned function', function () {
    it('should render a void element', function () {
      patch(container, h('input'))

      var el = container.childNodes[0]

      expect(el.tagName).to.equal('INPUT')
    })

    it('should render an element with attributes', function () {
      function render () {
        return h('input', {type: 'number', 'data-foo': 'foo'})
      }
      patch(container, render())

      var el = container.childNodes[0]
      expect(el.getAttribute('type')).to.equal('number')
      expect(el.getAttribute('data-foo')).to.equal('foo')
    })

    it('should not render prototype values on provided attributes object', function () {
      function Classy () {
        this.type = 'number'
      }
      Classy.prototype['data-prototype-value'] = 'bad-value'

      var render = function () {
        return h('input', new Classy())
      }
      patch(container, render())

      var el = container.childNodes[0]
      expect(el.getAttribute('type')).to.equal('number')
      expect(el.getAttribute('data-prototype-value')).to.be.null
    })

    it('should render attributes when their value is falsy', function () {
      function render () {
        return h('input', {
          type: 'number',
          'data-foo': false,
          'data-bar': 0
        })
      }
      patch(container, render())

      var el = container.childNodes[0]
      expect(el.getAttribute('data-foo')).to.equal('false')
      expect(el.getAttribute('data-bar')).to.equal('0')
    })

    it('should not render attributes when their value is undefined or null', function () {
      function render () {
        return h('input', {
          type: 'number',
          'data-foo': undefined,
          'data-bar': null
        })
      }
      patch(container, render())

      var el = container.childNodes[0]
      expect(el.getAttribute('data-foo')).to.be.null
      expect(el.getAttribute('data-bar')).to.be.null
    })

    it('should update attributes on an element', function () {
      function render (fooVal, shouldRenderBarVal) {
        var barVal = (shouldRenderBarVal) ? 'baz' : undefined
        return h('input', {
          type: 'number',
          'data-foo': fooVal,
          'data-bar': barVal
        })
      }
      patch(container, render('foo', true))

      var el = container.childNodes[0]

      expect(el.getAttribute('type')).to.equal('number')
      expect(el.getAttribute('data-foo')).to.equal('foo')
      expect(el.getAttribute('data-bar')).to.equal('baz')

      patch(container, render('bar', false))

      expect(el.getAttribute('type')).to.equal('number')
      expect(el.getAttribute('data-foo')).to.equal('bar')
      expect(el.getAttribute('data-bar')).to.be.null
    })

    it('should set properties on an element', function () {
      function render (fooVal, barValReturn) {
        function barVal () {
          return barValReturn
        }

        return h('input', {
          type: 'number',
          'foo': fooVal,
          'bar': barVal
        })
      }
      patch(container, render({baz: 'qux'}, 'poit'))

      var el = container.childNodes[0]

      expect(el.foo).to.deep.equal({baz: 'qux'})
      expect(el.bar).to.be.a('function')
      expect(el.bar()).to.equal('poit')

      patch(container, render({qux: 'norf'}, 'troz'))

      expect(el.foo).to.deep.equal({qux: 'norf'})
      expect(el.bar()).to.equal('troz')
    })

    it('should render text child of an element', function () {
      function render () {
        return h('div', null, 'foobarbaz')
      }

      patch(container, render())

      var el = container.childNodes[0]

      expect(el.textContent).to.equal('foobarbaz')
    })

    it('should render child element of an element', function () {
      function render () {
        return h(
          'div',
          null,
          h('h1', {id: 'foo'}, 'Title Foo')
        )
      }

      patch(container, render())

      var el = container.childNodes[0]
      var childEl = el.childNodes[0]

      expect(el.tagName).to.equal('DIV')
      expect(childEl.tagName).to.equal('H1')
      expect(childEl.getAttribute('id')).to.equal('foo')
      expect(childEl.textContent).to.equal('Title Foo')
    })

    it('should render multiple children when an array is provided', function () {
      function render () {
        return h(
          'div',
          null,
          [
            h('h1', {id: 'foo'}, 'Title Foo'),
            h('h2', {id: 'bar'}, 'Title Bar'),
            'Some',
            'Text'
          ]
        )
      }

      patch(container, render())

      var el = container.childNodes[0]
      var childEl1 = el.childNodes[0]
      var childEl2 = el.childNodes[1]
      var childEl3 = el.childNodes[2]
      var childEl4 = el.childNodes[3]

      expect(el.tagName).to.equal('DIV')

      expect(childEl1.tagName).to.equal('H1')
      expect(childEl1.getAttribute('id')).to.equal('foo')
      expect(childEl1.textContent).to.equal('Title Foo')

      expect(childEl2.tagName).to.equal('H2')
      expect(childEl2.getAttribute('id')).to.equal('bar')
      expect(childEl2.textContent).to.equal('Title Bar')

      expect(childEl3.textContent).to.equal('Some')
      expect(childEl3).to.be.a('Text')

      expect(childEl4.textContent).to.equal('Text')
      expect(childEl4).to.be.a('Text')
    })

    it('should render multiple children when multiple child arguments are provided', function () {
      function render () {
        return h(
          'div',
          null,
          h('h1', {id: 'foo'}, 'Title Foo'),
          h('h2', {id: 'bar'}, 'Title Bar'),
          'Some',
          'Text'
        )
      }

      patch(container, render())

      var el = container.childNodes[0]
      var childEl1 = el.childNodes[0]
      var childEl2 = el.childNodes[1]
      var childEl3 = el.childNodes[2]
      var childEl4 = el.childNodes[3]

      expect(el.tagName).to.equal('DIV')

      expect(childEl1.tagName).to.equal('H1')
      expect(childEl1.getAttribute('id')).to.equal('foo')
      expect(childEl1.textContent).to.equal('Title Foo')

      expect(childEl2.tagName).to.equal('H2')
      expect(childEl2.getAttribute('id')).to.equal('bar')
      expect(childEl2.textContent).to.equal('Title Bar')

      expect(childEl3.textContent).to.equal('Some')
      expect(childEl3).to.be.a('Text')

      expect(childEl4.textContent).to.equal('Text')
      expect(childEl4).to.be.a('Text')
    })
  })
})
