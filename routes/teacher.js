const express = require('express');
const router = express.Router();
const checkTeacher = require('../middleware/TeacherAuthinticate');
const TeacherScheduleController = require('../controllers/Teacher/TeacherScheduleController');
const SessionsController = require('../controllers/Teacher/SessionsController');
const StudentsController = require('../controllers/Teacher/studentsController');
const ClassroomController = require('../controllers/Teacher/ClassroomController');


router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

router.get('/', checkTeacher, (req, res) => {
    res.render('teacher/index', { title: 'Teacher' });
});

router.get('/mySchedule', checkTeacher, (req, res) => {
    res.render('teacher/mySchedule', { title: 'My Schedule' });
});
router.get('/schedule/:teacherId', checkTeacher, TeacherScheduleController.getSchedule);


// sessions routes

router.get('/sessions', checkTeacher, (req, res) => {
    res.render('teacher/sessions', { title: 'Sessions' });
});

router.get('/sessions/:teacherId/:dayName', checkTeacher, SessionsController.getSessions);
router.post('/sessions/students', checkTeacher, SessionsController.getSessionStudents);
router.post('/sessions/attendance', checkTeacher, SessionsController.storeAttendance);


// students routes

router.get('/students', checkTeacher, (req, res) => {
    res.render('teacher/students', { title: 'Students' });
});
router.post('/students/data', checkTeacher, StudentsController.getStudents);
router.get('/modules/data', checkTeacher, StudentsController.getModules);

// classroom routes

// Teacher classroom routes
router.get('/classrooms/availability', checkTeacher, ClassroomController.getClassrooms);


module.exports = router;