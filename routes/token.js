var express = require('express');
var router = express.Router();
const { HTTP_METHOD } = require('../common/constant');
const { dbType }= require('../config/db');
var tokenDao = require(`../dao/${dbType}/tokenDao`);

router.use('/login', function (req, res, next) {
    if(req.method === HTTP_METHOD.OPTIONS){
        res.send('GET,HEAD');
    } else {
        tokenDao.getToken('admin',req, res, next);
    }
});

router.get('/info',function (req, res, next) {
    tokenDao.getInfo(req,res,next)
})

module.exports = router;
