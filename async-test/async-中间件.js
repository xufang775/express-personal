const express = require('express');
const app = express();

app.use(function (req,res,next) {
    next();
});

app.get('/',function (req,res,next) {
    res.send('hello, world');
});

app.post('/', function (req,res,next) {
    res.send('hello,world')
});

app.listen(3000, '127.0.0.1', function () {
    console.log(`Server running at http://${ this.address().address }:${ this.address().port }/`);
});