module.exports = {
    queryPage: `select * from cost_type where name like '%?%' and iid >=(select iid from cost_type order by iid limit ?,1) order by iid limit ?;`,
    queryAllCount:`select count(*) as count from cost_type where name like '%?%' and deleteFlag = 0`
};