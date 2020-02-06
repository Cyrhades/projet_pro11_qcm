import Voice from '../models/Voice.js';
import RouterVoice from './VoiceRouter.js';

export default function(app) {
    
    if(app.config.voiceEnable !== true) return;

    app.voice = new Voice()
    app.voice.init()

    RouterVoice(app)

    app.voice.addAction([`autre`, `corriger`, `correction`, `suivant`, `suivante`], () => {
        app.voice.corriger()
    })

    app.voice.addAction([`précédent`,`précédente`], () => {
        app.voice.precedent()
    })

    app.voice.addAction([`valider`], () => {
        app.voice.valider()
    })

    app.voice.addAction(['modifier', 'changer', 'oups'], () => {
        if( app.voice.lastAction ) {
            app.voice.nextAction = app.voice.lastAction
            app.voice.lastAction = null; 
        }
    })
    
    app.voice.addAction([`changer la terminologie`, `modifier la terminologie`], 
        () => { },
        (term) => {
            // on veut récupérer la derniere action à effectuer
            app.voice.nextAction = app.voice.lastAction
            app.voice.changerTerminology(term)
        }
    )

    // On démarre l'écoute des qu'on arrive
    app.voice.start()
}