module.exports = {
    queryPage: `select * from cost_record where iid >=(select iid from cost_record order by iid limit ?,1) order by iid limit ?;`,
    queryAllCount:`select count(*) as count from cost_record where deleteFlag = 0`
};