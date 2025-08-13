const express = require('express');
const env = require('dotenv').config();
const app = express();
const port = process.env.PORT;
const oracle = require('./config/db');
const session = require('express-session');
const path = require('path');
const AuthController = require('./controllers/AuthController');

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



app.get('/', (req, res) => {
    res.send('Hello World!');
});

// users login

app.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login Page' });
});

app.post('/login', AuthController.login);

app.get('/logout', AuthController.logout);




const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const teacherRoutes = require('./routes/teacher');
app.use('/teacher', teacherRoutes);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
