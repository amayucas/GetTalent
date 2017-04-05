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
    },
    function (session, results) {
        session.endConversation("Ya hemos terminado.Gracias "+session.userData.name+" por responder a mis preguntas");
    }
]);

bot.dialog('/inicio', [
    function (session) {
        session.send("Bienvenido al bot GetTalent. Este es un bot de preguntas.");
        session.send("Recuerda: en cualquier momento puedes salir diciendo 'salir'");
        builder.Prompts.text(session,"Tus respuestas se guardaran en nuestra base de datos. Por favor, introduce tu nombre:");
    },
    function (session, results,next) {
        session.userData.name=results.response;
        builder.Prompts.text(session,"Vale "+session.userData.name);
        next();
    },
    function (session) {
        session.beginDialog('/preguntas');
    }
]).triggerAction({ 
        matches: /get.*talent/i,
  })
  .cancelAction({ 
      matches: /salir/i,
      confirmPrompt: "¿Seguro que quieres salir?: (Si/No)"
  })
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
    { field: 'num', prompt: "Por favor, indica cuantas preguntas quieres que te haga:" },
    { field: 'question', prompt: "¿Cuanto es 1+1?" },
    { field: 'question2', prompt:"¿Cuanto es 1+1?" },
    { field: 'question3', prompt:"¿Cuanto es 1+1?" },
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
    { field: 'question21', prompt: "¿Cuanto es 1+1?" },
    { field: 'question22', prompt: "¿Cuanto es 1+1?"},
    { field: 'question23', prompt: "¿Cuanto es 1+1?" },
    { field: 'question24', prompt: "¿Cuanto es 1+1?" },
    { field: 'question25', prompt: "¿Cuanto es 1+1?" },
    { field: 'question26', prompt: "¿Cuanto es 1+1?" },
    { field: 'question27', prompt: "¿Cuanto es 1+1?" },
    { field: 'question28', prompt: "¿Cuanto es 1+1?" },
    { field: 'question29', prompt: "¿Cuanto es 1+1?" },
    { field: 'question30', prompt: "¿Cuanto es 1+1?" },
    { field: 'question31', prompt: "¿Cuanto es 1+1?" },
    { field: 'question32', prompt: "¿Cuanto es 1+1?" },
    { field: 'question33', prompt: "¿Cuanto es 1+1?" },
    { field: 'question34', prompt: "¿Cuanto es 1+1?" },
    { field: 'question35', prompt: "¿Cuanto es 1+1?" },
    { field: 'question36', prompt: "¿Cuanto es 1+1?" },
    { field: 'question37', prompt: "¿Cuanto es 1+1?" },
    { field: 'question38', prompt: "¿Cuanto es 1+1?" },
    { field: 'question39', prompt: "¿Cuanto es 1+1?" },
    { field: 'question40', prompt: "¿Cuanto es 1+1?" },
    { field: 'question41', prompt: "¿Cuanto es 1+1?" },
    { field: 'question42', prompt: "¿Cuanto es 1+1?" },
    { field: 'question43', prompt: "¿Cuanto es 1+1?" },
    { field: 'question44', prompt: "¿Cuanto es 1+1?" },
    { field: 'question45', prompt: "¿Cuanto es 1+1?" },
    { field: 'question46', prompt: "¿Cuanto es 1+1?" },
    { field: 'question47', prompt: "¿Cuanto es 1+1?" },
    { field: 'question48', prompt: "¿Cuanto es 1+1?" },
    { field: 'question49', prompt: "¿Cuanto es 1+1?" },
    { field: 'question50', prompt: "¿Cuanto es 1+1?" }
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