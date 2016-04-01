'use strict';

var React       = require('react');
var ReactDOM    = require('react-dom');
var classNames  = require('classnames');
var axios       = require('axios');

var config                  = require('./utils/config.js');
var createQuickLinks        = require('./utils/create-quick-links.js');
var createSuggestedLinks    = require('./utils/create-suggested-links.js');

var Search;

module.exports = Search = React.createClass({

    /**
     * Set the initial state of the component
     * @method getInitialState
     */
    getInitialState: function() {
        return {
            query: '',
            highlighted_item: -1,
            categories: [],
            sub_categories: [],
            quick_links: [],
            suggestions: [],
            default_suggestions: [],
            focused: false,
            cssClasses : {
                animateIn: false,
                animateComplete: false
            }
        };
    },


    /**
     * When the component first loads get the json blob of categories
     * and sub categories
     * NOTE: this should probably be handled on change in the input and by the server
     * @method componentDidMount
     */
    componentDidMount: function() {
        var _this = this;

        this.serverRequest = axios
            .get('https://webseeker-proxy.bizzby.com/task/categories')
            .then(function(result) {

                // set the sub cats for easy search
                var subCategories = [];
                var suggestions = [];

                for (var i = 0; i < result.data.body.categories.length; i++) {
                    subCategories = subCategories.concat(result.data.body.categories[i].subcategories);

                    // set a mock 'suggestions'
                    // at the moment just use the first 5 results
                    if (i < 5) {
                        suggestions.push(result.data.body.categories[i]);
                    }
                }

                _this.setState({
                    categories: result.data.body.categories,
                    sub_categories: subCategories,
                    suggestions: suggestions,
                    default_suggestions: suggestions
                });
            });
    },


    /**
     * Clean and normalise the input for seatch
     * @method cleanInput
     * @return {String}   the cleaned input
     */
    cleanInput: function() {
        return this.state.query.toLowerCase().trim();
    },


    /**
     * Filter through the categories and sub categories
     * using the search query to offer suggestions and matches
     * NOTE: this could be written as a post to the server to handle the
     * filtering and matching thre. The post/search route was not supplied
     * @method suggest
     */
    suggest: function() {
        var searchTerm = this.cleanInput();

        var quickLinks = createQuickLinks( this.state.categories, searchTerm );
        var suggestions = createSuggestedLinks( this.state.sub_categories, searchTerm );

        this.setState({
            quick_links: quickLinks,
            suggestions: suggestions
        });
    },


    /**
     * Handle the search request
     * @method search
     * @return {[type]} [description]
     */
    search: function(){
        var _this = this;
        console.log('SEARCH FOR: ', _this.state.query);
    },


    /**
     * On each change in the input
     * @method onChange
     * @param  {Object} e The event
     */
    onChange: function(e) {
        // clear the previous timeout
        clearTimeout(this.timer);
        var _this = this;
        // get the users input
        var input = e.target.value;

        // reset the state to default and set the query
        this.setState({
            highlighted_item: -1,
            query: input
        });

        // if the input is < 3 set it to the initial state
        if (input.length < 3) {
            _this.setState({
                quick_links: [],
                suggestions: _this.state.default_suggestions
            });
            return false;
        }

        // set a timeout so the users doesnt smash the input
        this.timer = setTimeout(function() {
            return _this.suggest();
        }, this.props.delay);
    },


    /**
     * Cycle up and down through the suggestions
     * @method cycleResults
     * @param  {[type]} _key [description]
     */
    cycleResults: function( _key ){
        var _this = this;
        var item = _this.state.highlighted_item;
        var items = _this.state.suggestions;

        if( _this.state.quick_links ){
            items = _this.state.quick_links.concat( _this.state.suggestions );
        }

        var lastItem = ( items.length );

        var nextItem;

        if ( _key === config.keyCodes.UP ) {
            nextItem = (item <= 1) ? lastItem : item - 1;
        } else {
            nextItem = (item === lastItem) ? 1 : item + 1;
        }

        if( nextItem === 0 ){
            nextItem = 1;
        }

        var selected = items[ nextItem - 1 ];

        this.setState({
            highlighted_item: nextItem,
            query: ( selected.value ) ? selected.value : selected.title
        });

    },

    /**
     * Kill the form
     * @method killForm
     */
    killForm: function() {
        var _this = this;

        this.setState({
            focused: false,
            query: '',
            highlighted_item: -1,
            quick_links: [],
            suggestions: _this.state.default_suggestions,
            cssClasses: {
                animateIn: false,
                animateComplete: false
            }
        });
    },


    /**
     * Handle keyboard presses in the form
     * @method onKeyDown
     * @param  {Object} e The key event
     */
    onKeyDown: function(e) {
        var _this = this;
        var key = e.which || e.keyCode;

        switch (key) {
            case config.keyCodes.UP:
            case config.keyCodes.DOWN:
                e.preventDefault();
                _this.cycleResults(key);
                break;

            case config.keyCodes.ENTER:
                e.preventDefault();
                this.search();
                break;

            case config.keyCodes.ESCAPE:
                this.killForm();
                break;
        }
    },


    /**
     * Activate and open the search bar thing
     * @method activateSearch
     */
    activateSearch: function(){
        var _this = this;

        // set the initial open state
        this.setState({
            focused: true,
            cssClasses: {
                animateIn: true
            }
        });


        // after a slight delay focus the cursor to the input
        setTimeout(function() {
            // focus the input
            ReactDOM.findDOMNode(_this.refs.searchBar).focus();
        }, 100);


        // kill the animations
        setTimeout(function() {
            _this.setState({
                cssClasses: {
                    animateIn: false,
                    animateComplete: true
                }
            });
        }, 1000);

    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        var _this = this;
        // used for the up down index
        var itemIndex = 0;

        return (
            <div id="search-inner" className={classNames({ 'active': _this.state.focused })}>
                <a className="activeate-search"
                    onClick={ this.activateSearch }>
                </a>
                <form>
                    <div id="input-wrap">
                        <input type="text"
                            autoCorrect="off" autoCapitalize="off" autoComplete="off" spellCheck="false"
                            value={this.state.query}
                            onChange={ this.onChange }
                            onKeyDown={ this.onKeyDown }
                            ref="searchBar" />
                        <button type="reset" aria-label="Clear Search" className="reset"
                            onClick={ this.killForm }></button>
                    </div>
                </form>
                <aside className={
                        classNames(
                            {
                                'opened': _this.state.focused,
                                'animate-complete': _this.state.cssClasses.animateComplete,
                                'animate-in': _this.state.cssClasses.animateIn
                            }
                        )
                    }>

                    {(function(quickLinks) {
                        if (quickLinks.length) {

                            return (
                                <section>
                                    <h3>Quick Links</h3>
                                    <ul>

                                    {
                                        quickLinks.map(function( suggestion ) {
                                            itemIndex ++;
                                            return (
                                                <li
                                                className={classNames({
                                                  highlighted: _this.state.highlighted_item === itemIndex
                                                })}
                                                    key={ itemIndex }>
                                                    <a href={suggestion.url}>
                                                        {(function(a,b) {
                                                            // there is a difference btn the
                                                            // cat and sub cat naming
                                                            // correct this
                                                            return (a)?a:b;
                                                        })(suggestion.value, suggestion.title)}
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                                    </ul>
                                </section>
                            );
                        }
                    })(this.state.quick_links)}

                    <section>
                        <h3>Suggested Searches</h3>
                        <ul>
                            {
                                this.state.suggestions.map(function( suggestion ) {
                                    itemIndex ++;
                                    return (
                                        <li
                                        className={classNames({
                                          highlighted: _this.state.highlighted_item === itemIndex
                                        })}
                                            key={ itemIndex }>
                                            <a href={suggestion.url}>
                                                {(function(a,b) {
                                                    // there is a difference between the
                                                    // category and sub category naming
                                                    // correct this
                                                    return (a)?a:b;
                                                })(suggestion.value, suggestion.title)}
                                            </a>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </section>
                </aside>
            </div>
        );
    }
});


Search.defaultProps = {
    autoFocus: true,
    delay: 200
};
