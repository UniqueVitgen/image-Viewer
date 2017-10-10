angular.module('JWTDemoApp')
// Creating the Angular Controller
.controller('RegisterController', function($http, $scope, AuthService,$state,$rootScope) {
	if(AuthService.user){
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
