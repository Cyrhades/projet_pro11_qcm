import app from './app.js';
import config from './config.js';
import routes from './routes.js';

// --------------------------------------------------------------------------------------------------------------------
// INITIALISATION DE L'APPLICATION
// --------------------------------------------------------------------------------------------------------------------
// on stock la config dans l'application
app.config = config;

function initializeRouter() {
    // Instancier ici le Vanilla Router dans l'objet "app.mvc.router"
    // ...
    app.mvc.router = new Router({
        mode: 'hash',
        root: '/index.html'
    });

    routes(app).forEach((route) => {
        app.mvc.router.add(route.url, route.controller);
    })

    app.mvc.router.check().addUriListener();
    app.mvc.navigate()
}

// --------------------------------------------------------------------------------------------------------------------
// CODE PRINCIPAL
// --------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du routeur.
    initializeRouter()

    if(app.config.voiceEnable) {
        app.dom.getElement("#block_microphone").style.display = "block"
        app.dom.getElement("#microphone").addEventListener('click', () => {
            if(app.voice.started) app.voice.stop()
            else app.voice.start()
        })
    }
});

window.addEventListener('hashchange', (e) => {
    app.mvc.navigate()
});

