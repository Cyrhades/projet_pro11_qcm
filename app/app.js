let app = {
    // ----------------------------------------------------------------------------------------------------------------
    // MANIPULATION DU DOM DE L'APPLICATION
    // ----------------------------------------------------------------------------------------------------------------
    dom: {
        render : (html) => {
            document.querySelector('main.container').innerHTML = html;
        },
        
    },


    // ----------------------------------------------------------------------------------------------------------------
    // ARCHITECTURE MVC DE L'APPLICATION
    // ----------------------------------------------------------------------------------------------------------------
    mvc: {
        router: null,
        loadView : (view, params = {}) => {
            return fetch(`src/views/${view}.html`).then(response => response.text()).then(response => {
                app.dom.render(response, params)
            });
        }
    }, 

    voice: null,
    storage: null,
};

// L'application est exportée afin d'être accessible par d'autres modules.
export default app;