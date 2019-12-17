var mysql = require('mysql');
var config = require('../../config/db');
var sql = require('./userSqlMapping');
var logger = require('../../common/logger');

// 使用连接池，
var pool = mysql.createPool(config.mysql);
var common = require('./common');

// var all = common.exec(pool).then((res,conn)=>{
//     conn.query(sql.queryAll,function (err,result) {
//         var ret;
//         if(err){
//             logger.error(err);
//         } else {
//             ret = {
//                 code: 0,
//                 data: result
//             };
//         }
//         common.jsonWrite(res,ret);
//         conn.release();
//     })
// });

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

module.exports = {
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
    all2: all2
}