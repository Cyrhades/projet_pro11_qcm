export default class QcmStorage {


    add(title, questions) {
        this.saveQcm(null, title, questions) 
    }

    update(index) {
        
    }

    
    saveQcm(index, title, questions) {
        let qcms = this.getAll();
        if(index === null) {
            qcms.push({title, questions})
        } else {
            qcms[index] = {title, questions}
        }
        localStorage.setItem('QCMs', JSON.stringify(qcms)); 
    }

    delete(index) {
        let qcms = this.getAll();
        if(index) {
            qcms.splice(index,1)
        }
        localStorage.setItem('QCMs', JSON.stringify(qcms)); 
    }

    getAll() {
        return JSON.parse(localStorage.getItem('QCMs')) || [];
    }

    get(index) {
        let data = JSON.parse(localStorage.getItem('QCMs')) || [];
        if(data[index]) {
            return data[index];
        } 
        return null;
    }
}
