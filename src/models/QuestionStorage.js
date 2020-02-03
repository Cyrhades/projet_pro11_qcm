import app from '../../app/app.js';


export default class QuestionStorage {
    add(question, responses) {
        // console.log(question)
        // console.log(responses)
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        questions.push({question, responses})
        localStorage.setItem('questions', JSON.stringify(questions)); 
    }
}
