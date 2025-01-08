const express = require('express');
const router = express.Router();
const checkTeacher = require('../middleware/TeacherAuthinticate');

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



module.exports = router;