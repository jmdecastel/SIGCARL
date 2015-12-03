'use strict'

function FiliationController($scope, $rootScope, favoritesService, mapService) {
    $scope.isInFavorites = favoritesService.isInFavorites;

    $scope.hoverMarkerFiliation = function (currentPoi, state) {
        var layerEquivalent = document.querySelector('.layer-category-' + currentPoi.properties.category.id + '-' + currentPoi.id);
        if (layerEquivalent !== null) {
            if (state === 'enter') {
                if (!layerEquivalent.classList.contains('hovered')) {
                    layerEquivalent.classList.add('hovered');
                }
            } else {
                if (layerEquivalent.classList.contains('hovered')) {
                    layerEquivalent.classList.remove('hovered');
                }
            }
        }
    };

    $scope.toggleFavorites = function (currentElement) {
        var currentAction = '';
        if (favoritesService.isInFavorites(currentElement)) {
            currentAction = 'remove';
        } else {
            currentAction = 'add';
        }
        $rootScope.$broadcast('changeFavorite', {element: currentElement, action: currentAction});
    };

    $scope.mapFocusOn = function (result) {
        $rootScope.mapIsShown = true;
        mapService.centerOn(result);
    };


}

module.exports = {
    FiliationController: FiliationController
};