export default function(app) {
    if(app.config.keyboardShortcutEnable !== true) return;
 
    this.listenKeyBoard([
        // 13 = touche entrée, openQCM = ouverture popup avec formulaire pour QCM
        {keyCode: 13, cb : () => { 
            let index = parseInt(app.dom.getElement('.table-active').dataset.index);
            this.openQCM(index) 
        }},
        // 38 = fleche haut, selectQcmPrecedent = sélectionne le QCM précédente
        {keyCode: 38, cb : this.selectQcmPrecedent},
        // 40 = fleche bas, selectQcSuivant = sélectionne le QCM suivante
        {keyCode: 40, cb : this.selectQcmSuivant}
    ])
}