var mysql = require('mysql');
var config = require('../../config/db');
var pool = mysql.createPool(config.mysql);
var common = require('./common');

const sqlTemplate = {
    select:'select ?? from ?? where 1=1 ?? ',
    insert:'insert into ?? ( ?? ) values(??)',
    update:'update ?? set ?? where ??',
    delete:'delete from ?? where ??'
};
function handleSelectWhere(where) {
    let whereSql='',whereValue=[];
    if(!where) return [whereSql,whereValue];
    if( where.length >= 0 ){
        console.log('array')
    } else if(typeof where == 'object'){

        Object.keys(where).forEach(key=>{
            if(key.indexOf('like')>=0){
                whereSql += ` and ${key} ? `;
                whereValue.push(where[key]);
            }
            else if(key.indexOf('in')>=0 && where[key] instanceof Array && where[key].length >0){
                whereSql += ` and ${key} (`;
                where[key].forEach(v=>{
                    whereSql += '?,'
                });
                whereSql = whereSql.substring(0,whereSql.length-1) + ')';
                whereValue.push( ...where[key]);
            } else{
                let ysf = ['=','>','<','>=','<=','is'];
                ysf.forEach(fh=>{
                    if(key.indexOf(fh)>=0){
                        whereSql += ` and ${key} ? `;
                        whereValue.push(where[key]);
                    }
                })
            }
        });
    }
    return [whereSql,whereValue];
}

function select(sqlValue) {
    let selectV = sqlValue.select ? sqlValue.select : '*', fromV = sqlValue.from ;
    let [whereSql,whereValue] = handleSelectWhere(sqlValue.where);
    let [ select, from, where ] = sqlTemplate.select.split('??');
    let sqlRet = `${select}${selectV}${from}${fromV}${where}${whereSql}`;
    let sql = mysql.format(sqlRet,whereValue);
    console.log(sql)
    return sql;
}
//
//
// common.conn(pool).then(conn=>{
//     select({
//         deleteFlag:false,
//         from:'cost_type',
//         where:{
//             "name like":'%首%',
//             'code in':[101414,1014],
//             'id =':123
//         }
//     });
//     select({
//         from:'cost_type',
//         where:{
//             'deleteFlag is':false,
//         }
//     });
//     conn.release();
// });

module.exports = {
    select: select
}