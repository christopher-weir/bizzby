'use strict';


function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}


describe('Bizzby Search', function() {


    describe('Util', function(){

        importTest('Config', './test-utils/config');

        importTest('Create Quick Links', './test-utils/create-quick-links');

        importTest('Create Suggested Links', './test-utils/create-suggested-links');

    });



});
