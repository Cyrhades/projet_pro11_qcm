export default function(app) {
    if(app.config.keyboardShortcutEnable !== true) return;
    
    this.listenKeyBoard([
        // 13 = touche entrée, openModifQuestion = ouverture popup avec formulaire pour modification
        {keyCode: 13, cb : this.openModifQuestion},
        // 13 = delete, deleteQuestion = supprime la question courante
        {keyCode: 46, cb : this.deleteQuestion},
        // 38 = fleche haut, selectQuestionPrecedente = sélectionne la question précédente
        {keyCode: 38, cb : this.selectQuestionPrecedente},
        // 40 = fleche bas, selectQuestionSuivante = sélectionne la question suivante
        {keyCode: 40, cb : this.selectQuestionSuivante}
    ])
}