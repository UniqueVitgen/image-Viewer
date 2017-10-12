// Creating angular JWTDemoApp with module name "JWTDemoApp"
var app= angular.module('ui.imagedrop', [])
    .directive("imagedrop", function ($parse, $document) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var onImageDrop = $parse(attrs.onImageDrop);

                //When an item is dragged over the document
                var onDragOver = function (e) {
                    e.preventDefault();
                    angular.element('body').addClass("dragOver");
                };

                //When the user leaves the window, cancels the drag or drops the item
                var onDragEnd = function (e) {
                    e.preventDefault();
                    angular.element('body').removeClass("dragOver");
                };

                //When a file is dropped
                var loadFile = function (file) {
                    scope.uploadedFile = file;
                    scope.$apply(onImageDrop(scope));
                };

                //Dragging begins on the document
                $document.bind("dragover", onDragOver);

                //Dragging ends on the overlay, which takes the whole window
                element.bind("dragleave", onDragEnd)
                    .bind("drop", function (e) {
                        onDragEnd(e);
                        loadFile(e.originalEvent.dataTransfer.files[0]);
                    });
            }
        };
    });
angular.module('JWTDemoApp', [ 'ui.router','ui.imagedrop','ngMaterial','lfNgMdFileInput',
    'ngFileUpload',
    'angularFileUpload','ui.bootstrap'])
    .directive('tagManager', function() {
        return {
            restrict: 'E',
            scope: { tags: '=' },
            template:
            '<div class="tags">' +
            '<div ng-repeat="(idx, tag) in tags" class="tag label label-success">{{tag}} <a class="close" href ng-click="remove(idx)">×</a></div>' +
            '</div>' +
            '<div class="input-group"><input type="text" class="form-control" placeholder="Write a tag..." ng-model="new_value"></input> ' +
            '<span class="input-group-btn"><a class="btn btn-default" ng-click="add()">Add tag</a></span></div>',
            link: function ( $scope, $element ) {

                var input = angular.element( $element.children()[1] );

                // adds the new tag to the tags array
                $scope.add = function() {
                    $scope.tags.push( $scope.new_value );
                    $scope.new_value = "";
                };

                // remove an item
                $scope.remove = function ( idx ) {
                    $scope.tags.splice( idx, 1 );
                };

                // capture keypresses
                input.bind( 'keypress', function ( event ) {
                    // enter was pressed
                    if ( event.keyCode == 13 ) {
                        $scope.$apply( $scope.add );
                    }
                });
            }
        };
    })
    // .directive('tooltip', function(){
    //     return {
    //         restrict: 'A',
    //         link: function(scope, element, attrs){
    //             $(element).hover(function(){
    //                 // on mouseenter
    //                 if($(element.disabled))
    //                 $(element).tooltip('show');
    //             }, function(){
    //                 // on mouseleave
    //                 $(element).tooltip('hide');
    //             });
    //         }
    //     };
    // })

    // .directive('tooltip', function ($document, $compile) {
    //     return {
    //         restrict: 'A',
    //         scope: true,
    //         link: function (scope, element, attrs) {
    //
    //             var tip = $compile('<div ng-class="tipClass">{{ text }}<div class="tooltip-arrow"></div></div>')(scope),
    //                 tipClassName = 'tooltip',
    //                 tipActiveClassName = 'tooltip-show';
    //
    //             scope.tipClass = [tipClassName];
    //             scope.text = attrs.tooltip;
    //
    //             if(attrs.tooltipPosition) {
    //                 scope.tipClass.push('tooltip-' + attrs.tooltipPosition);
    //             }
    //             else {
    //                 scope.tipClass.push('tooltip-down');
    //             }
    //             $document.find('body').append(tip);
    //
    //             element.bind('mouseover', function (e) {
    //                 if ( $( element ).is( ":disabled" ) ){
    //                     tip.addClass(tipActiveClassName);
    //                 }
    //                 var pos = e.target.getBoundingClientRect(),
    //                     offset = tip.offset(),
    //                     tipHeight = tip.outerHeight(),
    //                     tipWidth = tip.outerWidth(),
    //                     elWidth = pos.width || pos.right - pos.left,
    //                     elHeight = pos.height || pos.bottom - pos.top,
    //                     tipOffset = 10;
    //
    //                 if(tip.hasClass('tooltip-right')) {
    //                     offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
    //                     offset.left = pos.right + tipOffset;
    //                 }
    //                 else if(tip.hasClass('tooltip-left')) {
    //                     offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
    //                     offset.left = pos.left - tipWidth - tipOffset;
    //                 }
    //                 else if(tip.hasClass('tooltip-down')) {
    //                     offset.top = pos.top + elHeight + tipOffset;
    //                     offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
    //                 }
    //                 else {
    //                     offset.top = pos.top - tipHeight - tipOffset;
    //                     offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
    //                 }
    //
    //                 tip.offset(offset);
    //             });
    //
    //             element.bind('mouseout', function () {
    //                 tip.removeClass(tipActiveClassName);
    //             });
    //
    //             tip.bind('mouseover', function () {
    //                 if(element.disabled){
    //                     tip.addClass(tipActiveClassName);
    //                 }
    //             });
    //
    //             tip.bind('mouseout', function () {
    //                 tip.removeClass(tipActiveClassName);
    //             });
    //
    //
    //         }
    //     }
    // })

// the following method will run at the time of initializing the module. That
// means it will run only one time.
.run(function(AuthService, $rootScope, $state) {
	// For implementing the authentication with ui-router we need to listen the
	// state change. For every state change the ui-router module will broadcast
	// the '$stateChangeStart'.
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		// checking the user is logged in or not
		if (!AuthService.user) {
			// To avoiding the infinite looping of state change we have to add a
			// if condition.
			if (toState.name != 'login' && toState.name != 'register') {
				event.preventDefault();
				$state.go('login');
			}
		} else {
			// checking the user is authorized to view the states
			if (toState.data && toState.data.role) {
				var hasAccess = false;
				for (var i = 0; i < AuthService.user.roles.length; i++) {
					var role = AuthService.user.roles[i];
					if (toState.data.role == role) {
						hasAccess = true;
						break;
					}
				}
				if (!hasAccess) {
					event.preventDefault();
					$state.go('access-denied');
				}

			}
		}
	});
});