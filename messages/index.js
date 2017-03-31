"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
const fs=require('fs');
var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
    session.send('You said ' + session.message.text);
},
function(session){
    var pregunta=fs.createReadStream('q8.txt', {start: 0, end: 64});
    session.send(pregunta);
    builder.Prompts.choice(session,'Select an option: ',[a,b,c,d]);
},
function(session,results){
    session.user.data=results.response;
    session.send('Has seleccionado la opcion '+session.user.data);
}
);

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
