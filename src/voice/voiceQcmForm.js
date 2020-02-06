export default function(app) {

    if(app.config.voiceEnable !== true) return;

    // ne dois être fait que sur la page de création
    if(app.mvc.router._currentPage.uri == 'admin/qcm/add') {
        app.voice.nextAction = this.contentQcmName;
    }

    app.voice.addAction([`modifier le titre`, `changer le titre`, `modifier le titre du QCM`, `changer le titre QCM`], () => {
        app.voice.nextAction = this.contentQcmName;
    })
 
    app.voice.addAction([`rechercher une question`, `ajouter une question`,`chercher une question`], () => {
        
    })



    

}