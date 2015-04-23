var app = angular.module('appSuiviProtocoles', ['baseSites', 'baseObservations', 'baseTaxons', 'biometrie', 'suiviProtocoleServices', 'FormDirectives', 'DisplayDirectives', 'angucomplete', 'ui.bootstrap', 'darthwade.loading']);

// module de gestion des sites
angular.module('baseSites', ['suiviProtocoleServices', 'ngRoute', 'ngTable']);

// module de gestion des observations
angular.module('baseObservations', ['suiviProtocoleServices', 'ngRoute', 'ngTable']);

// module de gestion des taxons
angular.module('baseTaxons', ['suiviProtocoleServices', 'ngRoute', 'ngTable']);

// module de gestion des biometries
angular.module('biometrie', ['suiviProtocoleServices', 'ngRoute']);

// services de l'application
angular.module('suiviProtocoleServices', []);

// directives formulaires
angular.module('FormDirectives', ['angularFileUpload']);

// directives affichage
angular.module('DisplayDirectives', []);


/*
 * Configuration des routes
 */
app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            controller: 'baseController',
            templateUrl: 'js/templates/index.htm'
        })
        .otherwise({redirectTo: '/'});
});


/*
 * Controleur de base
 * TODO authentification
 */
app.controller('baseController', function($scope, dataServ, configServ, mapService, userMessages){
    $scope._appName = 'chiro';
    $scope.success = function(resp){
        $scope.data = resp;
        configServ.put('debug', true);
        //userMessages.infoMessage = "bienvenue !";
    };
    dataServ.get('config/apps', $scope.success);
});

