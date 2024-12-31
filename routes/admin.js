const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Admin/AuthController');
const CheckAdmin = require('../middleware/AdminAuthinticate');
const TeachersController = require('../controllers/Admin/TeachersController');
const StudentsController = require('../controllers/Admin/StudentsController');
const ModulesController = require('../controllers/Admin/ModulesController');

router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

router.get('/',CheckAdmin , (req, res) => {
    res.render('admin/index' , { title: 'Admin Page' });
});

router.get('/login', (req, res) => {
    res.render('admin/auth/login', { title: 'Admin Login' });
});

router.post('/login', AuthController.login);

router.get('/logout', AuthController.logout);


// Teachers routes


router.get('/teachers',CheckAdmin , (req, res) => {
    res.render('admin/teachers', { title: 'Teachers' });
});
router.get('/teachers/data',CheckAdmin, TeachersController.getTeachers);
router.post('/teachers',CheckAdmin, TeachersController.createTeacher);
router.post('/teachers/delete',CheckAdmin, TeachersController.deleteTeacher);
router.post('/teachers/edit',CheckAdmin, TeachersController.editTeacher);
router.post('/teachers/update',CheckAdmin, TeachersController.updateTeacher);


// Students routes


router.get('/students',CheckAdmin , (req, res) => {
    res.render('admin/students', { title: 'Students' });
});
router.get('/students/data',CheckAdmin, StudentsController.getStudents);
router.get('/students/groupe',CheckAdmin, StudentsController.getGroupe);
router.post('/students',CheckAdmin, StudentsController.createStudent);
router.post('/students/delete',CheckAdmin, StudentsController.deleteStudent);
router.post('/students/edit',CheckAdmin, StudentsController.editStudent);
router.post('/students/update',CheckAdmin, StudentsController.updateStudent);



// Groups routes


   // TODO: Add the groups routes


// Moudules routes

router.get('/modules',CheckAdmin , (req, res) => {
    res.render('admin/modules', { title: 'Modules' });
});
router.get('/modules/data',CheckAdmin, ModulesController.getModules);




module.exports = router;