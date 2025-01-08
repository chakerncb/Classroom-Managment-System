const oracle = require('../config/db');
const bcrypt = require('bcryptjs');


 login = async (req, res) => {

    // console.log(req.body);

    const { email, password } = req.body;
    let passwordHash = bcrypt.hashSync(password, 10);
    let message = '';

    if (!email || !password) {
        message = 'Please provide an email and password';
        return res.render('auth/login', { message });
    }

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM teacher WHERE EMAIL = :email', [email]);
        const user = {
            id: result.rows[0][0],
            username: result.rows[0][1],
            email: result.rows[0][4],
            password: result.rows[0][3]
        };

        console.log(email, password, user);

        if (!user) {
            message = 'Invalid email or password';
            return res.render('auth/login', { message });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            message = 'Invalid email or password';
            return res.render('auth/login', { message });
        }

        req.session.user = user;
        res.redirect('/admin/');
    } catch (error) {
        console.error(error);
        message = 'Invalid email or password';
        res.render('auth/login', { message });
    } 
}

logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
}


module.exports = { login , logout};