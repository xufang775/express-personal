var express = require('express');
var router = express.Router();

const { dbType }= require('../../config/db');
var costRecordDao = require(`../../dao/${dbType}/cost-record.dao`);

router.post('/page',(req,res)=>{
    costRecordDao.queryAll(req,res);
});

module.exports = router;