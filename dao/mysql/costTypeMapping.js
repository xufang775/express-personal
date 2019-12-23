module.exports = {
    insert:'insert into sys_role(id,roleCode,roleName,remark,addDate,enabled) values(uuid_short(),?,?,?,?,?)',
    delete:'delete from sys_role where id=?',
    deleteLogic: 'update sys_role set deleteFlag = 1 where id = ?',
    queryAll:'select * from cost_type where deleteFlag=0 order by sortNo desc',
    queryPage:''
};