# jse-eval-vue

A webapp for testing and sharing javascript expressions made with vue3 components.

See [demo](https://mattsouth.github.io/jse-eval-vue/).

## Requirements

The main purpose of this tool is to show an evaluation table of all combinations of 
sample variable values including null (which can be counter intuitive). 

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

- [ ] sortable EvaluationTable
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

