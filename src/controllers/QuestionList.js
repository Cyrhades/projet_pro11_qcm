import app from '../../app/app.js';
import QuestionAdd from './QuestionAdd.js';
import VoiceCommon from '../voice/VoiceCommon.js';
import Voice from '../voice/VoiceQuestionList.js';
import Storage from '../models/QuestionStorage.js';

const StorageQuestion = new Storage();

export default class Question extends QuestionAdd {

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
                app.dom.getElement('#question').dataset.index = index
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

}