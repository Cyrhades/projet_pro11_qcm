import app from '../../app/app.js';
export default class AbstractController {
    constructor(app) {
        if (this.constructor === AbstractController) {
            throw new TypeError('Abstract class "AbstractController" cannot be instantiated directly');
        }
        this.app = app
    }

    loadDependencies(...dependencies) {
        dependencies.forEach(dependency => {
            dependency.bind(this, app).call()
        })
    }

    listenKeyBoard(actions, selector = document) {
        $(selector).on('keyup', (e) => {
            actions.forEach(action => {
                //console.log(e.keyCode)
                if(action.keyCode == e.keyCode) {
                    e.stopImmediatePropagation();
                    action.cb.call(this,e)
                    return;
                }
            })
        })
    }
}