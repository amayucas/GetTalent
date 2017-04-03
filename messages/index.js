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
    builder.Prompts.text(session,'Empecemos el test.¿Como te llamas?');
    },
    function (session,results){
        session.userData.name=results.response;
        session.send('Hola ' +session.userData.name+ ', Indica cuantas preguntas quieres que te haga: ');
    },
    function (session,results){
        var num=results.response;
        for(var i=0;i<num;i++){
            session.send('Pregunta: '+(i+1));
            session.beginDialog('/pregunta');
            var respuesta=results.response.entity;
            //Aquí pondríamos el archivo de texto de destino
        }
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
