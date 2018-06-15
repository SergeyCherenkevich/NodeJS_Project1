1. Подключаем npm init (создаем конфигурационный файл)
2. Запуск сервер node server.js


1. установка Mongodb инструкция в документации.

\\ Чиним для каждый раз делаем, чтобы запустить mongod
2. mongod --repair 
3. mongod --bind_ip=$IP --nojournal


4. $ npm install mongoose --save \\Устанавливаем библиотеку для работы с Mongodb

5. ctrl+c - Обновить\сбросить сервер приложений node js

$stateProvider -- Создавать и настраивать страницы
$locationProvider - HTML5
$urlRouterProvider -- Указываем страницу по умолчанию (например, вместо 404 показать свою)

2018.05.10 - Добавляем комменты на страницу

2018.05.14 - Добавляем удаление (DELETE) коммента. Если пользователь, читающий комент = автор коммента
             - отображаем форму с кнопкой удаления
           * ДЗ Добавляем кнопку Edit для тех же условий, что и Delete
           
2018.05.17 - Делаем Like
             Делаем модель 
             
2018.05.21 - Загружаем и храним файлы в папке. В БД только ссылки

2018.05.24 - создаем Promise, 
https://www.digitalocean.com/community/tutorials/node-js-ubuntu-16-04-ru
(Установка через nvm)

Promise - помогает справиться с ассинхронностью
const returnText = () => {
    setTimeout(()=>{
       return 'Hello form function' 
    },3000);
}

let result = returnText();

console.log(result);



ДЗ - map, reduce, filter, findIndex - для работы с массивами.


2018.05.28 -- 






             
             