angular.module('JWTDemoApp')
// Creating the Angular Controller
.controller('LoginController', function($http, $scope, $state, AuthService, $rootScope,$location) {

	// method for login
	$scope.login = function() {
		// requesting the token by usename and passoword
		$http({
			url : 'authenticate',
			method : "POST",
			params : {
				email : $scope.email,
				password : $scope.password
			}
		}).success(function(res) {
			$scope.password = null;
			// checking if the token is available in the response
			if (res.token) {
				$scope.message = '';
				// setting the Authorization Bearer token with JWT token
				AuthService.putToken(res.token);
				$http.defaults.headers.common['Authorization'] = 'Bearer ' + res.token;

				// setting the user in AuthService
				AuthService.user = res.user;
				AuthService.putUser(res.user);
				$rootScope.user = AuthService.user;
				$rootScope.$broadcast('LoginSuccessful');
				// going to the home page
				$state.go('home');
			} else {
				// if the token is not present in the response then the
				// authentication was not successful. Setting the error message.
				$scope.message = 'Authetication Failed !';
			}
		}).error(function(error) {
			// if authentication was not successful. Setting the error message.
			$scope.message = 'Authetication Failed !';
		});
	};
    if(AuthService.getUser()){
        $scope.message = '';
        // setting the Authorization Bearer token with JWT token
		var token = AuthService.getToken();
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + AuthService.getToken();

        // setting the user in AuthService
        AuthService.user = AuthService.getUser();
        $rootScope.user = AuthService.user;
        $rootScope.$broadcast('LoginSuccessful');
        // going to the home page
        $state.go('home');
    }
});
