(function () {

    var bsoAdmin = angular.module('bsoAdmin', ['ui.router','ngStorage','ngMessages', 'angular-jwt','ngFileUpload']);

    bsoAdmin.config(function ($stateProvider, $urlRouterProvider) {
        /*$routeProvider
        .when('/', { templateUrl: 'admin/views/login.html', controller: 'adminloginController' })
        .when('/dashboard', { templateUrl: 'admin/views/dashboard.html', controller: 'dashboardController' })
        .otherwise({ redirectTo: "/" });
*/
        /*$stateProvider
            .state('login', {url: '/', templateUrl: 'admin/views/login.html', controller: 'adminloginController'})
            .state('dashboard', {abstract: true, url:'/dashboard' , templateUrl: 'admin/views/dashboard.html', controller: 'dashboardController'})
            .state('dashboard.nav', {templateUrl: 'admin/views/navigation.html', controller: 'dashboardController'});
            $urlRouterProvider.otherwise('/');*/
            $urlRouterProvider.otherwise("/dashboard/grades");

      $stateProvider
        .state('login', {
            url: "/",
            templateUrl: "admin/views/login.html",
            controller: 'adminloginController'
        })
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "admin/views/dashboard.html",
            controller: 'navController'
        })
        .state('dashboard.grades', {
            url: "/grades",
            templateUrl: "admin/views/grades.html",
            controller: 'dashboardController'
        })
        .state('dashboard.competitions', {
            url: "/competitions",
            templateUrl: "admin/views/competitions.html",
            controller: 'competitionsController'
        })
        .state('dashboard.projects', {
            url: "/projects",
            templateUrl: "admin/views/projects.html",
            controller: 'projectsController'
        })
        .state('dashboard.categories', {
            url: "/categories",
            templateUrl: "admin/views/categories.html",
            controller: 'categoriesController'
        })
        .state('dashboard.judges', {
            url: "/judges",
            templateUrl: "admin/views/judges.html",
            controller: 'judgesController'
        })
        .state('dashboard.criteria', {
            url: "/criteria",
            templateUrl: "admin/views/criteria.html",
            controller: 'criteriaController'
        })


    }).run(function($rootScope, $http, $location, $localStorage, jwtHelper, authService) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if ($localStorage.currentUser){
                var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser.token);
                var tokenExpired = jwtHelper.isTokenExpired($localStorage.currentUser.token);
                //console.log("token",$localStorage.currentUser.token,"tokenExpiration", tokenExpired);
                if ((restrictedPage && tokenExpired) || !tokenPayload.isAdmin) {
                    authService.Logout();
                    $location.path('/');
                }
            }else if (restrictedPage){
                $location.path('/');
            }
        });
    });




}());
