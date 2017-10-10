angular.module('JWTDemoApp')
// Creating the Angular Service for storing logged user details
.service('AuthService', function($http) {
	return {
		user:null,
		getUser: function () {
            return JSON.parse(localStorage.getItem("user"));
        },
        putUser: function (user) {
            localStorage.setItem("user",JSON.stringify(user));
        },
        getToken: function () {
            return JSON.parse(localStorage.getItem("token"));
        },
        putToken: function (token) {
            localStorage.setItem("token",JSON.stringify(token));
        },
        getPassword: function() {
			var password;
			$http({
                url: 'users/password',
                method: "GET",
                params: {user:AuthService.getUser()}
            }).success(function (res) {
				password = res;
            });
			return password;
		}
	}
});
