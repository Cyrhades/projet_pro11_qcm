import app from '../../app/app.js';


export default class QuestionStorage {


    add(question, responses) {
        let questions = this.getAll();
        questions.push({question, responses})
        localStorage.setItem('questions', JSON.stringify(questions)); 
    }

    getAll() {
        return JSON.parse(localStorage.getItem('questions')) || [];
    }

    get(index) {
        let data = JSON.parse(localStorage.getItem('questions')) || [];
        if(data[index]) {
            return data[index];
        } 
        return null;
    }
}
