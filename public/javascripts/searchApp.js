angular.module("searchModule" , ['ui.router' , 'ngDialog']);
angular.module("searchModule").config(["$stateProvider", function($stateProvider){
      $stateProvider.state({
        name:'searchPage',
        url:'/uploadMocks',
        controller : 'searchPageController',
        controllerAs : 'vm',
        templateUrl:'./views/searchPage.html'
    });
}]);