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
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('/preguntas');
    },
    function (session, results) {
        session.send("Gracuas %(nombre)s, por responder a mis preguntas.", results.response);
    }
]);

bot.dialog('/preguntas', [
    function (session, args) {
        // Guardamos el estado inicial de los parametros
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};
        // Preguntamos
        builder.Prompts.text(session, questions[session.dialogData.index].prompt);
    },
    function (session, results) {
        // Guardamos la respuesta
        var field = questions[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;

        // Condición de salida
        if (session.dialogData.index >= questions.length+session.dialogData.form['num']) {
            // Podemos mostrar los resultados o solo dar las gracias
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            if(session.dialogData.index<=2)
            // Siguiente pregunta
            session.replaceDialog('/preguntas', session.dialogData);
        }
    }
]);

var questions = [
    { field: 'num', prompt: "Bienvenido al bot GetTalent.Este es un bot de preguntas. Por favor, indica cuantas preguntas quieres que te haga:" },
    { field: 'nombre', prompt: "Por favor, indica tu nombre:" },
    { field: 'question', prompt: "¿Cuanto es 1+1?" }
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