const oracle = require('../../config/db');

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

module.exports = { getTeachers };