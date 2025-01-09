const express = require('express');
const router = express.Router();
const checkTeacher = require('../middleware/TeacherAuthinticate');
const TeacherScheduleController = require('../controllers/Teacher/TeacherScheduleController');
const SessionsController = require('../controllers/Teacher/SessionsController');

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

module.exports = router;