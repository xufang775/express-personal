var mysql = require('mysql');
const orderById = 'iid';
const sqlTemplate = {
    select:'select ?? from ?? where 1=1 ?? ',
    insert:'insert into ?? ( ?? ) values(??)',
    update:'update ?? set ?? where ??',
    delete:'delete from ?? where ??'
};


function handlePagerSql(body) {
    let pageIndex = body.pageIndex ? body.pageIndex : 0,
        pageSize = body.pageSize ? body.pageSize : 10,
        pageStart = pageIndex * pageSize;
    let sqlOrderby1=mysql.format('order by iid limit ?,1',pageStart);
    let sqlOrderby2=mysql.format('order by iid limit ?',pageSize);
    return [sqlOrderby1,sqlOrderby2]
}
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
                let ysf = [' =',' >',' <',' >=',' <=',' is',' !='];
                ysf.forEach(fh=>{
                    let bb = key.length;
                    let aa = key.indexOf(fh);
                    if( key.indexOf(fh) == key.length - fh.length ){
                        if(typeof where[key] ==='string' && where[key].indexOf('select')>=0 && where[key].indexOf('from')>0){
                            // 值是sql语句
                            whereSql += ` and ${key} ( ${where[key]} ) `;
                            // whereValue.push(where[key]);
                        } else {
                            // 值
                            whereSql += ` and ${key} ? `;
                            whereValue.push(where[key]);
                        }
                    }
                })
            }
        });
    }
    return [whereSql,whereValue];
}
function handleSelect(sqlValue) {
    let selectV = sqlValue.select ? sqlValue.select : '*', fromV = sqlValue.from ;
    let [whereSql,whereValue] = handleSelectWhere(sqlValue.where);
    let [ select, from, where ] = sqlTemplate.select.split('??');
    let sqlRet = `${select}${selectV}${from}${fromV}${where}${whereSql}`;
    if(sqlValue.other){
        sqlRet += sqlValue.other;
    }
    let sql = mysql.format(sqlRet,whereValue);
    // console.log(sql);
    return sql;
}
function handleInsert() {
    
    let selectV = sqlValue.select ? sqlValue.select : '*', fromV = sqlValue.from ;
    let [whereSql,whereValue] = handleSelectWhere(sqlValue.where);
    let [ select, from, where ] = sqlTemplate.select.split('??');
    let sqlRet = `${select}${selectV}${from}${fromV}${where}${whereSql}`;
    if(sqlValue.other){
        sqlRet += sqlValue.other;
    }
    let sql = mysql.format(sqlRet,whereValue);
    // console.log(sql);
    return sql;
}

function pageSql(req,tableName,where) {
    // queryPage: `select * from cost_type where name like '%?%' and iid >=(select iid from cost_type order by iid limit ?,1) order by iid limit ?;`,
    // queryAllCount:`select count(*) as count from cost_type where name like '%?%' and deleteFlag = 0`
    let body = req.body;
    let [subOrderBy,baseOrderBy] = handlePagerSql(body);
    let subSql = handleSelect({select:orderById, from:tableName, where:where, other:subOrderBy});
    let baseSql = handleSelect({
        from:tableName,
        where:{
            ...where,
            [`${orderById} >=`]:subSql
        },
        other:baseOrderBy
    });
    let sqlCount = handleSelect({select:'count(*) as count', from:tableName, where:where});
    return [baseSql,sqlCount];
}
function insertSql({body},tableName) {
    // insert into ?? ( ?? ) values(??)
    let sqlTableName = tableName;
    let sqlFields = '';
    let sqlValues = '';
    let arrValues = [];
    Object.keys(body).forEach(field=>{
        if(body[field] || body[field] == false ){
            sqlFields += ','+field;
            sqlValues += ',?';
            arrValues.push(body[field])
        }
    })
    // 去掉第一个“，”
    sqlFields = sqlFields.substring(1);
    sqlValues = sqlValues.substring(1);
    sqlValues = mysql.format(sqlValues,arrValues);

    let insertArr = sqlTemplate.insert.split('??');
    let sqlRet = `${insertArr[0]}${sqlTableName}${insertArr[1]}${sqlFields}${insertArr[2]}${sqlValues}${insertArr[3]}`;
    return sqlRet;
}


module.exports = {
    handleSelect: handleSelect,
    handlePagerSql: handlePagerSql,
    pageSql:pageSql,
    insertSql: insertSql
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

function test() {
    let req = {
        body:{
            name:'xufang',
            deleteFlag:0
        }
    };
   let sql = insertSql(req,'cost_type');
   console.log(sql)
}
// test();