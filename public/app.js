var app = angular.module('decode',['ui.router','naif.base64','ngCookies']).config(routeConfig);
    
    routeConfig.$inject = ['$stateProvider', '$locationProvider','$urlRouterProvider'];
    
    function routeConfig($stateProvider,$locationProvider,$urlRouterProvider){
      $locationProvider.html5Mode(true);//Показываем, что html5
      $urlRouterProvider.otherwise('/');
      
      $stateProvider
         .state('home', {
             url:'/',
             templateUrl: '/views/home.html',
             controller: 'HomeCtrl',
             controllerAs: 'vm'
         })
         .state('post', {//Создаем вторую страницу для отображения конкретного поста
             url:'/post/:id', //вызов из Home.html
             templateUrl: '/views/post.html',
             controller: 'PostCtrl',
             controllerAs: 'vm'
         })
         .state('login', {//создаем третью страницу
             url:'/login', 
             templateUrl: '/views/login.html',
             controller: 'LoginCtrl',
             controllerAs: 'vm'
         })
         .state('reg', {//создаем третью страницу
             url:'/reg', 
             templateUrl: '/views/reg.html',
             controller: 'regCtrl',
             controllerAs: 'vm'
         })
         .state('profile', {//создаем Profile
             url:'/profile', 
             templateUrl: '/views/profile.html',
             controller: 'profileCtrl',
             controllerAs: 'vm'
         });
}