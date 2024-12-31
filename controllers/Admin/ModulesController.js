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
                types.push({
                    id: result2.rows[i][0],
                    module_id: result2.rows[i][1],
                    name: result2.rows[i][2],
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

module.exports = { getModules };