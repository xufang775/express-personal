var user = {
    queryByUserName: 'select * from sys_user where username=?',
    login: 'select * from sys_user where user_name=?'
};
module.exports = user;