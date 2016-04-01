'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var Search = require('./classes/search.js');



if ( document.getElementById('search-wrap') ) {
    ReactDOM.render(<Search />, document.getElementById('search-wrap'));
}
