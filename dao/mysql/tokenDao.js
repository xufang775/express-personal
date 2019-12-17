var mysql = require('mysql');
var conf = require('../../config/db');
var jsonWebToken = require('jsonwebtoken');
var sql = require('./tokenSqlMapping');
var logger = require('../../common/logger');
const { CONSTANT } = require('../../common/constant');

// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');

function getToken(role,req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    pool.getConnection(function (err, connection) {
        if(err){
            logger.error(err);
        }
        let sqlSentence = role === 'admin' ? sql.login : sql.queryById;
        connection.query(sqlSentence, username, function (err, result) {
            if (err) {
                logger.error(err);
            }
            if (result.length > 0) {
                var obj = result[0];
                var ret;
                if (obj.password === password) {
                    if (role === 'admin') {
                        ret = {
                            code: 0,
                            date: {
                                token: jsonWebToken.sign(
                                    {uid: obj.username},
                                    CONSTANT.SECRET_KEY,
                                    { expiresIn: 60 * 60 * 24 * 30 }
                                ),
                                uid: obj.username,
                                // app
                            }
                        }
                    } else {
                        ret = {
                            code: 0,
                            data: {
                                token: jsonWebToken.sign(
                                    {uid: obj.username},
                                    CONSTANT.SECRET_KEY,
                                    { expiresIn: 60 * 60 * 24 * 30 }
                                ),
                                uid: obj.username,
                            }
                        }
                    }
                }
            }
            common.jsonWrite(res, ret);
            connection.release();
        })
    })
}

module.exports = {
    getToken: getToken
}