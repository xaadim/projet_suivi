var app = angular.module('biometrie');

app.config(function($routeProvider){
    $routeProvider
        .when('/:appName/biometrie/:id', {
            controller: 'biometrieDetailController',
            templateUrl: 'js/views/biometrie/detail.htm'
        })
        .when('/:appName/edit/biometrie/taxon/:otx_id', {
            controller: 'biometrieEditController',
            templateUrl: 'js/views/biometrie/edit.htm'
        })
        .when('/:appName/edit/biometrie/:id', {
            controller: 'biometrieEditController',
            templateUrl: 'js/views/biometrie/edit.htm'
        })
});

app.controller('biometrieDetailController', function($scope, $routeParams, configServ, dataServ){
    $scope._appName = $routeParams.appName;

    $scope.schemaUrl = $scope._appName + '/config/biometrie/detail';
    $scope.dataUrl = $scope._appName + '/biometrie/' + $routeParams.id;
    $scope.updateUrl = '#/' + $scope._appName + '/edit/biometrie/' + $routeParams.id;

    $scope.dataId = $routeParams.id;

    configServ.bc.splice(3, configServ.bc.length);

    $scope.$on('display:init', function(ev, data){
        $scope.title = "Biométrie n°" + data.id;
        configServ.bc.push({label: 'taxon', url: '#/' + $scope._appName + '/taxons/' + data.obsTxId});
    });

});

app.controller('biometrieEditController', function($scope, $routeParams, $location, configServ, dataServ){
    $scope._appName = $routeParams.appName;
    $scope.configUrl = $scope._appName + '/config/biometrie/form';
    if($routeParams.id){
        $scope.saveUrl = $scope._appName + '/biometrie/' + $routeParams.id;
        $scope.dataUrl = $scope._appName + '/biometrie/' + $routeParams.id;
        $scope.data = {};
    }
    else{
        $scope.saveUrl = $scope._appName + '/biometrie'
        $scope.data = {obsTxId: $routeParams.otx_id};
    }
    $scope.$on('form:init', function(ev, data){
        if($routeParams.id){
            $scope.title = "Modification de la biométrie";
            // breadcrumbs
            configServ.bc.push({label: 'biometrie', url: '#/' + $scope._appName + '/biometrie/' + $routeParams.id});
        }
        else{
            $scope.title = 'Nouvelle biométrie';
        }
    });

    $scope.$on('form:create', function(ev, data){
        //TODO msg utilisateur
        $location.url($scope._appName + '/biometrie/' + data.id);
    });

    $scope.$on('form:update', function(ev, data){
        //TODO msg utilisateur
        $location.url($scope._appName + '/biometrie/' + data.id);
    });

    $scope.$on('form:delete', function(ev, data){
        //TODO msg utilisateur
        dataServ.forceReload = true;
        $location.url($scope._appName + '/taxons/' + data.obsTxId);
    });
});
