export default function(app) {
    if(app.config.keyboardShortcutEnable !== true) return;
    
    this.listenKeyBoard([
        // 13 = touche entrée, openModifQuestion = ouverture popup avec formulaire pour modification
        {keyCode: 13, cb : this.openModifQuestion},
        // 46 = delete, deleteQuestion = ouvre popup pour supprimer la question courante
        {keyCode: 46, cb : () => { 
            let index = parseInt(app.dom.getElement('.table-active').dataset.index);
            this.deleteQuestion(index) 
        }},
        // 38 = fleche haut, selectQuestionPrecedente = sélectionne la question précédente
        {keyCode: 38, cb : this.selectQuestionPrecedente},
        // 40 = fleche bas, selectQuestionSuivante = sélectionne la question suivante
        {keyCode: 40, cb : this.selectQuestionSuivante}
    ])
}