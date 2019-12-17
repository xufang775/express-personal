const { promisify } = require('util');
const { readFile } = require('fs');
const readFileAsync = promisify(readFile);
const express = require('express');
const app = express();
const router = new express.Router();
const methods = [ 'get', 'post', 'put', 'delete' ];
app.use(router);

for (let method of methods) {
    app[method] = function (...data) {
        if (method === 'get' && data.length === 1) return app.set(data[0]);

        const params = [];
        for (let item of data) {
            if (Object.prototype.toString.call(item) !== '[object AsyncFunction]') {
                params.push(item);
                continue;
            }
            const handle = function (...data) {
                const [ req, res, next ] = data;
                item(req, res, next).then(next).catch(next);
            };
            params.push(handle);
        }
        router[method](...params);
    };
}

app.get('/', async function (req, res, next) {
    const data = await readFileAsync('./package.json');
    res.send(data.toString());
});

app.post('/', async function (req, res, next) {
    const data = await readFileAsync('./age.json');
    res.send(data.toString());
});

router.use(function (err, req, res, next) {
    // console.error('Error:', err);
    res.status(500).send('Service Error');
});

app.listen(3000, '127.0.0.1', function () {
    console.log(`Server running at http://${ this.address().address }:${ this.address().port }/`);
});