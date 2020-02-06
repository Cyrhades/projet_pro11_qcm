import Home from '../src/controllers/Home.js';

import QuestionList from '../src/controllers/QuestionList.js';
import QuestionAdd from '../src/controllers/QuestionAdd.js';

import QcmAdd from '../src/controllers/QcmAdd.js';


export default (app) => [
    {url : '/', controller : () => { (new Home(app)).show() }},
    {url : '/admin/questions', controller: () => { (new QuestionList(app)).show() } },
    {url : '/admin/question/add', controller : () => { (new QuestionAdd(app)).show() } },
    {url : '/admin/qcm/add', controller : () => { (new QcmAdd(app)).show() } },
];