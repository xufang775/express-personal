const url = {
    costType:'../dao/mysql/cost-type.dao',
    costTypeConfig:'../dao/mysql/cost-type-config.dao',
    costRecord:'../dao/mysql/cost-record.dao',
};

module.exports = function (daoName) {
    return require(url[daoName]);
};