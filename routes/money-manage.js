var express = require('express');
var router = express.Router();
var costRecordRouter = require('./money-manage/cost-record');
var costTypeRouter = require('./money-manage/cost-type');
var costTypeConfigRouter = require('./money-manage/cost-type-config');

router.use('/costRecord', costRecordRouter);
router.use('/costType', costTypeRouter);
router.use('/costTypeConfig', costTypeConfigRouter);

module.exports = router;