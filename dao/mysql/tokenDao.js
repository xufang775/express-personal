var mysql = require('mysql');
var conf = require('../../config/db');
var jsonWebToken = require('jsonwebtoken');
var sqlMapping = require('./tokenSqlMapping');
var logger = require('../../common/logger');
const { CONSTANT , HTTP_CODE} = require('../../common/constant');

// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');

function getToken(role,req,res,next) {
    let { username,password } = req.body.data;
    common.conn(pool).then(connection=>{
        let sql = sqlMapping.queryByUserName;
        common.exec(connection,sql,username).then(result=>{
            console.log(result);
            let ret;
            if(result.length > 0) {
                let obj = result[0];
                if(obj.password === password){
                    ret = {
                        code: HTTP_CODE.c20000,
                        data: {
                            token: jsonWebToken.sign(
                                {uid: obj.username},
                                CONSTANT.SECRET_KEY,
                                { expiresIn: 60 * 60 * 24 * 30 }
                            ),
                            username: obj.username,
                            role: obj.role
                        },
                    }
                    ret.message = ret.data.token;
                } else {
                    ret = { code:HTTP_CODE.c20000, message:'对不起，密码错误！' };
                }
            } else {
                ret = { code:HTTP_CODE.c20000, message:'对不起，没有此用户！' };
            }
            common.jsonWrite(res, ret);
            connection.release();
        })


        // connection.query(sql, username, function (err, result) {
        //     if (err) {
        //         logger.error(err);
        //     }
        //     if (result.length > 0) {
        //         var obj = result[0];
        //         var ret;
        //         if (obj.password === password) {
        //             if (role === 'admin') {
        //                 ret = {
        //                     code: 0,
        //                     date: {
        //                         token: jsonWebToken.sign(
        //                             {uid: obj.username},
        //                             CONSTANT.SECRET_KEY,
        //                             { expiresIn: 60 * 60 * 24 * 30 }
        //                         ),
        //                         uid: obj.username,
        //                         // app
        //                     }
        //                 }
        //             } else {
        //                 ret = {
        //                     code: 0,
        //                     data: {
        //                         token: jsonWebToken.sign(
        //                             {uid: obj.username},
        //                             CONSTANT.SECRET_KEY,
        //                             { expiresIn: 60 * 60 * 24 * 30 }
        //                         ),
        //                         uid: obj.username,
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     common.jsonWrite(res, ret);
        //     connection.release();
        // })
    });

    // pool.getConnection(function (err, connection) {
    //     if(err){
    //         logger.error(err);
    //     }
    //     let sqlSentence = role === 'admin' ? sql.login : sql.queryById;
    //     connection.query(sqlSentence, username, function (err, result) {
    //         if (err) {
    //             logger.error(err);
    //         }
    //         if (result.length > 0) {
    //             var obj = result[0];
    //             var ret;
    //             if (obj.password === password) {
    //                 if (role === 'admin') {
    //                     ret = {
    //                         code: 0,
    //                         date: {
    //                             token: jsonWebToken.sign(
    //                                 {uid: obj.username},
    //                                 CONSTANT.SECRET_KEY,
    //                                 { expiresIn: 60 * 60 * 24 * 30 }
    //                             ),
    //                             uid: obj.username,
    //                             // app
    //                         }
    //                     }
    //                 } else {
    //                     ret = {
    //                         code: 0,
    //                         data: {
    //                             token: jsonWebToken.sign(
    //                                 {uid: obj.username},
    //                                 CONSTANT.SECRET_KEY,
    //                                 { expiresIn: 60 * 60 * 24 * 30 }
    //                             ),
    //                             uid: obj.username,
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         common.jsonWrite(res, ret);
    //         connection.release();
    //     })
    // })
}

function getInfo(req,res,next) {
    let token = req.query.token;
    let ret = {
        code: HTTP_CODE.c20000,
        data:{
            name: 'admin',
            avatar: '',
            roles:[
                {code:'01',roleName:'admin'},
                {code:'02',roleName:'user'},
            ]
        }
    }
    common.jsonWrite(res,ret)

    // common.conn(pool).then(conn=>{
    //
    // });
}

module.exports = {
    getToken: getToken,
    getInfo: getInfo
}