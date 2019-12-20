var mysql = require('mysql');
var config = require('../../config/db');
var sql = require('./userSqlMapping');
var logger = require('../../common/logger');


// 使用连接池，
var pool = mysql.createPool(config.mysql);
var common = require('./common');

var all2 = function (req,res,next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
        }
        connection.query(sql.queryAll,function (err,result) {
            var ret;
            if(err){
                logger.error(err);
            } else {
                ret = {
                    code: 0,
                    data: result
                };
            }
            common.jsonWrite(res,ret);
            connection.release();
        })
    })
}
var all3 = function (req,res,next) {
    sqlExec(pool,res,sql).then((result)=>{
        let ret = {
            code: 0,
            data: result
        };
        common.jsonWrite(res, ret)
    })
}

module.exports = {
    add:function (req,res,next) {
        pool.getConnection(function (err,connection) {
            if(err){
                logger.error(err);
                return;
            }
            var param = req.body;
            // 建立链接，向表中插入值
            connection.query(
                sql.insert,
                [param.username,param.password,param.password2,param.enabled,param.delete_flag,param.remark,param.sort_no],
                (err,result)=>{
                    if(err){
                        logger.error(err);
                    } else {
                        result = {
                            code: 0,
                            msg: '增加成功'
                        }
                    }
                    common.jsonWrite(res,result);
                    connection.release();
                })
        })
    },
    queryAll: function (req,res,next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
            }
            connection.query(sql.queryAll,function (err,result) {
                var ret;
                if(err){
                    logger.error(err);
                } else {
                    ret = {
                        code: 0,
                        data: result
                    };
                }
                common.jsonWrite(res,ret);
                connection.release();
            })
        })
    },
    all: function (req,res,next) {
        common.exec(pool).then((conn)=>{
            conn.query(sql.queryAll,(err,result)=>{
                var ret;
                if(err){
                    logger.error(err);
                } else {
                    ret = {
                        code: 0,
                        data: result
                    };
                }
                common.jsonWrite(res,ret);
                conn.release();
            })
        });
    }
}