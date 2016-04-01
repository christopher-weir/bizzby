'use strict';
/*jshint -W079 */

var config      = require('../../src/components/search/classes/utils/config.js');
var expect      = require('chai').expect;

it('KeyCodes should have the correct properties', function(){

    expect( config.keyCodes )
        .to.have.property('ENTER')
        .and.equal(13);


    expect( config.keyCodes )
        .to.have.property('ESCAPE')
        .and.equal(27);


    expect( config.keyCodes )
        .to.have.property('UP')
        .and.equal(38);


    expect( config.keyCodes )
        .to.have.property('DOWN')
        .and.equal(40);

});
