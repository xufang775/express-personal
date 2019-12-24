module.exports = {
    insert:'insert into sys_role(id,roleCode,roleName,remark,addDate,enabled) values(uuid(),?,?,?,?,?)',
    delete:'delete from sys_role where id=?',
    deleteLogic: 'update sys_role set deleteFlag = 1 where id = ?',
    queryAll:'select * from sys_role where deleteFlag=0 order by sortNo desc',
    queryPage:''
};