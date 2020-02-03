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
    app.mvc.router.add('/creer_question', () => (new Question(app)).show() );

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


    app.voice.addAction('modifier', () => {
        console.log(app.voice.lastAction)
        if( app.voice.lastAction ) {
            app.voice.nextAction = app.voice.lastAction
            app.voice.lastAction = null; 
        }
    })


    app.voice.addAction(['créer une question'], () => {
        app.mvc.router.navigateTo('/creer_question');
    })

    app.voice.addAction(['créer un QCM'], () => {
        alert(`Il n'est pas encore possible de créer un QCM !`)
        //app.mvc.router.navigateTo('/creer_question');
    })

    app.voice.addAction([`aller à l'accueil`], () => {
        app.mvc.router.navigateTo('/')
    })

    app.voice.start()
});


