var express = require('express');
var router = express.Router();
var dao = require('../url-dao')('costType');

router.post('/page',(req,res)=>{
    dao.queryPage(req,res);
});

router.post('/all',(req,res)=>{
    dao.query(req,res);
});


module.exports = router;