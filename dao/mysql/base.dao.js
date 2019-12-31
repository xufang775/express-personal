var mysql = require('mysql');
var config = require('../../config/db');
var logger = require('../../common/logger');

var common = require('./common');
var currentTime = require('../../common/getCurrentTime');
const { HTTP_CODE } = require('../../common/constant');
var pool = mysql.createPool(config.mysql);

async function exec(sql) {
    console.log(sql)
    let conn =await common.conn(pool);
    let result =await common.exec(conn,sql);
    conn.release();
    return result;
}
async function page(res,sql,sqlCount) {
    common.conn(pool).then(conn=>{
        common.exec(conn, sqlCount).then((result2) =>{
            console.log(result2)
        })
        common.exec(conn,sql).then(result =>{
            let ret;
            let count;
            if(result.length > 0){
                common.exec(conn, sqlCount).then(result2 =>{
                    if(result2){
                        count = result2[0].count;
                        ret = {
                            code: HTTP_CODE.c20000,
                            data: {
                                list: result,
                                total: count
                            }
                        }
                    }
                    common.jsonWrite(res, ret);
                    conn.release();
                });
            }
        });
    });
}
async function insert(res,sql) {
    let conn =await common.conn(pool);
    let result =await common.exec(conn,sql);
    let ret = {
        code: HTTP_CODE.c20000,
        data: result.affectedRows[0],
        message: result.affectedRows>0 ? '操作成功' : '操作失败'
    };
    common.jsonWrite(res, ret);
    conn.release();
}
async function update(res,sql) {
    let conn =await common.conn(pool);
    let result =await common.exec(conn,sql);
    let ret = {
        code: HTTP_CODE.c20000,
        data: result.affectedRows[0],
        message: result.affectedRows>0 ? '操作成功' : '操作失败'
    };
    common.jsonWrite(res, ret);
    conn.release();
}
async function deleteS(res,sql) {
    let conn =await common.conn(pool);
    let result =await common.exec(conn,sql);
    let ret = {
        code: HTTP_CODE.c20000,
        data: result.affectedRows[0],
        message: result.affectedRows > 0 ? '操作成功' : '操作失败'
    };
    common.jsonWrite(res, ret);
    conn.release();
}
async function select(res,sql) {
    let conn =await common.conn(pool);
    let result =await common.exec(conn,sql);
    let ret = {
        code: HTTP_CODE.c20000,
        data: {list: result},
        // message: result.affectedRows>0 ? '操作成功' : '操作失败'
    };
    common.jsonWrite(res, ret);
    conn.release();
}

module.exports = {
    exec:exec,
    page: page,
    insert: insert,
    update: update,
    delete: deleteS,
    select: select
};
