export default function(app) {
    
    if(app.config.voiceEnable !== true) return;

    app.voice.addAction([`modifier la question`,`changer la question`], () => {
        app.voice.nextAction = this.contentQuestion
    })

    app.voice.addAction([`annuler`,`fermer`], () => {
        $('#formQuestionModal').modal('hide')
    })

    // navigation dans la liste des questions
    app.voice.addAction([`suivante`, `question suivante`], () => {
        this.selectQuestionSuivante()
    })

    app.voice.addAction([`précédente`, `question précédente`], () => {
        this.selectQuestionPrecedente()
    })

    app.voice.addCommand([`modifier la question`, `question`], (number) => {
        // l'utilisateur nomme les numéro de question de 1 à n
        // javascript les stock de 0 à n-1
        this.selectQuestion(number-1)
        this.openModifQuestion(number-1);
    })

    app.voice.addCommand([`supprimer la question`, `supprimer`], (number) => {
        // l'utilisateur nomme les numéro de question de 1 à n
        // javascript les stock de 0 à n-1
        this.selectQuestion(number-1)
        this.deleteQuestion(number-1);
    })
}