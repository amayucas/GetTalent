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
        session.send("Has dicho: %s .Para iniciarme di 'get talent'.",session.message.text);
    },
    function (session, results) {
        session.endConversation("Ya hemos terminado. Gracias por responder a mis preguntas.");
    }
]);
bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };
        if (context.message.text) {
            switch (context.message.text.toLowerCase()) {
                case 'get talent':
                    intent = { score: 1.0, intent: 'get talent' };
                    break;
                case 'salir':
                    intent = { score: 1.0, intent: 'Salir' };
                    break;
            }
        }
        done(null, intent);
    }
});
bot.dialog('/nuevo',[
    function(session){
        session.send("Bienvenido al bot GetTalent. Este es un bot de preguntas. Tienes 5s para responder a cada una de ellas. ");
        builder.Prompts.text(session,"Tus respuestas se guardaran en nuestra base de datos. Por favor, introduce tu nombre:");
    },
    function(session,results,next){
        session.userData.name=results.response;
        builder.Prompts.text(session,"Vale "+session.userData.name+". Recuerda que puedes salir en cualquier momento diciendo 'salir'. Empecemos el test:");
        next();
    },
    function (session) {
        session.beginDialog('/preguntas');
    }
]).triggerAction({ matches: 'get talent' });
bot.endConversationAction('Salida forzosa',"De acuerdo, nos vemos pronto.",{matches: 'Salir'});
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
        if(session.dialogData.index%5==0){
            session.dialogData.form[field] = results.response.index;
            switch(session.dialogData.form[field]){
                case 0:
                    session.send("A partir de ahora solo tienes 5s para responder.");
                    session.beginDialog('/preguntas2');
                    break;
                case 1:
                    session.send("A partir de ahora solo tienes 5s para responder.");
                    session.beginDialog('/preguntas3');
                    break;
                default:
                    break;
            }
        }
        else
            session.dialogData.form[field] = results.response;
        // Condición de salida
        if (session.dialogData.index >=questions.length) {
            // Podemos mostrar los resultados o solo dar las gracias
            session.endDialog("Ya hemos terminado. Gracias por responder a mis preguntas.");
        } else {
            // Siguiente pregunta
            session.replaceDialog('/preguntas', session.dialogData);
        }
    }
]);
bot.dialog('/preguntas2', [
    function (session, args) {
        // Guardamos el estado inicial de los parametros
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};
        setTimeout(function() {
           session.endDialog("Se han superado los 5 segundos para contestar.Siguiente pregunta:");
        }, 5000);
        // Preguntamos
        builder.Prompts.choice(session, questions2[session.dialogData.index].prompt,questions2[session.dialogData.index].choices);
    },
    function (session, results) {
        // Guardamos la respuesta
        var field = questions2[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;
        // Condición de salida
        if (session.dialogData.index >=questions2.length) {
            // Podemos mostrar los resultados o solo dar las gracias
            session.endDialog("Ya hemos terminado. Gracias por responder a mis preguntas.");
        } else {
            // Siguiente pregunta
            session.replaceDialog('/preguntas2', session.dialogData);
        }
    }
]);
bot.dialog('/preguntas3', [
    function (session, args) {
        // Guardamos el estado inicial de los parametros
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};
        setTimeout(function() {
           session.endDialog("Se han superado los 5 segundos para contestar.Siguiente pregunta:");
        }, 5000);
        // Preguntamos
        builder.Prompts.choice(session, questions3[session.dialogData.index].prompt,questions3[session.dialogData.index].choices);
    },
    function (session, results) {
        // Guardamos la respuesta
        var field = questions3[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;
        // Condición de salida
        if (session.dialogData.index >=questions3.length) {
            // Podemos mostrar los resultados o solo dar las gracias
            session.endDialog("Ya hemos terminado. Gracias por responder a mis preguntas.");
        } else {
            // Siguiente pregunta
            session.replaceDialog('/preguntas3', session.dialogData);
        }
    }
]);
var questions2 = [
    { field: 'question5', prompt: "Which of the following statements are incorrect? ",choices:"public members of class can be accessed by any code in the program|private members of class can only be accessed by other members of the class|private members of class can be inherited by a sub class, and become protected members in sub class|protected members of a class can be inherited by a sub class, and become private members of the sub class"},
    { field: 'question6', prompt: "Which of these access specifier must be used for class so that it can be inherited by another sub class?",choices:"public|private|protected|None of the mentioned"},
    { field: 'question7', prompt: "Which of these events is generated when a button is pressed?",choices:"ActionEvent|KeyEvent|WindowEvent|AdjustmentEvent"},
    { field: 'question8', prompt: "What is an event in delegation event model used by Java programming language?",choices:"An event is an object that describes a state change in a source|An event is an object that describes a state change in processing|An event is an object that describes any change by the user and system|An event is a class used for defining object, to create events"},
    { field: 'question9', prompt: "Which of these methods can be used to obtain the command name for invoking ActionEvent object? ",choices:"getCommand()|getActionCommand()|getActionEvent()|getActionEventCommand()"}
];
var questions3 = [
    { field: 'question10', prompt: "Which of these are integer constants defined in ActionEvent class?",choices:"ALT_MASK|CTRL_MASK|SHIFT_MASK|All of the mentioned"},
    { field: 'question11', prompt: "Which of these events is generated by scroll bar?",choices:"ActionEvent|KeyEvent|WindowEvent|AdjustmentEvent"},
    { field: 'question12', prompt: "Which of these methods can be used to determine the type of adjustment event?",choices:"getType()|getEventType()|getAdjustmentType()|getEventObjectType()"},
    { field: 'question13', prompt: "Which of these methods can be used to know the degree of adjustment made by the user?",choices:"getValue()|getAdjustmentType()|getAdjustmentValue()|getAdjustmentAmount()"},
    { field: 'question14', prompt: "Which of these functions is called to display the output of an applet?",choices:"display()|print()|displayApplet()|PrintApplet()"},
    { field: 'question15', prompt: "Which of these methods can be used to output a sting in an applet? ",choices:"display()|print()|drawString()|transient()"},
    { field: 'question16', prompt: "What does AWT stands for?",choices:"All Window Tools|All Writing Tools|Abstract Window Toolkit|Abstract Writing Toolkit"},
    { field: 'question17', prompt: "Which of these methods is a part of Abstract Window Toolkit (AWT)  ?",choices:"display()|print()|drawString()|transient()"},
    { field: 'question18', prompt: "Which of these modifiers can be used for a variable so that it can be accessed from any thread or parts of a program?",choices:"transient|volatile|global|No modifier is needed"},
    { field: 'question19', prompt: "Which of these operators can be used to get run time information about an object?",choices:"getInfo|Info|instanceof|getinfoof"}
];
var questions = [
    { field: 'question', prompt: "Which of these access specifiers must be used for main() method? ",choices:"private|public|protected|None of the mentioned"},
    { field: 'question1', prompt: "Which of these is used to access member of class before object of that class is created?",choices: "public|private|static|protected"},
    { field: 'question2', prompt:"Which of these is used as default for a member of a class if no access specifier is used for it?",choices: "private|public|public, within its own package|protected"},
    { field: 'question3', prompt:"What is the process by which we can control what parts of a program can access the members of a class?" ,choices:"Polymorphism|Abstraction|Encapsulation|Recursion"},
    { field: 'question4', prompt: "¿Continuamos con el test?.",choices:"+5 Preguntas|+10 Preguntas|Salir"}
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