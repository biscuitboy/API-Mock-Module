(function(){
    'use strict';
    angular.module("searchModule")
    .filter('srcResolver' , srcResolver);
    srcResolver.$inject = ['$sce'];
    function srcResolver($sce){
        return function(url){
            return $sce.trustAsResourceUrl(url);
        }
    }
})();