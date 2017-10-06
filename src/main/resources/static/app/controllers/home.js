// angular.module('JWTDemoApp')
// Creating the Angular Controller
app
.controller('HomeController', function($http, $scope, AuthService) {
	$scope.user = AuthService.user;
	$scope.tags=[];
    var urlToBolb=function downloadArt(url)
    {
        $.ajax(url, {
            dataType: "binary",
            processData: false
        }).done(function (data) {
            // just my logic to name/create files
            var filename = url.substr(url.lastIndexOf('/') + 1) + '.png';
            var blob = new Blob([data], { type: 'image/png' });
            return blob;
            // saveAs(blob, filename);
        });
    };
    $scope.publish = function() {
        // requesting the token by usename and passoword
        $scope.tags = this.tags;
        $scope.source = this.files05[0];
        console.log(this.files05[0].lfDataUrl);
        console.log(typeof this.files05[0].lfDataUrl);
        // $scope.source = urlToBolb($scope.source);
        $scope.name = this.name;
        $scope.description = this.description;
        $http({
            url : 'publish',
            method : "POST",
            params : {
                name : $scope.name,
                description : $scope.description,
                source : $scope.source,
                tags : $scope.tags
            }
        }).success(function(res) {
            $scope.password = null;
            // checking if the token is available in the response
            if (res) {
                $scope.message = '';
                // setting the Authorization Bearer token with JWT token
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.token;

                // setting the user in AuthService
                AuthService.user = res.user;
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
});
