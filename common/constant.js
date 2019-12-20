const CONSTANT = {
    SECRET_KEY : 'screttKey'
};

const HTTP_METHOD = {
    OPTIONS:'OPTIONS',
    GET:'GET',
    POST:'POST'
};

// 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
const HTTP_CODE = {
    c20000: 20000,
    c50000: 50014,
    c50008: 50008,
    c50012: 50012,
    c50014: 50014
}
//  physics: 物理；  logic : 逻辑
const DELETE_TYPE = {
    physics: 1,
    logic: 2,
}

module.exports = {
    CONSTANT: CONSTANT,
    HTTP_METHOD: HTTP_METHOD,
    HTTP_CODE: HTTP_CODE,
    DELETE_TYPE: DELETE_TYPE
};