const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/signup', (request, response) => {
    response.render('signup');
});

router.post('/signup', async (request, response) => {
    
    var name = request.body.name;
    var email = request.body.email;
    var pw = request.body.password;
    var cpw = request.body.confirmPassword;

    request.checkBody('name', 'No Name Provided. ').notEmpty();
    request.checkBody('name', 'Must be less than 100 characters. ').matches(/^.{0,100}$/, "i");
    request.checkBody('email', 'No Email Provided').notEmpty();
    request.checkBody('email', 'Must be a valid email').matches(/.+\@.+\..+/, "i");
    request.checkBody('password', 'No password was provided.  ').notEmpty();
    request.checkBody('password', "Password must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    request.checkBody('confirmPassword', 'No confirmation was provided.  ').notEmpty();
    request.checkBody('confirmPassword', "Confirmation must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    
    var errors = request.validationErrors(); 
    var query = { where: { email: email } };
    var user = await models.users.find(query);
    var unavailable = "That email is already registered.";
    var model = { errors: errors, unavailable: unavailable };

    if (model.errors || user) {
        response.render('signup', model);
    } else {

    var newUser = await models.users.create({ name: name, email: email, password: pw });

    request.session.isAuthenticated = true;
    request.session.name = newUser.name;
    request.session.userId = newUser.id;

    response.redirect('/dashboard');
    }
});

module.exports = router;