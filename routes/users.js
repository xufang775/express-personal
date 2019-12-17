var express = require('express');
var router = express.Router();

const { dbType }= require('../config/db');
var userDao = require(`../dao/${dbType}/userDao`);
// var common = require('../../dao/common');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 查询用户
router.get('/queryAll', function (req,res,next) {
  userDao.queryAll(req,res,next)
})

router.get('/all', function (req,res,next) {
    userDao.all2(req,res,next);
});

module.exports = router;
