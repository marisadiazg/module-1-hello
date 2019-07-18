"use strict";
var content = '<!DOCTYPE html>' +
    '<html>' +
    '    <head>' +
    '        <meta charset="utf-8" />' +
    '        <title>ECE AST</title>' +
    '    </head>' +
    '    <body>' +
    '         <p>Hello World !</p>' +
    '    </body>' +
    '</html>';
var url = require('url');
var qs = require('querystring');
// ./handles.js
// Necessary imports
module.exports = {
    serverHandle: function (req, res) {
        var route = url.parse(req.url);
        var path = route.pathname;
        var params = qs.parse(route.query);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        if (path === '/hello' && 'name' in params) {
            if (params['name'] === 'Marisa') {
                res.write('Marisa Jacqueline Diaz Garcia, Im 21 years old, mexican and I study in the ITESM');
            }
            else {
                res.write('Hello ' + params['name']);
            }
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404: NOT FOUND');
        }
        res.end();
    }
};
