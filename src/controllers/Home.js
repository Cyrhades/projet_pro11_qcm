import app from '../../app/app.js';
import AbstractController from './AbstractController.js';
// Navigation à la voix
import VoiceCommon from '../voice/VoiceCommon.js';
import Voice from '../voice/VoiceHome.js';

// Navigation au clavier
import KeyboardCommon from '../keyboard/KeyboardCommon.js';
import Keyboard from '../keyboard/KeyboardHome.js';

import Storage from '../models/QcmStorage.js';
const StorageQCM = new Storage();

import Storage2 from '../models/QuestionStorage.js';
const QuestionStorage = new Storage2();


export default class Home extends AbstractController {
    show() {
        app.mvc.loadView(`home`).then(() => {
            // chargement des dépendances
            this.loadDependencies(VoiceCommon,Voice,KeyboardCommon,Keyboard);
            this.loadQCMsInList()
        });
    }

    loadQCMsInList()
    {
        let qcms = StorageQCM.getAll();
        app.dom.getElement("#list_qcms").innerHTML = '';
        qcms.forEach( (qcm, index) => {            
            app.dom.templateToHtml("#tpl_qcm", "#list_qcms", (clone) => {
                    if(index == 0) {
                        clone.querySelector("tr").className="table-active"
                    }
                    clone.querySelector("tr").dataset.index = index;
                    clone.querySelector(".text-index").textContent = index+1;
                    clone.querySelector(".text-title").textContent = qcm.title;
                    clone.querySelector(".text-count-questions").textContent = qcm.questions.length;
                }, () => {
            })     
        });
    }   

    openQCM(index) {
        if(isNaN(index)) {
            return;
        }

        let qcm = StorageQCM.get(index);
        let questions = [];
        qcm.questions.forEach(index => {
            questions.push(QuestionStorage.get(index))
        })
        $('#qcmModal').modal('show')
        $('#qcmModal').on('shown.bs.modal', () => {
           this.printQuestion(qcm.title, questions[0]);
        })
    }

    printQuestion(title, question) {

        app.dom.getElement('#qcmModalLabel').textContent = title;

        app.dom.getElement('#qcmContent h4').textContent = question.question
        
        // on doit boucler pour lister les réponses
        app.dom.getElement('#qcmContent p').innerHTML = '';
        question.responses.forEach((response, index) => {
            let btnResponse = document.createElement('button');
            btnResponse.className="btn btn-default col-2"
            btnResponse.type="button"
            btnResponse.dataset.index = index;
            btnResponse.textContent = `${index+1}) ${response.text}`;
            app.dom.getElement('#qcmContent p').append(btnResponse)
        })
    }

    responseNoSelected(numAnswer) {
        if(isNaN(numAnswer)) {
            return;
        }
        app.dom.getElement(`#qcmContent [data-index="${numAnswer}"]`).dataset.selected = 0
        app.dom.classSwitch( app.dom.getElement(`#qcmContent [data-index="${numAnswer}"]`), 'btn-default', 'btn-success') 
    }

    responseSelected(numAnswer) {
        if(isNaN(numAnswer)) {
            return;
        }
        app.dom.getElement(`#qcmContent [data-index="${numAnswer}"]`).dataset.selected = 0
        app.dom.classSwitch( app.dom.getElement(`#qcmContent [data-index="${numAnswer}"]`), 'btn-success', 'btn-default') 
    }

    selectQcmSuivant() {
        let currentElement = app.dom.getElement('.table-active');
        let newIndex = 0;
        if(currentElement) {
            newIndex = parseInt(currentElement.dataset.index)+1;
        }

        if( newIndex > app.dom.getElements("#list_qcms tr").length-1) {
            newIndex = 0;
        }

        this.selectQcm(newIndex)
    }

    selectQcmPrecedent() {
        let currentElement = app.dom.getElement('.table-active');
        let newIndex = 0;
        if(currentElement) {
            newIndex = parseInt(currentElement.dataset.index)-1;
        }

        if(newIndex < 0) {
            newIndex = app.dom.getElements("#list_qcms tr").length-1;
        }     
        this.selectQcm(newIndex)
    }

    selectQcm(number) {
        if(app.dom.getElement('.table-active')) {
            app.dom.getElement('.table-active').className = '';
        }
        $("tr[data-index="+number+"]").addClass('table-active');
    }


    selectQuestionSuivante() {
        // pas encore fait...
        alert("pas encore fait :-(")
    }
    
    selectQuestionPrecedente() {
        // pas encore fait...
        alert("pas encore fait :-(")
    }
}