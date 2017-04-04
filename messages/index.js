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
        session.send("Gracias, por responder a mis preguntas.", results.response);
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
        if (session.dialogData.index >session.dialogData.form['num']) {
            // Podemos mostrar los resultados o solo dar las gracias
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // Siguiente pregunta
            session.replaceDialog('/preguntas', session.dialogData);
        }
    }
]);

var questions = [
    { field: 'num', prompt: "Bienvenido al bot GetTalent.Este es un bot de preguntas. Por favor, indica cuantas preguntas quieres que te haga:" },
    { field: 'question', prompt: "¿Cuanto es 1+1?",choice: ['Avion','Suelo','Toro'] },
    { field: 'question2', prompt: "¿Cuanto es 1+1?" },
    { field: 'question3', prompt: "¿Cuanto es 1+1?" },
    { field: 'question4', prompt: "¿Cuanto es 1+1?" },
    { field: 'question5', prompt: "¿Cuanto es 1+1?" },
    { field: 'question6', prompt: "¿Cuanto es 1+1?" },
    { field: 'question7', prompt: "¿Cuanto es 1+1?" },
    { field: 'question8', prompt: "¿Cuanto es 1+1?" },
    { field: 'question9', prompt: "¿Cuanto es 1+1?" },
    { field: 'question10', prompt: "¿Cuanto es 1+1?" },
    { field: 'question11', prompt: "¿Cuanto es 1+1?" },
    { field: 'question12', prompt: "¿Cuanto es 1+1?" },
    { field: 'question13', prompt: "¿Cuanto es 1+1?" },
    { field: 'question14', prompt: "¿Cuanto es 1+1?" },
    { field: 'question15', prompt: "¿Cuanto es 1+1?" },
    { field: 'question16', prompt: "¿Cuanto es 1+1?" },
    { field: 'question17', prompt: "¿Cuanto es 1+1?" },
    { field: 'question18', prompt: "¿Cuanto es 1+1?" },
    { field: 'question19', prompt: "¿Cuanto es 1+1?" },
    { field: 'question20', prompt: "¿Cuanto es 1+1?" },
    { field: 'question21', prompt: "¿Cuanto es 1+1?" }
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