export default class AbstractController {
    constructor(app) {
        if (this.constructor === AbstractController) {
            throw new TypeError('Abstract class "AbstractController" cannot be instantiated directly');
        }
        this.app = app
    }
}