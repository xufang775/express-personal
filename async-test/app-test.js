const express = require('express');
const app = express();
const { promisify } = require('util');
const { readFile } = require('fs');
const readFileAsync = promisify(readFile);

app.get('/', async function (req, res, next) {
    try{
        const data = await readFileAsync('./age.json');
        res.send(data.toString());
    } catch (e){
        next(e)
    }
});
// Error Handler
app.use(function (err, req, res, next) {
    console.error('Error:', err);
    res.status(500).send('Service Error');
});

app.listen(3000, '127.0.0.1', function () {
    console.log(`Server running at http://${ this.address().address }:${ this.address().port }/`);
});