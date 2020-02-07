export default class QuestionStorage {

    add(question, responses) {
        this.saveQuestion(null, question, responses)
    }

    update(index, question, responses) {
        this.saveQuestion(index, question, responses)
    }

    delete(index) {
        // 2 solutions pour le delete
        // soit on laisse l'index mais on enleve le contenu
        // 2eme solution on supprime l'élément et on boucle sur tout les QCM pour  
        // supprimer la question (index) présente dans les QCM et retirer
        // -1 à tout les questions ayant un index supérieur à celui supprimer
        let questions = this.getAll();
          if(index) {
            questions.splice(index,1)
        }

        localStorage.setItem('questions', JSON.stringify(questions)); 
    }

    saveQuestion(index, question, responses) {
        let questions = this.getAll();
        if(index === null) {
            questions.push({question, responses})
        } else {
            questions[index] = {question, responses}
        }
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
