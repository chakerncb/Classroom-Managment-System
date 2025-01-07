const db = require('../../config/db');

getClassrooms = async (req, res) => {
    try {
        const connection = await db();
        const result = await connection.execute('SELECT * FROM classroom');
        if (result.rows.length > 0) {
            const classrooms = [];
            for (let i = 0; i < result.rows.length; i++) {
                classrooms.push({
                    code: result.rows[i][2],
                    type: result.rows[i][1],
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

module.exports = { getClassrooms };