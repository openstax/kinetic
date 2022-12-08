const fs = require('fs')
const cheerio = require('cheerio');

let data;

try {
    data = fs.readFileSync('./index.html', 'utf8')
} catch (err) {
    console.error(err)
}

const $ = cheerio.load(data);


console.log(
    $('body').html()
)

export {}
