const fs = require('fs');
var mysql = require('mysql');
var conf = require('../../config/db');
var pool = mysql.createPool(conf.mysql)
var async = require('async');
var logger = require('../../common/logger');

// 向前台返回JSON方法简单防封装
function jsonWrite (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret)
    }
}

function daoExec(pool,sql,params,cb) {
    pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
        }
        connection.query(sql,params,function (err,result) {
            if(err){
                logger.error(err);
            } else {
                cb(result);
            }
            common.jsonWrite(res, result);
            connection.release();
        })
    })
}

function exec(poll) {
    return function (req,res,next) {
        let p1 = new Promise((resolve)=>{
            pool.getConnection(function (err, connection) {
                if (err) {
                    logger.error(err);
                }
                resolve(res,connection);
            })
        })
    }
}

module.exports = {
    jsonWrite: jsonWrite,
    daoExec: daoExec,
    exec: exec
}