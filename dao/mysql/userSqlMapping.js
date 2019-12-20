module.exports = {
    insert:'insert into sys_user(id,user_name,password,password2,enabled,delete_flag,remark,sort_no) values(uuid(),?,?,?,?,?,?,?)',
    queryAll: 'select * from sys_user'
};


