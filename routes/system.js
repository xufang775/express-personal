var express = require('express');
var router = express.Router();
var roleRouter = require('./system-manage/role');

router.use('/sysRole', roleRouter)

router.use('/queryAll', function (req, res, next) {
    res.json('test');
});


module.exports = router;