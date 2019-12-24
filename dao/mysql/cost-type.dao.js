var mysql = require('mysql');
var config = require('../../config/db');
var logger = require('../../common/logger');
var mapping = require('./cost-type.mapping');
var mapping2 = require('./sql-mapping');

var common = require('./common');
var currentTime = require('../../common/getCurrentTime');
const { HTTP_CODE } = require('../../common/constant');

var pool = mysql.createPool(config.mysql);

function queryPage(req, res, next) {
    common.conn(pool).then(conn=>{
        let sql = mapping.queryPage;
        let sqlCount = mapping.queryAllCount;
        let pageIndex = req.body.pageIndex ? req.body.pageIndex : 0,
            pageSize = req.body.pageSize ? req.body.pageSize : 10,
            pageStart = pageIndex * pageSize;
        let pager = [pageStart,pageSize];
        let { name } = req.body;
        let param = [ name, ...pager ];
        common.exec(conn,sql,param).then(result =>{
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

function query(req,res,next) {
    common.conn(pool).then(conn=>{

        let sql = mapping2.select({
            from:'cost_type',
            where:{
                'code in':[101414,1014],
                'deleteFlag is':false,
            }
        });

        common.exec(conn,sql).then(result =>{
            let ret;
            let count;
            if(result.length > 0){
                ret = {
                    code: HTTP_CODE.c20000,
                    data: {
                        list: result,
                        total: count
                    }
                }
                common.jsonWrite(res, ret);
                conn.release();

            }

        });
    });
}


module.exports = {
    queryPage: queryPage,
    query: query
};