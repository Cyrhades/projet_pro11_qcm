export default function(app) {

    if(app.config.voiceEnable !== true) return;

    app.voice.nextAction = this.contentQuestion;

    
    app.voice.addAction([`autre`, `corriger`, `correction`, `suivant`, `suivante`], () => {
        app.voice.corriger()
    })

    app.voice.addAction([`précédent`,`précédente`], () => {
        app.voice.precedent()
    })

    app.voice.addAction([`valider`], () => {
        app.voice.valider()
    })

    app.voice.addAction(['modifier','changer','corriger', 'oups'], () => {
        if( app.voice.lastAction ) {
            app.voice.nextAction = app.voice.lastAction
            app.voice.lastAction = null; 
        }
    })
    
    app.voice.addAction([`créer une réponse`, `ajouter une réponse`], () => {
        this.addResponse()
    }, this.contentLastResponse)

    app.voice.addAction([`créer une réponse valide`, `créer une réponse correcte`, `ajouter une réponse valide`, `ajouter une réponse correcte`] , () => {
        this.addResponse(true)
    }, this.contentLastResponse)

    // valider une réponse après création
    app.voice.addAction([`cette réponse est valide`,`cette réponse est correcte`] , () => {
        let numAnswer = app.dom.getElements("#zone_reponses .form-group").length;
        this.changeValidResponse(numAnswer, true)
    }, this.contentLastResponse)

    // dévalider une réponse après création
    app.voice.addAction([`cette réponse n'est pas valide`,`cette réponse n'est pas correcte`, `cette réponse est incorrecte`] , () => {
        let numAnswer = app.dom.getElements("#zone_reponses .form-group").length;
        this.changeValidResponse(numAnswer, false)
    }, this.contentLastResponse)

    app.voice.addAction([`enregistrer`,`enregistrer la question`], () => {
        this.save()
    })

    app.voice.addAction([`enregistrer`,`enregistrer la question`], () => {},
    () => {
        app.dom.getElement('#question').value = `${question.charAt(0).toUpperCase()}${question.substr(1)} ?`;
    })
}