const React = require('react');
const ReactDOM = require('react-dom');
const e = React.createElement;
const {App} = require('./app');

ReactDOM.render(e(App, {}, null), document.querySelector('body'));
