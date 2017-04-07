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
        session.send("Para iniciarme di 'get talent'.");
   ,choices:"1|2|2|4"},
    function (session, results) {
        session.endConversation("Ya hemos terminado.Gracias por responder a mis preguntas");
    }
]);

bot.dialog('/inicio', [
    function (session) {
        session.send("Bienvenido al bot GetTalent. Este es un bot de preguntas.");
        builder.Prompts.text(session,"Tus respuestas se guardaran en nuestra base de datos. Por favor, introduce tu nombre:");
   ,choices:"1|2|2|4"},
    function (session, results,next) {
        session.userData.name=results.response;
        builder.Prompts.text(session,"Vale "+session.userData.name);
        next();
   ,choices:"1|2|2|4"},
    function (session) {
        session.beginDialog('/preguntas');
    }
]).triggerAction({ 
    onFindAction: function (context, callback) {
        // Recognize users utterance
        switch (context.message.text.toLowerCase()) {
            case 'get talent':
                // You can trigger the action with callback(null, 1.0) but you're also
                // allowed to return additional properties which will be passed along to
                // the triggered dialog.
                callback(null, 1.0, { topic: 'general' });
                break;
            case 'salir':
                callback(null,2.0);
                break;
            default:
                callback(null, 0.0);
                break;
        }
    } 
});
bot.dialog('/preguntas', [
    function (session, args) {
        // Guardamos el estado inicial de los parametros
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};
        // Preguntamos
        builder.Prompts.choice(session, questions[session.dialogData.index].prompt,questions[session.dialogData.index].choices);
   ,choices:"1|2|2|4"},
    function (session, results) {
        // Guardamos la respuesta
        var field = questions[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;
        // Condición de salida
        if (session.dialogData.index >=questions.length) {
            // Podemos mostrar los resultados o solo dar las gracias
            session.endDialog("Ya hemos terminado.Gracias por responder a mis preguntas");
        } else {
            // Siguiente pregunta
            session.replaceDialog('/preguntas', session.dialogData);
        }
    }
]);
var questions = [
    { field: 'question', prompt: "Which of these access specifiers must be used for main() method? ",choices:"private|public|protected|None of the mentioned"},
    { field: 'question1', prompt: "Which of these is used to access member of class before object of that class is created?",choices: "public|private|static|protected"},
    { field: 'question2', prompt:"Which of these is used as default for a member of a class if no access specifier is used for it?",choices: "private|public|public, within its own package|protected"},
    { field: 'question3', prompt:"What is the process by which we can control what parts of a program can access the members of a class?" ,choices:"Polymorphism|Abstraction|Encapsulation|Recursion"},
    { field: 'question4', prompt: "¿Cuanto es 1+1?",choices:"1|2|2|4"}
];
bot.on('addbot', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hola %s... Gracias por añadirme. Di 'Hola' para ver una demo", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));
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