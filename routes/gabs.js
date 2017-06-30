const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/creategab', (request, response) => {
    response.render('creategab', request.session);
});

router.get('/mygabs', async (request, response) => {
    var myGabs = await models.gabs.findAll(
        {
            order: [['createdAt', 'DESC']],
            where: { userId: request.session.userId },
            include: [models.users, models.likes]
        });
    model = { gabs: myGabs, name: request.session.name };
    response.render('mygabs', model);
});

router.post('/gabs', async (request, response) => {
    var gab = request.body.gab;
    request.checkBody('gab', 'Gab field cannot be empty. ').notEmpty();
    var errors = request.validationErrors(); 
    var model = { errors: errors};
    if (model.errors) {
        response.render('creategab', model);
    } else {
    var newGab = await models.gabs.create({ description: gab, author: request.session.name, userId: request.session.userId });
    response.redirect('/dashboard');
    }
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