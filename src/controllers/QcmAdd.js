import app from '../../app/app.js';
import AbstractController from './AbstractController.js';
// Navigation à la voix
import VoiceCommon from '../voice/VoiceCommon.js';
import Voice from '../voice/VoiceQcmForm.js';

// Navigation au clavier
import KeyboardCommon from '../keyboard/KeyboardCommon.js';

import Storage from '../models/QcmStorage.js';
const StorageQCM = new Storage();

import Storage2 from '../models/QuestionStorage.js';
const StorageQuestion = new Storage2();

export default class QcmAdd extends AbstractController {

    show() {
        app.mvc.loadView(`qcm/form_add`).then(() => {
            if(app.config.voiceEnable) {
                this.loadDependencies(VoiceCommon,Voice,KeyboardCommon);
            }
            // affichage des questions
            this.loadQuestionsInList();

             // Ajout du bouton enregistrer
             var node = document.createElement("button"); 
             var button = document.createTextNode("Enregistrer");
             node.appendChild(button);
             node.addEventListener('click', () => {
                 this.save()
             })
             node.className= 'btn btn-primary';
             app.dom.getElement('#formQcm').appendChild(node);
             this.search();
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
        if($("tr[data-index="+newIndex+"]:visible").length == 0 && $("tr[data-index]:visible").length > 0) {
            this.selectQuestionSuivante()
        } 
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
        if($("tr[data-index="+newIndex+"]:visible").length == 0 && $("tr[data-index]:visible").length > 0) {
            this.selectQuestionPrecedente()
        } 
    }

    selectQuestion(number) {
        if(app.dom.getElement('.table-active')) {
            app.dom.getElement('.table-active').className = '';
        }
        $("tr[data-index="+number+"]").addClass('table-active');
    }
    
    loadQuestionsInList()
    {
        let questions = StorageQuestion.getAll();
        app.dom.getElement("#liste_questions").innerHTML = '';
        questions.forEach( (question, index) => {            
            app.dom.templateToHtml("#tpl_question", "#liste_questions", (clone) => {
                    clone.querySelector("tr").style.display = "none";
                    clone.querySelector("tr").dataset.index = index;
                    clone.querySelector(".text-question").textContent = question.question;
                    clone.querySelector(".text-index").textContent = index+1;
                }, () => {
            })     
        });
    }   

    search() {
        $("#filtre_recherche").on("try_search", () => {
            var value = app.dom.getElement('#filtre_recherche').value.toLowerCase();
            if(app.dom.getElement('.table-active')) {
                app.dom.getElement('.table-active').className = '';
            }
            app.dom.getElements('#liste_questions .text-question').forEach((element) => {
                $(element).parents('tr').toggle($(element).text().toLowerCase().indexOf(value) > -1)
            })
            $("#liste_questions").find('tr:visible:first').addClass('table-active');
        });
    }

    // permet de récupérer le contenu à mettre dans la derniere réponse
    contentQcmName(title)
    {
        app.dom.getElement('#qcm_title').value = `${title.charAt(0).toUpperCase()}${title.substr(1)}`;
    }

    contentFiltreQuestion(keyword) {
        app.dom.getElement('#filtre_recherche').value = keyword;
        $("#filtre_recherche").trigger('try_search')
    }


    addQuestion(index)
    {
        if(isNaN(index)) return;

        let question = StorageQuestion.get(index);
        if(question) {
            app.dom.templateToHtml("#tpl_question", "#zone_questions", (clone) => {
                clone.querySelector("tr").dataset.index = index;
                // permettra de classer les questions par la suite
                clone.querySelector("tr").dataset.sort = app.dom.getElements('#zone_questions > tr').length+1;

                clone.querySelector(".text-question").textContent = question.question;
                clone.querySelector(".text-index").textContent = index+1;
            })     
        }
    }   



    /**
     * @todo ajouter des controles pour s'assurer de ne pas avoir :
     *
     * - un QCM sans intitule
     * - un QCM sans question
     */
    save(index = null) 
    {
        let title = app.dom.getElement('#qcm_title');
        let questions = Array.from(app.dom.getElements("#zone_questions tr"))
                            .map((question) => { return question.dataset.index });

        // Enregistrer dans LocalStorage
        if(index == null) {
            StorageQCM.add(title.value, questions)
        } else {
            StorageQCM.update(index, title.value, questions)
        }

        title.value = ""
        app.dom.getElement('#zone_questions').innerHTML = ""
    }
}