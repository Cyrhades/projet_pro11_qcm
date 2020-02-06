import VoiceQuestionForm from './VoiceQuestionForm.js';

export default function(app) {
    
    if(app.config.voiceEnable !== true) return;

    // on a besoin de pouvoir avoir les mêmes actions que lors de la création
    VoiceQuestionForm.bind(this, app).call()

    app.voice.addAction([`annuler`,`fermer`], () => {
        $('#formQuestionModal').modal('hide')
        $('#confirmDeleteQuestionModal').modal('hide')
    })

    // navigation dans la liste des questions
    app.voice.addAction([`suivante`, `question suivante`], () => {
        this.selectQuestionSuivante()
    })

    app.voice.addAction([`précédente`, `question précédente`], () => {
        this.selectQuestionPrecedente()
    })

    app.voice.addCommand([`modifier la question`], (number) => {
        if(number == 'une') number = 1;
        else if(number == 'de') number = 2;
        // l'utilisateur nomme les numéro de question de 1 à n
        // javascript les stock de 0 à n-1
        this.selectQuestion(number-1)
        this.openModifQuestion(number-1);
    })



    // @todo gérer des environnement pour les action et les commandes
    // par exemple ici cette action ne peut avoir lieu que sur la popUp de suppression
    app.voice.addAction([`supprimer`], () => {
        $('#btnConfirmDeleteQuestion').trigger('click')
    })
    // idem certaine action et/ou commandes ne doivent être effectuée que dans un contexte particulier
    app.voice.addAction([`enregistrer`, `enregistrer la question`], () => {
        let index = app.dom.getElement("#question").dataset.index;
        this.save(index)
        $('#formQuestionModal').modal('hide')
        this.loadQuestionsInList()
    })

    app.voice.addCommand([`supprimer la question`], (number) => {
        if(number == 'une') number = 1;
        else if(number == 'de') number = 2;
        // l'utilisateur nomme les numéro de question de 1 à n
        // javascript les stock de 0 à n-1
        this.selectQuestion(number-1)
        this.deleteQuestion(number-1)
    })
}