#!/usr/bin/env node

var yaml = require('js-yaml'),
    fs = require('fs');

var file = process.argv[2] || 'default.yaml';
var ages = yaml.safeLoad(fs.readFileSync(file, 'utf8'));

function btoa(str) {
    return (new Buffer(str, 'binary')).toString('base64');
}

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

console.log('export default "'+b64EncodeUnicode(JSON.stringify(ages))+'";\n');
