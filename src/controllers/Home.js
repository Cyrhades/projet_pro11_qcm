import app from '../../app/app.js';
import AbstractController from './AbstractController.js';
// Navigation à la voix
import VoiceCommon from '../voice/VoiceCommon.js';
// Navigation au clavier
import KeyboardCommon from '../keyboard/KeyboardCommon.js';

export default class Home extends AbstractController {
    show() {
        app.mvc.loadView(`home`).then(() => {
            // chargement des dépendances
            this.loadDependencies(VoiceCommon,KeyboardCommon);
        });
    }
}