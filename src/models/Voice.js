export default class Voice {

    constructor() {
        this.current = 0;
        this.actions = [];
        this.nextAction = null;
        this.lastAction = null;
    }

    init() {
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
        var grammar = '#JSGF V1.0; grammar commands; public <command> = alerte|console'

        this.recognition = new SpeechRecognition()
        this.speechRecognitionList = new SpeechGrammarList()
        this.speechRecognitionList.addFromString(grammar, 1);
        this.recognition.grammars = this.speechRecognitionList;

        this.recognition.continuous = true;
        this.recognition.lang = 'fr-FR';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
    }

    addAction(commands, action, nextAction = {}) {
        if(typeof commands === 'string') {
            this.actions.push({commands,action, nextAction})
        } else {
            commands.forEach(command => {
                this.actions.push({command,action, nextAction})
            });
        }
    }

    start() {
        this.recognition.start()
        this.recognition.onresult = (event) => {
            let index = this.actions.findIndex((action) => { return event.results[this.current ][0].transcript.trim() == action.command });
            if( index >= 0 ) {
                this.actions[index].action.call()
                if(this.actions[index].nextAction) {
                    this.nextAction = this.actions[index].nextAction;
                }
            } else { 
                if(this.nextAction) {
                    //console.log(this.nextAction)
                    //console.log(event.results[this.current][0].transcript.trim())
                    this.nextAction.call(this, event.results[this.current][0].transcript.trim())
                    this.lastAction = this.nextAction; // permet la modification
                    this.nextAction = null;
                }
                else {
                    console.log(`commande non trouvée : ${event.results[this.current][0].transcript.trim()}`)
                }
            }
            this.current++
        }

        this.recognition.onnomatch = function(event) {
            console.log(`commande libre : ${event.results[this.current][0].transcript.trim()}`)
        }
    }
}