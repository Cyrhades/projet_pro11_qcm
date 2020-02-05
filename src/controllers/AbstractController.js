export default class AbstractController {
    constructor(app) {
        if (this.constructor === AbstractController) {
            throw new TypeError('Abstract class "AbstractController" cannot be instantiated directly');
        }
        this.app = app
    }


    listenKeyBoard(actions) {
        document.addEventListener('keyup', (e) => {
            actions.forEach(action => {
                console.log(e.keyCode)
                if(action.keyCode == e.keyCode) {
                    action.cb.call(this,e)
                }
            })
        })
    }
}