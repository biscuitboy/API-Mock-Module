(function(){
  angular.module("searchModule").controller("popupCtrl" , popupCtrl);
popupCtrl.$inject = ['$scope'];
function popupCtrl($scope){
    var vm = this;
    vm.message = $scope.ngDialogData.message;
}  
})();
