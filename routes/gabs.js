const express = require('express');
const router = express.Router();
const models = require('../models');
var moment = require('moment');
moment().format();


router.get('/creategab', (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
    response.render('creategab', request.session);
    }
});

router.get('/mygabs', async (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
    var myGabs = await models.gabs.findAll(
        {
            order: [['createdAt', 'DESC']],
            where: { userId: request.session.userId },
            include: [models.users, models.likes]
        });
    model = { gabs: myGabs, name: request.session.name };
    response.render('mygabs', model);
    }
});

router.get('/editgab/:id', (request, response) => {
    if (!request.session.isAuthenticated) {
        response.redirect('/login');
    } else {
    var gabId = { gabId: request.params.id , name: request.session.name}
    response.render('editgab', gabId);
    }
});

router.post('/edit/:id', async (request, response) => {
    var gabId = request.params.id;
    var newContent = request.body.newContent;
    request.checkBody('newContent', 'Gab field cannot be empty. ').notEmpty();
    var errors = request.validationErrors();
    var model = { errors: errors };
    if (model.errors) {
        response.render('editgab', model);
    } else {
        var editGab = await models.gabs.update({
            description: newContent
        }, {
                where: {
                    id: gabId
                }
            });
        response.redirect('/mygabs');
    }
});



router.post('/gabs', async (request, response) => {
    var gab = request.body.gab;
    request.checkBody('gab', 'Gab must be between 1 and 140 characters ').len(1, 140);
    var errors = request.validationErrors();
    var model = { errors: errors };
    var timestamp = moment().format("dddd, MMMM Do YYYY, h:mm a");
    if (model.errors) {
        response.render('creategab', model);
    } else {
        var newGab = await models.gabs.create({ description: gab, author: request.session.name, userId: request.session.userId, timestamp: timestamp });
        response.redirect('/dashboard');
    }
});
router.post('/mygabs/like/:id', async (request, response) => {

    var gabId = request.params.id;
    var userId = request.session.userId;
    var likes = await models.likes.find({ where: { gabId: gabId, userId: userId } });

    if (!likes) {
        var newLike = await models.likes.create({ gabId: gabId, userId: userId });
    }
    response.redirect('/mygabs');
});


router.post('/delete/:id', async (request, response) => {
    var gabId = request.params.id;
    var deleteLikes = await models.likes.destroy({
        where: {
            gabId: gabId
        }
    });
    var deleteGab = await models.gabs.destroy({
        where: {
            id: gabId
        }
    });
    response.redirect('/mygabs');
});


module.exports = router;