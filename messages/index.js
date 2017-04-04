"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
var num=0;
var bot = new builder.UniversalBot(connector);

bot.dialog('/',[function (session) {
        builder.Prompts.text(session,'Bienvenido al bot GetTalent. Por favor, dime tu nombre: ');
    },
    function (session,results) {
        session.userData.name=results.response;
        builder.Prompts.text(session,'Este es un bot de preguntas. Por favor, indica cuantas preguntas quieres que te haga: ');
    },
    function (session,results) {
        num=results.response;
        session.beginDialog('/preguntas');
    },
    function (session, results) {
        builder.Prompts.text(session,"Gracias "+nombre+" por responder a mis preguntas");
    }
]);
//Preguntas que vamos a realizar y guardado de las respuestas
bot.dialog('/preguntas', [
    function (session, args) {
        // Guardamos el estado inicial
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};

        // Prompt user for next field
        builder.Prompts.text(session, questions[session.dialogData.index].prompt);
    },
    function (session, results) {
        // Save users reply
        var field = questions[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;

        // Check for end of form
        if (session.dialogData.index >= num) {
            // Return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        }
    }
]);
var questions = [
    { field: 'edad', prompt: "¿Cuantos años tienes?" }
];
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