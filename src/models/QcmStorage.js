export default class QcmStorage {


    add() {
        
    }

    update(index) {
        
    }

    delete(index) {
        let qcms = this.getAll();
        if(index) {
            qcms.splice(index,1)
        }
        localStorage.setItem('qcm', JSON.stringify(qcms)); 
    }

    getAll() {
        return JSON.parse(localStorage.getItem('qcm')) || [];
    }

    get(index) {
        let data = JSON.parse(localStorage.getItem('qcm')) || [];
        if(data[index]) {
            return data[index];
        } 
        return null;
    }
}
