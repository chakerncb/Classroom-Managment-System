const oracle = require('../../config/db');

getModules = async (req, res) => {
    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM module');
        const result2 = await connection.execute('SELECT * FROM typemodule');

        if (result.rows.length > 0) {
            const modules = [];
            for (let i = 0; i < result.rows.length; i++) {
                modules.push({
                    id: result.rows[i][0],
                    name: result.rows[i][1],
                    semester: result.rows[i][3],
                });
            }

            const types = [];
            for (let i = 0; i < result2.rows.length; i++) {
                const teacher = await connection.execute('SELECT * FROM teacher WHERE IDT = :IDT', [result2.rows[i][3]]);
                types.push({
                    id: result2.rows[i][0],
                    module_id: result2.rows[i][1],
                    name: result2.rows[i][2],
                    teacher: teacher.rows[0][1] + ' ' + teacher.rows[0][5],
                });
            }

            res.json({ success: true, modules, types });
        } else {
            res.json({ success: false, modules: [], types: [] });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


createModule = async (req, res) => {
    const { name, level , semester } = req.body;
    try {
        const connection = await oracle();
        // selct the last id
        const result1 = await connection.execute('SELECT MAX(IDM) FROM module');
        const id = result1.rows[0][0] + 1;
        const result = await connection.execute('INSERT INTO module (IDM , NAME , LEVELM, SEMESTER) VALUES (:IDM , :NAME, :LEVELM, :SEMESTER)', [id, name, level , semester]);
        connection.execute('COMMIT');
        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Module created successfully' });
        } else {
            res.json({ success: false, message: 'Failed to create module' });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


createType = async (req, res) => {
    const { type_id , module_id, teacher_id } = req.body;

    if (!type_id || !module_id || !teacher_id) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    let name = '';

    if (type_id === '1') {
         name = 'Cours';
    } else if (type_id === '2') {
         name = 'TD';
    } else if (type_id === '3') {
         name = 'TP';
    } else {
         return res.json({ success: false, message: 'Invalid type'+type_id });
    }



    try {
        const connection = await oracle();
        const result = await connection.execute('INSERT INTO typemodule (ID, IDM, NAMET, IDT) VALUES (:ID, :IDM, :NAMET, :IDT)', [type_id ,module_id, name, teacher_id]);
        connection.execute('COMMIT');
        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Type created successfully' });
        } else {
            res.json({ success: false, message: 'Failed to create type' });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { getModules , createModule , createType };