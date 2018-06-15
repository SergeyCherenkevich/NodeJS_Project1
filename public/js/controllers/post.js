// -- Все, что генерит фронт ЗДЕСЬ!!!
//var app = angular.module('decode',[]);

app.controller('PostCtrl',PostCtrl); //$state - узнаем на какой странице мы находимся, какие у нее параментры и т.д.

PostCtrl.$inject = ['$http', '$state','$rootScope'];

function PostCtrl($http, $state, $rootScope)  {
  var vm=this;
  vm.id = $state.params.id; //тот же параметр, что указан в url app.js
  $http.get('/api/post/'+vm.id)
  .success(function(response){
      vm.post = response;
      // console.log(vm.post);
  })
  .error(function(err){
      console.log(err);
  });
  
  vm.addComment = function(){
    var data = {
      text:vm.text
    }
    $http.post('/api/comment/'+vm.id,data)
    .success(function(response){
      vm.post.comments.push(response);
      vm.text='';
    })
    .error(function(err){
      console.log(err);
    });
  }
  
  vm.delComment = function(id, index, post_id){
    var pid = {
      post_id:post_id
    }
    
    $http.post('/api/delcomment/'+id,pid)
    .success(function(response){
      vm.post.comments.splice(index, 1);
      // vm.text='';
      console.log(response);
    })
    .error(function(err){
      console.log(err);
    });
  }
  
}
