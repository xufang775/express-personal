var mysql = require('mysql');
var config = require('../../config/db');
var logger = require('../../common/logger');
var sqlMapping = require('./roleSqlMapping');
var pool = mysql.createPool(config.mysql);
var common = require('./common');
var currentTime = require('../../common/getCurrentTime');
const { HTTP_CODE, DELETE_TYPE} = require('../../common/constant');

function queryAll(req,res) {
    common.conn(pool).then(conn=>{
        var sql = sqlMapping.queryAll;
        common.exec(conn,sql).then(result => {
            let ret;
            if(result.length >= 0){
                ret = {
                    code: HTTP_CODE.c20000,
                    data: {
                        list: result
                    }
                }
            }
            common.jsonWrite(res, ret);
            conn.release();
        });
    });
}

function save(req, res) {
    common.conn(pool).then(conn =>{
        let data = req.body;
        let sql = sqlMapping.insert;
        let dataArr = [data.roleCode,data.roleName,data.remark,currentTime,data.enabled];
        console.log(dataArr)
        common.exec(conn, sql, dataArr).then(result=>{
            let ret;
            if(result.affectedRows>0){
                ret = {
                    code: HTTP_CODE.c20000,
                    data: {},
                    message: '操作成功'
                }
            } else {
                ret = {
                    code: HTTP_CODE.c50000,
                    data: {},
                    message: '操作失败'
                }
            }
            common.jsonWrite(res, ret);
            conn.release();
        });
    })
}

function deleteOne(req, res) {
    let data = req.body;
    let flag = data.flag;   //  physics: 物理；  logic : 逻辑
    let id = data.id;
    common.conn(pool).then(conn =>{
        let data = req.body;
        let sql = flag == DELETE_TYPE.physics ? sqlMapping.delete : sqlMapping.deleteLogic;
        common.exec(conn, sql, id).then(result=>{
            let ret;
            if(result.affectedRows>0){
                ret = {
                    code: HTTP_CODE.c20000,
                    data: {},
                    message: '操作成功'
                }
            } else {
                ret = {
                    code: HTTP_CODE.c50000,
                    data: {},
                    message: '操作失败'
                }
            }
            common.jsonWrite(res, ret);
            conn.release();
        });
    })
}

module.exports = {
    queryAll : queryAll,
    save: save,
    delete: deleteOne,
}