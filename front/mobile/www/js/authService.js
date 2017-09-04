(function () {
    'use strict';

    angular
        .module('bsoApp')
        .factory('authService', Service);

    function Service($http, $localStorage, $window) {
        var service = {};
        var api = '/admin/';
        var domain = 'http://localhost:8080';
        service.Login = Login;
        service.Logout = Logout;

        return service;

        function Login(credentials, callback) {
            if(credentials.code) api = domain+'/api/judges/authenticate';
            if(credentials.username && credentials.password) api = domain + '/admin/authenticate';
            $http.post(api, credentials)
                .then(function (response) {
                    console.log("response",response);
                    // login successful if there's a token in the response
                    console.log("response.data.token", response.data.token);
                    if (response.data.token) {
                        // store username and token in local storage to keep user logged in between page refreshes
                        if(credentials.code)
                        $localStorage.currentUser = { judge: response.data.judge, token: response.data.token };
                        if(credentials.username && credentials.password)
                        $localStorage.currentUser = { username: response.data.user.username, token: response.data.token };
                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = response.data.token;
                        //console.log("Authorization header: ", $http.defaults.headers.common.Authorization);

                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                },
                function(error){
                    console.log("login error:",error);
                });
        }

        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
            //$window.location.reload();
        }
    }
})();
