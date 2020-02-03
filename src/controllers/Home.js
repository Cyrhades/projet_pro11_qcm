import app from '../../app/app.js';
import AbstractController from './AbstractController.js';

export default class Home extends AbstractController {
    show() {
        app.mvc.loadView(`home`).then(() =>{
            this.listener();
        });
    }

    listener() {

    }
}