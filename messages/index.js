"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var fs=require('fs');
var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector, [ function (session) {
    session.send('Empecemos el test');
},
function (session){
    fs.readFile('q8.txt', function (err, data) {
        if (err) {
            return session.send('Oops. Error reading file.');
        }
    var text= Buffer.from(data).toString();
    session.send(text);
    }
)}
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
