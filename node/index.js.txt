/* Partea de node */
const express = require('express');
const { readFile } = require('fs').promises;

const app = express();

let json;
let dataArray = new Array();

function processData(data) {
    for (let i = 0; i <= 13952; ++i) {
        let str = data.result['event' + i];

        if (!str) {
            continue;
        }

        if (str.description.length && str.date.length === 10) {
            dataArray.push({
                date: str.date,
                descr: str.description
            });
        }
    }
}

function getReversed() {
    dataArray.sort().reverse();
}

function putline(str) {
    return `<p id="fragment">${str}<p>\n`;
}

function getSortedByYear() {
    let result = "";
    let nr = 0;

    for (let i = 0; i < 20; ++i) {
        const obj = dataArray[i];
        if (nr < 20) {
            result += putline(`${obj.date}: ${obj.descr}`);
        }
    }

    return result;
}

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', async (req, res) => {
    res.send(await readFile('./hello.txt', 'utf8'));
});

app.get('/data', async (req, res) => {
    res.send(getSortedByYear());
});

app.get('/data/reverse', async (req, res) => {
    getReversed();
    res.send(getSortedByYear());
});

app.get('/num', async (req, res) => {
    res.send(`${parseInt(json.result.count)}`);
});

const defaultPort = 8080;
const port = process.env.PORT || defaultPort;

app.listen(port, async () => {
    json = JSON.parse(await readFile('./data2.json', 'utf-8'));
    processData(json);
    console.log(`App available at localhost:${port}`);
});