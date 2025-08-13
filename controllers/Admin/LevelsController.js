const oracle = require('../../config/db');

getLevels = async (req, res) => {
    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM levels');
        if (result.rows.length > 0) {
            const levels = [];
            for (let i = 0; i < result.rows.length; i++) {
                levels.push({
                    id: result.rows[i][0],
                    name: result.rows[i][1],
                });
            }
            res.json({ success: true, levels });
        } else {
            res.json({ success: false, levels: [] });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

getModules = async (req, res) => {
    const { level } = req.body;
    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM module WHERE LEVELM = :LEVELM', [level]);
        if (result.rows.length > 0) {
            const modules = [];
            for (let i = 0; i < result.rows.length; i++) {
                modules.push({
                    id: result.rows[i][0],
                    name: result.rows[i][1],
                });
            }
            res.json({ success: true, modules });
        } else {
            res.json({ success: false, modules: [] });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { getLevels , getModules };