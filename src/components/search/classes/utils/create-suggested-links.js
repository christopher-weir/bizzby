'use strict';


module.exports = function( _items, _query ){
    var i = 0;

    var quickLinks = [];

    quickLinks = _items.filter(function(o) {

        var match = null;
        var val = o.title.toLowerCase().trim();

        // basic partial match comparision
        // also limit to the first 5
        if (val.indexOf(_query) > -1 && i < 5) {
            i++;
            match = o;
        }

        return match;
    });

    return quickLinks;
};
