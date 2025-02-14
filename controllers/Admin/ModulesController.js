const oracle = require('../../config/db');

getModules = async (req, res) => {
    try {
        const connection = await oracle();
        const result3 = await connection.execute('SELECT * FROM LEVELS');
        const result = await connection.execute('SELECT * FROM module');
        const result2 = await connection.execute('SELECT * FROM typemodule');

        const levels = [];

        for (let i = 0; i < result3.rows.length; i++) {
            levels.push({
                id: result3.rows[i][0],
                name: result3.rows[i][1],
            });
        }

        if (result.rows.length > 0) {
            const modules = [];
            for (let i = 0; i < result.rows.length; i++) {
                modules.push({
                    id: result.rows[i][0],
                    name: result.rows[i][1],
                    semester: result.rows[i][3],
                    level: result.rows[i][2],
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

            res.json({ success: true, modules, types, levels });
        } else {
            res.json({ success: false, modules: [], types: [], levels: [] });
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

deleteType = async (req, res) => {
    const { id , module_id} = req.body;
    console.log(id , module_id);
    try {
        const connection = await oracle();
        // Delete child records in related table(s) first
        await connection.execute('DELETE FROM attend WHERE IDTM = :IDTM', [id]);
        const result = await connection.execute('DELETE FROM typemodule WHERE ID = :ID AND IDM = :IDM ', [id , module_id]);
        await connection.execute('COMMIT');
        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Type deleted successfully' });
        } else {
            console.log(result);
            res.json({ success: false, message: 'Failed to delete type' });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

getTypes = async (req, res) => {
    const { moduleId } = req.body;

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM typemodule WHERE IDM = :IDM', [moduleId]);
        const result2 = await connection.execute('SELECT SEMESTER , LEVELM FROM module WHERE IDM = :IDM', [moduleId]);

        if (result.rows.length > 0) {
            const types = [];
            const semester = result2.rows[0][0];
            const level = result2.rows[0][1];
            for (let i = 0; i < result.rows.length; i++) {
                types.push({
                    id: result.rows[i][0],
                    module_id: result.rows[i][1],
                    name: result.rows[i][2],
                    teacher_id: result.rows[i][3],
                });
            }

            res.json({ success: true, types , semester , level });
        } else {
            res.json({ success: false, types: [] });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { getModules , createModule , createType  , deleteType , getTypes };