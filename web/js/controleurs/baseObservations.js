var app = angular.module('baseObservations');


/*
 * configuration des routes
 */
app.config(function($routeProvider){
    $routeProvider
        .when('/:appName/observation', {
            controller: 'observationListController',
            templateUrl: 'js/templates/observation/list.htm'
        })
        .when('/:appName/observation/site/:id', {
            controller: 'observationSiteListController',
            templateUrl: 'js/templates/observation/list.htm'
        })
        .when('/:appName/edit/observation', {
            controller: 'observationEditController',
            templateUrl: 'js/templates/observation/edit.htm'
        })
        .when('/:appName/edit/observation/site/:site_id', {
            controller: 'observationEditController',
            templateUrl: 'js/templates/observation/edit.htm'
        })
        .when('/:appName/edit/observation/:id', {
            controller: 'observationEditController',
            templateUrl: 'js/templates/observation/edit.htm'
        })
        .when('/:appName/observation/:id', {
            controller: 'observationDetailController',
            templateUrl: 'js/templates/observation/detail.htm'
        });

});


app.controller('observationListController', function($scope, $routeParams){
    $scope._appName = $routeParams.appName;
});

app.controller('observationSiteListController', function($scope, $routeParams){
    $scope._appName = $routeParams.appName;
});

app.controller('observationEditController', function($scope, $routeParams, $location, configServ, dataServ){
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
            $scope.title = "Modification de l'observation du " + data.obsDate;
        }
        else{
            $scope.title = 'Nouvelle observation';
        }
    });

    $scope.$on('form:create', function(ev, data){
        //TODO msg utilisateur
        $location.url($scope._appName + '/observation/' + data.id);
    });

    $scope.$on('form:update', function(ev, data){
        //TODO msg utilisateur
        $location.url($scope._appName + '/observation/' + data.id);
    });

});


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

app.controller('observationDetailController', function($scope, $routeParams, dataServ, configServ){
    $scope._appName = $routeParams.appName;

    $scope.schemaUrl = $scope._appName + '/config/observation/detail';
    $scope.dataUrl = $scope._appName + '/observation/' + $routeParams.id;
    $scope.updateUrl = '#/' + $scope._appName + '/edit/observation/' + $routeParams.id;
    $scope.dataId = $routeParams.id;

});
