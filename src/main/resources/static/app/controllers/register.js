angular.module('JWTDemoApp')
// Creating the Angular Controller
.controller('RegisterController', function($http, $scope, AuthService,$state,$rootScope) {
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
	$scope.submit = function() {
		$http.post('register', $scope.appUser).success(function(res) {
			$scope.appUser = null;
			$scope.confirmPassword = null;
			$scope.register.$setPristine();
            $state.go('home');
			$scope.message = "Registration successfull !";
		}).error(function(error) {
			$scope.message = error.message;
		});
	};
});
