import app from '../../app/app.js';
import AbstractController from './AbstractController.js';
import Storage from '../models/QuestionStorage.js';

const StorageQuestion = new Storage();

export default class Question extends AbstractController {
    show() {
        app.mvc.loadView(`question`).then(() =>{
            this.listener();
        });
    }

    listener() {
        this.app.voice.nextAction = (question) => {
            document.getElementById('question').value = question
        };

        this.app.voice.addAction([`créer une réponse`, `ajouter une réponse`], () => {
            this.addResponse()
        }, this.contentResponse)

        this.app.voice.addAction([`créer une réponse valide`, `créer une réponse correcte`, `ajouter une réponse valide`] , () => {
            this.addResponse(true)
        }, this.contentResponse)

        // valider une réponse après création
        this.app.voice.addAction([`cette réponse est valide`,`cette réponse est correcte`] , () => {
            let numAnswer = document.querySelectorAll("#zone_reponses .form-group").length;
            document.getElementById(`response_${numAnswer}`).dataset.valid = 1 
            document.getElementById(`response_${numAnswer}`).parentNode.classList.add('has-success')
            document.getElementById(`response_${numAnswer}`).parentNode.classList.remove('has-error')
        }, this.contentResponse)

        // dévalider une réponse après création
        this.app.voice.addAction([`cette réponse n'est pas valide`,`cette réponse n'est pas correcte`, `cette réponse est incorrecte`] , () => {
            let numAnswer = document.querySelectorAll("#zone_reponses .form-group").length;
            document.getElementById(`response_${numAnswer}`).dataset.valid = 0
            document.getElementById(`response_${numAnswer}`).parentNode.classList.add('has-error')
            document.getElementById(`response_${numAnswer}`).parentNode.classList.remove('has-success')
        }, this.contentResponse)
    
        this.app.voice.addAction([`enregistrer la question`], () => {
            let question = document.getElementById('question').value;
            let responses = Array.from(document.querySelectorAll("#zone_reponses .form-group input"))
                                .map((response) => { return { text:response.value, valid: response.dataset.valid } });

            // Enregistrer dans LocalStorage
            StorageQuestion.add(question, responses)

            document.getElementById('question').value = ""
            document.getElementById('zone_reponses').innerHTML = ""
        })
    }

    addResponse(isValid = false)
    {
       if ("content" in document.createElement("template")) {
            let clone = document.importNode(document.getElementById("tpl_response").content, true);
            
            let numAnswer = document.querySelectorAll("#zone_reponses .form-group").length+1;

            if(isValid)
                clone.querySelector("div").classList.add('has-success')
            else
                clone.querySelector("div").classList.add('has-error')

            let label = clone.querySelector("label");
            label.textContent = `Réponse ${numAnswer}`;
            label.setAttribute('for',  `response_${numAnswer}`);

            let input = clone.querySelector("input");
            input.setAttribute('placeholder', `Réponse ${numAnswer}`);
            input.setAttribute('id', `response_${numAnswer}`);
            input.dataset.valid = isValid ? 1 : 0

            document.getElementById("zone_reponses").appendChild(clone);
        }
    }

    contentResponse(answer)
    {
        let nodes = document.querySelectorAll('#zone_reponses input')
        var last = nodes[nodes.length-1];
        last.value = answer
    }
}