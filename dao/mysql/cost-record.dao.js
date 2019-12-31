var mysql = require('mysql');
var config = require('../../config/db');
var logger = require('../../common/logger');
var mapping = require('./cost-record.mapping');

var pool = mysql.createPool(config.mysql);


var bDao = require('./base.dao');
var bMapping = require('./base.mapping');
const { HTTP_CODE } = require('../../common/constant');
var currentTime = require('../../common/getCurrentTime');
var common = require('./common');
var tableName = 'cost_type';
var orderByConfig = 'id|asc|id asc';   // 排序字段| 排序sql字段
// var orderByConfig = 'id|desc';   // 排序字段| 排序sql字段


function queryPage(req, res, next) {
    common.conn(pool).then(conn=>{
        let sql = mapping.queryPage;
        let sqlCount = mapping.queryAllCount;
        let pageIndex = req.body.pageIndex ? req.body.pageIndex : 0,
            pageSize = req.body.pageSize ? req.body.pageSize : 10,
            pageStart = pageIndex * pageSize;
        let param = [pageStart,pageSize];
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


function queryMonth(req) {
    let body = req.body;
    let sql = `
      select DATE_FORMAT(costDate,'%Y-%m-%d') costDate,costItemId, b.itemName costItemName,a.remark,b.itemCode,sum(costPrice) costPrice
      ,group_concat(a.costPrice SEPARATOR '||') costPriceAll,group_concat(a.remark SEPARATOR '||') remarkAll
      ,a.costTypeCode,ctype.name costTypeName,ctype.field costTypeField
      from cost_record a
      left join cost_item b on a.costItemId = b.id
      left join cost_type ctype on a.costTypeCode = ctype.code
      where a.deleteflag=0 and DATE_FORMAT(a.costDate,'%Y-%m') = ?
      group by costDate,costItemId,costTypeCode
      order by costDate desc
    `;
    return mysql.format(sql,[body.searchDate]);
}
function queryYear(req) {
    let body = req.body;
    let sql = `
      select DATE_FORMAT(a.costDate,'%Y-%m') costMonth,costItemId, b.itemName costItemName,a.remark,b.itemCode,sum(costPrice) costPrice
      ,group_concat(DATE_FORMAT(a.costDate,'%Y-%m-%d') order by a.costDate SEPARATOR '||') costDateAll
      ,group_concat(a.costPrice order by a.costDate SEPARATOR '||') costPriceAll
      ,group_concat(a.remark order by a.costDate SEPARATOR '||') remarkAll
      ,a.costTypeCode,ctype.name costTypeName,ctype.field costTypeField
      from cost_record a
      left join cost_item b on a.costItemId = b.id
      left join cost_type ctype on a.costTypeCode = ctype.code
      where a.deleteflag=0 and DATE_FORMAT(a.costDate,'%Y') = ?
      group by DATE_FORMAT(a.costDate,'%Y-%m'),costItemId,costTypeCode
      order by costDate desc
    `;
    return mysql.format(sql,[body.searchDate]);
}

module.exports = {
    queryPage: queryPage,
    queryMonth: queryMonth,
    queryTable: async function(req,res,next){
        let body = req.body;
        let resultArr = [];
        let ret;
        switch (body.searchType){
            case 'month':
                let sqlMonth = queryMonth(req);
                resultArr = await bDao.exec(sqlMonth);
                break;
            case 'year':
                let sqlYear = queryYear(req);
                resultArr = await bDao.exec(sqlYear);
                break;
        }
        if(resultArr.length>0){
            ret = {
                code: HTTP_CODE.c20000,
                data: resultArr
            }
        } else {
            ret = {
                code: HTTP_CODE.c20000,
                data: resultArr
            }
        }
        common.jsonWrite(res,ret);
    }
};