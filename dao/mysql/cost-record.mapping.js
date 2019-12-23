module.exports = {
  queryPage: `select * from cost_record where iid >=(select iid from cost_record order by iid limit ?,1) order by iid limit ?;`,
};