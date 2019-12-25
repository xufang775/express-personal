var mysql = require('mysql');
var baseMapping = require('./base.mapping');
var tableName = 'cost_type';
function handleWhere({body}) {
    let where = {
        'deleteFlag is':false,
    };
    if(body.name){
        where['name like'] = `${body.name}`;
    }
    return where;
}

module.exports = {
    page:(req)=>{
        return baseMapping.pageSql(req,tableName,handleWhere(req));
    }
};


// module.exports = {
//     queryPage: `select * from cost_type where name like '%?%' and iid >=(select iid from cost_type order by iid limit ?,1) order by iid limit ?;`,
//     queryAllCount:`select count(*) as count from cost_type where name like '%?%' and deleteFlag = 0`
// };