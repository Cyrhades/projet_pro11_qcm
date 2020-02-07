export default function(app) {

    if(app.config.voiceEnable !== true) return;

    // ne dois être fait que sur la page de création
    if(app.mvc.router._currentPage.uri == 'admin/qcm/add') {
        app.voice.nextAction = this.contentQcmName;
    }

    app.voice.addAction([`fermer`, `annuler`], () => {
        $('#choiceQuestionModal').modal('hide')
    })

    // navigation dans la liste des questions
    app.voice.addAction([`suivante`, `question suivante`], () => {
        this.selectQuestionSuivante()
    })

    app.voice.addAction([`précédente`, `question précédente`], () => {
        this.selectQuestionPrecedente()
    })

    app.voice.addAction([`modifier le titre`, `changer le titre`, `modifier le titre du QCM`, `changer le titre QCM`], () => {
        app.voice.nextAction = this.contentQcmName;
    })
     
    app.voice.addAction([`rechercher une question`, `recherche une question`, `ajouter une question`,`chercher une question`], () => {
        $('#choiceQuestionModal').modal('show')
        app.voice.nextAction = this.contentFiltreQuestion;
    })
    
    app.voice.addAction(['modifier la recherche', 'changer la recherche'], () => {
        if( app.voice.lastAction ) {
            app.voice.nextAction = app.voice.lastAction
            app.voice.lastAction = null; 
        }
    })

    app.voice.addCommand([`ajouter`,`ajouter la question`, `rajouter la question`,`sélectionner la question`], (number) => {
        if(number == 'une' || number == 'un' ) number = 1;
        else if(number == 'de') number = 2;
        if(isNaN(number)) return;
        this.addQuestion(number-1)
    })

    app.voice.addAction([`enregistrer`,`enregistrer le QCM`], () => {
        this.save()
    })
}