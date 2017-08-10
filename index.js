const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const {
  App,
  Update,
  Init,
  createActionInit,
  createActionSearchChanged,
  createActionClearSearch,
  createActionShowMore,
  Dispatch,
  Consume,
  isEmpty
} = require('./app');
const companies = require('./company');

let queue = [createActionInit()];
let currentState = Init(companies);

const dispatch = Dispatch(queue);
const consume = Consume(queue);
const isQueueEmpty = isEmpty(queue);

function Loop() {
  if (!isQueueEmpty()) {
    const message = consume();
    currentState = Update(currentState, message);
    ReactDOM.render(e(App, {state: currentState, dispatch}, null), document.querySelector('body'));
  }
  requestAnimationFrame(Loop);
}

Loop();
