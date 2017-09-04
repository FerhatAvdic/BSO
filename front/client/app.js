(function () {

    var bsoApp = angular.module('bsoApp', ['ngRoute','ngStorage', 'angular-jwt','ngFileUpload', 'ngSanitize']);

    bsoApp.config(function ($routeProvider) {
        $routeProvider
        .when('/home', { templateUrl: 'client/views/home.html', controller: 'homeController' })
        .when('/projects', { templateUrl: 'client/views/projects.html', controller: 'projectsController' })
        .when('/judges', { templateUrl: 'client/views/judges.html', controller: 'judgesController' })
        .when('/competitions', { templateUrl: 'client/views/competitions.html', controller: 'competitionsController' })
        .when('/register', {templateUrl:'client/views/register.html', controller: 'registerController' })
        .when('/login', {templateUrl:'client/views/login.html', controller: 'loginController' })
        .when('/myproject', {templateUrl:'client/views/myproject.html', controller: 'myProjectController' })
        .otherwise({ redirectTo: "/home" });


    }).run(function($rootScope, $http, $location, $localStorage,jwtHelper,authService) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/','/home','/register','/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if ($localStorage.currentUser){
                var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser.token);
                var tokenExpired = jwtHelper.isTokenExpired($localStorage.currentUser.token);
                if ((restrictedPage && tokenExpired) || !tokenPayload.isProject) {
                    authService.Logout();
                    $location.path('/home');
                }
            }else if(restrictedPage){
                $location.path('/home');
            }
        });
    });




}());
