export default function(app) {
    
    if(app.config.voiceEnable !== true) return;

    // navigation dans la liste des questions
    app.voice.addAction([`suivante`, `question suivante`, `confirmer`, `confirmer la question`, `confirmer la réponse`], () => {
        this.selectQuestionSuivante()
    })

    app.voice.addAction([`précédente`, `question précédente`], () => {
        this.selectQuestionPrecedente()
    })

    app.voice.addCommand([`QCM`, `faire le QCM`, `participer au QCM`], (number) => {
        if(number == 'une') number = 1;
        else if(number == 'de') number = 2;
        // démarrage du QCM
        this.openQCM(number-1)
    })

    
    app.voice.addCommand([`QCM`, `faire le QCM`, `participer au QCM`], (number) => {
        if(number == 'une') number = 1;
        else if(number == 'de') number = 2;
        // démarrage du QCM
        this.openQCM(number-1)
    })

    app.voice.addCommand([`sélectionner la réponse`, `valider la réponse`], (number) => {
        if(number == 'une') number = 1;
        else if(number == 'de') number = 2;
        // démarrage du QCM
        this.responseSelected(number-1)
    })

    app.voice.addCommand([`retirer la réponse`, `annuler la réponse`], (number) => {
        if(number == 'une') number = 1;
        else if(number == 'de') number = 2;
        // démarrage du QCM
        this.responseNoSelected(number-1)
    })
}