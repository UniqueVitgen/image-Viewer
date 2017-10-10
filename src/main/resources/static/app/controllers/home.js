// angular.module('JWTDemoApp')
// Creating the Angular Controller
app
.controller('HomeController', ['$http', '$scope', 'AuthService', 'FileUploader','Upload',
    function($http, $scope, AuthService, FileUploader,Upload,$state,$rootScope) {
        Array.prototype.contains = function ( needle ) {
            for (i in this) {
                if (this[i] == needle) return true;
            }
            return false;
        };
        if(!AuthService.getUser()){

            AuthService.user = null;
            AuthService.putUser(null);
            AuthService.putToken(null);
            $rootScope.$broadcast('LogoutSuccessful');
            $state.go('login');
        }
	$scope.user = AuthService.user;

        AuthService.putUser($scope.user);
        var  u =JSON.parse(localStorage.getItem("user"));
	$scope.tags=[];
	$scope.pictures = [];
	$scope.popularTagNames = [];
	$http.get('popular').success(function (res) {
        $scope.popularTags = res;

    }).error(function(err){

    });
        $http.get('tags').success(function (res) {
            $scope.allTags = res;

        }).error(function(err){

        });
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
    function base64toBlob(base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        }
        function blobToString(b) {
            var u, x;
            u = URL.createObjectURL(b);
            x = new XMLHttpRequest();
            x.open('GET', u, false); // although sync, you're not fetching over internet
            x.send();
            URL.revokeObjectURL(u);
            return x.responseText;
        }
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
    $http.get('pictures').success(function (res) {
            $scope.pictures = res;
            $scope.sources = [];
            for(var i = 0; i < $scope.pictures.length;i++){
                var b = base64toBlob(res[i].source,"image/jpeg");
                $scope.sources.push(URL.createObjectURL(b));
            }

        }).error(function (error) {
            $scope.message = error.message;
        });

    // downloadURI("data:text/html,HelloWorld!", "helloWorld.txt");
    $scope.publish = function() {

        var fd = new FormData();
        //Take the first selected file
        fd.append("file", this.files05[0].lfFile);
        fd.append("name", this.name);
        fd.append("description", this.description);
        fd.append("tags", this.tags);

        $http.post("upload", fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(res) {

        })
            .error();
    };
    $scope.searching = function (name) {
        var findingTag = $scope.allTags.filter(function (tag) {
            return tag.name.indexOf(name) !=-1;
        });
        $scope.findingPictures = $scope.pictures.filter(function (picture) {
            var ans = false;
            var tagNames = picture.tags.map(function (t) {
                return t.name.toLowerCase();
            });
            findingTag.forEach(function (tag) {
                if(tagNames.contains(tag.name.toLowerCase())){
                    ans = true;
                }
            });
            return ans;
        });

        $scope.sources = [];
        for(var i = 0; i < $scope.findingPictures.length;i++){
            var b = base64toBlob($scope.findingPictures[i].source,"image/jpeg");
            $scope.sources.push(URL.createObjectURL(b));
        }
    }
    $scope.searchValueChange = function(name){
        $scope.searchText = name;
    }
}]);
