const oracle = require('../../config/db');
const bcrypt = require('bcryptjs');

const getStudents = async (req, res) => {
    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM student');


        if (result.rows.length > 0) {
            const students = [];
            for (let i = 0; i < result.rows.length; i++) {

                const groupe = await connection.execute('SELECT * FROM groupe WHERE ID_G = :ID_G', [result.rows[i][5]]);

                students.push({
                    code: result.rows[i][0],
                    fname: result.rows[i][1],
                    lname: result.rows[i][2],
                    level: result.rows[i][3],
                    speciality: result.rows[i][4],
                    groupe: groupe.rows[0][1]
                });
            }
            
            res.json(students);
        } else {
            res.json([]);
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

}


getGroupe = async (req, res) => {

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM groupe');
        if (result.rows.length > 0) {
            const groupes = [];
            for (let i = 0; i < result.rows.length; i++) {
                groupes.push({
                    id: result.rows[i][0],
                    name: result.rows[i][1]
                });
            }
            res.json(groupes);
        } else {
            res.json([]);
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

createStudent = async (req, res) => {
    try {
        const { code, fname, lname, level, speciality, groupe } = req.body;
        const connection = await oracle();

        // console.log( code, fname, lname, level, speciality, groupe );
        if (!code || !fname || !lname || !level || !speciality || !groupe) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        if (!/^[a-zA-Z]+$/.test(fname) || !/^[a-zA-Z]+$/.test(lname)) {
            return res.json({ success: false, message: 'First name and last name must contain only letters' });
        }

        if (!/^[0-9]+$/.test(code)) {
            return res.json({ success: false, message: 'ID must contain only numbers' });
        }

        // groupe validation

        const groupeExists = await connection.execute('SELECT * FROM groupe WHERE ID_G = :ID_G', [groupe]);
        if (groupeExists.rows.length === 0) {
            return res.json({ success: false, message: 'Groupe not found' });
        }

       

        // code already exists

        const codeExists = await connection.execute('SELECT * FROM student WHERE CODES = :CODES', [code]);
        if (codeExists.rows.length > 0) {
            return res.json({ success: false, message: 'ID already exists' });
        }

        const result = await connection.execute('INSERT INTO student (CODES, FNAME, LNAME, LEVELS, SPECIALITY, ID_GR) VALUES (:codes, :fname, :lname, :levels, :speciality, :groupe)', [code, fname, lname, level, speciality, groupe]);

        connection.execute('commit');
        res.json({ success: true, message: 'Student created successfully' });
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

deleteStudent = async (req, res) => {
    try {
        const { id } = req.body;
        const connection = await oracle();
        if (!id) {
            return res.json({ success: false, message: 'ID is required' });
        }

        const result = await connection.execute('DELETE FROM student WHERE CODES = :codes', [id]);
        connection.execute('commit');
        res.json({ success: true, message: 'Teacher deleted successfully' });
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

}

editStudent = async (req, res) => {
    try {
        const { id } = req.body;
        const connection = await oracle();

        if (!id) {
            return res.json({ success: false, message: 'ID is required' });
        }

        const result = await connection.execute('SELECT * FROM student WHERE CODES = :codes', [id]);
        if (result.rows.length > 0) {
            const student = {
                code: result.rows[0][0],
                fname: result.rows[0][1],
                lname: result.rows[0][2],
                level: result.rows[0][3],
                speciality: result.rows[0][4],
                groupe: result.rows[0][5]
            };
            res.json({ success: true, student });
        } else {
            res.json({ success: false, message: 'Student not found' });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


updateStudent = async (req, res) => {
    const { code, fname, lname, level, speciality, groupe } = req.body;
    const connection = await oracle();
    // const passwordHash = await bcrypt.hash(password, 10);

    console.log(req.body);

    if (!code || !fname || !lname || !level || !speciality || !groupe) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    if (!/^[a-zA-Z]+$/.test(fname) || !/^[a-zA-Z]+$/.test(lname)) {
        return res.json({ success: false, message: 'First name and last name must contain only letters' });
    }

    if (!/^[0-9]+$/.test(code)) {
        return res.json({ success: false, message: 'ID must contain only numbers' });
    }

    // groupe validation

    const groupeExists = await connection.execute('SELECT * FROM groupe WHERE ID_G = :ID_G', [groupe]);
    if (groupeExists.rows.length === 0) {
        return res.json({ success: false, message: 'Groupe not found' });
    }

    // code already exists

    const codeExists = await connection.execute('SELECT * FROM student WHERE CODES = :CODES', [code]);
    if (codeExists.rows.length === 0) {
        return res.json({ success: false, message: 'ID not found' });
    }

    try {

        const result = await connection.execute('UPDATE student SET FNAME = :fname, LNAME = :lname, LEVELS = :levels, SPECIALITY = :speciality, ID_GR = :groupe WHERE CODES = :codes', [fname, lname, level, speciality, groupe, code]);
        connection.execute('commit');
        res.json({ success: true, message: 'Student updated successfully' });
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { getStudents , createStudent , deleteStudent , getGroupe , editStudent , updateStudent };