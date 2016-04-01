'use strict';
/*jshint -W079 */

var createQuickLinks      = require('../../src/components/search/classes/utils/create-quick-links.js');
var expect      = require('chai').expect;

// set some super basic data
// NOTE: i would normally do this using live data
var testData = [
    {
        value: 'Plumbing',
        subcategories: [
            {
                title: 'Emergency Plumber'
            },
            {
                title: 'Leaks & Drips'
            },
            {
                title: 'Blocked Drains'
            },
            {
                title: 'Plumbing Installations'
            },
            {
                title: 'other'
            },
            {
                title: 'other again'
            }
        ]
    },
    {
        value: 'Gas Safe',
        subcategories: [
            {
                title: 'Emergency Plumber'
            }
        ]
    }
];

it('Should return an array', function(){

    expect( createQuickLinks( testData, 'plu' ) )
        .to.be.an('array');
});

it('Should have a length above 1', function(){

    expect( createQuickLinks( testData, 'plu' ) )
        .to.have.length.above(1);
});
