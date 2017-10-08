// angular.module('JWTDemoApp')
// Creating the Angular Controller
app
.controller('HomeController', ['$http', '$scope', 'AuthService', 'FileUploader','Upload',
    function($http, $scope, AuthService, FileUploader,Upload) {
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
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }
    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var dw = new DataView(ab);
        for(var i = 0; i < byteString.length; i++) {
            dw.setUint8(i, byteString.charCodeAt(i));
        }
        // write the ArrayBuffer to a blob, and you're done
        return new Blob([ab], {type: mimeString});
    }


    // downloadURI("data:text/html,HelloWorld!", "helloWorld.txt");
    var myBlob;
    $scope.publish = function() {
        // requesting the token by usename and passoword

        $scope.tags = this.tags;
        $scope.source = this.files05[0].lfDataUrl;

        // downloadURI($scope.source, "helloWorld.jpg");
        console.log(this.files05[0].lfFile instanceof File);
        console.log(this.files05[0].lfFile instanceof Blob);
        console.log(typeof this.files05[0].lfFile);
        $scope.source = new Blob([this.files05[0].lfFile],{ type: "image/jpeg" });
        $scope.source.type = "image/jpeg";
        console.log($scope.source instanceof Blob);
        console.log($scope.source);

        var fd = new FormData();
        //Take the first selected file
        fd.append("file", this.files05[0].lfFile);

        $http.post("upload", fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success().error();

//create the ajax request (traditional way)
//         var request = new XMLHttpRequest();
//         request.open('POST', 'upload');
//         request.send(formData);
        // Upload.upload({
        //     url : 'upload',
        //     data: {file: this.files05[0].lfFile, 'username': this.name}
        // });
        // var myBl;
        // var f = function downloadArt(url)
        // {
        //     $.ajax(url, {
        //         dataType: "binary",
        //         processData: false
        //     }).done(function (data) {
        //         // just my logic to name/create files
        //         // var filename = url.substr(url.lastIndexOf('/') + 1) + '.png';
        //         var blob = new Blob([data], { type: 'image/png' });
        //         myBl=blob;
        //         // saveAs(blob, filename);
        //     });
        // };
        // f($scope.source);
        // $scope.blob = myBl;
        // $scope.source = urlToBolb($scope.source);
        $scope.name = this.name;
        $scope.description = this.description;
        // $upload.upload({
        //     url : 'upload',
        //     file : this.files05[0].lfFile,
        //     method : 'POST',
        //     data : 'data'
        // });
        // $http({
        //     url : 'upload',
        //     method : "POST",
        //     params : {
        //         file: this.files05[0].lfFile
        //     },
        //     enctype:"multipart/form-data"
        // }).success(function(res) {
        //     $scope.password = null;
        //     // checking if the token is available in the response
        //     if (res) {
        //         $scope.message = '';
        //         // setting the Authorization Bearer token with JWT token
        //         $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.token;
        //
        //         // setting the user in AuthService
        //         AuthService.user = res.user;
        //         $rootScope.$broadcast('LoginSuccessful');
        //         // going to the home page
        //         $state.go('home');
        //     } else {
        //         // if the token is not present in the response then the
        //         // authentication was not successful. Setting the error message.
        //         $scope.message = 'Authetication Failed !';
        //     }
        // }).error(function(error) {
        //     // if authentication was not successful. Setting the error message.
        //     $scope.message = 'Authetication Failed !';
        // });
    };
}]);
