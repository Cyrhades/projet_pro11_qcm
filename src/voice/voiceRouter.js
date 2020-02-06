export default (app) => {
    if(app.config.voiceEnable !== true) return;
    
    app.voice.addAction([`aller à l'accueil`, `retour à l'accueil`, `retourner à l'accueil`], () => {
        app.mvc.router.navigateTo('/')
    })

    app.voice.addAction([`voir les questions`, `afficher les questions`, `voir toutes les questions`, `afficher toutes les questions`], () => {
        app.mvc.router.navigateTo('/admin/questions');
    })

    app.voice.addAction([`créer une question`, `ajouter une question`,`créer une nouvelle question`,`ajouter une nouvelle question`], () => {
        app.mvc.router.navigateTo('/admin/question/add');
    })

    app.voice.addAction([`créer un QCM`, `ajouter un QCM`,`créer un nouveau QCM`,`ajouter un nouveau QCM`], () => {
        app.mvc.router.navigateTo('/admin/qcm/add');
    })
}