import app from '../../app/app.js';
import AbstractController from './AbstractController.js';
import Storage from '../models/QuestionStorage.js';

const StorageQuestion = new Storage();

export default class Question extends AbstractController {

    showList() {
        app.mvc.loadView(`question/list`).then(() =>{
            // affichage des questions
            this.loadQuestionsInList();
            this.listenerList();
        });
    }

    showFormAdd() {
        app.mvc.loadView(`question/form_add`).then(() =>{
            this.listenerForm();

            // Ajàout du bouton enregistrer
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
 
    listenerList() {
        this.app.voice.addAction([`modifier une question`, `modifier la question`], () => {
            this.openModifQuestion(0);
        })
        
    }

    openModifQuestion(index) {
        let question = StorageQuestion.get(index);
        $('#formQuestionModal').modal('show')
        $('#formQuestionModal').on('shown.bs.modal', () => {
            app.mvc.loadView('question/form_add', '#formQuestionContent').then(() => {
                app.dom.getElement('#question').value = question.question;
                question.responses.forEach(response => {
                    this.addResponse(response.valid == 1)
                    this.contentResponse(response.text)
                })
            })
        })
    }

    loadQuestionsInList()
    {
        let questions = StorageQuestion.getAll();
        questions.forEach( (question, index) => {
            app.dom.templateToHtml("#tpl_question", "#liste_questions", (clone) => {
                    clone.querySelector("tr").dataset.index = index;
                    clone.querySelector(".text-question").textContent = question.question;
                    clone.querySelector(".text-index").textContent = index+1;
                }, () => {
            })     
        });
        
    }

    listenerForm() {
        this.app.voice.nextAction = (question) => {
            app.dom.getElement('#question').value = `${question.charAt(0).toUpperCase()}${question.substr(1)} ?`;
        };

        this.app.voice.addAction([`créer une réponse`, `ajouter une réponse`], () => {
            this.addResponse()
        }, this.contentResponse)

        this.app.voice.addAction([`créer une réponse valide`, `créer une réponse correcte`, `ajouter une réponse valide`] , () => {
            this.addResponse(true)
        }, this.contentResponse)

        // valider une réponse après création
        this.app.voice.addAction([`cette réponse est valide`,`cette réponse est correcte`] , () => {
            let numAnswer = app.dom.getElements("#zone_reponses .form-group").length;
            this.changeValidResponse(numAnswer, true)
        }, this.contentResponse)

        // dévalider une réponse après création
        this.app.voice.addAction([`cette réponse n'est pas valide`,`cette réponse n'est pas correcte`, `cette réponse est incorrecte`] , () => {
            let numAnswer = app.dom.getElements("#zone_reponses .form-group").length;
            this.changeValidResponse(numAnswer, false)
        }, this.contentResponse)
    
        this.app.voice.addAction([`enregistrer la question`], () => {
            this.save()
        })
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

    // permet de récupérer le contenu à mettre dans la derniere réponse
    contentResponse(answer, event = null)
    {
        let nodes = app.dom.getElements(`#zone_reponses input`)
        var last = nodes[nodes.length-1];
        last.value = answer
    }

    /**
     * @todo ajouter des controles pour s'assurer de ne pas avoir :
     *
     * - une question vide
     * - une / ou plusieurs réponse vide
     * - une question sans réponse valide
     */
    save() {
        let question = app.dom.getElement('#question');
        let responses = Array.from(app.dom.getElements("#zone_reponses .form-group input"))
                            .map((response) => { return { text:response.value, valid: response.dataset.valid } });

        // Enregistrer dans LocalStorage
        StorageQuestion.add(question.value, responses)

        question.value = ""
        app.dom.getElement('#zone_reponses').innerHTML = ""
    }

}