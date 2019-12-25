// var mysql = require('mysql');
var bDao = require('./base.dao');
var bMapping = require('./base.mapping');
const { HTTP_CODE } = require('../../common/constant');
var common = require('./common');
var tableName = 'cost_type';

function handleWhere(req) {
    let body = req.body;
    let where = {
        'deleteFlag is':false,
    };
    if(body.name){
        where['name like'] = `${body.name}`;
    }
    if(body.parentCode){
        where['code like'] = `${body.parentCode}%`;
        where['code !='] = body.parentCode;
    }
    if(body.userId){
        where['addUserId ='] = body.userId;
    }
    return where;
}

function TreeRead(list,parentCode) {
    let  subList = list.filter(m=>m.value.indexOf(parentCode) == 0 && m.value.length ==parentCode.length+2 );
    subList.forEach(item=>{
        let children = TreeRead(list,item.value);
        if(children.length > 0){
            item.children= children;
        }
    })
    return subList;
}

const mapping = {
    page:(req)=> bMapping.pageSql(req,tableName,handleWhere(req)),
    insert:(req)=>bMapping.insertSql(req,tableName),
    cascader:(req)=>{
        return bMapping.handleSelect({
            select:'code value,name label,field',
            from:tableName,
            where: handleWhere(req)
        })
    },
};

module.exports = {
    page: async function(req,res,next) {
        let [sql,sqlCount] = mapping.page(req,res);
        await bDao.page(res,sql,sqlCount);
    },
    insert: async function(req,res,next) {
        let sql = mapping.insert(req);
        await bDao.page(res,sql);
    },
    cascader: async function(req,res,next){
        let sql = mapping.cascader(req);
        let resultAll = await bDao.exec(sql);
        let resultTree = resultAll.filter(m=>m.value.length == 2);
        resultTree.forEach(item=>{
            let children = TreeRead(resultAll,item.value);
            if(children.length > 0){
                item.children= children;
            }
        });
        console.log(resultTree);
        let ret = {
            code: HTTP_CODE.c20000,
            data:resultTree
        }
        common.jsonWrite(res,ret);
    }
};