export default function(app) {
    if(app.config.keyboardShortcutEnable !== true) return;
    
    this.listenKeyBoard([
        // 13 = touche entrée, openModifQuestion = ouverture popup avec formulaire pour modification
        //{keyCode: 13, cb : this.openModifQuestion},
    ])
}