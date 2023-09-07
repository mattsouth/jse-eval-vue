# jse-eval-vue

A webapp for testing and sharing javascript expressions made with vue3 components.

Demos:

* [qualifier](https://mattsouth.github.io/jse-eval-vue/?expr=a%3C0%20%3F%20%22negative%22%20%3A%20((a%3D%3D0%20%7C%7C%20a%3D%3Dnull)%20%3F%20%22none%22%20%3A%20a%3E3%20%3F%20%22many%22%20%3A%20%22some%22)&context=%5B%7B%22name%22%3A%22a%22%2C%22values%22%3A%5Bnull%2C-1%2C0%2C1%2C2%2C3%2C4%5D%2C%22selected%22%3A%5B%5D%7D%5D#)
* [raw negation](https://mattsouth.github.io/jse-eval-vue/?expr=!a&context=%5B%7B%22name%22%3A%22a%22%2C%22values%22%3A%5Bnull%2Ctrue%2Cfalse%5D%2C%22selected%22%3A%5B%5D%7D%5D) - an example of why you need to consider null values in your analysis
* [fizzbuzz](https://mattsouth.github.io/jse-eval-vue/?expr=i%20%25%2015%20%3D%3D%200%20%3F%20%22fizzbuzz%22%20%3A%20(i%25%203%3D%3D0%20%3F%20%22fizz%22%20%3A%20(i%20%25%205%3D%3D0%20%3F%20%22buzz%22%20%3A%20i))&context=%5B%7B%22name%22%3A%22i%22%2C%22values%22%3A%5Bnull%2C0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%5D%2C%22selected%22%3A%5B%5D%7D%5D)

## Requirements

The main purpose of this tool is to show an evaluation table of all combinations of 
sample variable values including null (which is easy to forget testing and can be counter intuitive). 

### visual viewer

* must provide a visual tree view of an expression &#x2713;
* must map operators to more generally understood symbols &#x2713;
* must distinguish variables / constants / operators &#x2713;

### visual editor

* must allow an expression to be created with template elements to assist the user &#x2713;
* must be able to support a configurable range of javascript expression elements and gracefully handle not supporting a given expression
* must facilitate editing an expression with a minimised number of actions
* should recommend simplifications, e.g. ``a AND a`` can be replaced with ``a``

## TODO

- [ ] visual view
  - [ ] centre all text along a given line
  - [ ] handle broken line vertical spacing
  - [ ] remove extra space at top of a clause box
- [ ] visual editor
  - [ ] send focus to next available input once a template is chosen or a slot filled
  - [ ] inline binary expressions with simple clauses
  - [ ] edit literal and identifier clauses in place
  - [ ] allow delete to remove clauses from AND/OR expressions with more than two clauses

## Useful

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators

## Libraries

This work relies on the following libraries:

* [jse-eval](https://github.com/6utt3rfly/jse-eval)
* [vue](https://vuejs.org/)
* [vite](https://vitejs.dev/) (inc [eslint](https://eslint.org/) and [prettier](https://prettier.io/))
* [bootstrap](https://getbootstrap.com) (inc [icons](https://icons.getbootstrap.com/), [popperjs](https://popper.js.org/) and [sass](https://sass-lang.com/))
* [execa](https://github.com/sindresorhus/execa) - for deployment