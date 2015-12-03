'use strict';

var controllers = require('./controllers');

function resultsListeDirective() {
    return {
        restrict: 'E',
        replace: true,
        template: require('./templates/results-liste.html'),
        controller: 'ResultsListeController'
    };
}

module.exports = {
    resultsListeDirective: resultsListeDirective
};