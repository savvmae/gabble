const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const application = express();

application.engine('mustache', mustacheExpress());

application.set('views', './views');
application.set('view engine', 'mustache');

var users = [{ name: 'admin', password: '1234', page_views: 0 }];

application.use(cookieParser());
application.use(bodyParser.urlencoded());
application.use(session({
    secret: 'iAmASecret',
    saveUninitialized: true,
    resave: false
}));

application.use(function (request, response, next) {
    if (request.session.isAuthenticated === undefined) {
        request.session.isAuthenticated = false;
    }
    next();
});

application.get('/', (request, response) => {
    response.render('index');
});

application.get('/login', (request, response) => {
    response.render('login');
});

application.get('/signup', (request, response) => {
    response.render('signup');
});



application.get('/dashboard', (request, response) => {

    if (request.session.isAuthenticated === false) {
        response.redirect('login');
    }
    else {
        var model = {
            name: request.session.name,
            views: request.session.views++
        }
        response.render('dashboard', model);
    }
});

application.post('/signup', (request, response) => {
    var user = {
        name: request.body.name,
        password: request.body.password,
    }
    users.push(user);
    response.redirect('/login');
});



application.post('/login', (request, response) => {
    var user = users.find(user => { return user.name === request.body.name && user.password === request.body.password });

    if (user) {
        request.session.isAuthenticated = true;
        request.session.name = user.name;
        request.session.views = 1;
        response.redirect('/dashboard');
    }
    else {
        response.redirect('/signup');
    }
});

application.post('/logout', (request, response) => {
    request.session = null;
    response.render('login');
})

application.listen(3000);


