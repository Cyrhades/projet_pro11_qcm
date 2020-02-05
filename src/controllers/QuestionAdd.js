import app from '../../app/app.js';
import AbstractController from './AbstractController.js';

import VoiceCommon from '../voice/VoiceCommon.js';
import Voice from '../voice/VoiceQuestionForm.js';


export default class QuestionAdd extends AbstractController {

    show() {
        app.mvc.loadView(`question/form_add`).then(() => {
            if(app.config.voiceEnable) {
                // on charge la possibilité d'utilser la voix
                //on bind l'objet courant
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
            app.dom.getElement('#formQuestion').appendChild(node);
        });
    }


    addResponse(isValid = false)
    {
        let numAnswer = app.dom.getElements("#zone_reponses .form-group").length+1;
        app.dom.templateToHtml("#tpl_response", "#zone_reponses", (clone) => {
            let label = clone.querySelector("label");
            label.textContent = `Réponse ${numAnswer}`;
            label.setAttribute('for',  `response_${numAnswer}`);

            let input = clone.querySelector("input");
            input.setAttribute('placeholder', `Réponse ${numAnswer}`);
            input.setAttribute('id', `response_${numAnswer}`);
            input.dataset.valid = 0;
        }, () => {
            this.changeValidResponse(numAnswer, isValid)
            app.dom.addEvent(`#response_${numAnswer}`, 'click', (event) => {
                this.changeValidResponse(numAnswer, event.currentTarget.dataset.valid == 1 ? false : true)
            })
        })     
    }

    changeValidResponse(numAnswer, isValid = false)
    {
        app.dom.getElement(`#response_${numAnswer}`).dataset.valid = isValid ? 1 : 0
        if(isValid) {
            app.dom.classSwitch( app.dom.getElement(`#response_${numAnswer}`).parentNode, 'has-success', 'has-error') 
        } else {
            app.dom.classSwitch( app.dom.getElement(`#response_${numAnswer}`).parentNode, 'has-error', 'has-success') 
        }
    }
    
    deleteQuestion(index) {

        if(isNaN(index)) {
            return;
        }
        var question = StorageQuestion.get(index);

        $('#confirmDeleteQuestionModal').modal('show')
        $('#confirmDeleteQuestionModal').on('shown.bs.modal', () => {
            $('#confirmDeleteQuestionContent').html(`Etes vous sur de vouloir supprimer la question ?<br /><br />"${question.question}"`)
            // @todo : vérifier si keyboard actif
            $('#confirmDeleteQuestionModal').on('keyup', (e) => {
                if(46 == e.keyCode) {
                    $('#btnConfirmDeleteQuestion').trigger('click')
                }
            })
        })
        $('#btnConfirmDeleteQuestion').on('click', () => {
            StorageQuestion.delete(index)
            this.loadQuestionsInList()

            $('#confirmDeleteQuestionModal').modal('hide')
        })        
    }

    // permet de récupérer le contenu à mettre dans la derniere réponse
    contentLastResponse(answer)
    {
        let nodes = app.dom.getElements(`#zone_reponses input`)
        var last = nodes[nodes.length-1];
        last.value = answer
    }

    // permet de récupérer le contenu à mettre dans la derniere réponse
    contentResponse(answer, numAnswer)
    {
        app.dom.getElement(`#response_${numAnswer}`).value = answer
    }

    // permet de récupérer le contenu à mettre dans la derniere réponse
    contentQuestion(question)
    {
        app.dom.getElement('#question').value = `${question.charAt(0).toUpperCase()}${question.substr(1)} ?`;
    }

        
    /**
     * @todo ajouter des controles pour s'assurer de ne pas avoir :
     *
     * - une question vide
     * - une / ou plusieurs réponse vide
     * - une question sans réponse valide
     */
    save(index = null) 
    {
        let question = app.dom.getElement('#question');
        let responses = Array.from(app.dom.getElements("#zone_reponses .form-group input"))
                            .map((response) => { return { text:response.value, valid: response.dataset.valid } });

        // Enregistrer dans LocalStorage
        if(index == null) {
            StorageQuestion.add(question.value, responses)
        } else {
            StorageQuestion.update(index, question.value, responses)
        }

        question.value = ""
        app.dom.getElement('#zone_reponses').innerHTML = ""
    }
}