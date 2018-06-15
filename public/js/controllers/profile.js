// -- Все, что генерит фронт ЗДЕСЬ!!!
//var app = angular.module('decode',[]);

app.controller('profileCtrl',profileCtrl);

profileCtrl.$inject = ['$http'];

function profileCtrl($http)  {
  var vm=this;
  vm.showUpdateForm = false;
  vm.new_id = null;
  vm.new_index = null;
//   vm.myInput = 'Hello';
  $http.get('/api/post/profile')
  .success(function(response){
      vm.posts = response;
     // console.log(vm.posts);
  })
  .error(function(err){
      console.log(err);
  });
  
  vm.addPost = function(){ //Функцию изменили 2018,05
    console.log(vm.file);
    var data = new FormData()
    data.append('title',vm.title);
    data.append('content',vm.content);
    data.append('author',vm.author);
    vm.file.foreach(function(item, i, arr){
      data.append('file',item);
    });
    // data.append('file',vm.file[0]);
    $http.post('/api/post', data, {
       headers:{'Content-Type':undefined}, //Говорим в каком типе будут переданы данные. Ранее применяли json
       transformRequest: angular.identity
    })
    .success(function(response){
      console.log(response)
      vm.title='';
      vm.content='';
      vm.author='';
      vm.posts.unshift(response);
    })
    .error(function(err){
      console.log(err);
    })
    
  //   var file_name = vm.file.filename.split('.').pop(); //Старое сохранение поста, когда файл в base64
  //   console.log(file_name);
  //   //return;
  //   /*console.log(vm.file);*/
  //   if (file_name=='png' || file_name=='jpg') {
 
  //   var data = {
  //     title:vm.title,
  //     content:vm.content,
  //     author:vm.author,
  //     file:'data:'+vm.file.filetype+';base64,'+vm.file.base64
  //   }
  //   $http.post('/api/post',data)
  //   .success(function(response){
  //     //vm.posts.push(response); Добавляем в конец
  //   //очищаем поля после save
  //     vm.title='';
  //     vm.content='';
  //     vm.author='';
  //   //-----------------------
  //     vm.posts.unshift(response);
  //   })
  //   .error(function(err) {
  //     console.log(err);
  //   })
  //   console.log(data);
 
  //   }
  //   else {
  //     alert('Выберите нужный формат');
  // }
  }
       
    
  
  vm.showUpdate = function(index,id){
    vm.new_title = vm.posts[index].title;
    vm.new_content = vm.posts[index].content;
    vm.new_author = vm.posts[index].author;
    vm.new_id = vm.posts[index]._id;
    vm.new_index = index;
    vm.showUpdateForm = true; //Показываем/скрываем форму.
  }
  
  vm.updatePost = function(){
    var data = {
      title:vm.new_title,
      content:vm.new_content,
      author:vm.new_author,
      file:'',
      id: vm.new_id
    }
    if (vm.new_file){
      data.file='data:'+vm.new_file.filetype+';base64,'+vm.new_file.base64;
    }
    
    $http.put('/api/post',data)
    .success(function(response){
      vm.posts[vm.new_index] = response;
      vm.showUpdateForm = false; //Показываем/скрываем форму.
      console.log(response)
    })
    .error(function(err) {
      console.log(err);
    })
    console.log(data);
  }; 
  
  vm.deletePost = function(index,id) {
   // console.log(index,id);
    $http.delete('/api/post/' + id)
        .success(function(response) {
          //console.log(response);
          vm.posts.splice(index,1);
        })
        .error(function(err){
           console.log(err);
          
        })
  }
  //console.log('Hello World')  
}