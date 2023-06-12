/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
let gameMode =''
let tiles = [...Array(9).keys()].map(x => ++x)
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Willkommen bei Tic Tac Toe! Möchtest du gegen einen Freund spielen oder gegen den Computer?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OpponentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OpponentIntent';
    },
    handle(handlerInput) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        let opponent = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Opponent')
        let speakOutput = ''
        if(opponent === 'Freund' || opponent === 'freund'){
            gameMode = 'pvp'
            let random = getRandomInt(2)
            switch (random){
                case 0: 
                    speakOutput = `Ok, Spieler O beginnt das Spiel. Wo möchtest du den ersten Zug platzieren? Spielmodi ist ${gameMode}`;
                    break;
                case 1:
                    speakOutput = `Ok, Spieler X beginnt das Spiel. Wo möchtest du den ersten Zug platzieren? Spielmodi ist ${gameMode}`;
                    break;
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Wo möchtest du den ersten Zug platzieren?')
            .getResponse();
        }
        else {
            gameMode = 'pvc'
            let random = getRandomInt(2)
            switch (random){
                case 0: 
                    speakOutput = `Ok, ich werde mein Bestes geben. Du darfst beginnen. Wo möchtest du den ersten Zug platzieren? Spielmodi ist ${gameMode}`;
                    break;
                case 1:
                    let firstMove = tiles[Math.floor(Math.random()*tiles.length)]
                    speakOutput = `Ok, ich werde mein Bestes geben. Diese Runde beginne ich. Möge der Bessere beginnen! Mein erster Zug ist auf Feld ${firstMove}. Jetzt bist du an der Reihe, wo möchtest du deinen Zug platzieren? Spielmodi ist ${gameMode}`;
                    tiles.splice(firstMove-1,1)
                    break;
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Wo möchtest du deinen Zug platzieren?')
            .getResponse();
        }
    }
};

const PlaceMoveIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlaceMoveIntent';
    },
    handle(handlerInput) {
        let tile = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Tile')
        let tileNumber = Number(tile)
        let indexOfTile = tiles.indexOf(tileNumber)
        if(indexOfTile > -1){
    /**        
            let speakOutput = `dein gewähltes Feld: ${tile}. TypeOf Tile: ${typeof tile}. TypeOf NumberTile: ${typeof tileNumber} . Verfügbare Felder: ${tiles} Der Index des Feldes im array: ${indexOfTile}. Da ist etwas schief gelaufen, bitte starte das Spiel neu!`
            tiles.splice(tileNumber-1,1)
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt('ADsad' )
                    .getResponse();
                    */
  
            if(gameMode==='pvp'){
                tiles.splice(tileNumber-1,1)
               let speakOutput = `Ok, dein Zug wurde auf Feld ${tile} platziert. Jetzt ist dein Gegner an der Reihe. Wo möchtest du deinen Zug platzieren?`
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt('Wo möchtest du deinen Zug platzieren?')
                    .getResponse();
            }
            else if(gameMode==='pvc'){
                let move = tiles[Math.floor(Math.random()*tiles.length)]
                let moveNumber = Number(move)
                tiles.splice(moveNumber-1,1)
                let speakOutput = `Ok, dein Zug wurde auf Feld ${tile} platziert. Jetzt bin ich an der Reihe. Ich platziere meinen Zug auf Feld ${move}. Jetzt bist du wieder an der Reihe, wo möchtest du deinen Zug platzieren?`
                tiles.splice(tileNumber-1,1)
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt('Wo möchtest du deinen Zug platzieren?')
                    .getResponse();
            }
            
        }
        else {
            let speakOutput = `dein gewähltes Feld: ${tile}. TypeOf Tile: ${typeof tile}. TypeOf NumberTile: ${typeof tileNumber} . Verfügbare Felder: ${tiles} Der Index des Feldes im array: ${indexOfTile}. Da ist etwas schief gelaufen, bitte starte das Spiel neu!`
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                    .getResponse();
        }
        

    }
};


const GameInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GameInfoIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Im Spielfeld sind noch folgende Felder frei: ${tiles}. Wo möchtest du deinen Zug platzieren?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Im Spielfeld sind noch folgende Felder frei: ${tiles}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        OpponentIntentHandler,
        PlaceMoveIntentHandler,
        GameInfoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();