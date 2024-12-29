const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Admin/AuthController');
const CheckAdmin = require('../middleware/AdminAuthinticate');
const TeachersController = require('../controllers/Admin/TeachersController');

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


router.get('/teachers',CheckAdmin , (req, res) => {
    res.render('admin/teachers', { title: 'Teachers' });
});

router.get('/teachers/data',CheckAdmin, TeachersController.getTeachers);







module.exports = router;