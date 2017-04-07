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
        session.endConversation("Ya hemos terminado.Gracias por responder a mis preguntas");
    }
]);

bot.dialog('/inicio', [
    function (session) {
        session.send("Bienvenido al bot GetTalent. Este es un bot de preguntas.");
        builder.Prompts.choice(session,"Elige una opción:","Empezar un test|Salir");
    },
    function (session, results){
        switch (results.response.index) {
            case 0:
                session.beginDialog('/nuevo');
                break;
            case 1:
                session.endDialog("No dudes en volver a usarme cuando quieras.Nos vemos");
                break;
            default:
                session.endDialog();
                break;
        }
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
            default:
                callback(null, 0.0);
                break;
        }
    } 
});
bot.dialog('/nuevo',[
    function(session){
        builder.Prompts.text(session,"Tus respuestas se guardaran en nuestra base de datos. Por favor, introduce tu nombre:");
    },
    function(session,results,next){
        session.userData.name=results.response;
        builder.Prompts.text(session,"Vale "+session.userData.name+". Recuerda que puedes salir en cualquier momento diciendo 'get talent'.Empecemos el test:");
        next();
    },
    function (session) {
        session.beginDialog('/preguntas');
    }
]);
bot.dialog('/preguntas', [
    function (session, args) {
        // Guardamos el estado inicial de los parametros
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};
        // Preguntamos
        builder.Prompts.choice(session, questions[session.dialogData.index].prompt,questions[session.dialogData.index].choices);
    },
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
    { field: 'question4', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question5', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question6', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question7', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question8', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question9', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question10', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question11', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question12', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question13', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question14', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question15', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question16', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question17', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question18', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question19', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question20', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question21', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question22', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question23', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question24', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question25', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question26', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question27', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question28', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question29', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question30', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question31', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question32', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question33', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question34', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question35', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question36', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question37', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question38', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question39', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question40', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question41', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question42', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question43', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question44', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question45', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question46', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question47', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question48', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question49', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"},
    { field: 'question50', prompt: "¿Cuanto es 1+1?",choices:"1|2|3|4"}
];

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