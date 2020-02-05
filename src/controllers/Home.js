import app from '../../app/app.js';
import AbstractController from './AbstractController.js';
import Voice from '../voice/VoiceCommon.js';


export default class Home extends AbstractController {
    show() {
        app.mvc.loadView(`home`).then( Voice.bind(this, app) );
    }
}