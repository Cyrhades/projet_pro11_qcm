export default function(app) {

    if(app.config.voiceEnable !== true) return;

    // ne dois être fait que sur la page de création
    if(app.mvc.router._currentPage.uri == 'admin/question/add') {
        app.voice.nextAction = this.contentQuestion;
    }
 
    
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

    app.voice.addAction([`modifier la question`,`changer la question`,`modifier l'intitulé`,`changer l'intitulé`], () => {
        app.voice.nextAction = this.contentQuestion
    })
    
    app.voice.addCommand([`modifier la réponse`], (number) => {
        if(number == 'une') number = 1;
        else if(number == 'de') number = 2;

        app.voice.nextAction = (answer) => { this.contentResponse(answer, number) }
    })
}