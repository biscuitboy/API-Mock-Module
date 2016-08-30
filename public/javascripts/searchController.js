angular.module("searchModule").controller("searchPageController" , searchPageController)
.directive('fileName', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileName);
                var modelSetter = model.assign;
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                    });
            }
        };
    }]);

searchPageController.$inject = ['$http','$window','$filter','ngDialog','$scope','$timeout'];

function searchPageController($http,$window,$filter,ngDialog,$scope,$timeout){
    
    var vm =  this;
    vm.submit = submit;
    vm.downloadJson = downloadJson;
    vm.deleteMockJson = deleteMockJson;
    vm.getMockList = getMockList;
    vm.projectList = projectList;
    vm.saveProject = saveProject;
    vm.deleteProject = deleteProject; 
    vm.confirm = confirm;
    vm.addNew = false;
    vm.readMe = false;
    vm.ipAddress = "";
    vm.projectName = "";
    vm.sampleRead = "This is the content to read";
    vm.list = [];
    vm.projects = [];
    var arrayList = [];
    var urlHost = $window.location.host;
    function saveProject(){
        var temp = {};
        temp.name = vm.projectName;
        temp.ip = vm.ipAddress;
        arrayList.push(temp);
      $http({
            method:"put",
            url:"http://" + urlHost + "/saveProjectList",
            data:{"projectList":arrayList}
        }).then(function(response){
           
          vm.message = vm.projectName + "project has been added successfully!!!";
            var modalToOpen = {
                    template: './views/popup.html',
                    scope: $scope,
                    controller: 'popupCtrl',
                    controllerAs: 'vm',
                    appendClassName: 'success-popup',
                    showClose: false,
                    
                    disableAnimation: false,
                    closeByDocument: false,
                    closeByEscape: true,
                    data : vm
                }
               ngDialog.open(modalToOpen);
               $timeout(function(){
                   ngDialog.close();
                   vm.projectList();
           vm.projectSelected  = {"name" : vm.projectName};
          vm.getMockList();
          vm.projectName = "";
          vm.ipAddress = "";
               } , 3000);
        },function(){});  
    }
    
    
    function projectList(){
        $http({
            method:"GET",
            url:"http://" + urlHost +"/projectList"
        }).then(function(response){
            vm.projects = response.data.projectList;
            arrayList = response.data.projectList;
        },function(){});
    }
    
       function getMockList(){
            $http({
                   method:"POST",
                   url :"http://" + urlHost + "/mockList",
                    data:{projectName : vm.projectSelected.name}
        }).then(function(response){
                    vm.list = angular.fromJson(response.data.fileList);        
        },function(error){

        });
       }
    
    
    function downloadJson(fileName){
       var url = "http://" + urlHost + "/downloadMock/" + vm.projectSelected.name +"/" + fileName; 
        window.open(url);
    }
    
    function confirm(fileName){
        var modalToOpen = {
                    template: './views/confirm.html',
                    scope: $scope,
                    appendClassName: 'confirm-popup',
                }
        ngDialog.openConfirm(modalToOpen).then(function(){
            $timeout(vm.deleteMockJson(fileName),3000);
        },function(){});
    }
    
    function deleteMockJson(fileName){
        var url = "http://" + urlHost + "/deleteMock";
        $http({
            method:"POST",
            url:url,
            data:{projectName : vm.projectSelected.name , filename:fileName}
        }).then(function(response){
            vm.message = fileName + " has been deleted successfully!!!";
            var modalToOpen = {
                    template: './views/popup.html',
                    scope: $scope,
                    controller: 'popupCtrl',
                    controllerAs: 'vm',
                    appendClassName: 'success-popup',
                    showClose: false,
                    
                    disableAnimation: false,
                    closeByDocument: false,
                    closeByEscape: true,
                    data : vm
                }
               ngDialog.open(modalToOpen);
               $timeout(function(){
                   ngDialog.close();
                   getMockList();
               } , 3000);
        },function(error){});;
    }
    
     function deleteProject(){
      vm.projects.splice(vm.projects.indexOf(vm.projectSelected.name), 1);
      var projName = vm.projectSelected.name;
      $http({
            method:"post",
            url:"http://" + urlHost + "/deleteProject",
            data:{"projectName":vm.projectSelected.name}
        }).then(function(response){
           
          vm.message = projName + "project has been deleted successfully!!!";
            var modalToOpen = {
                    template: './views/popup.html',
                    scope: $scope,
                    controller: 'popupCtrl',
                    controllerAs: 'vm',
                    appendClassName: 'success-popup',
                    showClose: false,
                    disableAnimation: false,
                    closeByDocument: false,
                    closeByEscape: true,
                    data : vm
                }
               ngDialog.open(modalToOpen);
               $timeout(function(){
                   ngDialog.close();
                   $http({
            method:"put",
            url:"http://" + urlHost + "/saveProjectList",
            data:{"projectList":vm.projects}
        }).then(function(response){
                       vm.list = [];
                   },function(){});
               } , 3000);
        },function(){});
    }
    
    function submit(){
        var files = vm.files;
        var reader = new FileReader();
        var input = document.querySelector("input");
        var file = input.files[0];
        var fd = new FormData();
        fd.append("file" , files);
        var url = "http://" + urlHost + "/upload/" + vm.projectSelected.name;
           $http({
               method:"PUT",
               url : url,
               data : fd,
               transformRequest: angular.identity,
               headers: {'Content-Type': undefined}
							
           }).then(function(response){
               vm.message = file.name.split(".")[0] + " service has been mocked successfully!!!!";
               var modalToOpen = {
                    template: './views/popup.html',
                    scope: $scope,
                    controller: 'popupCtrl',
                    controllerAs: 'vm',
                    appendClassName: 'success-popup',
                    showClose: false,
                    
                    disableAnimation: false,
                    closeByDocument: false,
                    closeByEscape: true,
                    data : vm
                }
               ngDialog.open(modalToOpen);
               $timeout(function(){
                   ngDialog.close();
                   getMockList();
               } , 3000);
           },function(error){
               
           });    
    }
 vm.projectList();
}
