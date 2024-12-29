const express = require('express');
const env = require('dotenv').config();
const app = express();
const port = process.env.APP_PORT;
const oracle = require('./config/db');
const session = require('express-session');
const path = require('path');

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

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.get('/oracle', async (req, res) => {
    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM teacher');
        res.json(result.rows);
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
