var mysql = require('mysql');
var config = require('../../config/db');
var pool = mysql.createPool(config.mysql);
var common = require('./common');

// sql格式化
function sqlFormat() {
    var sql = `select * from ?? where ?? = ?`;
    var inserts = ['cost_type','deleteFlag',0];
    sql = mysql.format(sql,inserts);
    console.log(sql)
}
// 混合查询语句
function sqlHunheSQL(conn) {
    let sql = 'select 1; select 2;'
    conn.query(sql,(err,results)=>{
        if (err) throw err;
        console.log(results)
    })
}

function sql2(connection) {
    var query = connection.query('SELECT 1; SELECT 2');
    query
        .on('fields', function(fields, index) {
            // the fields for the result rows that follow
            console.log(fields,index)
        })
        .on('result', function(row, index) {
            // index refers to the statement this result belongs to (starts at 0)
            console.log(row,index)
        });
}


common.conn(pool).then(conn=>{
    // // sql格式化
    // sqlFormat();
    // // 混合查询语句
    // sqlHunheSQL(conn);

    let sql = 'select 1; select 2;';
    conn.query(sql,(err,results)=>{
        if (err) throw err;
        console.log(results)
    })

    // sql2(conn);

    conn.release();
})
