const oracle = require('../../config/db');
const bcrypt = require('bcryptjs');

const getTeachers = async (req, res) => {
    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM teacher');
        if (result.rows.length > 0) {
            const teachers = [];
            for (let i = 0; i < result.rows.length; i++) {
                teachers.push({
                    id: result.rows[i][0],
                    name: result.rows[i][1],
                    lname: result.rows[i][5],
                    grade: result.rows[i][2],
                    email: result.rows[i][4]
                });
            }
            
            res.json(teachers);
        } else {
            res.json([]);
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

}

createTeacher = async (req, res) => {
    try {
        const { code, fname, lname, grade, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const connection = await oracle();
        console.log(req.body);

        if (!code || !fname || !lname || !grade || !email || !password) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: 'Password must be at least 6 characters' });
        }

        if (!/^[a-zA-Z]+$/.test(fname) || !/^[a-zA-Z]+$/.test(lname)) {
            return res.json({ success: false, message: 'First name and last name must contain only letters' });
        }

        if (!/^[0-9]+$/.test(code)) {
            return res.json({ success: false, message: 'ID must contain only numbers' });
        }

        // email validation

        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        // email already exists

        const emailExists = await connection.execute('SELECT * FROM teacher WHERE email = :email', [email]);
        if (emailExists.rows.length > 0) {
            return res.json({ success: false, message: 'Email already exists' });
        }

        // code already exists

        const codeExists = await connection.execute('SELECT * FROM teacher WHERE IDT = :IDT', [code]);
        if (codeExists.rows.length > 0) {
            return res.json({ success: false, message: 'ID already exists' });
        }

        const result = await connection.execute(
            `INSERT INTO teacher (IDT, name, lname, grade, email, password) VALUES (:IDT, :name, :lname, :grade, :email, :password)`,
            [code, fname, lname, grade, email, passwordHash]
        );
        connection.execute('commit');
        console.log(result);
        res.json({ success: true, message: 'Teacher created successfully' });
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

deleteTeacher = async (req, res) => {
    try {
        const { id } = req.body;
        const connection = await oracle();
        if (!id) {
            return res.json({ success: false, message: 'ID is required' });
        }

        const result = await connection.execute('DELETE FROM teacher WHERE IDT = :IDT', [id]);
        connection.execute('commit');
        res.json({ success: true, message: 'Teacher deleted successfully' });
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

}

editTeacher = async (req, res) => {
    try {
        const { id } = req.body;
        // console.log(id);
        const connection = await oracle();
        if (!id) {
            return res.json({ success: false, message: 'ID is required' });
        }

        const result = await connection.execute('SELECT * FROM teacher WHERE IDT = :IDT', [id]);
        if (result.rows.length > 0) {
            const teacher = {
                id: result.rows[0][0],
                fname: result.rows[0][1],
                lname: result.rows[0][5],
                grade: result.rows[0][2],
                email: result.rows[0][4]
            };
            res.json({ success: true, teacher });
        } else {
            res.json({ success: false, message: 'Teacher not found' });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


updateTeacher = async (req, res) => {
    const { id, fname, lname, grade, email } = req.body;
    const connection = await oracle();

    console.log(id);

    if (!id || !fname || !lname || !grade || !email) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    if (!/^[a-zA-Z]+$/.test(fname) || !/^[a-zA-Z]+$/.test(lname)) {
        return res.json({ success: false, message: 'First name and last name must contain only letters' });
    }

    if (!/^[0-9]+$/.test(id)) {
        return res.json({ success: false, message: 'ID must contain only numbers' });
    }

    // email validation

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        return res.json({ success: false, message: 'Invalid email' });
    }

    const emailExists = await connection.execute('SELECT * FROM teacher WHERE email = :email AND IDT != :IDT', [email, id]);
    if (emailExists.rows.length > 0) {
        return res.json({ success: false, message: 'Email already exists' });
    }

    try {
        const result = await connection.execute(
            `UPDATE teacher SET name = :name, lname = :lname, grade = :grade, email = :email WHERE IDT = :IDT`,
            [fname, lname, grade, email, id]
        );
        connection.execute('commit');
        res.json({ success: true, message: 'Teacher updated successfully' });
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { getTeachers , createTeacher , deleteTeacher , editTeacher , updateTeacher };