const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/login', (request, response) => {
    response.render('login');
});

router.post('/login', async (request, response) => {
    var name = request.body.name;
    var password = request.body.password;
    var query = { where: { name: name, password: password } };
    var user = await models.users.find(query);
    
    if (user) {
        request.session.isAuthenticated = true;
        request.session.name = user.name;
        request.session.userId = user.id;
        response.redirect('/dashboard');
    }
    else {
        response.redirect('/signup');
    }
});

module.exports = router;