var jade = require('jade'),
fs = require('fs');

var dir = __dirname,
examples = fs.readdirSync(dir + '/examples'),
input = fs.readFileSync(dir + '/index.jade'),
output = dir + '/index.html';

var markup = jade.compile(input)({
    examples: examples
});

fs.writeFileSync(output, markup);

