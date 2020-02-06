import app from '../../app/app.js';
import AbstractController from './AbstractController.js';

import VoiceCommon from '../voice/VoiceCommon.js';
import Voice from '../voice/VoiceQcmForm.js';

import Storage from '../models/QcmStorage.js';

const StorageQCM = new Storage();

export default class QcmAdd extends AbstractController {

    show() {
        app.mvc.loadView(`qcm/form_add`).then(() => {
            if(app.config.voiceEnable) {
                // on charge la possibilité d'utilser la voix
                // on bind l'objet courant
                VoiceCommon.bind(this, app).call()
                Voice.bind(this, app).call()
            }
             // Ajout du bouton enregistrer
             var node = document.createElement("button"); 
             var button = document.createTextNode("Enregistrer");
             node.appendChild(button);
             node.addEventListener('click', () => {
                 this.save()
             })
             node.className= 'btn btn-primary';
             app.dom.getElement('#formQcm').appendChild(node);
        });
    }


    // permet de récupérer le contenu à mettre dans la derniere réponse
    contentQcmName(title)
    {
        app.dom.getElement('#qcm_title').value = `${title.charAt(0).toUpperCase()}${title.substr(1)}`;
    }
}