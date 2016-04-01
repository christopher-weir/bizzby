'use strict';


/**
 * Loop through the categories and find the best match re the query
 * add the first 4 sub categories to the returned Object
 * @method function
 * @param  {Array} _items Array of the category objects
 * @param  {String} _query The current query
 * @return {Array}        An array of the compiled quick links
 */
module.exports = function( _items, _query ){

    var quickLinks = [];

    // super basic filter to find a category match
    var filtered = _items.filter(function(o) {

        var match = null;
        var val = o.value.toLowerCase().trim();

        // basic partial match comparision
        if (val.indexOf(_query) > -1) {
            match = o;
        }

        return match;
    });

    if( filtered[0] ){

        quickLinks.push( filtered[ 0 ] );

        for (var i = 0; i < filtered[ 0 ].subcategories.length; i++) {
            if( i === 4 ){ break; }
            quickLinks.push( filtered[ 0 ].subcategories[i] );
        }
    }


    return quickLinks;

};
