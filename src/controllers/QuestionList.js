import app from '../../app/app.js';
import AbstractController from './AbstractController.js';
import VoiceCommon from '../voice/VoiceCommon.js';
import Voice from '../voice/VoiceQuestionList.js';
import Storage from '../models/QuestionStorage.js';

const StorageQuestion = new Storage();

export default class Question extends AbstractController {

    show() {
        app.mvc.loadView(`question/list`).then(() =>{

            VoiceCommon.bind(this, app).call()
            Voice.bind(this, app).call()

            // affichage des questions
            this.loadQuestionsInList();
        });
    }
 

    selectQuestionSuivante() {
        let currentElement = app.dom.getElement('.table-active');
        let newIndex = 0;
        if(currentElement) {
            newIndex = parseInt(currentElement.dataset.index)+1;
        }

        if( newIndex > app.dom.getElements("#liste_questions tr").length-1) {
            newIndex = 0;
        }

        this.selectQuestion(newIndex)
    }

    selectQuestionPrecedente() {
        let currentElement = app.dom.getElement('.table-active');
        let newIndex = 0;
        if(currentElement) {
            newIndex = parseInt(currentElement.dataset.index)-1;
        }

        if(newIndex < 0) {
            newIndex = app.dom.getElements("#liste_questions tr").length-1;
        }     
        this.selectQuestion(newIndex)
    }

    selectQuestion(number) {
        if(app.dom.getElement('.table-active')) {
            app.dom.getElement('.table-active').className = '';
        }
        $("tr[data-index="+number+"]").addClass('table-active');
    }


    openModifQuestion(index) {
        if(isNaN(index)) {
            index = parseInt(app.dom.getElement('.table-active').dataset.index);
        }
        let question = StorageQuestion.get(index);
        $('#formQuestionModal').modal('show')
        $('#formQuestionModal').on('shown.bs.modal', () => {
            app.mvc.loadView('question/form_add', '#formQuestionContent').then(() => {
                app.dom.getElement('#question').value = question.question;
                question.responses.forEach(response => {
                    this.addResponse(response.valid == 1)
                    this.contentLastResponse(response.text)
                })
            })
        })
    }



    loadQuestionsInList()
    {
        let questions = StorageQuestion.getAll();
        app.dom.getElement("#liste_questions").innerHTML = '';
        questions.forEach( (question, index) => {            
            app.dom.templateToHtml("#tpl_question", "#liste_questions", (clone) => {
                    // par défaut la premiere ligne est sélectionnée
                    if(index == 0) {
                        clone.querySelector("tr").className="table-active"
                    }
                    clone.querySelector("tr").dataset.index = index;
                    clone.querySelector(".text-question").textContent = question.question;
                    clone.querySelector(".text-index").textContent = index+1;
                }, () => {
            })     
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