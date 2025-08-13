const oracle = require('../../config/db');

getClassrooms = async (req, res) => {
    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM classroom');
        if (result.rows.length > 0) {
            const classrooms = [];
            for (let i = 0; i < result.rows.length; i++) {
                classrooms.push({
                    code: result.rows[i][2],
                    type: result.rows[i][1],
                    capacity: result.rows[i][0]
                });
            }
            res.json({ success: true, classrooms });
        } else {
            res.json({ success: false, classrooms: [] });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

addClassroom = async (req, res) => {
    const { code, type, capacity } = req.body;
    const connection = await oracle();

    const classroomAlreadyExists = await connection.execute('SELECT * FROM classroom WHERE code = :code', [code]);
    if (classroomAlreadyExists.rows.length > 0) {
        res.json({ success: false, message: 'Classroom already exists' });
        return;
    }

    try {
        const result = await connection.execute('INSERT INTO classroom (CAPACITY , TYPE , CODE) VALUES (:capacity, :type, :code)', [capacity, type, code]);
        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Classroom added successfully' });
            console.log('Classroom added successfully');
        } else {
            res.json({ success: false, message: 'Classroom not added' });
            console.log('Classroom not added');
        }
        await connection.commit();
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

deleteClassroom = async (req, res) => {
    const { code } = req.body;

    const connection = await oracle();
    const classroomUsed = await connection.execute('SELECT * FROM schedule WHERE CODE_C = :code', [code]);
    if (classroomUsed.rows.length > 0) {
        res.json({ success: false, message: 'Classroom is used in a schedule' });
        return;
    }

    try {
        const result = await connection.execute('DELETE FROM classroom WHERE CODE = :code', [code]);
        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Classroom deleted successfully' });
            console.log('Classroom deleted successfully');
        } else {
            res.json({ success: false, message: 'Classroom not found' });
            console.log('Classroom not found');
        }
        await connection.commit();
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


editClassroom = async (req, res) => {
    const { code } = req.body;

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM classroom WHERE CODE = :code', [code]);

        if (result.rows.length > 0) {
            const classroom = {
                code: result.rows[0][2],
                type: result.rows[0][1],
                capacity: result.rows[0][0]
            };
            res.json({ success: true, classroom });
        } else {
            res.json({ success: false, classroom: {} });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

updateClassroom = async (req, res) => {
    const {id , code, type, capacity } = req.body;

    const connection = await oracle();
    if (id != code) {
        const classroomAlreadyExists = await connection.execute('SELECT * FROM classroom WHERE code = :code', [code]);
        if (classroomAlreadyExists.rows.length > 0) {
            res.json({ success: false, message: 'Classroom already exists' });
            return;
        }
    }

    try {
        const result = await connection.execute('UPDATE classroom SET CAPACITY = :capacity, TYPE = :type WHERE CODE = :code', [capacity, type, code]);
        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Classroom updated successfully' });
            console.log('Classroom updated successfully');
        } else {
            res.json({ success: false, message: 'Classroom not updated' });
            console.log('Classroom not updated');
        }
        await connection.commit();
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
module.exports = { getClassrooms , deleteClassroom , addClassroom , editClassroom , updateClassroom }; 