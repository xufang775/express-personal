var express = require('express');
var router = express.Router();
var costRecordRouter = require('./money-manage/cost-record');
var costTypeRouter = require('./money-manage/cost-type');

router.use('/costRecord', costRecordRouter);
router.use('/costType', costTypeRouter);

module.exports = router;