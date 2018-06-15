// JavaScript Filedsf
app.controller('LoginCtrl',LoginCtrl);

LoginCtrl.$inject = ['$http','$state','$cookies','$rootScope'];

function LoginCtrl($http,$state,$cookies,$rootScope)  {
    var vm = this;
    
    vm.login = function() {
        var data = {
           email: vm.email,
           password: vm.password
        }
        
        $http.post('/api/login',data)
        .success(function(response){
          // $rootscope.session = $cookies.getObject('session').email; //заполняем глобальную переменную
           $rootScope.currentUser = response;
           
            $state.go('home'); //Возвращаем на главную, если прошли авторизацию
        })
        .error(function(err) {
          console.log(err);
        })    
    }
    
 
}