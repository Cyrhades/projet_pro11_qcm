export default class Voice {

    constructor() {
        this.started = false;
        this.current = 0;
        this.actions = [];
        this.nextAction = null;
        this.lastAction = null;
        this.lastResponse;
        this.lastIndexAlternative = 0;
        this.currentCorrection = null;
    }

    init() {
        this.changerTerminology('commande');

        this.recognition.continuous = true;
        this.recognition.lang = 'fr-FR';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 5;

        this.recognition.onresult = (event) => {
            let index = this.actions.findIndex((action) => { return event.results[this.current][0].transcript.trim() == action.command });
            if( index >= 0 ) {
                this.actions[index].action.call()
                if(this.actions[index].nextAction) {
                    this.nextAction = this.actions[index].nextAction;
                }
            } else { 
                this.lastResponse = event;
                if(this.nextAction) {
                    //console.log(this.nextAction)
                    //console.log(event.results[this.current][0].transcript.trim())
                    this.nextAction.call(this, event.results[this.current][0].transcript.trim(), event)
                    this.lastAction = this.nextAction; // permet la modification
                    this.nextAction = null;
                }
                else {
                    console.log(`commande non trouvée : ${event.results[this.current][0].transcript.trim()}`)
                }
            }
            this.current++
        }
    }

    valider() {
        this.lastIndexAlternative = 0;
        this.lastResponse = null;
        this.currentCorrection = null;
    }

    precedent() {
        // -2 car il y a un +1 dans corriger()
        this.lastIndexAlternative = this.lastIndexAlternative-2;
        this.corriger();
    }

    corriger() {
        if(this.lastResponse!== null) {
            if(this.currentCorrection == null) {
                this.currentCorrection = this.lastResponse.results.length-1;
            }

            if(this.lastIndexAlternative < this.recognition.maxAlternatives-1) {
                this.lastIndexAlternative++;
            } else {
                this.lastIndexAlternative = 0;
            }

            this.lastAction.call(
                this, 
                this.lastResponse.results[this.currentCorrection][this.lastIndexAlternative].transcript.trim(), 
                this.lastResponse
            );
        }
    }


    addAction(commands, action, nextAction = null) {
        if(typeof commands === 'string') {
            this.actions.push({commands,action, nextAction})
        } else {
            commands.forEach(command => {
                this.actions.push({command,action, nextAction})
            });
        }
    }

    start() {
        if(this.started === false) {
            this.started = true;
            this.recognition.start()
        }
    }

    stop() {
        if(this.started === true) {
            this.started = false;
            this.current = 0;
            this.recognition.stop()
        }
    }

    changerTerminology(term = null)
    {
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
        let grammar;
        switch(term) {
            case 'color' :
            case 'colors' :
            case 'couleur' :
            case 'couleurs' :
                grammar = '#JSGF V1.0; grammar colors; public <color> = vert | bleu | rouge | pourpre | noir | violet'
            break;
            default :
                grammar = '#JSGF V1.0; grammar commands; public <command> = alerte|console';
        }

        this.recognition = new SpeechRecognition()
        this.speechRecognitionList = new SpeechGrammarList()
        this.speechRecognitionList.addFromString(grammar, 1);
        this.recognition.grammars = this.speechRecognitionList;
    }
}