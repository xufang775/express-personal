const url = {
    costType:'../dao/mysql/cost-type.dao',
    costRecord:'../dao/mysql/cost-record.dao',
};

module.exports = function (daoName) {
    return require(url[daoName]);
};