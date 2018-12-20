#!/usr/bin/env node

'use strict';

var ngrok = require('ngrok');
var http = require('http');
var httpProxy = require('http-proxy');

var NGROK_PORT = 5050;
var NGROK_HOST = '0.0.0.0';

var argv = require('yargs')
    .usage('Usage: $0 [options]')
    .alias('b', 'backend-url')
	.alias('d', 'subdomain')
	.alias('t', 'authtoken')
    .alias('u', 'firebase-url')
    .alias('s', 'firebase-secret')
    .alias('p', 'plugin')
    .alias('a', 'access-token')
    .describe('b', 'Backend service URL ie: http://0.0.0.0:3000')
    .describe('u', 'Firebase URL (x-firebase-url)')
    .describe('s', 'Firebase secret (x-firebase-secret)')
    .describe('p', 'Plugin namespace (x-plugin)')
    .describe('a', 'Zengine access token')
	.describe('t', 'authtoken your license from ngrok for upgraded accounts')
	.describe('d', 'custom subdomain if authtoken provided (requires a upgraded account)')
    .default('b', 'http://0.0.0.0:3000')
    .help('h')
    .alias('h', 'help')
    .argv;

var proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {

    var headers = [
        'firebase-url',
        'firebase-secret',
        'plugin',
        'access-token'
    ];

    headers.forEach(function(header) {

        if (argv[header]) {
            
            var headerName = 'x-' + header;
            var headerValue = argv[header];

            if (header === 'access-token') {
                headerName = 'authorization';
                headerValue = 'Bearer ' + argv.accessToken
            }

            proxyReq.setHeader(headerName, headerValue)
        }
    });

});

proxy.on('error', function(err, req, res) {
    console.log(err);
});

ngrok.once('connect', function(url) {
    console.log('ngrok accepting connections on ' + url);
    console.log('inspect connections on http://0.0.0.0:4040');
});

ngrok.once('disconnect', function() {
    console.log('ngrok disconnected');
});

ngrok.once('error', function(error) {
    console.log(error);
});

var options = { addr: NGROK_HOST + ':' + NGROK_PORT};

if (argv.authtoken) {
	options.authtoken = argv.authtoken;
}
if (argv.subdomain) {
	options.subdomain = argv.subdomain;
}
ngrok.connect(options);

var server = http.createServer(function(req, res) {
    proxy.web(req, res, { target: argv.backendUrl });
});

server.listen(5050);
