var express = require('express');
var router = express.Router();

const { dbType }= require('../../config/db');
var roleDao = require(`../../dao/${dbType}/roleDao`);

router.post('/queryAll',(req,res)=>{
   roleDao.queryAll(req,res);
});

router.post('/save', (req,res) =>{
   roleDao.save(req, res);
});

router.post('/delete', ( req, res) =>{
   roleDao.delete(req, res);
});

module.exports = router;