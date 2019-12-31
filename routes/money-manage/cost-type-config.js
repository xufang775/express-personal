var express = require('express');
var router = express.Router();
var dao = require('../url-dao')('costTypeConfig');

router.post('/page',(req,res)=>{
    dao.page(req,res);
});

router.post('/insert',(req,res)=>{
    dao.insert(req,res);
});
router.post('/update',(req,res)=>{
    dao.update(req,res);
});

router.post('/delete',(req,res)=>{
    dao.delete(req,res);
});

router.post('/cascader',(req,res)=>{
    dao.cascader(req,res);
});

router.post('/queryById',(req,res)=>{
    dao.queryById(req,res);
});

module.exports = router;