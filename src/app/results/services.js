'use strict';

function resultsService($q, $location, globalSettings, treksService, contentsService, eventsService, filtersService) {

    var self = this;

    this.getAllResults = function () {
        var deferred = $q.defer(),
            promises = [],
            results = [];

        if (this._results) {
            deferred.resolve(this._results);
        }

        if (globalSettings.ENABLE_TREKS) {
            promises.push(
                treksService.getTreks()
                    .then(
                        function (treks) {
                            _.forEach(treks.features, function (trek) {
                                if (trek.properties.published) {
                                    results.push(trek);
                                }
                            });
                        }
                    )
            );
        }

        if (globalSettings.ENABLE_TOURISTIC_CONTENT) {
            promises.push(
                contentsService.getContents()
                    .then(
                        function (contents) {
                            _.forEach(contents.features, function (content) {
                                if (content.properties.published) {
                                    results.push(content);
                                }
                            });
                        }
                    )
            );
        }

        if (globalSettings.ENABLE_TOURISTIC_EVENTS) {
            promises.push(
                eventsService.getEvents()
                    .then(
                        function (trEvents) {
                            _.forEach(trEvents.features, function (trEvent) {
                                if (trEvent.properties.published) {
                                    results.push(trEvent);
                                }
                            });
                        }
                    )

            );
        }

        $q.all(promises)
            .then(
                function () {
                    self._results = results;
                    deferred.resolve(results);
                }
            );

        return deferred.promise;
    };

    this.getAResult = function (elementSlug) {
        var deferred = $q.defer();

        if (globalSettings.ENABLE_TREKS) {
            treksService.getTreks()
                .then(
                    function (treks) {
                        _.forEach(treks.features, function (trek) {
                            if (trek.properties.slug === elementSlug && trek.properties.published) {
                                deferred.resolve(trek);
                            }
                        });
                    }
                );
        }

        if (globalSettings.ENABLE_TOURISTIC_CONTENT) {

            contentsService.getContents()
                .then(
                    function (contents) {
                        _.forEach(contents.features, function (content) {
                            if (content.properties.slug === elementSlug && content.properties.published) {
                                deferred.resolve(content);
                            }
                        });
                    }
                );
        }

        if (globalSettings.ENABLE_TOURISTIC_EVENTS) {
            eventsService.getEvents()
                .then(
                    function (trEvents) {
                        _.forEach(trEvents.features, function (trEvent) {
                            if (trEvent.properties.slug === elementSlug && trEvent.properties.published) {
                                deferred.resolve(trEvent);
                            }
                        });
                    }
                );

        }

        return deferred.promise;
    };

    this.getFilteredResults = function () {
        var deferred = $q.defer(),
            filters = $location.search();

        if (!this._results) {
            self.getAllResults()
                .then(
                    function (results) {
                        self.filteredResults = [];
                        _.forEach(results, function (result) {
                            if (filtersService.filterElement(result, filters)) {
                                self.filteredResults.push(result);
                            }
                        });
                        deferred.resolve(self.filteredResults);
                    }
                );
        } else {
            self.filteredResults = [];
            _.forEach(self._results, function (result) {
                if (filtersService.filterElement(result, filters)) {
                    self.filteredResults.push(result);
                }
            });
            deferred.resolve(self.filteredResults);
        }

        return deferred.promise;
    };
}

module.exports = {
    resultsService: resultsService
};