// var mysql = require('mysql');
var bDao = require('./base.dao');
var bMapping = require('./base.mapping');
const { HTTP_CODE } = require('../../common/constant');
var currentTime = require('../../common/getCurrentTime');
var common = require('./common');
var tableName = 'cost_type';
// var orderByConfig = 'id|asc|id asc';   // 排序字段| 排序sql字段
var orderByConfig = 'id|desc|id desc';   // 排序字段| 排序sql字段

function handleWhere(body) {
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
    if(body.parentCodeLength){
        where['length(code) ='] = body.parentCodeLength;
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
    maxCode:async (body)=>{
        let sqlMaxCode = bMapping.handleSelect({
            select:'max(code)+1 code',
            from:tableName,
            where: handleWhere(body)
        });
        let resultCode = await bDao.exec(sqlMaxCode);
        if(resultCode.length>0){
            return resultCode[0].code ? resultCode[0].code : body.parentCode + '10';
        } else {
            return '';
        }
    },
    page:(req)=> {
        // let orderbySql = ' id desc '; // orderbyKey
        return bMapping.pageSql(req,tableName,handleWhere(req.body),orderByConfig)
    },
    insert:async (req)=>{
        // 处理上传来的数据
        let body = req.body;
        let insertData = { ...body }; //{ name: body.name, remark: body.remark };

        // 处理 code 信息
        let maxWhere = {};
        if ( body.isTop ) {
            // 是顶级类型，则编码是两位数
            maxWhere.parentCodeLength = 2;
            let code = await mapping.maxCode(maxWhere);
            if(code){
                insertData.code = code;
            }
        } else {
            // 不是顶级类型，编码则为父级编码+ 两位数
            if(body.parentCode && body.parentCode.length > 0){
                maxWhere.parentCode = body.parentCode[body.parentCode.length-1];
                let code = await mapping.maxCode(maxWhere);
                if(code){
                    insertData.code = code;
                }
            }
        }
        insertData.addDate = currentTime;
        delete insertData.isTop;
        delete insertData.parentCode;
        console.log(insertData);
        return bMapping.insertSql(insertData,tableName, true)
    },
    cascader:(req)=>{
        return bMapping.handleSelect({
            select:'code value,name label,field',
            from:tableName,
            where: handleWhere(req.body)
        })
    },

};

module.exports = {
    page: async function(req,res,next) {
        let [sql,sqlCount] = mapping.page(req,res);
        await bDao.page(res,sql,sqlCount);
    },
    insert: async function(req,res,next) {
        
        let sql = await mapping.insert(req);
        console.log(sql)
        await bDao.insert(res,sql);
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
        // console.log(resultTree);
        let ret = {
            code: HTTP_CODE.c20000,
            data:resultTree
        }
        common.jsonWrite(res,ret);
    }
};