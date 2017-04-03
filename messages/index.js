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

var bot = new builder.UniversalBot(connector);
bot.dialog('/', [ function (session) {
    session.send('Bienvenido al bot de preguntas GetTalent. A continuación se le hara numerosas preguntas de diversos temas. Si te acuerdo, por favor indique su nombre:');
    },
    function (session,results){
        session.userData.name=results.response;
        builder.Prompts.text(session,'Hola ' +session.userData.name+ ', Indica cuantas preguntas quieres que te haga: ');
    },
    function (session,results){
        var num=results.response;
        for(var i=1;i<=num;i++){
            builder.Prompts.text(session,'Pregunta: '+i);
            session.beginDialog('/pregunta');
            var respuesta=results.response.entity;
            //Aquí pondríamos el archivo de texto de destino
        }
    },
    function (session) {
        builder.Prompts.text(session,'Vale ' +session.userData.name+'.');
        session.endDialog('Gracias por contestar a mis preguntas.Nos vemos.');
    }
]);
bot.dialog('/pregunta',function (session) {
        builder.Prompts.choice(session,"Si tuvieras que elegir entre estos colores cual elegírias:",['Rojo','Amarrillo','Verde','Azul']);
});
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
