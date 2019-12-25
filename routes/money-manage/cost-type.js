var express = require('express');
var router = express.Router();
var dao = require('../url-dao')('costType');

router.post('/page',(req,res)=>{
    dao.page(req,res);
});

router.post('/insert',(req,res)=>{
    dao.insert(req,res);
});

router.post('/cascader',(req,res)=>{
    dao.cascader(req,res);
});


module.exports = router;