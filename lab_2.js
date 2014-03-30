
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var users = require('./db/users.json');
var objects = require('./db/objects.json');
var status = require('./db/status.json');

var app = express();

var user_name; // имя текущего пользователя

app.set('port',3000);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'ejs');

//Обработака favicon.ico
//app.use(express.favicon());


app.get('/',function(req, res, next) {
	res.render("index", {
		title: 'foreigner'

	});
})

// Обработака get запроса
app.get('/sign',function(req, res, next) {
	
	user_name = req.url.split("=")[1];
	
	if (users[user_name]) {
		res.render("user", {
			title: user_name

		});
	} else {
		res.render("error");
	}
	
})

//Обработка post запроса
app.post('/sign',function(req, res, next) {
	
	user_name = req.body['login'];

	if (users[user_name]) {
		
		res.render("user", {
		title: user_name, // имя пользователя в ситсеме(слева сверху)
		objects: objects, // Вывод доступных пользователю объектов
		users: users,
		status: status,
		user_name: user_name	
		});

	} else {
		res.render("error");
	}
})

app.post('/actions',function(req, res, next) {

	var result = ""; // Содержит новые права доступа
	var obj = req.body['object']; //Имя объекта над которым необходимо выполнить действия 
	var choose_action = req.body['options'];
	var allow_action;


	if (users[user_name] < objects[obj]) {
		allow_action = "read";
	} else {
		allow_action = "write";
	}

	if (choose_action == allow_action) {
		res.render("res", {
			color: "background-color:green",
			answer: "Вы успешно выполнили действие"
		})
	} else {
		res.render("res", {
			color: "background-color:red",
			answer: "Вы не имеет прав доступа на выбранное действие"
		})
	}
	
})

app.use(express.static(path.join(__dirname, 'public')));


http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});
