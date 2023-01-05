const express = require('express');
const router = express.Router();
const path = require('path')
const middlewares = require('../middlewares');
const users = require('../controllers/users');

router
     .get('/users',middlewares.checkContentType,  middlewares.checkToken, users.get)
     .get('/users/:id',middlewares.checkContentType,  middlewares.checkToken, users.getById)
     .delete('/users/:id',middlewares.checkContentType,  middlewares.checkToken, users.remove)
     .post('/user_login', middlewares.checkContentType,  users.login)
     .put('/users/:id',middlewares.checkContentType,  middlewares.checkToken, users.edit)
     .post('/users', middlewares.checkContentType,   users.create)

     .get('/test', (req, res) => {
      res.send(req.ip)
     })


module.exports = router;     