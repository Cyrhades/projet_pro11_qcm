import Voice from '../models/Voice.js';
import RouterVoice from './VoiceRouter.js';

export default function(app) {
    
    if(app.config.voiceEnable !== true) return;

    app.voice = new Voice()
    app.voice.init()

    RouterVoice(app)

    app.voice.addAction(['créer un QCM'], () => {
        alert(`Il n'est pas encore possible de créer un QCM !`)
        //app.mvc.router.navigateTo('/creer_question');
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