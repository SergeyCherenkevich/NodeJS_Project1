// JavaScript Filedsf
app.controller('HeaderCtrl',HeaderCtrl);

HeaderCtrl.$inject = ['$http','$state','$cookies','$rootScope']; //$rootscope - глобальные переменные. Весь сайт видит

function HeaderCtrl($http,$state,$cookies,$rootScope)  {
    var vm = this;
    if ($cookies.getObject('user')) {
        $rootScope.currentUser = $cookies.getObject('user');
    }else{
        $rootScope.currentUser = null;    
    }
    
    $rootScope.$watch('currentUser', function(){
        vm.user = $rootScope.currentUser;
    })
    vm.logout = function () {
          $http.post('/api/logout')
          .success(function(response) {
                //  $rootScope.session=null;
                $rootScope.currentUser = null;
          })
          .error(function(err) {
              console.log(err);
          })
    }
 }