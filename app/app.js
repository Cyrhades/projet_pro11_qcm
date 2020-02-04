let app = {
    // ----------------------------------------------------------------------------------------------------------------
    // MANIPULATION DU DOM DE L'APPLICATION
    // ----------------------------------------------------------------------------------------------------------------
    dom: {
        addEvent : (selector, event, eventHandler) => {
            document.querySelector(selector).addEventListener(event, eventHandler);
        },
        render : (selector, html) => {
            document.querySelector(selector).innerHTML = html;
        },
        getElement :(selector) => {
            return  document.querySelector(selector);
        },
        getElements: (selector) => {
            return document.querySelectorAll(selector);
        },
        templateToHtml : (tplSelector, targetSelector, generate, callback) => {
            if ("content" in document.createElement("template")) {
                let clone = document.importNode(app.dom.getElement(tplSelector).content, true);
                generate(clone)
                app.dom.getElement(targetSelector).appendChild(clone);
                if(callback) {
                    callback()
                }
            }
        },
        classSwitch(element, add, remove) {
            element.classList.add(add)
            element.classList.remove(remove)
        }
    },


    // ----------------------------------------------------------------------------------------------------------------
    // ARCHITECTURE MVC DE L'APPLICATION
    // ----------------------------------------------------------------------------------------------------------------
    mvc: {
        router: null,
        loadView : (view, target = 'main.container') => {
            return fetch(`src/views/${view}.html`).then(response => response.text()).then(response => {
                app.dom.render(target, response)
            });
        }
    }, 

    voice: null,
    storage: null,
};

// L'application est exportée afin d'être accessible par d'autres modules.
export default app;