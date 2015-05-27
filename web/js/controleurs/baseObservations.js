var app = angular.module('baseObservations');


/*
 * configuration des routes
 */
app.config(function($routeProvider){
    $routeProvider
        .when('/:appName/observation', {
            controller: 'observationListController',
            templateUrl: 'js/views/observation/list.htm'
        })
        .when('/:appName/observation/site/:id', {
            controller: 'observationSiteListController',
            templateUrl: 'js/views/observation/list.htm'
        })
        .when('/:appName/edit/observation', {
            controller: 'observationEditController',
            templateUrl: 'js/views/observation/edit.htm'
        })
        .when('/:appName/edit/observation/site/:site_id', {
            controller: 'observationEditController',
            templateUrl: 'js/views/observation/edit.htm'
        })
        .when('/:appName/edit/observation/:id', {
            controller: 'observationEditController',
            templateUrl: 'js/views/observation/edit.htm'
        })
        .when('/:appName/observation/:id', {
            controller: 'observationDetailController',
            templateUrl: 'js/views/observation/detail.htm'
        });

});


app.controller('observationListController', function($scope, $rootScope, $routeParams, $filter, dataServ, mapService, configServ, userMessages, $loading, ngTableParams, userServ, $q){
    $scope._appName = $routeParams.appName;
    $rootScope._function='observation';


    var data = [];
    $scope._appName = $routeParams.appName;
    $scope.createAccess = userServ.checkLevel(2);
    $scope.editAccess = userServ.checkLevel(3);
    $scope.data = [];
    configServ.addBc(0, 'Observations', '#/' + $scope._appName + '/observation'); 

    
    /*
     * Spinner
     * */
    
    $loading.start('spinner-1');
    var dfd = $q.defer();
    var promise = dfd.promise;
    promise.then(function(result) {
        $loading.finish('spinner-1');
    });
    
    $scope.setData = function(resp){
        var tmp = [];
        $scope.items = resp;
        resp.forEach(function(item){
            tmp.push(item);
            geom = item.geom;
            mapService.addGeom({
                    type: 'Feature',
                    geometry: geom,
                    properties: item
            });
        });
        $scope.geoms = resp;
        $scope.data = tmp;
        dfd.resolve('loading data');
    };

    $scope.setSchema = function(schema){
        $scope.schema = schema;
        mapService.initialize().then(function(){

            /*
             * initialisation des listeners d'évenements carte 
             */

            // click sur la carte
            $scope.$on('mapService:itemClick', function(ev, item){
                mapService.selectItem(item.feature.properties.id);
                $rootScope.$broadcast('chiro/observation:select', item.feature.properties);
            });

            // sélection dans la liste
            $scope.$on('chiro/observation:ngTable:ItemSelected', function(ev, item){
                var geom = mapService.selectItem(item.id);
                geom.openPopup();
            });

            // filtrage de la liste
            $scope.$on('chiro/observation:ngTable:Filtered', function(ev, data){
                ids = [];
                data.forEach(function(item){
                    ids.push(item.id);
                });
                mapService.filterData(ids);
            });


            dataServ.get($scope._appName + '/observation', $scope.setData);
        });
    };

    configServ.getUrl($scope._appName + '/config/observation/list', $scope.setSchema);
    

});

app.controller('observationSiteListController', function($scope, $routeParams){
    $scope._appName = $routeParams.appName;
});

app.controller('observationEditController', function($scope, $rootScope, $routeParams, $location, configServ, dataServ, userMessages){
    $rootScope.$broadcast('map:show');
    $scope._appName = $routeParams.appName;
    $scope.configUrl = $scope._appName + '/config/observation/form';
    if($routeParams.id){
        $scope.saveUrl = $scope._appName + '/observation/' + $routeParams.id;
        $scope.dataUrl = $scope._appName + '/observation/' + $routeParams.id;
        $scope.data = {};
    }
    else{
        $scope.saveUrl = $scope._appName + '/observation';
        $scope.data = {siteId: $routeParams.site_id};
    }

    $scope.$on('form:init', function(ev, data){
        if(data.obsDate){
            $scope.title = "Modification de l'observation du " + data.obsDate.replace(/(\w+)-(\w+)-(\w+)/, '$3/$2/$1');
            // breadcrumbs
            configServ.addBc(2, data.obsDate.replace(/(\w+)-(\w+)-(\w+)/, '$3/$2/$1'), '#/' + $scope._appName + '/observation/' + data.id);
            configServ.addBc(3, $scope.title, '');
        }
        else{
            $scope.title = 'Nouvelle observation';
            configServ.addBc(3, $scope.title, '');
        }
    });

    $scope.$on('form:create', function(ev, data){
        userMessages.infoMessage = "l'observation n° " + data.id + " du " + data.obsDate + ' a été créée avec succès.'
        $location.url($scope._appName + '/observation/' + data.id);
    });

    $scope.$on('form:update', function(ev, data){
        userMessages.infoMessage = "l'observation n° " + data.id + " du " + data.obsDate + ' a été mise à jour avec succès.'
        $location.url($scope._appName + '/observation/' + data.id);
    });

    $scope.$on('form:delete', function(ev, data){
        userMessages.infoMessage = "l'observation n° " + data.id + " du " + data.obsDate + " n'a jamais eu lieu. Non. Jamais.";
        dataServ.forceReload = true;
        $location.url($scope._appName + '/site/' + data.siteId);
    });
});

app.controller('observationDetailController', function($scope, $rootScope, $routeParams, dataServ, configServ){
    $scope._appName = $routeParams.appName;

    $rootScope.$broadcast('map:show');

    $scope.schemaUrl = $scope._appName + '/config/observation/detail';
    $scope.dataUrl = $scope._appName + '/observation/' + $routeParams.id;
    $scope.updateUrl = '#/' + $scope._appName + '/edit/observation/' + $routeParams.id;
    $scope.dataId = $routeParams.id;

    $scope.$on('display:init', function(ev, data){
        configServ.addBc(2, data.obsDate.replace(/(\w+)-(\w+)-(\w+)/, '$3/$2/$1'), '#/' + $scope._appName + '/observation/' + data.id);
        $scope.title = "Observation du " + data.obsDate.replace(/(\d+)-(\d+)-(\d+)/, '$3/$2/$1');
    });

});


/*
app.controller('observationSiteEditController', function($scope, $routeParams, $location, configServ, dataServ){
    $scope._appName = $routeParams.appName;

    $scope.setSchema = function(resp){
        $scope.schema = angular.copy(resp);
        $scope.setData({});
    };
    

    $scope.setData = function(resp){
        $scope.data = angular.copy(resp);


        angular.forEach($scope.schema.formObs, function(value){
            $scope.data[value.name] = value.default || null;
        }, $scope);
        $scope.data.siteId = $routeParams.id;
        $scope.data.observateurs = [null];
        dataServ.get($scope._appName + '/site/' + $routeParams.id, $scope.setSite);
    };

    $scope.setSite = function(resp){
        $scope.site = resp;
    };

    $scope.save = function(){
        dataServ.put($scope._appName + '/observation', $scope.data, function(resp){
            dataServ.forceReload = true;
            $location.path($scope._appName + '/observation/' + resp.id);

        }, function(resp, status){
            $scope.errors = resp;
        });
    };

    $scope.remove = function(){

    };

    configServ.getUrl($scope._appName + '/obsConfig', $scope.setSchema);

});
*/
