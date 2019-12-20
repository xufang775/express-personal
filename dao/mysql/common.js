const fs = require('fs');
var mysql = require('mysql');
var conf = require('../../config/db');
var pool = mysql.createPool(conf.mysql)
var async = require('async');
var logger = require('../../common/logger');

function exec(conn,sql,params) {
    return new Promise((resolve)=>{
        if(params){
            conn.query(sql, params, function (err, result) {
                if (err) {
                    logger.error(err);
                    logger.error(err.sql);
                }
                resolve(result);
            })
        } else {
            conn.query(sql,function (err, result) {
                if (err) {
                    logger.error(err);
                }
                resolve(result);
            })
        }
    });
}

function conn(pool) {
    return new Promise((resolve)=>{
        pool.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
            }
            resolve(connection);
        })
    })
}

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



module.exports = {
    jsonWrite: jsonWrite,
    exec: exec,
    conn: conn
}