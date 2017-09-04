(function () {

    var bsoApp = angular.module('bsoApp', ['ionic', 'ngStorage', 'angular-jwt'])

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })

    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
      // setup an abstract state for the tabs directive
        .state('index', {
        url: '/',
        abstract: true,
        templateUrl: 'index.html'
      })
      // Each tab has its own nav history stack:
      .state('welcome', {
        url: '/',
        templateUrl: 'templates/welcome.html',
        controller: 'welcomeController'
      })
      .state('adminlogin', {
        url: '/admin/login',
        templateUrl: 'templates/adminlogin.html',
        controller: 'loginController'
      })
      .state('judgelogin', {
        url: '/judge/login',
        templateUrl: 'templates/judgelogin.html',
        controller: 'loginController'
      })
      .state('adminpanel', {
        url: '/admin/panel',
        templateUrl: 'templates/adminpanel.html',
        controller: 'adminController'
      })
      .state('judgepanel', {
        url: '/judge/panel',
        templateUrl: 'templates/judgepanel.html',
        controller: 'judgeController'
      })
      .state('evaluation', {
        url: '/judge/panel/:project_id',
        templateUrl: 'templates/projectevaluation.html',
        controller: 'evaluationController'
      })
      .state('guide', {
        url: '/judge/guide',
        templateUrl: 'templates/judgeguide.html',
        controller: 'judgeController'
      })
      .state('adminprojects', {
        url: '/admin/projects',
        templateUrl: 'templates/adminprojects.html',
        controller: 'projectsController'
      })
      .state('adminpviewroject', {
        url: '/admin/projects/:project_id',
        templateUrl: 'templates/adminviewproject.html',
        controller: 'projectsController'
      })

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/');

    }).run(function($rootScope, $http, $location, $localStorage, jwtHelper, authService) {
    // keep user logged in after page refresh
    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/','/admin/login','/judge/login'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        console.log("currentUser", $localStorage.currentUser);
        if ($localStorage.currentUser){
            var tokenPayload = jwtHelper.decodeToken($localStorage.currentUser.token);
            var tokenExpired = jwtHelper.isTokenExpired($localStorage.currentUser.token);
            if ((restrictedPage && tokenExpired) || (!tokenPayload.isJudge && !tokenPayload.isAdmin)) {
                authService.Logout();
                $location.path('/');
            }
        }else if(restrictedPage){
            $location.path('/');
        }
    });
});
}());
