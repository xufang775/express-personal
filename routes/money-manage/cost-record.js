var express = require('express');
var router = express.Router();
var dao = require('../url-dao')('costRecord');  // costRecord 为 url-dao.js文件中 url 的属性名
const fn = {}

router.post('/page',(req,res)=>{
    dao.queryPage(req,res);
});
router.post('/queryTable',(req,res)=>{
    dao.queryTable(req,res);
});

router.get('/test',(req,res)=>{
    res.json('33');
});



module.exports = router;