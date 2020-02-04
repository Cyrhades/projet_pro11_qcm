import app from './app.js';
import Voice from '../src/models/Voice.js';

import config from './config.js';

import Home from '../src/controllers/Home.js';
import Question from '../src/controllers/Question.js';


// --------------------------------------------------------------------------------------------------------------------
// INITIALISATION DE L'APPLICATION
// --------------------------------------------------------------------------------------------------------------------

function initializeRouter() {
    // Instancier ici le Vanilla Router dans l'objet "app.mvc.router"
    // ...
    app.mvc.router = new Router({
        mode: 'hash',
        root: '/index.html'
    });

    app.mvc.router.add('/', () => (new Home(app)).show() );
    app.mvc.router.add('/admin/questions', () => (new Question(app)).showList() );
    app.mvc.router.add('/admin/question/add', () => (new Question(app)).showFormAdd() );

    app.mvc.router.check().addUriListener();
}


// --------------------------------------------------------------------------------------------------------------------
// CODE PRINCIPAL
// --------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du routeur.
    initializeRouter()

    app.voice = new Voice()
    app.voice.init()

    app.voice.addAction([`autre`,`suivant`,`suivante`], () => {
        app.voice.corriger()
    })

    app.voice.addAction([`précédent`,`précédente`], () => {
        app.voice.precedent()
    })

    app.voice.addAction([`valider`], () => {
        app.voice.valider()
    })

    app.voice.addAction(['modifier','changer','corriger', 'oups'], () => {
        if( app.voice.lastAction ) {
            app.voice.nextAction = app.voice.lastAction
            app.voice.lastAction = null; 
        }
    })

    app.voice.addAction([`voir les questions`, `afficher les questions`, `voir toutes les questions`, `afficher toutes les questions`], () => {
        app.mvc.router.navigateTo('/admin/questions');
    })

    app.voice.addAction([`créer une question`, `ajouter une question`], () => {
        app.mvc.router.navigateTo('/admin/question/add');
    })

    app.voice.addAction(['créer un QCM'], () => {
        alert(`Il n'est pas encore possible de créer un QCM !`)
        //app.mvc.router.navigateTo('/creer_question');
    })

    app.voice.addAction([`aller à l'accueil`], () => {
        app.mvc.router.navigateTo('/')
    })

    app.voice.addAction([`changer la terminologie`, `modifier la terminologie`], 
        () => { },
        (term) => {
            // on veut récupérer la derniere action à effectuer
            app.voice.nextAction = app.voice.lastAction
            app.voice.changerTerminology(term)
        }
    )

    document.addEventListener('keyup', (e) => {
        if(e.keyCode == 32) {
            if(app.voice.started)
                app.voice.stop()
            else
                app.voice.start()
        }
    })

    // On démarre l'écoute des qu'on arrive
    app.voice.start()
    
});


